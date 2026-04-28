/* ============================================================
   MEDIA.JS — Artwork Gallery (dynamic from manifest.json)
   Music section removed; YouTube videos are in index.html.
   ============================================================ */
(function () {
  'use strict';

  fetch('manifest.json?v=' + Date.now())
    .then(r => r.json())
    .catch(() => ({ artwork: [] }))
    .then(manifest => {
      buildArtwork(manifest.artwork || []);
    });

  function titleFromFile(name) {
    return name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function buildArtwork(files) {
    const section = document.getElementById('artwork');
    if (!section || !files.length) return;

    const grid = section.querySelector('.artwork-dynamic-grid');
    if (!grid || grid.children.length > 0) return; // already hardcoded

    files.forEach((file, i) => {
      const src   = 'artwork/' + file;
      const title = 'Artwork ' + String(i + 1).padStart(2, '0');

      const a       = document.createElement('a');
      a.href          = src;
      a.className     = 'gallery-item glightbox artwork-item';
      a.dataset.gallery = 'artworkGallery';
      a.dataset.title   = title;

      const thumb = document.createElement('div');
      thumb.className = 'gallery-thumb artwork-thumb';

      const img = document.createElement('img');
      img.src      = src;
      img.alt      = title + ' by Soummyashree Chakraborty';
      img.loading  = 'lazy';
      img.decoding = 'async';
      img.className = 'artwork-img';

      const overlay = document.createElement('div');
      overlay.className   = 'gallery-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML   = `<span>${title} &nbsp;<i class="fas fa-arrow-up-right-from-square"></i></span>`;

      const badge = document.createElement('div');
      badge.className = 'artwork-badge';
      badge.textContent = String(i + 1).padStart(2, '0');

      thumb.appendChild(img);
      thumb.appendChild(badge);
      a.appendChild(thumb);
      a.appendChild(overlay);
      grid.appendChild(a);
    });

    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.artwork-item', touchNavigation: true, loop: true });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.from(grid.querySelectorAll('.artwork-item'), {
        y: 60, opacity: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' },
      });
    }
  }
})();
