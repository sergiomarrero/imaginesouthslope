// Packs each built design into ONE self-contained HTML file (all pages, both languages, hash routing).
// Run after `npm run build`. Output: dist/preview-<design>.html (and, with --fragment, dist/preview-<design>.fragment.html).
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, PAGE_FILE, LANGS } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const fragment = process.argv.includes('--fragment');
const site = JSON.parse(await readFile(path.join(ROOT, 'content', 'site.json'), 'utf8'));

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.avif': 'image/avif' };
const manifest = JSON.parse(await readFile(path.join(DIST, '.designs.json'), 'utf8').catch(() => '[]'));
if (!manifest.length) throw new Error('Nothing built yet. Run `npm run build` first.');
for (const { slug, name, dir: sub } of manifest) {
  const dir = path.join(DIST, sub);
  const imageData = new Map();
  for (const f of await readdir(path.join(dir, 'images')).catch(() => [])) {
    const ext = path.extname(f).toLowerCase();
    if (!MIME[ext]) continue;
    const buf = await readFile(path.join(dir, 'images', f));
    if (buf.length < 1.5e6) imageData.set(f, `data:${MIME[ext]};base64,${buf.toString('base64')}`);
  }
  const css = await readFile(path.join(dir, 'assets', 'styles.css'), 'utf8');
  const js = await readFile(path.join(dir, 'assets', 'app.js'), 'utf8');
  const favicon = await readFile(path.join(dir, 'assets', 'favicon.svg'), 'utf8');
  const pages = {};
  let fonts = '';
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const file = path.join(dir, lang === 'es' ? 'es' : '', PAGE_FILE[page]);
      const html = await readFile(file, 'utf8');
      const title = (/<title>([^<]*)<\/title>/.exec(html) || [, ''])[1];
      const bodyClass = (/<body class="([^"]*)"/.exec(html) || [, ''])[1];
      fonts = fonts || (/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/.exec(html) || [, ''])[1];
      let body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
      body = body.slice(body.indexOf('>') + 1);
      body = body.replace(/<script src="[^"]*app\.js" defer><\/script>/, '');
      const rel = lang === 'es' ? '../' : '';
      // Rewrite internal links to hash routes: page.html[#anchor] -> #/lang/page[/anchor]
      body = body.replace(/href="((?:\.\.\/|es\/)?)(index|about|program|admissions|contact)\.html(#[^"]*)?"/g, (m, prefix, page, hash) => {
        const targetLang = prefix === 'es/' ? 'es' : prefix === '../' ? 'en' : lang;
        const p = page === 'index' ? 'home' : page;
        return `href="#/${targetLang}/${p}${hash ? '/' + hash.slice(1) : ''}"`;
      });
      // Keep images/<file> paths in the stored HTML; the router swaps them for data URIs stored once.
      body = body.replace(/(src|href)="(?:\.\.\/)?images\/([^"]+)"/g, (m, attr, f) => `${attr}="images/${f}"`);
      pages[`${lang}/${page}`] = { title, bodyClass, body, lang };
    }
  }
  const router = `
(function () {
  var PAGES = ${JSON.stringify(pages)};
  var IMAGES = ${JSON.stringify(Object.fromEntries(imageData))};
  document.documentElement.classList.add('js');
  var app = document.getElementById('app');
  function route() {
    var h = location.hash.replace(/^#\\/?/, '') || 'en/home';
    var parts = h.split('/');
    var key = parts[0] + '/' + (parts[1] || 'home');
    var anchor = parts[2];
    var p = PAGES[key] || PAGES['en/home'];
    document.documentElement.lang = p.lang;
    document.title = p.title;
    document.body.className = p.bodyClass;
    app.innerHTML = p.body;
    app.querySelectorAll('img[src^="images/"]').forEach(function (img) {
      var f = img.getAttribute('src').slice(7);
      if (IMAGES[f]) img.src = IMAGES[f];
    });
    if (window.initApp) window.initApp();
    if (anchor) { var el = document.getElementById(anchor); if (el) { el.scrollIntoView(); return; } }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', route); else route();
})();`;
  const designName = name || slug;
  const head = `<title>${designName} for ${site.school.shortName}</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<style>${css}</style>
<script>${js}</script>
<script>${router}</script>`;
  const content = `${head}\n<div id="app"></div>`;
  const out = fragment
    ? content
    : `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n<div id="app"></div>\n</body>\n</html>`;
  const file = path.join(DIST, `preview-${slug}${fragment ? '.fragment' : ''}.html`);
  await writeFile(file, out);
  const size = (await stat(file)).size;
  console.log(`${path.relative(ROOT, file)} (${Math.round(size / 1024)} KB, ${Object.keys(pages).length} pages)`);
}
