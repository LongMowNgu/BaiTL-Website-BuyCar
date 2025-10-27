// auth-effects.js
// Small visual enhancements for auth pages: parallax on mouse move + slow float animation
(function () {
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  document.addEventListener('DOMContentLoaded', function () {
    const bg = document.querySelector('.page-bg');
    const logo = document.querySelector('.brand-logo');
    const card = document.querySelector('.card');

    // gentle float animation (pure CSS would also work; this keeps JS control available)
    if (bg) {
      // subtle slow scale + translate to make register background visible as well
      bg.animate(
        [
          { transform: 'translate3d(0,0,0) scale(1)' },
          { transform: 'translate3d(-2%, 1%, 0) scale(1.02)' },
          { transform: 'translate3d(0,0,0) scale(1)' }
        ],
        { duration: 14000, iterations: Infinity, easing: 'ease-in-out' }
      );
    }

    // mouse-based parallax
    let lastX = 0, lastY = 0, vx = 0, vy = 0;
    function onMove(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 18; // stronger horizontal movement
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      lastX = x; lastY = y;
      if (bg) {
        bg.style.transform = `translate3d(${x * 0.6}px, ${y * 0.6}px, 0)`;
      }
      if (logo) {
        logo.style.transform = `translate3d(${x * 0.12}px, ${y * 0.12}px, 0)`;
      }
      if (card) {
        card.style.transform = `translate3d(${x * 0.03}px, ${y * 0.03}px, 0)`;
      }
    }

    // touch support: map touchmove to mousemove handler
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', function (ev) {
      const t = ev.touches && ev.touches[0];
      if (!t) return;
      onMove({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: true });

    // subtle idle return to center when mouse leaves
    window.addEventListener('mouseleave', function () {
      if (bg) bg.style.transform = '';
      if (logo) logo.style.transform = '';
      if (card) card.style.transform = '';
    });
  });
})();
