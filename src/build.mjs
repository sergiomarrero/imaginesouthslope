// Builds the chosen design (content/site.json "design", or DESIGNS=sol,bosque|all) x pages x languages into dist/.
// One design lands at the root of dist/; several land in dist/<slug>/ with a chooser page.
import { readFile, writeFile, mkdir, rm, readdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { makeCtx, PAGES, LANGS, PAGE_FILE, esc } from './lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const baseUrl = (process.env.SITE_BASE_URL || '').replace(/\/$/, '');

const site = JSON.parse(await readFile(path.join(ROOT, 'content', 'site.json'), 'utf8'));
const imagesDir = path.join(ROOT, 'images');
const imageFiles = new Set((await readdir(imagesDir)).filter((f) => /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(f)));
const sharedJs = await readFile(path.join(ROOT, 'src', 'shared', 'app.js'), 'utf8');

const requested = String(process.env.DESIGNS || site.design || 'all').trim();
const wanted = requested === 'all' ? null : requested.split(',').map((x) => x.trim()).filter(Boolean);

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await writeFile(path.join(DIST, '.nojekyll'), '');

const designsDir = path.join(ROOT, 'src', 'designs');
const designNames = [];
for (const d of (await readdir(designsDir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
  if (!d.isDirectory()) continue;
  const entry = path.join(designsDir, d.name, 'index.mjs');
  if (await stat(entry).then(() => true).catch(() => false)) designNames.push(d.name);
}
const designs = [];
for (const name of designNames) {
  const design = await import(pathToFileURL(path.join(designsDir, name, 'index.mjs')).href);
  if (!wanted || wanted.includes(design.meta.slug)) designs.push(design);
}
if (wanted) for (const w of wanted) if (!designs.some((d) => d.meta.slug === w)) console.warn(`warning: no design named "${w}" in src/designs/`);
if (!designs.length) throw new Error(`No design matched "${requested}". Available: ${designNames.join(', ')}`);
const single = designs.length === 1;
const manifest = [];
let pageCount = 0;

for (const design of designs) {
  const slug = design.meta.slug;
  const urlPrefix = single ? '' : `${slug}/`;
  const outDir = path.join(DIST, urlPrefix);
  await mkdir(path.join(outDir, 'assets'), { recursive: true });
  await mkdir(path.join(outDir, 'es'), { recursive: true });
  await mkdir(path.join(outDir, 'images'), { recursive: true });
  for (const f of imageFiles) await copyFile(path.join(imagesDir, f), path.join(outDir, 'images', f));
  const assets = await design.assets({ sharedJs, root: ROOT });
  for (const [file, content] of Object.entries(assets)) await writeFile(path.join(outDir, 'assets', file), content);
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const ctx = makeCtx({ site, design, lang, page, imageFiles, baseUrl, urlPrefix });
      const html = design.render(ctx);
      const target = path.join(outDir, lang === 'es' ? 'es' : '', PAGE_FILE[page]);
      await writeFile(target, html);
      pageCount += 1;
    }
  }
  manifest.push({ slug, name: design.meta.name, dir: urlPrefix });
}

await writeFile(path.join(DIST, '.designs.json'), JSON.stringify(manifest));
if (!single) await writeFile(path.join(DIST, 'index.html'), chooserHtml(designs, site));
console.log(`Built ${pageCount} pages for ${designs.map((d) => d.meta.name).join(' + ')} into dist/${single ? '' : ' (with a chooser page)'} (${imageFiles.size} photo(s) found${imageFiles.size ? '' : ', placeholders in use'}).`);

function chooserHtml(list, site) {
  const cards = list
    .map(
      (d) => `<article class="card" style="--accent:${d.meta.themeColor}">
      <div class="swatches">${d.meta.palette.map((c) => `<span style="background:${c}"></span>`).join('')}</div>
      <h2>${esc(d.meta.name)} <small>${esc(d.meta.tagline)}</small></h2>
      <p>${esc(d.meta.description)}</p>
      <p class="links"><a class="btn" href="${d.meta.slug}/index.html">Open in English</a> <a class="btn btn--ghost" href="${d.meta.slug}/es/index.html">Abrir en español</a></p>
    </article>`
    )
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Two designs for ${esc(site.school.name)}</title>
<meta name="robots" content="noindex">
<style>
  :root{color-scheme:light}
  *{box-sizing:border-box}
  body{margin:0;font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f6f4ef;color:#1f1f1f;padding:24px 16px 48px}
  main{max-width:920px;margin:0 auto}
  h1{font-size:clamp(1.6rem,4vw,2.4rem);line-height:1.15;margin:0 0 .4rem}
  .lead{color:#555;margin:0 0 1.5rem;max-width:60ch}
  .grid{display:grid;gap:16px;grid-template-columns:1fr}
  @media(min-width:700px){.grid{grid-template-columns:1fr 1fr}}
  .card{background:#fff;border:1px solid #e6e2d8;border-radius:16px;padding:20px;border-top:6px solid var(--accent)}
  .card h2{margin:.4rem 0 .3rem;font-size:1.4rem}
  .card h2 small{display:block;font-size:.85rem;font-weight:500;color:#666;margin-top:.15rem}
  .card p{margin:.4rem 0}
  .swatches{display:flex;gap:6px}.swatches span{width:22px;height:22px;border-radius:50%;border:1px solid rgba(0,0,0,.08)}
  .btn{display:inline-block;padding:.65rem 1rem;border-radius:999px;background:var(--accent);color:#fff;text-decoration:none;font-weight:600;min-height:44px;line-height:1.2}
  .btn--ghost{background:transparent;color:var(--accent);border:2px solid var(--accent)}
  .links{display:flex;flex-wrap:wrap;gap:8px;margin-top:1rem}
  .note{font-size:.9rem;color:#666;margin-top:2rem}
</style>
</head>
<body>
<main>
  <h1>Two directions for ${esc(site.school.name)}</h1>
  <p class="lead">Both use the same words, photos and pages. Open each one on your phone first; that is how most parents will find the school.</p>
  <div class="grid">${cards}</div>
  <p class="note">Every page is available in English and Spanish. Text lives in <code>content/site.json</code>; photos go in <code>images/</code>.</p>
</main>
</body>
</html>`;
}
