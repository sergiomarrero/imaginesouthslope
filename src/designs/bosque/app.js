/* Bosque extras: quote counter for the testimonial carousel, and a soft hero parallax. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var track = car.querySelector('[data-carousel-track]');
    var counter = car.querySelector('[data-carousel-counter]');
    if (!track || !counter) return;
    var items = track.children;
    var update = function () {
      var w = items[0] ? items[0].getBoundingClientRect().width : 1;
      var i = Math.round(track.scrollLeft / Math.max(w, 1)) + 1;
      counter.textContent = Math.min(i, items.length) + ' / ' + items.length;
    };
    track.addEventListener('scroll', update, { passive: true });
    update();
  });
  var heroImg = document.querySelector('[data-parallax]');
  if (heroImg && !reduce) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        heroImg.style.transform = 'translateY(' + Math.min(window.scrollY * 0.18, 120) + 'px) scale(1.06)';
        tick = false;
      });
    }, { passive: true });
  }
})();
