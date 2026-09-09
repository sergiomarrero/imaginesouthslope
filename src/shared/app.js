/* Shared behaviors for both designs. Everything is driven by data attributes.
   initApp() can run more than once; each element is bound only the first time. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var once = function (el, key) { if (!el || el.dataset[key]) return false; el.dataset[key] = '1'; return true; };

  function initApp() {
    /* Mobile navigation */
    var navToggle = $('[data-nav-toggle]');
    var nav = $('[data-nav]');
    if (navToggle && nav && once(navToggle, 'boundNav')) {
      var open = function () {
        document.body.classList.add('nav-open');
        navToggle.setAttribute('aria-expanded', 'true');
        var first = nav.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      };
      var close = function () {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      };
      navToggle.addEventListener('click', function () { document.body.classList.contains('nav-open') ? close() : open(); });
      $$('[data-nav-close]').forEach(function (el) { el.addEventListener('click', close); });
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }

    /* Header shadow and floating buttons after scrolling */
    if (!window.__appScrollBound) {
      window.__appScrollBound = true;
      var onScroll = function () {
        var y = window.scrollY || 0;
        var header = $('[data-header]');
        var fab = $('[data-fab]');
        var hero = $('[data-hero]');
        if (header) header.classList.toggle('is-scrolled', y > 24);
        if (fab) fab.classList.toggle('is-visible', y > (hero ? hero.offsetHeight * 0.6 : 400));
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.__appOnScroll = onScroll;
    }
    window.__appOnScroll();

    /* Reveal on scroll */
    var revealEls = $$('[data-reveal]').filter(function (el) { return once(el, 'boundReveal'); });
    if (revealEls.length) {
      if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      } else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
          });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
        revealEls.forEach(function (el) { io.observe(el); });
      }
    }

    /* Carousels: scroll-snap tracks with prev/next buttons and dots */
    $$('[data-carousel]').forEach(function (car) {
      if (!once(car, 'boundCarousel')) return;
      var track = $('[data-carousel-track]', car);
      if (!track) return;
      var items = Array.prototype.slice.call(track.children);
      var prev = $('[data-carousel-prev]', car);
      var next = $('[data-carousel-next]', car);
      var dots = $('[data-carousel-dots]', car);
      var step = function () {
        if (!items[0]) return track.clientWidth;
        var cs = getComputedStyle(track);
        return items[0].getBoundingClientRect().width + parseFloat(cs.columnGap || cs.gap || 0);
      };
      var go = function (dir) { track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' }); };
      if (prev) prev.addEventListener('click', function () { go(-1); });
      if (next) next.addEventListener('click', function () { go(1); });
      if (dots) {
        items.forEach(function (_, i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'carousel__dot';
          b.setAttribute('aria-label', String(i + 1));
          b.addEventListener('click', function () { track.scrollTo({ left: i * step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
          dots.appendChild(b);
        });
        var update = function () {
          var i = Math.round(track.scrollLeft / Math.max(step(), 1));
          Array.prototype.forEach.call(dots.children, function (d, j) { d.classList.toggle('is-active', j === i); });
        };
        track.addEventListener('scroll', update, { passive: true });
        update();
      }
    });

    /* Lightbox for gallery images */
    var lightboxImgs = $$('[data-lightbox]').filter(function (el) { return once(el, 'boundLightbox'); });
    if (lightboxImgs.length) {
      var dlg = $('dialog.lightbox');
      if (!dlg) {
        dlg = document.createElement('dialog');
        dlg.className = 'lightbox';
        dlg.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close">&times;</button><img class="lightbox__img" alt=""><p class="lightbox__caption"></p>';
        document.body.appendChild(dlg);
        $('.lightbox__close', dlg).addEventListener('click', function () { dlg.close(); });
        dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
      }
      lightboxImgs.forEach(function (el) {
        el.addEventListener('click', function () {
          var target = el.tagName === 'IMG' ? el : el.querySelector('img');
          if (!target) return;
          $('.lightbox__img', dlg).src = target.currentSrc || target.src;
          $('.lightbox__img', dlg).alt = target.alt || '';
          $('.lightbox__caption', dlg).textContent = target.alt || '';
          if (typeof dlg.showModal === 'function') dlg.showModal();
        });
      });
    }

    /* Tour request form: Formspree when configured, otherwise a pre-filled email */
    $$('[data-form]').forEach(function (form) {
      if (!once(form, 'boundForm')) return;
      var status = $('[data-form-status]', form);
      var submit = $('[data-form-submit]', form);
      var action = form.getAttribute('data-action');
      var mailto = form.getAttribute('data-mailto');
      var setStatus = function (kind, text) {
        if (!status) return;
        status.textContent = text;
        status.classList.remove('is-success', 'is-error');
        if (kind) status.classList.add(kind === 'success' ? 'is-success' : 'is-error');
      };
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        var data = new FormData(form);
        if (data.get('_gotcha')) return;
        var entries = Array.from(data.entries()).filter(function (kv) { return kv[0].indexOf('_') !== 0; });
        if (action) {
          var original = submit ? submit.textContent : '';
          if (submit) { submit.disabled = true; submit.textContent = submit.getAttribute('data-sending') || original; }
          fetch(action, { method: 'POST', headers: { Accept: 'application/json' }, body: data })
            .then(function (res) { if (!res.ok) throw new Error('bad status'); setStatus('success', status.getAttribute('data-success')); form.reset(); })
            .catch(function () { setStatus('error', status.getAttribute('data-error')); })
            .then(function () { if (submit) { submit.disabled = false; submit.textContent = original; } });
          return;
        }
        var label = function (name) {
          var el = form.querySelector('[name="' + name + '"]');
          var lab = el && el.id ? form.querySelector('label[for="' + el.id + '"]') : null;
          return lab ? lab.textContent.replace('*', '').trim() : name;
        };
        var body = entries.map(function (kv) { return label(kv[0]) + ': ' + kv[1]; }).join('\n');
        var subject = 'Tour request: ' + (data.get('name') || '');
        window.location.href = 'mailto:' + mailto + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        setStatus('success', status.getAttribute('data-success'));
      });
    });

    /* Smooth-scroll for same-page anchors */
    if (!window.__appAnchorBound) {
      window.__appAnchorBound = true;
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a) return;
        var id = a.getAttribute('href').slice(1);
        if (!id || id.indexOf('/') === 0) return;
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    }
  }

  window.initApp = initApp;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
  else initApp();
})();
