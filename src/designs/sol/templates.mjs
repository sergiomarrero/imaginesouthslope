import { headHtml, formHtml, faqHtml, socialLinks, icon, esc } from '../../lib.mjs';

const sunMark = `<svg class="mark" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="11" fill="#F5B841"/><g stroke="#E39F1E" stroke-width="3" stroke-linecap="round"><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/></g></svg>`;

const wave = (cls = '') => `<div class="wave ${cls}" aria-hidden="true"><svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0 30C240 60 480 0 720 30s480 60 720 0v30H0z"/></svg></div>`;

function tourBtn(ctx, cls = 'btn btn--primary', label) {
  const ext = ctx.tourExternal();
  const text = label || ctx.t(ctx.ui.cta.tour);
  return `<a class="${cls}" href="${ctx.tourHref()}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(text)}${icon(ext ? 'external' : 'arrow-right', 'btn__icon')}</a>`;
}
const callBtn = (ctx, cls = 'btn btn--ghost') => `<a class="${cls}" href="${ctx.telHref()}">${icon('phone', 'btn__icon btn__icon--lead')}${esc(ctx.t(ctx.ui.cta.call))}</a>`;
const langLink = (ctx, cls = 'lang') => `<a class="${cls}" href="${ctx.altHref()}" hreflang="${ctx.otherLang}" lang="${ctx.otherLang}" aria-label="${esc(ctx.t(ctx.ui.langSwitchAria))}">${esc(ctx.t(ctx.ui.langSwitch))}</a>`;

function sectionHead(ctx, { eyebrow, title, text, align = '' }) {
  const { t } = ctx;
  return `<div class="sec__head${align ? ' sec__head--' + align : ''}" data-reveal>
    ${eyebrow ? `<p class="eyebrow">${esc(t(eyebrow))}</p>` : ''}
    <h2 class="sec__title">${esc(t(title))}</h2>
    ${text ? `<p class="sec__text">${esc(t(text))}</p>` : ''}
  </div>`;
}

function ctaBand(ctx) {
  const { t, site } = ctx;
  return `<section class="band">
    <div class="wrap band__in" data-reveal>
      <div class="band__sun" aria-hidden="true">${sunMark}</div>
      <h2 class="band__title">${esc(t(site.home.visit.title))}</h2>
      <p class="band__text">${esc(t(site.home.visit.text))}</p>
      <div class="band__cta">${tourBtn(ctx, 'btn btn--dark')}${callBtn(ctx, 'btn btn--ghost-dark')}</div>
    </div>
  </section>`;
}

