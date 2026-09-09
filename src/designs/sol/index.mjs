// Design A: "Sol". Sunny, playful and bold. Butter paper, marigold, cobalt and sage.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from '../../lib.mjs';
import { render as renderPages } from './templates.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));

export const meta = {
  slug: 'sol',
  name: 'Sol',
  tagline: 'Sunny, playful, bold',
  description: 'Butter-yellow paper, a marigold sun and cobalt buttons, photo stacks and sticker badges. Feels like a bright Brooklyn morning and speaks to parents who want joy first.',
  themeColor: '#2F4FCF',
  palette: ['#FFF6E3', '#F5B841', '#2F4FCF', '#7CA982', '#2A2118'],
  fonts: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..800,0..100,0..1&family=Nunito:wght@400;600;700;800&display=swap',
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

// Shown wherever a photo file is missing from images/. Three warm variants keyed off the file name.
export function placeholder({ file, alt, ctx, opts = {} }) {
  const variant = [...file].reduce((a, c) => a + c.charCodeAt(0), 0) % 3;
  const scenes = [
    `<circle cx="300" cy="90" r="46" fill="#F5B841"/><path d="M-20 240C80 190 160 230 240 200s130-30 200 20v100H-20z" fill="#7CA982"/><path d="M-20 270c90-40 180-10 260-30s110-10 180 30v60H-20z" fill="#5E8C65"/>`,
    `<circle cx="90" cy="80" r="38" fill="#2F4FCF"/><rect x="230" y="150" width="120" height="120" rx="26" fill="#F5B841" transform="rotate(-8 290 210)"/><path d="M-20 260c120-60 260-60 440 0v60H-20z" fill="#7CA982"/>`,
    `<path d="M200 60c40 0 70 30 70 70s-30 70-70 70-70-30-70-70 30-70 70-70z" fill="#F5B841"/><path d="M-20 230c100-50 180 20 260-10s120-40 180 10v90H-20z" fill="#6DB5D8"/><path d="M-20 280c120-40 220-10 420-20v60H-20z" fill="#7CA982"/>`,
  ];
  const label = ctx.t(ctx.ui.photoPlaceholder);
  const cls = opts.class ? ` ${esc(opts.class)}` : '';
  return `<div class="ph${cls}" role="img" aria-label="${esc(alt || label)}">
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#F6E7CF"/>${scenes[variant]}</svg>
    <span class="ph__label">${esc(label)}</span>
  </div>`;
}
