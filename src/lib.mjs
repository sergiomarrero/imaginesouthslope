// Shared helpers used by the build and by both designs.
import { ICONS } from './shared/icons.mjs';

export const PAGES = ['home', 'about', 'program', 'admissions', 'contact'];
export const LANGS = ['en', 'es'];
export const PAGE_FILE = {
  home: 'index.html',
  about: 'about.html',
  program: 'program.html',
  admissions: 'admissions.html',
  contact: 'contact.html',
};

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function localizer(lang) {
  return (v) => {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    if (typeof v === 'object') return v[lang] ?? v.en ?? '';
    return String(v);
  };
}

export const phoneDigits = (p) => String(p).replace(/\D/g, '');
export function telHref(p) {
  const d = phoneDigits(p);
  return `tel:+${d.length === 10 ? '1' + d : d}`;
}
export function formatPhone(p) {
  const d = phoneDigits(p);
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : String(p);
}

export function icon(name, cls = '') {
  const body = ICONS[name] || ICONS.spark;
  return `<svg class="icon${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

export function makeCtx({ site, design, lang, page, imageFiles, baseUrl }) {
  const t = localizer(lang);
  const rel = lang === 'en' ? '' : '../';
  const file = PAGE_FILE[page];
  const ctx = {
    site,
    school: site.school,
    ui: site.ui,
    design,
    lang,
    page,
    t,
    esc,
    icon,
    rel,
    baseUrl,
    otherLang: lang === 'en' ? 'es' : 'en',
    year: new Date().getFullYear(),
    href: (p, hash) => `${PAGE_FILE[p]}${hash ? '#' + hash : ''}`,
    altHref: () => (lang === 'en' ? `es/${file}` : `../${file}`),
    asset: (f) => `${rel}assets/${f}`,
    imageSrc: (f) => `${rel}../images/${f}`,
    tourHref: () => site.school.tourUrl || `${PAGE_FILE.contact}#tour`,
    tourExternal: () => Boolean(site.school.tourUrl),
    telHref: (p = site.school.phone) => telHref(p),
    phoneDisplay: (p = site.school.phone) => formatPhone(p),
    mailHref: () => `mailto:${site.school.email}`,
    photo: (key) => site.photos.find((p) => p.file === key) || site.photos.find((p) => p.slot === key) || null,
    hasImage: (f) => imageFiles.has(f),
    nav: () => PAGES.map((p) => ({ page: p, label: t(site.ui.nav[p]), href: PAGE_FILE[p], active: p === page })),
    absUrl: (p = page, l = lang) => (baseUrl ? `${baseUrl}/${design.meta.slug}/${l === 'es' ? 'es/' : ''}${PAGE_FILE[p]}` : ''),
    faqForHome: () => site.faq.filter((f) => f.home),
  };
  ctx.img = (key, opts = {}) => {
    const photo = ctx.photo(key);
    const f = photo ? photo.file : key;
    const alt = photo ? t(photo.alt) : opts.alt || '';
    if (imageFiles.has(f)) {
      const cls = opts.class ? ` class="${esc(opts.class)}"` : '';
      return `<img src="${ctx.imageSrc(f)}" alt="${esc(alt)}"${cls} loading="${opts.loading || 'lazy'}" decoding="async">`;
    }
    return design.placeholder({ photo, file: f, alt, ctx, opts });
  };
  ctx.imgUrl = (key) => {
    const photo = ctx.photo(key);
    const f = photo ? photo.file : key;
    return imageFiles.has(f) ? ctx.imageSrc(f) : '';
  };
  return ctx;
}

export function jsonLd(ctx) {
  const { school: s, t } = ctx;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Preschool',
    name: s.name,
    description: t(s.description),
    telephone: `+1-${formatPhone(s.phone).replace(/[()]/g, '').replace(' ', '-')}`,
    email: s.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address.street,
      addressLocality: s.address.city,
      addressRegion: s.address.state,
      postalCode: s.address.zip,
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: s.address.lat, longitude: s.address.lng },
    openingHours: s.hoursSchema,
    foundingDate: String(s.founded),
    founder: { '@type': 'Person', name: ctx.site.about.edith.name },
    areaServed: 'Brooklyn, NY',
    inLanguage: ['es', 'en'],
    sameAs: Object.values(s.social).filter(Boolean),
  };
  if (ctx.absUrl()) data.url = ctx.absUrl();
  else if (s.siteUrl) data.url = s.siteUrl;
  return JSON.stringify(data);
}

