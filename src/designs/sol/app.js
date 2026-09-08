/* Sol extras: a lazy sun that turns as you scroll. */
(function () {
  var sun = document.querySelector('[data-sun]');
  if (!sun || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      sun.style.transform = 'rotate(' + (window.scrollY / 12) + 'deg)';
      ticking = false;
    });
  }, { passive: true });
})();
