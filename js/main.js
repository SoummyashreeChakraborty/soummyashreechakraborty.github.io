/* ============================================================
   MAIN.JS — App init: loader, mobile menu, GLightbox
   ============================================================ */
(function () {
  'use strict';

  /* ── Loader ───────────────────────────────────────────────── */
  (function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Prevent scroll while loader is visible
    document.body.style.overflow = 'hidden';

    window.addEventListener('load', () => {
      // Use GSAP if available, else CSS transition
      const hide = () => {
        loader.style.transition = 'opacity 0.9s ease, visibility 0.9s ease';
        loader.style.opacity    = '0';
        loader.style.visibility = 'hidden';
        setTimeout(() => {
          loader.style.display = 'none';
          document.body.style.overflow = '';
        }, 950);
      };

      if (typeof gsap !== 'undefined') {
        gsap.to(loader, {
          opacity: 0, duration: 0.9, delay: 1.5, ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            document.body.style.overflow = '';
          },
        });
      } else {
        setTimeout(hide, 1500);
      }
    });
  })();

  /* ── Mobile Menu ──────────────────────────────────────────── */
  (function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose  = document.getElementById('menuClose');
    if (!hamburger || !mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.add('open');
      hamburger.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);

    // Close when a nav link is tapped
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on backdrop click
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) closeMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
  })();

  /* ── GLightbox ────────────────────────────────────────────── */
  (function initLightbox() {
    if (typeof GLightbox === 'undefined') return;
    GLightbox({
      touchNavigation: true,
      loop:            true,
      autoplayVideos:  false,
      openEffect:      'fade',
      closeEffect:     'fade',
      cssEfects: {
        fade: { in: 'fadeIn', out: 'fadeOut' },
      },
    });
  })();

  /* ── Smooth anchor scroll (for older browsers) ────────────── */
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const targetId = a.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  })();

  /* ── Language bar fill animation via IntersectionObserver ─── */
  (function initLangBars() {
    const cards = document.querySelectorAll('.lang-card');
    if (!cards.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    cards.forEach(c => io.observe(c));
  })();
})();
