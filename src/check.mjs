// Validates content/site.json and explains problems in plain language.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(ROOT, 'content', 'site.json');
const raw = await readFile(file, 'utf8');

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  const m = /position (\d+)/.exec(err.message);
  if (m) {
    const pos = Number(m[1]);
    const before = raw.slice(0, pos);
    const line = before.split('\n').length;
    const col = pos - before.lastIndexOf('\n');
    const lines = raw.split('\n');
    console.error(`\ncontent/site.json has a formatting problem near line ${line}, column ${col}.\n`);
    for (let i = Math.max(0, line - 3); i < Math.min(lines.length, line + 2); i++) {
      console.error(`${String(i + 1).padStart(5)} ${i + 1 === line ? '>' : ' '} ${lines[i]}`);
    }
    console.error('\nUsually this is a missing comma between items, or a missing quotation mark.');
  } else {
    console.error(`content/site.json could not be read: ${err.message}`);
  }
  process.exit(1);
}

const errors = [];
const warnings = [];
let confirmCount = 0;

function walk(node, trail) {
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${trail}[${i}]`));
  if (!node || typeof node !== 'object') return;
  if ('en' in node || 'es' in node) {
    if (!node.en) errors.push(`${trail}: missing English text ("en")`);
    if (!node.es) warnings.push(`${trail}: missing Spanish text ("es"), English will be shown instead`);
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('_confirm') || k === '_testimonialsConfirm') { confirmCount += 1; continue; }
    walk(v, trail ? `${trail}.${k}` : k);
  }
}
walk(data, '');

const s = data.school || {};
for (const key of ['name', 'phone', 'email', 'hours', 'tagline', 'description']) if (!s[key]) errors.push(`school.${key} is missing`);
for (const key of ['street', 'city', 'state', 'zip']) if (!s.address || !s.address[key]) errors.push(`school.address.${key} is missing`);
if (s.formAction && !/^https:\/\//.test(s.formAction)) errors.push('school.formAction must start with https://');
if (s.tourUrl && !/^https?:\/\//.test(s.tourUrl)) errors.push('school.tourUrl must start with https://');
if (!Array.isArray(data.photos)) errors.push('photos must be a list');
else data.photos.forEach((p, i) => { if (!p.file) errors.push(`photos[${i}] needs a "file" name`); if (!p.alt) errors.push(`photos[${i}] needs "alt" text`); });
if (!Array.isArray(data.faq) || !data.faq.length) errors.push('faq needs at least one question');
if (!Array.isArray(data.testimonials)) errors.push('testimonials must be a list');
for (const page of ['home', 'about', 'program', 'admissions', 'contact']) if (!data[page]) errors.push(`section "${page}" is missing`);

warnings.forEach((w) => console.warn(`warning: ${w}`));
errors.forEach((e) => console.error(`error: ${e}`));
console.log(`${errors.length ? 'Problems found.' : 'content/site.json looks good.'} ${confirmCount} item(s) still marked for the founder to confirm.`);
process.exit(errors.length ? 1 : 0);
