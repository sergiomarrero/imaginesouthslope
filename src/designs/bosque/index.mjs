// Design B: "Bosque". Calm, modern, grounded. Mist-green paper, forest, moss and pink-tower rose.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../../lib.mjs';
import { render as renderPages } from './templates.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));

export const meta = {
  slug: 'bosque',
  name: 'Bosque',
  tagline: 'Calm, modern, grounded',
  description: 'Pale mist-green paper, deep forest, a pink-tower rose accent and a confident grotesk headline over full-bleed photography. Feels like the calm of a Montessori room and speaks to parents who want trust first.',
  themeColor: '#1E3A2B',
  palette: ['#EDF1EA', '#1E3A2B', '#5F7F63', '#D2727C', '#D9E2D3'],
  fonts: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=DM+Sans:opsz,wght@9..40,400..700&display=swap',
};

export async function assets({ sharedJs }) {
  const [css, extra, favicon] = await Promise.all([
    readFile(path.join(DIR, 'styles.css'), 'utf8'),
    readFile(path.join(DIR, 'app.js'), 'utf8'),
    readFile(path.join(DIR, 'favicon.svg'), 'utf8'),
  ]);
  return { 'styles.css': css, 'app.js': `${sharedJs}\n${extra}`, 'favicon.svg': favicon };
}

export function render(ctx) {
  return renderPages(ctx);
}

// Shown wherever a photo file is missing from images/. Thin line drawings on paper, or on forest green for dark slots.
export function placeholder({ file, alt, ctx, opts = {} }) {
  const dark = opts.tone === 'dark';
  const stroke = dark ? 'rgba(228,218,198,.28)' : '#5F7F63';
  const bg = dark ? '#1E3A2B' : '#DFE6DA';
  const variant = [...file].reduce((a, c) => a + c.charCodeAt(0), 0) % 3;
  const scenes = [
    `<g fill="none" stroke="${stroke}" stroke-width="1.5"><circle cx="300" cy="95" r="40"/><path d="M0 230c90-40 170-40 260 0s120 30 140 20"/><path d="M0 262c90-40 170-40 260 0s120 30 140 20"/><path d="M60 150c20-40 60-40 80 0M140 150c20-40 60-40 80 0"/></g>`,
    `<g fill="none" stroke="${stroke}" stroke-width="1.5"><path d="M200 60c60 0 90 60 90 120s-30 90-90 90-90-30-90-90 30-120 90-120z"/><path d="M200 60v210M140 150c30 20 90 20 120 0M130 210c40 20 100 20 140 0"/></g>`,
    `<g fill="none" stroke="${stroke}" stroke-width="1.5"><path d="M40 260c40-80 80-120 160-140 80 20 120 60 160 140"/><path d="M200 120v140M120 200l80-60 80 60"/><circle cx="330" cy="70" r="24"/><path d="M0 285h400"/></g>`,
  ];
  const label = ctx.t(ctx.ui.photoPlaceholder);
  const cls = opts.class ? ` ${esc(opts.class)}` : '';
  return `<div class="ph${dark ? ' ph--dark' : ''}${cls}" role="img" aria-label="${esc(alt || label)}">
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="${bg}"/>${scenes[variant]}</svg>
    <span class="ph__label">${esc(label)}</span>
  </div>`;
}