function layout(ctx, { title, description, body }) {
  const { t, ui, school, site, lang } = ctx;
  const navLinks = (cls) => ctx.nav().map((n) => `<a class="${cls}${n.active ? ' is-active' : ''}" href="${n.href}"${n.active ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('');
  return `<!doctype html>
<html lang="${lang}">
<head>
${headHtml(ctx, { title, description })}
</head>
<body class="page-${ctx.page}">
<a class="skip" href="#main">${esc(t(ui.skipLink))}</a>
<header class="hdr" data-header>
  <div class="wrap hdr__in">
    <a class="brand" href="${ctx.href('home')}">${sunMark}<span class="brand__name">Imagine <em>South Slope</em> Montessori</span></a>
    <nav class="hdr__nav" aria-label="Primary">${navLinks('hdr__link')}</nav>
    <div class="hdr__actions">
      ${langLink(ctx, 'lang hdr__lang')}
      ${tourBtn(ctx, 'btn btn--primary btn--sm hdr__cta')}
      <button class="burger" type="button" data-nav-toggle aria-expanded="false" aria-controls="menu"><span class="visually-hidden">${esc(t(ui.menu))}</span>${icon('menu', 'burger__open')}${icon('close', 'burger__close')}</button>
    </div>
  </div>
</header>
<div class="menu" id="menu" data-nav>
  <nav class="menu__nav wrap" aria-label="${esc(t(ui.menu))}">${navLinks('menu__link')}</nav>
  <div class="menu__foot wrap">
    ${tourBtn(ctx, 'btn btn--primary btn--block')}
    <a class="menu__contact" href="${ctx.telHref()}">${icon('phone')}${esc(ctx.phoneDisplay())}</a>
    <a class="menu__contact" href="${ctx.mailHref()}">${icon('mail')}${esc(school.email)}</a>
    ${langLink(ctx, 'lang lang--menu')}
  </div>
</div>
<main id="main">
${body}
</main>
<footer class="ftr">
  <div class="wrap ftr__grid">
    <div class="ftr__brand">
      <a class="brand brand--ftr" href="${ctx.href('home')}">${sunMark}<span class="brand__name">Imagine <em>South Slope</em> Montessori</span></a>
      <p>${esc(t(ui.footer.blurb))}</p>
      <p class="ftr__since">${esc(t(ui.sinceLabel))} · ${esc(t(ui.sePablaEspanol))}</p>
    </div>
    <div>
      <h3 class="ftr__h">${esc(t(ui.footer.visit))}</h3>
      <address class="ftr__addr">${esc(school.address.venue)}<br>${esc(school.address.street)}<br>${esc(school.address.city)}, ${esc(school.address.state)} ${esc(school.address.zip)}</address>
      <a class="ftr__link" href="${esc(school.address.mapsUrl)}" target="_blank" rel="noopener">${esc(t(ui.cta.directions))}${icon('arrow-up-right')}</a>
    </div>
    <div>
      <h3 class="ftr__h">${esc(t(ui.footer.hours))}</h3>
      <p>${esc(t(school.hours))}</p>
      <p><a class="ftr__link" href="${ctx.telHref()}">${icon('phone')}${esc(ctx.phoneDisplay())}</a></p>
      <p><a class="ftr__link" href="${ctx.mailHref()}">${icon('mail')}${esc(school.email)}</a></p>
    </div>
    <div>
      <h3 class="ftr__h">${esc(t(ui.footer.follow))}</h3>
      <div class="social">${socialLinks(ctx)}</div>
      <p class="ftr__lang">${langLink(ctx, 'lang lang--ftr')}</p>
    </div>
  </div>
  <div class="wrap ftr__bottom">
    <p>© ${ctx.year} ${esc(school.legalName)}. ${esc(t(ui.footer.rights))}</p>
    <p>${esc(t(ui.footer.privacy))}</p>
  </div>
</footer>
<div class="dock">
  ${callBtn(ctx, 'dock__call')}
  ${tourBtn(ctx, 'btn btn--primary dock__tour')}
</div>
<script src="${ctx.asset('app.js')}" defer></script>
</body>
</html>`;
}

/* ---------- Home ---------- */
// Prefer photos that exist over placeholders, keeping the preferred order within each group.
const existingFirst = (ctx, files) => [...files].sort((a, b) => Number(ctx.hasImage(b)) - Number(ctx.hasImage(a)));

function home(ctx) {
  const { t, site, school, ui } = ctx;
  const h = site.home;
  const day = site.program.day;
  const rv = h.reviews;
  const reviews = site.testimonials;
  const reviewCount = (n) => t(ui.reviews.counter).replace('{n}', n).replace('{total}', reviews.length);
  // Collage order: top (large), middle (right), bottom. Strawberries lead, tracing in the middle, studio at the bottom.
  const collage = existingFirst(ctx, ['classroom-2.jpg', 'hero.jpg', 'studio.jpg', 'circle.jpg', 'playground.jpg', 'materials.jpg', 'art.jpg']).slice(0, 3);
  // Six photos not already in the collage: the wide room leads, the rest fill a 2-column grid on phones and 3 columns on desktop.
  const gallery = existingFirst(ctx, ['room.jpg', 'art.jpg', 'materials.jpg', 'books.jpg', 'movement.jpg', 'culture.jpg', 'classroom-1.jpg', 'circle.jpg', 'playground.jpg']).slice(0, 6);
  const body = `
<section class="hero" data-hero>
  <div class="hero__sun" data-sun aria-hidden="true">${sunMark}</div>
  <div class="wrap hero__grid">
    <div class="hero__copy">
      <p class="eyebrow">${esc(t(h.hero.eyebrow))}</p>
      <h1 class="hero__title">${esc(t(h.hero.title))}</h1>
      <p class="hero__sub">${esc(t(h.hero.subtitle))}</p>
      <div class="hero__cta">
        ${tourBtn(ctx)}
        <a class="btn btn--ghost" href="${ctx.href('program', 'day')}">${esc(t(ui.cta.seeDay))}</a>
      </div>
      <p class="hero__note"><span class="pulse" aria-hidden="true"></span>${esc(t(h.hero.note))}</p>
    </div>
    <div class="collage" aria-hidden="false">
      <figure class="polaroid polaroid--a">${ctx.img(collage[0], { loading: 'eager' })}</figure>
      <figure class="polaroid polaroid--b">${ctx.img(collage[1])}</figure>
      <figure class="polaroid polaroid--c">${ctx.img(collage[2])}</figure>
      <span class="sticker sticker--hola" aria-hidden="true">¡Hola!</span>
      <span class="sticker sticker--ages" aria-hidden="true">${esc(t(school.ages))}</span>
    </div>
  </div>
</section>

<section class="stats-wrap">
  <ul class="wrap stats" data-reveal>
    ${h.stats.map((s) => `<li class="stat"><strong class="stat__value">${esc(s.value)}</strong><span class="stat__label">${esc(t(s.label))}</span></li>`).join('')}
  </ul>
</section>

${wave('wave--sand')}
<section class="sec mont" id="montessori">
  <div class="wrap mont__grid">
    <div class="mont__copy" data-reveal>
      <p class="eyebrow">${esc(t(h.montessori.eyebrow))}</p>
      <h2 class="sec__title">${esc(t(h.montessori.title))}</h2>
      <p class="sec__text">${esc(t(h.montessori.text))}</p>
      <ul class="checks">${h.montessori.points.map((p) => `<li>${icon('check')}<span>${esc(t(p))}</span></li>`).join('')}</ul>
      <a class="btn btn--ghost" href="${ctx.href('about')}">${esc(t(ui.nav.about))}${icon('arrow-right', 'btn__icon')}</a>
    </div>
    <figure class="quote-card" data-reveal>
      ${icon('quote', 'quote-card__mark')}
      <blockquote>${esc(t(h.montessori.quote))}</blockquote>
      <figcaption>${esc(t(h.montessori.quoteBy))}</figcaption>
    </figure>
  </div>
</section>
${wave('wave--sand wave--flip')}

<section class="sec why" id="why">
  <div class="wrap">
    ${sectionHead(ctx, { eyebrow: h.why.eyebrow, title: h.why.title, text: h.why.intro })}
    <div class="why__grid">
      ${h.why.items.map((it, i) => `<article class="why__card" data-reveal style="--i:${i}"><span class="why__icon">${icon(it.icon)}</span><h3 class="why__title">${esc(t(it.title))}</h3><p>${esc(t(it.text))}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="sec day" id="day">
  <div class="wrap">
    ${sectionHead(ctx, { eyebrow: h.dayPreview.eyebrow, title: h.dayPreview.title, text: h.dayPreview.text })}
  </div>
  <div class="carousel" data-carousel>
    <div class="wrap carousel__bar">
      <button class="carousel__btn" type="button" data-carousel-prev aria-label="Previous">${icon('chevron-left')}</button>
      <div class="carousel__dots" data-carousel-dots></div>
      <button class="carousel__btn" type="button" data-carousel-next aria-label="Next">${icon('chevron-right')}</button>
    </div>
    <ol class="carousel__track day__track" data-carousel-track>
      ${day.items.map((d) => `<li class="day__card"><span class="day__time">${esc(d.time)}</span><h3 class="day__title">${esc(t(d.title))}</h3><p>${esc(t(d.text))}</p></li>`).join('')}
    </ol>
  </div>
  <div class="wrap day__more" data-reveal><a class="btn btn--secondary" href="${ctx.href('program', 'day')}">${esc(t(ui.cta.seeProgram))}${icon('arrow-right', 'btn__icon')}</a></div>
</section>

<section class="sec edith">
  <div class="wrap edith__grid">
    <figure class="edith__photo blob" data-reveal>${ctx.img('edith.jpg')}</figure>
    <div class="edith__copy" data-reveal>
      <p class="eyebrow">${esc(t(h.edithTeaser.eyebrow))}</p>
      <h2 class="sec__title">${esc(t(h.edithTeaser.title))}</h2>
      <p class="sec__text">${esc(t(h.edithTeaser.text))}</p>
      <a class="btn btn--ghost" href="${ctx.href('about')}#edith">${esc(t(ui.cta.meetEdith))}${icon('arrow-right', 'btn__icon')}</a>
    </div>
  </div>
</section>

<section class="sec voices" id="reviews">
  <div class="wrap voices__grid">
    <div class="voices__head" data-reveal>
      <p class="eyebrow">${esc(t(rv.eyebrow))}</p>
      <h2 class="sec__title">${esc(t(h.testimonialsTitle))}</h2>
      <p class="sec__text">${esc(t(rv.intro))}</p>
    </div>
    <div class="review" data-carousel data-carousel-loop data-reveal role="region" aria-roledescription="carousel" aria-label="${esc(t(ui.reviews.region))}">
      <ul class="review__track" data-carousel-track>
        ${reviews.map((q, i) => `<li class="review__slide" role="group" aria-roledescription="slide" aria-label="${esc(reviewCount(i + 1))}"><figure class="review__card">${icon('quote', 'review__mark')}<blockquote class="review__q"${q.lang && q.lang !== ctx.lang ? '' : ` lang="${q.lang || ctx.lang}"`}>“${esc(t(q.quote))}”</blockquote><figcaption class="review__by"><span>${esc(t(q.by))}</span>${q.date ? `<time class="review__date"${q.iso ? ` datetime="${esc(q.iso)}"` : ''}>${esc(t(q.date))}</time>` : ''}${q.lang && q.lang !== ctx.lang ? `<span class="review__tr">${esc(t(ui.reviews.translated))}</span>` : ''}</figcaption></figure></li>`).join('')}
      </ul>
      <div class="review__bar">
        <button class="carousel__btn" type="button" data-carousel-prev aria-label="${esc(t(ui.reviews.prev))}">${icon('chevron-left')}</button>
        <span class="review__count" data-carousel-counter data-template="${esc(t(ui.reviews.counter))}" aria-live="polite">${esc(reviewCount(1))}</span>
        <button class="carousel__btn" type="button" data-carousel-next aria-label="${esc(t(ui.reviews.next))}">${icon('chevron-right')}</button>
      </div>
      <p class="review__source"><a href="${esc(rv.sourceUrl)}" target="_blank" rel="noopener">${esc(t(rv.sourceLabel))}${icon('arrow-up-right', 'btn__icon')}</a><span class="review__note">${esc(t(rv.note))}</span></p>
    </div>
  </div>
</section>

<section class="sec gallery">
  <div class="wrap">
    ${sectionHead(ctx, { title: h.galleryTitle, text: h.galleryText })}
    <div class="gallery__grid" data-reveal>
      ${gallery.map((f, i) => `<figure class="gallery__item gallery__item--${i}" data-lightbox>${ctx.img(f)}</figure>`).join('')}
    </div>
  </div>
</section>

<section class="sec faq-sec">
  <div class="wrap faq-sec__grid">
    <div data-reveal>
      <p class="eyebrow">FAQ</p>
      <h2 class="sec__title">${esc(t(site.admissions.faqTitle))}</h2>
      <a class="btn btn--ghost" href="${ctx.href('admissions', 'faq')}">${esc(t(ui.cta.readFaq))}${icon('arrow-right', 'btn__icon')}</a>
    </div>
    <div data-reveal>${faqHtml(ctx, ctx.faqForHome())}</div>
  </div>
</section>

${ctaBand(ctx)}

<section class="sec where">
  <div class="wrap where__grid">
    <div class="where__copy" data-reveal>
      <p class="eyebrow">${esc(t(ui.footer.visit))}</p>
      <h2 class="sec__title">${esc(t(h.location.title))}</h2>
      <p class="sec__text">${esc(t(h.location.text))}</p>
      <address class="where__addr">${icon('pin')}<span>${esc(school.address.venue)}<br>${esc(school.address.street)}<br>${esc(school.address.city)}, ${esc(school.address.state)} ${esc(school.address.zip)}</span></address>
      <p class="where__hours">${icon('clock')}<span>${esc(t(school.hours))}</span></p>
      <a class="btn btn--secondary" href="${esc(school.address.mapsUrl)}" target="_blank" rel="noopener">${esc(t(ui.cta.directions))}${icon('arrow-up-right', 'btn__icon')}</a>
    </div>
    <div class="map" data-reveal>
      <div class="map__fallback" aria-hidden="true">${icon('pin')}<span>${esc(school.address.street)}</span></div>
      <iframe class="map__frame" src="${esc(school.address.mapsEmbed)}" loading="lazy" title="Map" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>`;
  return layout(ctx, { title: t(h.meta.title), description: t(school.description), body });
}

/* ---------- About ---------- */
function about(ctx) {
  const { t, site, ui } = ctx;
  const a = site.about;
  const spacePics = existingFirst(ctx, ['classroom-1.jpg', 'movement.jpg', 'playground.jpg']);
  const body = `
<section class="phero" data-hero>
  <div class="wrap phero__grid">
    <div class="phero__copy">
      <p class="eyebrow">${esc(t(a.hero.eyebrow))}</p>
      <h1 class="phero__title">${esc(t(a.hero.title))}</h1>
      <p class="phero__intro">${esc(t(a.hero.intro))}</p>
    </div>
    <figure class="phero__photo polaroid polaroid--solo">${ctx.img(existingFirst(ctx, ['room.jpg', 'studio.jpg'])[0], { loading: 'eager' })}</figure>
  </div>
</section>

<section class="sec philo">
  <div class="wrap philo__grid">
    <div class="philo__side" data-reveal>
      <p class="eyebrow">${esc(t(a.philosophy.eyebrow))}</p>
      <h2 class="sec__title">${esc(t(a.philosophy.title))}</h2>
    </div>
    <div class="philo__body prose" data-reveal>
      ${a.philosophy.paragraphs.map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${esc(t(p))}</p>`).join('')}
    </div>
  </div>
</section>

${wave('wave--sand')}
<section class="sec values">
  <div class="wrap">
    ${sectionHead(ctx, { title: a.values.title })}
    <div class="values__grid">
      ${a.values.items.map((v, i) => `<article class="value" data-reveal style="--i:${i}"><span class="value__icon">${icon(v.icon)}</span><h3>${esc(t(v.title))}</h3><p>${esc(t(v.text))}</p></article>`).join('')}
    </div>
  </div>
</section>
${wave('wave--sand wave--flip')}

<section class="sec edith edith--full" id="edith">
  <div class="wrap edith__grid">
    <figure class="edith__photo blob" data-reveal>${ctx.img('edith.jpg')}</figure>
    <div class="edith__copy prose" data-reveal>
      <p class="eyebrow">${esc(t(a.edith.eyebrow))}</p>
      <h2 class="sec__title">${esc(a.edith.name)}</h2>
      <p class="edith__role">${esc(t(a.edith.role))}</p>
      ${a.edith.bio.map((p) => `<p>${esc(t(p))}</p>`).join('')}
      <h3 class="h4">${esc(t(a.team.title))}</h3>
      <p>${esc(t(a.team.text))}</p>
    </div>
  </div>
</section>

<section class="sec space">
  <div class="wrap space__grid">
    <div class="space__copy" data-reveal>
      <p class="eyebrow">${esc(t(a.space.eyebrow))}</p>
      <h2 class="sec__title">${esc(t(a.space.title))}</h2>
      <p class="sec__text">${esc(t(a.space.text))}</p>
    </div>
    <div class="space__photos" data-reveal>
      <figure class="polaroid polaroid--tilt-l" data-lightbox>${ctx.img(spacePics[0])}</figure>
      <figure class="polaroid polaroid--tilt-r" data-lightbox>${ctx.img(spacePics[1])}</figure>
    </div>
  </div>
</section>

<section class="sec story">
  <div class="wrap">
    ${sectionHead(ctx, { title: a.story.title })}
    <ol class="story__list">
      ${a.story.milestones.map((m) => `<li class="story__item" data-reveal><span class="story__year">${esc(m.year)}</span><p>${esc(t(m.text))}</p></li>`).join('')}
    </ol>
  </div>
</section>

${ctaBand(ctx)}`;
  return layout(ctx, { title: t(a.meta.title), description: t(a.hero.intro), body });
}

/* ---------- Program ---------- */
function program(ctx) {
  const { t, site, ui } = ctx;
  const p = site.program;
  const body = `
<section class="phero" data-hero>
  <div class="wrap phero__grid">
    <div class="phero__copy">
      <p class="eyebrow">${esc(t(p.hero.eyebrow))}</p>
      <h1 class="phero__title">${esc(t(p.hero.title))}</h1>
      <p class="phero__intro">${esc(t(p.hero.intro))}</p>
      <div class="hero__cta">${tourBtn(ctx)}<a class="btn btn--ghost" href="#day">${esc(t(ui.cta.seeDay))}</a></div>
    </div>
    <figure class="phero__photo polaroid polaroid--solo">${ctx.img(ctx.hasImage('materials.jpg') ? 'materials.jpg' : 'hero.jpg', { loading: 'eager' })}</figure>
  </div>
</section>

<section class="sec steps-sec">
  <div class="wrap">
    ${sectionHead(ctx, { eyebrow: p.immersion.eyebrow, title: p.immersion.title })}
    <ol class="steps">
      ${p.immersion.steps.map((s, i) => `<li class="step" data-reveal style="--i:${i}"><span class="step__num">${i + 1}</span><h3>${esc(t(s.title))}</h3><p>${esc(t(s.text))}</p></li>`).join('')}
    </ol>
  </div>
</section>

${wave('wave--sand')}
<section class="sec areas">
  <div class="wrap">
    ${sectionHead(ctx, { eyebrow: p.areas.eyebrow, title: p.areas.title })}
    <div class="areas__grid">
      ${p.areas.items.map((a, i) => `<article class="area" data-reveal style="--i:${i}"><span class="area__icon">${icon(a.icon)}</span><h3>${esc(t(a.title))}</h3><p>${esc(t(a.text))}</p></article>`).join('')}
    </div>
  </div>
</section>
${wave('wave--sand wave--flip')}

<section class="sec tl-sec" id="day">
  <div class="wrap tl-sec__grid">
    <div class="tl-sec__side" data-reveal>
      <p class="eyebrow">${esc(t(p.day.eyebrow))}</p>
      <h2 class="sec__title">${esc(t(p.day.title))}</h2>
      <p class="sec__text">${esc(t(p.day.note))}</p>
      <figure class="polaroid polaroid--tilt-l tl-sec__photo" data-lightbox>${ctx.img(existingFirst(ctx, ['circle.jpg', 'books.jpg'])[0])}</figure>
    </div>
    <ol class="tl">
      ${p.day.items.map((d) => `<li class="tl__item" data-reveal><span class="tl__time">${esc(d.time)}</span><div class="tl__body"><h3>${esc(t(d.title))}</h3><p>${esc(t(d.text))}</p></div></li>`).join('')}
    </ol>
  </div>
</section>

<section class="sec sched">
  <div class="wrap">
    ${sectionHead(ctx, { eyebrow: p.schedules.eyebrow, title: p.schedules.title, text: p.schedules.text })}
    <ul class="sched__grid">
      ${p.schedules.options.map((o, i) => `<li class="plan" data-reveal style="--i:${i}"><strong class="plan__days">${esc(o.days)}</strong><span class="plan__label">${esc(t(o.label))}</span><p class="plan__note">${esc(t(o.note))}</p></li>`).join('')}
    </ul>
    <div class="tuition" data-reveal>
      <div class="tuition__main">
        <h3>${esc(t(p.tuition.title))}</h3>
        <p>${esc(t(p.tuition.text))}</p>
        <p class="tuition__fee">${icon('dollar')}<span>${esc(t(p.tuition.fee))}</span></p>
        ${tourBtn(ctx, 'btn btn--primary')}
      </div>
      <div class="tuition__bring">
        <h3>${esc(t(p.bring.title))}</h3>
        <ul class="checks">${p.bring.items.map((b) => `<li>${icon('check')}<span>${esc(t(b))}</span></li>`).join('')}</ul>
      </div>
    </div>
  </div>
</section>

${ctaBand(ctx)}`;
  return layout(ctx, { title: t(p.meta.title), description: t(p.hero.intro), body });
}

/* ---------- Admissions ---------- */
function admissions(ctx) {
  const { t, site, ui } = ctx;
  const ad = site.admissions;
  const body = `
<section class="phero phero--plain" data-hero>
  <div class="wrap phero__grid">
    <div class="phero__copy">
      <p class="eyebrow">${esc(t(ad.hero.eyebrow))}</p>
      <h1 class="phero__title">${esc(t(ad.hero.title))}</h1>
      <p class="phero__intro">${esc(t(ad.hero.intro))}</p>
      <div class="hero__cta">${tourBtn(ctx)}${callBtn(ctx)}</div>
    </div>
    <figure class="phero__photo polaroid polaroid--solo">${ctx.img('classroom-2.jpg', { loading: 'eager' })}</figure>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    ${sectionHead(ctx, { title: ad.steps.title })}
    <ol class="steps steps--big">
      ${ad.steps.items.map((s, i) => `<li class="step" data-reveal style="--i:${i}"><span class="step__num">${i + 1}</span><h3>${esc(t(s.title))}</h3><p>${esc(t(s.text))}</p></li>`).join('')}
    </ol>
  </div>
</section>

${wave('wave--sand')}
<section class="sec req">
  <div class="wrap req__grid">
    <div data-reveal>
      <h2 class="sec__title">${esc(t(ad.requirements.title))}</h2>
      <ul class="checks checks--big">${ad.requirements.items.map((r) => `<li>${icon('check')}<span>${esc(t(r))}</span></li>`).join('')}</ul>
    </div>
    <div class="open" data-reveal>
      <span class="open__icon">${icon('calendar')}</span>
      <h2 class="h3">${esc(t(ad.openHouse.title))}</h2>
      <p>${esc(t(ad.openHouse.text))}</p>
      ${tourBtn(ctx, 'btn btn--primary')}
    </div>
  </div>
</section>
${wave('wave--sand wave--flip')}

<section class="sec" id="faq">
  <div class="wrap faq-page">
    ${sectionHead(ctx, { eyebrow: 'FAQ', title: ad.faqTitle })}
    <div data-reveal>${faqHtml(ctx, site.faq)}</div>
  </div>
</section>

${ctaBand(ctx)}`;
  return layout(ctx, { title: t(ad.meta.title), description: t(ad.hero.intro), body });
}

/* ---------- Contact ---------- */
function contact(ctx) {
  const { t, site, school, ui } = ctx;
  const c = site.contact;
  const dirIcons = ['train', 'bus', 'door', 'stroller'];
  const body = `
<section class="phero phero--plain" data-hero>
  <div class="wrap">
    <p class="eyebrow">${esc(t(c.hero.eyebrow))}</p>
    <h1 class="phero__title">${esc(t(c.hero.title))}</h1>
    <p class="phero__intro">${esc(t(c.hero.intro))}</p>
  </div>
</section>

<section class="sec contact">
  <div class="wrap contact__grid">
    <div class="contact__cards">
      <a class="ccard" href="${ctx.telHref()}" data-reveal><span class="ccard__icon">${icon('phone')}</span><span class="ccard__label">${esc(t(c.labels.phone))}</span><strong>${esc(ctx.phoneDisplay())}</strong>${school.phoneAlt ? `<small>${esc(t(c.labels.phoneAlt))}: ${esc(ctx.phoneDisplay(school.phoneAlt))}</small>` : ''}</a>
      <a class="ccard" href="${ctx.mailHref()}" data-reveal><span class="ccard__icon">${icon('mail')}</span><span class="ccard__label">${esc(t(c.labels.email))}</span><strong class="ccard__break">${esc(school.email)}</strong></a>
      <div class="ccard" data-reveal><span class="ccard__icon">${icon('clock')}</span><span class="ccard__label">${esc(t(c.labels.hours))}</span><strong>${esc(t(school.hours))}</strong></div>
      <a class="ccard" href="${esc(school.address.mapsUrl)}" target="_blank" rel="noopener" data-reveal><span class="ccard__icon">${icon('pin')}</span><span class="ccard__label">${esc(t(c.labels.address))}</span><strong>${esc(school.address.venue)}<br>${esc(school.address.street)}<br>${esc(school.address.city)}, ${esc(school.address.state)} ${esc(school.address.zip)}</strong><small>${esc(t(ui.cta.directions))} ↗</small></a>
    </div>
    <div class="contact__form" data-reveal>
      <h2 class="h3">${esc(t(ui.form.title))}</h2>
      <p class="sec__text">${esc(t(ui.form.intro))}</p>
      ${formHtml(ctx)}
    </div>
  </div>
</section>

<section class="sec where where--contact">
  <div class="wrap where__grid">
    <div class="where__copy" data-reveal>
      <h2 class="sec__title">${esc(t(c.directions.title))}</h2>
      <ul class="dirs">${c.directions.items.map((d, i) => `<li>${icon(dirIcons[i] || 'pin')}<span>${esc(t(d))}</span></li>`).join('')}</ul>
    </div>
    <div class="map" data-reveal>
      <div class="map__fallback" aria-hidden="true">${icon('pin')}<span>${esc(school.address.street)}</span></div>
      <iframe class="map__frame" src="${esc(school.address.mapsEmbed)}" loading="lazy" title="Map" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>`;
  return layout(ctx, { title: t(c.meta.title), description: t(c.hero.intro), body });
}

const pages = { home, about, program, admissions, contact };
export function render(ctx) {
  return pages[ctx.page](ctx);
}
