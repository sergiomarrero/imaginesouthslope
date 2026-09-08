import { headHtml, formHtml, faqHtml, socialLinks, icon, esc } from '../../lib.mjs';

const leafMark = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4c6 0 9 6 9 13s-3 11-9 11-9-4-9-11 3-13 9-13z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16 4v24M10 15c4 2.5 8 2.5 12 0M9 22c5 2.5 9 2.5 14 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

const num = (i) => String(i + 1).padStart(2, '0');
// Color the last word of a headline: the one accent the design spends.
function accent(text) {
  const s = esc(text).trim();
  const m = /^(.*\s)(\S+?)([.!?…]*)$/.exec(s);
  return m ? `${m[1]}<em>${m[2]}</em>${m[3]}` : s;
}

function tourBtn(ctx, cls = 'btn btn--forest', label) {
  const ext = ctx.tourExternal();
  const text = label || ctx.t(ctx.ui.cta.tour);
  return `<a class="${cls}" href="${ctx.tourHref()}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(text)}${icon(ext ? 'arrow-up-right' : 'arrow-right', 'btn__icon')}</a>`;
}
const callBtn = (ctx, cls = 'btn btn--line') => `<a class="${cls}" href="${ctx.telHref()}">${icon('phone', 'btn__icon btn__icon--lead')}${esc(ctx.t(ctx.ui.cta.call))}</a>`;
const textLink = (ctx, href, label, ext = false) => `<a class="tlink" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(label)}${icon(ext ? 'arrow-up-right' : 'arrow-right')}</a>`;
const langSeg = (ctx, cls = 'seg') => `<div class="${cls}" role="group" aria-label="Language">
  <span class="seg__on" aria-current="true">${ctx.lang.toUpperCase()}</span>
  <a class="seg__off" href="${ctx.altHref()}" hreflang="${ctx.otherLang}" lang="${ctx.otherLang}" aria-label="${esc(ctx.t(ctx.ui.langSwitchAria))}">${ctx.otherLang.toUpperCase()}</a>
</div>`;

function secHead(ctx, { n, eyebrow, title, text, cls = '' }) {
  const { t } = ctx;
  return `<header class="shead ${cls}" data-reveal>
    ${eyebrow ? `<p class="eyebrow">${esc(t(eyebrow))}</p>` : ''}
    <h2 class="shead__title">${accent(t(title))}</h2>
    ${text ? `<p class="shead__text">${esc(t(text))}</p>` : ''}
  </header>`;
}

function visitBand(ctx) {
  const { t, site } = ctx;
  return `<section class="visit">
    <div class="wrap visit__in" data-reveal>
      <p class="eyebrow eyebrow--light">${esc(t(ctx.ui.footer.visit))}</p>
      <h2 class="visit__title">${accent(t(site.home.visit.title))}</h2>
      <p class="visit__text">${esc(t(site.home.visit.text))}</p>
      <div class="visit__cta">${tourBtn(ctx, 'btn btn--bone')}${callBtn(ctx, 'btn btn--line-light')}</div>
    </div>
  </section>`;
}

