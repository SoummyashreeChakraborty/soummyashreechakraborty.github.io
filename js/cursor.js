/* ============================================================
   CURSOR.JS — Custom magnetic cursor with lerp follower
   Desktop only — gracefully skipped on touch devices
   ============================================================ */
(function () {
  'use strict';

  // Skip on touch devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0;      // mouse position
  let fx = 0, fy = 0;      // follower position (lerped)
  let visible = false;

  /* ── Lerp helper ─────────────────────────────────────────── */
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── Mouse tracking ──────────────────────────────────────── */
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    if (!visible) {
      // Snap follower on first move to avoid flying from 0,0
      fx = mx; fy = my;
      cursor.style.opacity   = '1';
      follower.style.opacity = '1';
      visible = true;
    }

    cursor.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
    visible = false;
  });

  /* ── Follower RAF loop ───────────────────────────────────── */
  function animateFollower() {
    fx = lerp(fx, mx, 0.075);
    fy = lerp(fy, my, 0.075);
    follower.style.transform = `translate(calc(${fx}px - 50%), calc(${fy}px - 50%))`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  /* ── Hover state for interactive elements ────────────────── */
  const hoverSelectors = [
    'a', 'button', '.btn', '.exp-card', '.gallery-item',
    '.contact-card', '.skill-pill', '.interest-item',
    '.nav-link', '.mobile-nav-link', '.logo'
  ].join(', ');

  function attachHover(root) {
    root.querySelectorAll(hoverSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        follower.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        follower.classList.remove('cursor-hover');
        // Reset magnetic on leave (handled below but safety net)
        el.style.transform = '';
      });
    });
  }
  attachHover(document);

  /* ── Magnetic effect on .magnetic elements ───────────────── */
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
