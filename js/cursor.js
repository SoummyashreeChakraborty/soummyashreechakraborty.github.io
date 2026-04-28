/* ============================================================
   CURSOR.JS — Magnetic effect only; system cursor is used.
   ============================================================ */
(function () {
  'use strict';

  if (!window.matchMedia('(pointer: fine)').matches) return;

  const lerp = (a, b, t) => a + (b - a) * t;

  document.querySelectorAll('.magnetic').forEach(el => {
    let animId = null;
    let targetX = 0, targetY = 0, currX = 0, currY = 0;

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      targetX = (e.clientX - cx) * 0.28;
      targetY = (e.clientY - cy) * 0.28;
    });

    el.addEventListener('mouseenter', () => {
      cancelAnimationFrame(animId);
      function ease() {
        currX = lerp(currX, targetX, 0.12);
        currY = lerp(currY, targetY, 0.12);
        el.style.transform = `translate(${currX}px, ${currY}px)`;
        animId = requestAnimationFrame(ease);
      }
      ease();
    });

    el.addEventListener('mouseleave', () => {
      cancelAnimationFrame(animId);
      function spring() {
        currX  = lerp(currX,  0, 0.1);
        currY  = lerp(currY,  0, 0.1);
        targetX = 0; targetY = 0;
        el.style.transform = `translate(${currX}px, ${currY}px)`;
        if (Math.abs(currX) > 0.05 || Math.abs(currY) > 0.05) {
          animId = requestAnimationFrame(spring);
        } else {
          el.style.transform = '';
        }
      }
      spring();
    });
  });
})();