export function headHtml(ctx, { title, description }) {
  const { site, lang, design } = ctx;
  const fullTitle = `${title} | ${site.school.name}`;
  const canonical = ctx.absUrl();
  const alt = { en: ctx.absUrl(ctx.page, 'en'), es: ctx.absUrl(ctx.page, 'es') };
  const ogImage = ctx.hasImage('hero.jpg') && ctx.baseUrl ? `${ctx.baseUrl}/images/hero.jpg` : '';
  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    '<script>document.documentElement.classList.add("js")</script>',
    `<title>${esc(fullTitle)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<meta name="theme-color" content="${design.meta.themeColor}">`,
    canonical ? `<link rel="canonical" href="${canonical}">` : '',
    canonical ? `<link rel="alternate" hreflang="en" href="${alt.en}">` : '',
    canonical ? `<link rel="alternate" hreflang="es" href="${alt.es}">` : '',
    canonical ? `<link rel="alternate" hreflang="x-default" href="${alt.en}">` : '',
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${esc(fullTitle)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:locale" content="${lang === 'es' ? 'es_US' : 'en_US'}">`,
    ogImage ? `<meta property="og:image" content="${ogImage}">` : '',
    `<link rel="icon" href="${ctx.asset('favicon.svg')}" type="image/svg+xml">`,
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${design.meta.fonts}">`,
    `<link rel="stylesheet" href="${ctx.asset('styles.css')}">`,
    `<script type="application/ld+json">${jsonLd(ctx)}</script>`,
  ].filter(Boolean).join('\n');
}

// Tour request form. Sends to Formspree when school.formAction is set, otherwise opens the parent's email app.
export function formHtml(ctx) {
  const { site, t, esc: e } = ctx;
  const f = site.ui.form;
  const s = site.school;
  const action = s.formAction || `mailto:${s.email}`;
  const enctype = s.formAction ? '' : ' enctype="text/plain"';
  const req = `<span class="form__req" aria-hidden="true">*</span>`;
  const field = (key, name, type, required = false, extra = '') =>
    `<div class="form__field">
      <label class="form__label" for="f-${name}">${e(t(f[key]))}${required ? req : ''}</label>
      <input class="form__input" id="f-${name}" name="${name}" type="${type}"${required ? ' required' : ''}${extra}>
    </div>`;
  const select = (key, name, options) =>
    `<div class="form__field">
      <label class="form__label" for="f-${name}">${e(t(f[key]))}</label>
      <select class="form__input form__select" id="f-${name}" name="${name}">
        ${options.map((o) => `<option value="${e(t(o))}">${e(t(o))}</option>`).join('')}
      </select>
    </div>`;
  return `<form class="form" id="tour" data-form data-action="${e(s.formAction)}" data-mailto="${e(s.email)}" method="POST" action="${e(action)}"${enctype} novalidate>
    <div class="visually-hidden" aria-hidden="true"><label>Leave this empty <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
    <input type="hidden" name="_subject" value="Tour request from the website">
    <div class="form__grid">
      ${field('parentName', 'name', 'text', true, ' autocomplete="name"')}
      ${field('email', 'email', 'email', true, ' autocomplete="email" inputmode="email"')}
      ${field('phone', 'phone', 'tel', false, ' autocomplete="tel" inputmode="tel"')}
      ${field('childName', 'child_name', 'text')}
      ${field('childAge', 'child_age', 'text')}
      ${select('schedule', 'schedule', f.scheduleOptions)}
      ${select('language', 'reply_language', f.languageOptions)}
      <div class="form__field form__field--wide">
        <label class="form__label" for="f-message">${e(t(f.message))}</label>
        <textarea class="form__input form__textarea" id="f-message" name="message" rows="4"></textarea>
      </div>
    </div>
    <p class="form__note">${s.formAction ? '' : e(t(f.mailtoNote))}</p>
    <button class="btn btn--primary btn--block" type="submit" data-form-submit data-sending="${e(t(f.sending))}">${e(t(f.submit))}</button>
    <p class="form__status" role="status" aria-live="polite" data-form-status data-success="${e(t(f.success))}" data-error="${e(t(f.error))}"></p>
  </form>`;
}

export function faqHtml(ctx, items, { openFirst = true } = {}) {
  const { t, esc: e } = ctx;
  return `<div class="faq" data-faq>
    ${items
      .map(
        (it, i) => `<details class="faq__item"${openFirst && i === 0 ? ' open' : ''}>
      <summary class="faq__q"><span>${e(t(it.q))}</span>${icon('chevron-down', 'faq__chev')}</summary>
      <div class="faq__a"><p>${e(t(it.a))}</p></div>
    </details>`
      )
      .join('\n')}
  </div>`;
}

export function socialLinks(ctx) {
  const { school } = ctx;
  const items = [
    ['facebook', school.social.facebook, 'Facebook'],
    ['instagram', school.social.instagram, 'Instagram'],
    ['youtube', school.social.youtube, 'YouTube'],
  ].filter(([, url]) => url);
  return items
    .map(([name, url, label]) => `<a class="social__link" href="${esc(url)}" target="_blank" rel="noopener" aria-label="${label}">${icon(name)}</a>`)
    .join('');
}
