/* ============================================================
   ANIMATIONS.JS — GSAP + ScrollTrigger + SplitType
   ============================================================ */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded — animations skipped.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── Wait for loader to finish, then run hero anim ────────── */
  const LOADER_DELAY = 2.2; // seconds after page load

  /* ── HERO: SplitType character reveal ────────────────────── */
  function initHeroText() {
    const titleEl = document.querySelector('.hero-title');
    if (!titleEl) return;

    if (typeof SplitType !== 'undefined') {
      const split = new SplitType(titleEl, { types: 'chars,words' });
      gsap.set(split.chars, { y: 110, opacity: 0, rotateX: -40 });
      gsap.to(split.chars, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.15,
        stagger: { each: 0.028, from: 'start' },
        ease: 'power4.out',
        delay: LOADER_DELAY,
      });
    } else {
      // Fallback: simple fade up
      gsap.from(titleEl, { y: 60, opacity: 0, duration: 1.4, delay: LOADER_DELAY, ease: 'power4.out' });
    }
  }

  /* ── HERO: other elements ─────────────────────────────────── */
  function initHeroElements() {
    const d = LOADER_DELAY;
    const els = [
      { sel: '.hero-content .eyebrow',         delay: d + 0.0 },
      { sel: '.hero-content .tagline',          delay: d + 1.3 },
      { sel: '.hero-content .hero-desc',        delay: d + 1.55 },
      { sel: '.hero-content .hero-buttons',     delay: d + 1.8 },
      { sel: '.hero-content .hero-scroll-hint', delay: d + 2.1 },
    ];

    els.forEach(({ sel, delay }) => {
      const el = document.querySelector(sel);
      if (el) gsap.from(el, { y: 36, opacity: 0, duration: 1, delay, ease: 'power3.out' });
    });

    // Portrait slides in from right
    const portrait = document.querySelector('.hero-portrait-wrap');
    if (portrait) {
      gsap.from(portrait, {
        x: 80, opacity: 0, duration: 1.6, delay: d + 0.2,
        ease: 'power4.out',
      });
    }
  }

  /* ── PORTRAIT: parallax on scroll ────────────────────────── */
  function initPortraxParallax() {
    const frame = document.querySelector('.portrait-frame');
    if (!frame) return;

    gsap.to(frame, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  /* ── SCROLL: fade-up single elements ─────────────────────── */
  function initFadeUps() {
    gsap.utils.toArray('[data-anim="fade-up"]').forEach(el => {
      gsap.from(el, {
        y: 55, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });
  }

  /* ── SCROLL: stagger grid children ───────────────────────── */
  function initStaggerGrids() {
    const grids = [
      { parent: '.experience-grid', child: '.exp-card' },
      { parent: '.skill-categories',  child: '.skill-category' },
      { parent: '.gallery-grid',    child: '.gallery-item' },
      { parent: '.interests-grid',  child: '.interest-item' },
      { parent: '.stats-grid',      child: '.stat-card' },
      { parent: '.contact-grid',    child: '.contact-card' },
      { parent: '.education-timeline', child: '.edu-item' },
    ];

    grids.forEach(({ parent, child }) => {
      const container = document.querySelector(parent);
      if (!container) return;
      const children = container.querySelectorAll(child);
      if (!children.length) return;

      gsap.from(children, {
        y: 65, opacity: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  /* ── SCROLL: section headings ─────────────────────────────── */
  function initSectionHeadings() {
    document.querySelectorAll('.section h2, .section .eyebrow, .section .section-desc').forEach(el => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      });
    });
  }

  /* ── SCROLL: about text ───────────────────────────────────── */
  function initAboutText() {
    document.querySelectorAll('.about-text').forEach((el, i) => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 1, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-grid', start: 'top 85%', toggleActions: 'play none none none' },
      });
    });
  }

  /* ── COUNTER: animate stat numbers ───────────────────────── */
  function initCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix !== undefined ? el.dataset.suffix : (target > 5 ? '+' : '');
      const obj    = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(obj, {
            val: target, duration: 2.2, ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(obj.val) + suffix;
            },
          });
        },
      });
    });
  }

  /* ── NAV: active section highlight ───────────────────────── */
  function initNavActive() {
    const navLinks = document.querySelectorAll('.nav-link');

    document.querySelectorAll('section[id]').forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: self => {
          if (self.isActive) {
            navLinks.forEach(a => a.classList.remove('active'));
            const a = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (a) a.classList.add('active');
          }
        },
      });
    });
  }

  /* ── SCROLL PROGRESS bar ──────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      bar.style.transform = `scaleX(${Math.min(progress, 1)})`;
    }, { passive: true });
  }

  /* ── NAV: shrink on scroll ────────────────────────────────── */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── Boot ─────────────────────────────────────────────────── */
  initHeroText();
  initHeroElements();
  initPortraxParallax();
  initFadeUps();
  initStaggerGrids();
  initSectionHeadings();
  initAboutText();
  initCounters();
  initNavActive();
  initScrollProgress();
  initNavScroll();
})();
