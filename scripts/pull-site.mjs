#!/usr/bin/env node
// Downloads the live site's pages and photos so they can be reused in the remake.
// Run this on a normal internet connection:  npm run pull-site
// Output: content/pulled/<page>.html + <page>.txt, images/site/<file>, images/site/MANIFEST.md
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const BASE = process.argv[2] || 'https://southslopemontessori.com';
const PAGES = ['/', '/about', '/admission', '/contact-us'];
const UA = 'Mozilla/5.0 (compatible; ImagineSiteRemake/1.0)';

const outPages = path.join(ROOT, 'content', 'pulled');
const outImages = path.join(ROOT, 'images', 'site');
await mkdir(outPages, { recursive: true });
await mkdir(outImages, { recursive: true });

const seenImages = new Map();
const discoveredLinks = new Set();

function abs(u, from) { try { return new URL(u, from).href; } catch { return null; } }
function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<\/(p|div|h[1-6]|li|section|article|br|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim();
}

for (const p of PAGES) {
  const url = new URL(p, BASE).href;
  process.stdout.write(`Fetching ${url} ... `);
  let html;
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA } });
    if (!res.ok) { console.log(`HTTP ${res.status}`); continue; }
    html = await res.text();
  } catch (e) { console.log(`failed: ${e.message}`); continue; }
  const slug = p === '/' ? 'home' : p.replace(/^\//, '').replace(/[^a-z0-9-]+/gi, '-');
  await writeFile(path.join(outPages, `${slug}.html`), html);
  await writeFile(path.join(outPages, `${slug}.txt`), textOf(html));
  console.log('ok');

  for (const m of html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
    const a = abs(m[1], url);
    if (a && a.startsWith(BASE)) discoveredLinks.add(a);
  }
  const imgRe = /(?:<img[^>]+(?:src|data-src)=["']([^"']+)["'])|(?:url\((["']?)([^)"']+)\2\))|(?:srcset=["']([^"']+)["'])/gi;
  for (const m of html.matchAll(imgRe)) {
    const candidates = [];
    if (m[1]) candidates.push(m[1]);
    if (m[3]) candidates.push(m[3]);
    if (m[4]) candidates.push(...m[4].split(',').map((s) => s.trim().split(/\s+/)[0]));
    for (const c of candidates) {
      const a = abs(c, url);
      if (a && /\.(jpe?g|png|webp|gif|svg)(\?|$)/i.test(a) && !seenImages.has(a)) seenImages.set(a, slug);
    }
  }
}

const manifest = ['# Images pulled from the live site', '', `Source: ${BASE}`, '', '| File | From page | Original URL |', '|---|---|---|'];
let i = 0;
for (const [imgUrl, fromPage] of seenImages) {
  i += 1;
  const ext = (imgUrl.match(/\.(jpe?g|png|webp|gif|svg)/i) || ['', 'jpg'])[1].toLowerCase();
  const file = `${fromPage}-${String(i).padStart(2, '0')}.${ext}`;
  const dest = path.join(outImages, file);
  if (existsSync(dest)) { manifest.push(`| ${file} | ${fromPage} | ${imgUrl} |`); continue; }
  process.stdout.write(`Image ${imgUrl} ... `);
  try {
    const res = await fetch(imgUrl, { headers: { 'user-agent': UA } });
    if (!res.ok) { console.log(`HTTP ${res.status}`); continue; }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    manifest.push(`| ${file} | ${fromPage} | ${imgUrl} |`);
    console.log('ok');
  } catch (e) { console.log(`failed: ${e.message}`); }
}
manifest.push('', '## Links found on the site', '', ...[...discoveredLinks].sort().map((l) => `- ${l}`));
await writeFile(path.join(outImages, 'MANIFEST.md'), manifest.join('\n') + '\n');

console.log(`\nDone. ${seenImages.size} image(s) in images/site/, page text in content/pulled/.`);
console.log('Next: copy the best photos into images/ using the slot names in images/README.md.');