function layout(ctx, { title, description, body, heroDark = false }) {
  const { t, ui, school, lang } = ctx;
  const navLinks = (cls) => ctx.nav().map((n) => `<a class="${cls}${n.active ? ' is-active' : ''}" href="${n.href}"${n.active ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('');
  return `<!doctype html>
<html lang="${lang}">
<head>
${headHtml(ctx, { title, description })}
</head>
<body class="page-${ctx.page}${heroDark ? ' has-dark-hero' : ''}">
<a class="skip" href="#main">${esc(t(ui.skipLink))}</a>
<header class="hdr" data-header>
  <div class="wrap hdr__in">
    <a class="brand" href="${ctx.href('home')}">${leafMark}<span class="brand__text"><span class="brand__name">Imagine</span><span class="brand__sub">South Slope Montessori</span></span></a>
    <nav class="hdr__nav" aria-label="Primary">${navLinks('hdr__link')}</nav>
    <div class="hdr__actions">
      ${langSeg(ctx, 'seg hdr__seg')}
      ${tourBtn(ctx, 'btn btn--forest btn--sm hdr__cta')}
      <button class="burger" type="button" data-nav-toggle aria-expanded="false" aria-controls="menu"><span class="visually-hidden">${esc(t(ui.menu))}</span><span class="burger__bar"></span><span class="burger__bar"></span></button>
    </div>
  </div>
</header>
<div class="drawer" id="menu" data-nav>
  <div class="drawer__in">
    <div class="drawer__top"><span class="drawer__brand">${leafMark}Imagine</span><button class="drawer__close" type="button" data-nav-close aria-label="${esc(t(ui.close))}">${icon('close')}</button></div>
    <nav class="drawer__nav" aria-label="${esc(t(ui.menu))}">${ctx.nav().map((n, i) => `<a class="drawer__link${n.active ? ' is-active' : ''}" href="${n.href}"${n.active ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('')}</nav>
    <div class="drawer__foot">
      ${tourBtn(ctx, 'btn btn--bone btn--block')}
      <a class="drawer__contact" href="${ctx.telHref()}">${icon('phone')}${esc(ctx.phoneDisplay())}</a>
      <a class="drawer__contact" href="${ctx.mailHref()}">${icon('mail')}${esc(school.email)}</a>
      ${langSeg(ctx, 'seg seg--light')}
    </div>
  </div>
  <button class="drawer__scrim" type="button" data-nav-close aria-label="${esc(t(ui.close))}"></button>
</div>
<main id="main">
${body}
</main>
<footer class="ftr">
  <div class="wrap ftr__grid">
    <div class="ftr__brand">
      <p class="ftr__word">Imagine <em>South Slope</em> Montessori</p>
      <p class="ftr__blurb">${esc(t(ui.footer.blurb))}</p>
      <p class="ftr__since">${esc(t(ui.sinceLabel))} · ${esc(t(ui.sePablaEspanol))}</p>
    </div>
    <div>
      <h3 class="ftr__h">${esc(t(ui.footer.visit))}</h3>
      <address class="ftr__addr">${esc(school.address.venue)}<br>${esc(school.address.street)}<br>${esc(school.address.city)}, ${esc(school.address.state)} ${esc(school.address.zip)}</address>
      ${textLink(ctx, esc(school.address.mapsUrl), t(ui.cta.directions), true)}
    </div>
    <div>
      <h3 class="ftr__h">${esc(t(ui.footer.hours))}</h3>
      <p>${esc(t(school.hours))}</p>
      <p><a class="ftr__link" href="${ctx.telHref()}">${esc(ctx.phoneDisplay())}</a></p>
      <p><a class="ftr__link" href="${ctx.mailHref()}">${esc(school.email)}</a></p>
    </div>
    <div>
      <h3 class="ftr__h">${esc(t(ui.footer.follow))}</h3>
      <div class="social">${socialLinks(ctx)}</div>
      <div class="ftr__lang">${langSeg(ctx)}</div>
    </div>
  </div>
  <div class="wrap ftr__bottom">
    <p>© ${ctx.year} ${esc(school.legalName)}. ${esc(t(ui.footer.rights))}</p>
    <p>${esc(t(ui.footer.privacy))}</p>
  </div>
</footer>
<div class="fab" data-fab>
  <a class="fab__call" href="${ctx.telHref()}" aria-label="${esc(t(ui.cta.call))}">${icon('phone')}</a>
  ${tourBtn(ctx, 'btn btn--forest fab__tour')}
</div>
<script src="${ctx.asset('app.js')}" defer></script>
</body>
</html>`;
}

/* ---------- Home ---------- */
function home(ctx) {
  const { t, site, school, ui } = ctx;
  const h = site.home;
  const day = site.program.day;
  const body = `
<section class="hero" data-hero>
  <div class="hero__media" data-parallax>${ctx.img('hero.jpg', { loading: 'eager', tone: 'dark', class: 'hero__img' })}</div>
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="wrap hero__content">
    <p class="eyebrow eyebrow--light">${esc(t(h.hero.eyebrow))}</p>
    <h1 class="hero__title">${accent(t(h.hero.title))}</h1>
    <p class="hero__sub">${esc(t(h.hero.subtitle))}</p>
    <div class="hero__cta">${tourBtn(ctx, 'btn btn--bone')}<a class="tlink tlink--light" href="${ctx.href('program', 'day')}">${esc(t(ui.cta.seeDay))}${icon('arrow-right')}</a></div>
    <p class="hero__note">${esc(t(h.hero.note))}</p>
  </div>
</section>

<section class="stats">
  <ul class="wrap stats__grid" data-reveal>
    ${h.stats.map((s) => `<li class="stat"><span class="stat__value">${esc(s.value)}</span><span class="stat__label">${esc(t(s.label))}</span></li>`).join('')}
  </ul>
</section>

<section class="sec why" id="why">
  <div class="wrap why__grid">
    ${secHead(ctx, { n: 0, eyebrow: h.why.eyebrow, title: h.why.title, text: h.why.intro, cls: 'why__head' })}
    <ol class="rows">
      ${h.why.items.map((it, i) => `<li class="row" data-reveal style="--i:${i}"><span class="row__icon">${icon(it.icon)}</span><div class="row__body"><h3 class="row__title">${esc(t(it.title))}</h3><p>${esc(t(it.text))}</p></div></li>`).join('')}
    </ol>
  </div>
</section>

<section class="sec mont" id="montessori">
  <div class="wrap mont__grid">
    <div class="mont__copy" data-reveal>
      <p class="eyebrow eyebrow--light">${esc(t(h.montessori.eyebrow))}</p>
      <h2 class="shead__title">${accent(t(h.montessori.title))}</h2>
      <p class="mont__text">${esc(t(h.montessori.text))}</p>
      <ul class="dashes">${h.montessori.points.map((p) => `<li>${esc(t(p))}</li>`).join('')}</ul>
      ${textLink(ctx, ctx.href('about'), t(ui.nav.about))}
    </div>
    <div class="mont__side" data-reveal>
      <figure class="mont__photo">${ctx.img('classroom-1.jpg', { tone: 'dark' })}<figcaption>${esc(t(ctx.photo('classroom-1.jpg').alt))}</figcaption></figure>
      <blockquote class="mont__quote"><p>${esc(t(h.montessori.quote))}</p><footer>${esc(t(h.montessori.quoteBy))}</footer></blockquote>
    </div>
  </div>
</section>

<section class="sec day" id="day">
  <div class="wrap">
    ${secHead(ctx, { n: 2, eyebrow: h.dayPreview.eyebrow, title: h.dayPreview.title, text: h.dayPreview.text })}
    <ol class="strip" data-reveal>
      ${day.items.slice(0, 4).map((d) => `<li class="strip__item"><span class="strip__time">${esc(d.time)}</span><h3 class="strip__title">${esc(t(d.title))}</h3><p>${esc(t(d.text))}</p></li>`).join('')}
    </ol>
    <p data-reveal>${textLink(ctx, ctx.href('program', 'day'), t(ui.cta.seeProgram))}</p>
  </div>
</section>

<section class="sec edith">
  <div class="wrap edith__grid">
    <figure class="edith__photo" data-reveal>${ctx.img('edith.jpg')}</figure>
    <div class="edith__copy" data-reveal>
      <p class="eyebrow">${esc(t(h.edithTeaser.eyebrow))}</p>
      <h2 class="shead__title">${accent(t(h.edithTeaser.title))}</h2>
      <p class="shead__text">${esc(t(h.edithTeaser.text))}</p>
      ${textLink(ctx, `${ctx.href('about')}#edith`, t(ui.cta.meetEdith))}
    </div>
  </div>
</section>

<section class="sec voices">
  <div class="wrap">
    ${secHead(ctx, { n: 3, eyebrow: h.testimonialsTitle, title: h.testimonialsTitle, cls: 'voices__head' })}
    <div class="qcar" data-carousel data-reveal>
      <ul class="qcar__track" data-carousel-track>
        ${site.testimonials.map((q) => `<li class="qcar__item"><blockquote class="qcar__q"><p>${esc(t(q.quote))}</p><footer>${esc(t(q.by))}</footer></blockquote></li>`).join('')}
      </ul>
      <div class="qcar__bar">
        <span class="qcar__count" data-carousel-counter>1 / ${site.testimonials.length}</span>
        <span class="qcar__btns"><button class="qcar__btn" type="button" data-carousel-prev aria-label="Previous">${icon('arrow-right', 'flip')}</button><button class="qcar__btn" type="button" data-carousel-next aria-label="Next">${icon('arrow-right')}</button></span>
      </div>
    </div>
  </div>
</section>

<section class="sec gal">
  <div class="wrap">
    ${secHead(ctx, { n: 4, eyebrow: h.galleryTitle, title: h.galleryTitle, text: h.galleryText })}
    <div class="gal__grid" data-reveal>
      ${['studio.jpg', 'classroom-2.jpg', 'circle.jpg', 'playground.jpg', 'materials.jpg'].map((f, i) => `<figure class="gal__item gal__item--${i}" data-lightbox>${ctx.img(f)}<figcaption>${esc(t(ctx.photo(f).alt))}</figcaption></figure>`).join('')}
    </div>
  </div>
</section>

<section class="sec faqs">
  <div class="wrap faqs__grid">
    <div data-reveal>
      <p class="eyebrow">FAQ</p>
      <h2 class="shead__title">${accent(t(site.admissions.faqTitle))}</h2>
      ${textLink(ctx, ctx.href('admissions', 'faq'), t(ui.cta.readFaq))}
    </div>
    <div data-reveal>${faqHtml(ctx, ctx.faqForHome(), { openFirst: false })}</div>
  </div>
</section>

${visitBand(ctx)}

<section class="sec where">
  <div class="wrap where__grid">
    <div data-reveal>
      <p class="eyebrow">${esc(t(ui.footer.visit))}</p>
      <h2 class="shead__title">${accent(t(h.location.title))}</h2>
      <p class="shead__text">${esc(t(h.location.text))}</p>
      <dl class="facts">
        <div><dt>${esc(t(site.contact.labels.address))}</dt><dd>${esc(school.address.venue)}<br>${esc(school.address.street)}<br>${esc(school.address.city)}, ${esc(school.address.state)} ${esc(school.address.zip)}</dd></div>
        <div><dt>${esc(t(site.contact.labels.hours))}</dt><dd>${esc(t(school.hours))}</dd></div>
      </dl>
      ${textLink(ctx, esc(school.address.mapsUrl), t(ui.cta.directions), true)}
    </div>
    <div class="map" data-reveal>
      <div class="map__fallback" aria-hidden="true">${icon('pin')}<span>${esc(school.address.street)}</span></div>
      <iframe class="map__frame" src="${esc(school.address.mapsEmbed)}" loading="lazy" title="Map" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>`;
  return layout(ctx, { title: t(h.meta.title), description: t(school.description), body, heroDark: true });
}

/* ---------- Page hero for inner pages ---------- */
function pageHero(ctx, { eyebrow, title, intro, photo, cta = '' }) {
  const { t } = ctx;
  return `<section class="phero" data-hero>
  <div class="wrap phero__grid">
    <div class="phero__copy">
      <p class="eyebrow">${esc(t(eyebrow))}</p>
      <h1 class="phero__title">${accent(t(title))}</h1>
      <p class="phero__intro">${esc(t(intro))}</p>
      ${cta}
    </div>
    ${photo ? `<figure class="phero__photo">${ctx.img(photo, { loading: 'eager' })}</figure>` : ''}
  </div>
</section>`;
}

/* ---------- About ---------- */
function about(ctx) {
  const { t, site, ui } = ctx;
  const a = site.about;
  const body = `
${pageHero(ctx, { eyebrow: a.hero.eyebrow, title: a.hero.title, intro: a.hero.intro, photo: 'studio.jpg' })}

<section class="sec philo">
  <div class="wrap philo__grid">
    ${secHead(ctx, { n: 0, eyebrow: a.philosophy.eyebrow, title: a.philosophy.title, cls: 'philo__head' })}
    <div class="prose" data-reveal>
      ${a.philosophy.paragraphs.map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${esc(t(p))}</p>`).join('')}
    </div>
  </div>
</section>

<section class="sec values">
  <div class="wrap">
    ${secHead(ctx, { n: 1, eyebrow: a.values.title, title: a.values.title })}
    <ul class="vgrid">
      ${a.values.items.map((v, i) => `<li class="vcell" data-reveal style="--i:${i}"><span class="vcell__icon">${icon(v.icon)}</span><h3>${esc(t(v.title))}</h3><p>${esc(t(v.text))}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="sec edith edith--full" id="edith">
  <div class="wrap edith__grid">
    <figure class="edith__photo" data-reveal>${ctx.img('edith.jpg')}</figure>
    <div class="edith__copy prose" data-reveal>
      <p class="eyebrow">${esc(t(a.edith.eyebrow))}</p>
      <h2 class="shead__title">${esc(a.edith.name)}</h2>
      <p class="edith__role">${esc(t(a.edith.role))}</p>
      ${a.edith.bio.map((p) => `<p>${esc(t(p))}</p>`).join('')}
      <h3 class="h-small">${esc(t(a.team.title))}</h3>
      <p>${esc(t(a.team.text))}</p>
    </div>
  </div>
</section>

<section class="sec space">
  <div class="wrap space__grid">
    <div class="space__photos" data-reveal>
      <figure class="space__ph space__ph--a" data-lightbox>${ctx.img('classroom-1.jpg')}</figure>
      <figure class="space__ph space__ph--b" data-lightbox>${ctx.img('playground.jpg')}</figure>
    </div>
    <div data-reveal>
      <p class="eyebrow">${esc(t(a.space.eyebrow))}</p>
      <h2 class="shead__title">${accent(t(a.space.title))}</h2>
      <p class="shead__text">${esc(t(a.space.text))}</p>
    </div>
  </div>
</section>

<section class="sec story">
  <div class="wrap">
    ${secHead(ctx, { n: 4, eyebrow: a.story.title, title: a.story.title })}
    <ol class="story">
      ${a.story.milestones.map((m) => `<li class="story__item" data-reveal><span class="story__year">${esc(m.year)}</span><p>${esc(t(m.text))}</p></li>`).join('')}
    </ol>
  </div>
</section>

${visitBand(ctx)}`;
  return layout(ctx, { title: t(a.meta.title), description: t(a.hero.intro), body });
}

/* ---------- Program ---------- */
function program(ctx) {
  const { t, site, ui } = ctx;
  const p = site.program;
  const body = `
${pageHero(ctx, { eyebrow: p.hero.eyebrow, title: p.hero.title, intro: p.hero.intro, photo: 'materials.jpg', cta: `<div class="hero__cta">${tourBtn(ctx)}<a class="tlink" href="#day">${esc(t(ui.cta.seeDay))}${icon('arrow-right')}</a></div>` })}

<section class="sec">
  <div class="wrap">
    ${secHead(ctx, { n: 0, eyebrow: p.immersion.eyebrow, title: p.immersion.title })}
    <ol class="cols">
      ${p.immersion.steps.map((s, i) => `<li class="col" data-reveal style="--i:${i}"><span class="col__n">${num(i)}</span><h3>${esc(t(s.title))}</h3><p>${esc(t(s.text))}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="sec areas">
  <div class="wrap">
    ${secHead(ctx, { n: 1, eyebrow: p.areas.eyebrow, title: p.areas.title })}
    <ul class="vgrid vgrid--3">
      ${p.areas.items.map((a, i) => `<li class="vcell" data-reveal style="--i:${i}"><span class="vcell__icon">${icon(a.icon)}</span><h3>${esc(t(a.title))}</h3><p>${esc(t(a.text))}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="sec tl-sec" id="day">
  <div class="wrap tl-sec__grid">
    <div class="tl-sec__side" data-reveal>
      <p class="eyebrow">${esc(t(p.day.eyebrow))}</p>
      <h2 class="shead__title">${accent(t(p.day.title))}</h2>
      <p class="shead__text">${esc(t(p.day.note))}</p>
      <figure class="tl-sec__photo" data-lightbox>${ctx.img('circle.jpg')}</figure>
    </div>
    <ol class="tl">
      ${p.day.items.map((d) => `<li class="tl__item" data-reveal><span class="tl__time">${esc(d.time)}</span><div class="tl__body"><h3>${esc(t(d.title))}</h3><p>${esc(t(d.text))}</p></div></li>`).join('')}
    </ol>
  </div>
</section>

<section class="sec sched">
  <div class="wrap">
    ${secHead(ctx, { n: 3, eyebrow: p.schedules.eyebrow, title: p.schedules.title, text: p.schedules.text })}
    <ul class="plans">
      ${p.schedules.options.map((o, i) => `<li class="plan" data-reveal style="--i:${i}"><span class="plan__days">${esc(o.days)}</span><span class="plan__label">${esc(t(o.label))}</span><p class="plan__note">${esc(t(o.note))}</p></li>`).join('')}
    </ul>
    <div class="tuition" data-reveal>
      <div class="tuition__main">
        <h3 class="h-mid">${esc(t(p.tuition.title))}</h3>
        <p>${esc(t(p.tuition.text))}</p>
        <p class="tuition__fee">${esc(t(p.tuition.fee))}</p>
        ${tourBtn(ctx)}
      </div>
      <div class="tuition__bring">
        <h3 class="h-mid">${esc(t(p.bring.title))}</h3>
        <ul class="dashes">${p.bring.items.map((b) => `<li>${esc(t(b))}</li>`).join('')}</ul>
      </div>
    </div>
  </div>
</section>

${visitBand(ctx)}`;
  return layout(ctx, { title: t(p.meta.title), description: t(p.hero.intro), body });
}

/* ---------- Admissions ---------- */
function admissions(ctx) {
  const { t, site, ui } = ctx;
  const ad = site.admissions;
  const body = `
${pageHero(ctx, { eyebrow: ad.hero.eyebrow, title: ad.hero.title, intro: ad.hero.intro, photo: 'classroom-2.jpg', cta: `<div class="hero__cta">${tourBtn(ctx)}${callBtn(ctx)}</div>` })}

<section class="sec">
  <div class="wrap">
    ${secHead(ctx, { n: 0, eyebrow: ad.steps.title, title: ad.steps.title })}
    <ol class="cols cols--steps">
      ${ad.steps.items.map((s, i) => `<li class="col" data-reveal style="--i:${i}"><span class="col__n col__n--big">${num(i)}</span><h3>${esc(t(s.title))}</h3><p>${esc(t(s.text))}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="sec req">
  <div class="wrap req__grid">
    <div data-reveal>
      <p class="eyebrow">${esc(t(ad.requirements.title))}</p>
      <h2 class="shead__title">${accent(t(ad.requirements.title))}</h2>
      <ul class="checks">${ad.requirements.items.map((r) => `<li>${icon('check')}<span>${esc(t(r))}</span></li>`).join('')}</ul>
    </div>
    <aside class="open" data-reveal>
      <p class="eyebrow eyebrow--light">${esc(t(ad.openHouse.title))}</p>
      <h2 class="open__title">${accent(t(ad.openHouse.title))}</h2>
      <p>${esc(t(ad.openHouse.text))}</p>
      ${tourBtn(ctx, 'btn btn--bone')}
    </aside>
  </div>
</section>

<section class="sec" id="faq">
  <div class="wrap faqs__grid">
    ${secHead(ctx, { n: 2, eyebrow: 'FAQ', title: ad.faqTitle })}
    <div data-reveal>${faqHtml(ctx, site.faq, { openFirst: false })}</div>
  </div>
</section>

${visitBand(ctx)}`;
  return layout(ctx, { title: t(ad.meta.title), description: t(ad.hero.intro), body });
}

/* ---------- Contact ---------- */
function contact(ctx) {
  const { t, site, school, ui } = ctx;
  const c = site.contact;
  const dirIcons = ['train', 'bus', 'door', 'stroller'];
  const body = `
${pageHero(ctx, { eyebrow: c.hero.eyebrow, title: c.hero.title, intro: c.hero.intro })}

<section class="sec contact">
  <div class="wrap contact__grid">
    <dl class="cards" data-reveal>
      <div class="card"><dt>${icon('phone')}${esc(t(c.labels.phone))}</dt><dd><a href="${ctx.telHref()}">${esc(ctx.phoneDisplay())}</a>${school.phoneAlt ? `<br><small>${esc(t(c.labels.phoneAlt))}: <a href="${ctx.telHref(school.phoneAlt)}">${esc(ctx.phoneDisplay(school.phoneAlt))}</a></small>` : ''}</dd></div>
      <div class="card"><dt>${icon('mail')}${esc(t(c.labels.email))}</dt><dd><a class="brk" href="${ctx.mailHref()}">${esc(school.email)}</a></dd></div>
      <div class="card"><dt>${icon('clock')}${esc(t(c.labels.hours))}</dt><dd>${esc(t(school.hours))}</dd></div>
      <div class="card"><dt>${icon('pin')}${esc(t(c.labels.address))}</dt><dd>${esc(school.address.venue)}<br>${esc(school.address.street)}<br>${esc(school.address.city)}, ${esc(school.address.state)} ${esc(school.address.zip)}<br>${textLink(ctx, esc(school.address.mapsUrl), t(ui.cta.directions), true)}</dd></div>
    </dl>
    <div class="contact__form" data-reveal>
      <p class="eyebrow">${esc(t(ui.form.title))}</p>
      <h2 class="shead__title">${accent(t(ui.form.title))}</h2>
      <p class="shead__text">${esc(t(ui.form.intro))}</p>
      ${formHtml(ctx)}
    </div>
  </div>
</section>

<section class="sec where">
  <div class="wrap where__grid">
    <div data-reveal>
      <p class="eyebrow">${esc(t(c.directions.title))}</p>
      <h2 class="shead__title">${accent(t(c.directions.title))}</h2>
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
