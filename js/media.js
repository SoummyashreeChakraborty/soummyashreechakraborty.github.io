/* ============================================================
   MEDIA.JS — Dynamic Music Player + Artwork Gallery
   Reads manifest.json, builds UI, hides sections if empty
   ============================================================ */
(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls)  e.className   = cls;
    if (html) e.innerHTML   = html;
    return e;
  }
  function fmt(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }
  function titleFromFile(name) {
    return name
      .replace(/\.[^/.]+$/, '')          // remove extension
      .replace(/[-_]/g, ' ')             // dashes/underscores → spaces
      .replace(/\b\w/g, c => c.toUpperCase()); // Title Case
  }

  /* ── Fetch manifest ──────────────────────────────────────── */
  fetch('manifest.json?v=' + Date.now())
    .then(r => r.json())
    .catch(() => ({ music: [], artwork: [] }))
    .then(manifest => {
      buildMusic(manifest.music   || []);
      buildArtwork(manifest.artwork || []);
    });

  /* ══════════════════════════════════════════════════════════
     MUSIC PLAYER
  ══════════════════════════════════════════════════════════ */
  function buildMusic(tracks) {
    const section = document.getElementById('music-section');
    if (!section) return;

    if (!tracks.length) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';

    const container = qs('.music-player-wrap', section);
    if (!container) return;

    /* ── State ───────────────────────────────────────────── */
    let current    = 0;
    let isPlaying  = false;
    let isShuffle  = false;
    let isRepeat   = false;
    let barAnim    = null;
    const audio    = new Audio();
    audio.preload  = 'metadata';

    /* ── Build HTML ──────────────────────────────────────── */
    container.innerHTML = `
      <div class="mp-player">

        <!-- Album Art & Visualizer -->
        <div class="mp-art-wrap">
          <div class="mp-art" id="mpArt">
            <div class="mp-art-inner">
              <div class="mp-vinyl" id="mpVinyl">
                <div class="mp-vinyl-label">
                  <i class="fas fa-music"></i>
                </div>
              </div>
            </div>
            <!-- Visualizer bars -->
            <div class="mp-visualizer" id="mpVisualizer">
              ${Array.from({length: 20}, (_, i) =>
                `<div class="mp-bar" style="animation-delay:${i * 0.07}s"></div>`
              ).join('')}
            </div>
          </div>
        </div>

        <!-- Main Controls -->
        <div class="mp-controls-wrap">

          <!-- Track info -->
          <div class="mp-track-info">
            <div class="mp-track-title" id="mpTitle">Select a track</div>
            <div class="mp-track-sub"   id="mpSub">Music</div>
          </div>

          <!-- Progress -->
          <div class="mp-progress-wrap">
            <span class="mp-time" id="mpCurrent">0:00</span>
            <div class="mp-progress-bar" id="mpProgressBar" role="slider" aria-label="Seek">
              <div class="mp-progress-fill" id="mpFill"></div>
              <div class="mp-progress-thumb" id="mpThumb"></div>
            </div>
            <span class="mp-time" id="mpDuration">0:00</span>
          </div>

          <!-- Buttons -->
          <div class="mp-buttons">
            <button class="mp-btn mp-btn-icon" id="mpShuffle" aria-label="Shuffle" title="Shuffle">
              <i class="fas fa-shuffle"></i>
            </button>
            <button class="mp-btn mp-btn-icon" id="mpPrev" aria-label="Previous" title="Previous">
              <i class="fas fa-backward-step"></i>
            </button>
            <button class="mp-btn mp-btn-play" id="mpPlay" aria-label="Play/Pause">
              <i class="fas fa-play" id="mpPlayIcon"></i>
            </button>
            <button class="mp-btn mp-btn-icon" id="mpNext" aria-label="Next" title="Next">
              <i class="fas fa-forward-step"></i>
            </button>
            <button class="mp-btn mp-btn-icon" id="mpRepeat" aria-label="Repeat" title="Repeat">
              <i class="fas fa-repeat"></i>
            </button>
          </div>

          <!-- Volume -->
          <div class="mp-volume-wrap">
            <button class="mp-btn mp-btn-vol" id="mpMute" aria-label="Mute">
              <i class="fas fa-volume-high" id="mpVolIcon"></i>
            </button>
            <div class="mp-vol-bar" id="mpVolBar" role="slider" aria-label="Volume">
              <div class="mp-vol-fill" id="mpVolFill"></div>
              <div class="mp-vol-thumb" id="mpVolThumb"></div>
            </div>
          </div>

        </div>

        <!-- Playlist -->
        <div class="mp-playlist-wrap">
          <div class="mp-playlist-header">
            <span><i class="fas fa-list"></i> Playlist</span>
            <span class="mp-playlist-count" id="mpCount">${tracks.length} track${tracks.length !== 1 ? 's' : ''}</span>
          </div>
          <ul class="mp-playlist" id="mpPlaylist" role="listbox" aria-label="Track list">
            ${tracks.map((t, i) => `
              <li class="mp-track-item${i === 0 ? ' active' : ''}"
                  data-index="${i}"
                  role="option"
                  aria-selected="${i === 0}"
                  tabindex="0">
                <span class="mp-track-num">${String(i + 1).padStart(2, '0')}</span>
                <span class="mp-track-name">${titleFromFile(t)}</span>
                <span class="mp-track-dur" data-src="music/${t}">—</span>
              </li>
            `).join('')}
          </ul>
        </div>

      </div>
    `;

    /* ── Grab elements ────────────────────────────────────── */
    const mpTitle     = qs('#mpTitle');
    const mpSub       = qs('#mpSub');
    const mpCurrent   = qs('#mpCurrent');
    const mpDuration  = qs('#mpDuration');
    const mpFill      = qs('#mpFill');
    const mpThumb     = qs('#mpThumb');
    const mpPlayIcon  = qs('#mpPlayIcon');
    const mpVinyl     = qs('#mpVinyl');
    const mpVisualizer= qs('#mpVisualizer');
    const mpPlaylist  = qs('#mpPlaylist');
    const mpVolFill   = qs('#mpVolFill');
    const mpVolThumb  = qs('#mpVolThumb');
    const mpVolIcon   = qs('#mpVolIcon');
    const mpShuffleBtn= qs('#mpShuffle');
    const mpRepeatBtn = qs('#mpRepeat');
    const mpMuteBtn   = qs('#mpMute');

    let volume = 0.8;
    audio.volume = volume;
    setVolUI(volume);

    /* ── Load track ──────────────────────────────────────── */
    function loadTrack(idx, autoplay) {
      current = ((idx % tracks.length) + tracks.length) % tracks.length;
      const name = tracks[current];
      audio.src  = 'music/' + name;
      mpTitle.textContent = titleFromFile(name);
      mpSub.textContent   = 'Track ' + (current + 1) + ' of ' + tracks.length;
      mpFill.style.width  = '0%';
      mpThumb.style.left  = '0%';
      mpCurrent.textContent = '0:00';
      mpDuration.textContent = '0:00';

      // Highlight playlist
      mpPlaylist.querySelectorAll('.mp-track-item').forEach((li, i) => {
        li.classList.toggle('active', i === current);
        li.setAttribute('aria-selected', i === current);
      });

      // Vinyl reset
      mpVinyl.style.animation = 'none';
      void mpVinyl.offsetWidth;

      if (autoplay) {
        audio.play().then(() => setPlaying(true)).catch(() => {});
      } else {
        setPlaying(false);
      }
    }

    function setPlaying(state) {
      isPlaying = state;
      mpPlayIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
      mpVinyl.classList.toggle('spinning', isPlaying);
      mpVisualizer.classList.toggle('active', isPlaying);
      container.querySelector('.mp-player').classList.toggle('playing', isPlaying);
    }

    /* ── Controls ────────────────────────────────────────── */
    qs('#mpPlay').addEventListener('click', () => {
      if (!audio.src || audio.src === window.location.href) {
        loadTrack(0, true); return;
      }
      if (isPlaying) { audio.pause(); setPlaying(false); }
      else { audio.play().then(() => setPlaying(true)).catch(() => {}); }
    });

    qs('#mpPrev').addEventListener('click', () => loadTrack(current - 1, isPlaying));
    qs('#mpNext').addEventListener('click', () => {
      if (isShuffle) loadTrack(Math.floor(Math.random() * tracks.length), isPlaying);
      else loadTrack(current + 1, isPlaying);
    });

    mpShuffleBtn.addEventListener('click', () => {
      isShuffle = !isShuffle;
      mpShuffleBtn.classList.toggle('active', isShuffle);
    });

    mpRepeatBtn.addEventListener('click', () => {
      isRepeat = !isRepeat;
      mpRepeatBtn.classList.toggle('active', isRepeat);
      audio.loop = isRepeat;
    });

    mpMuteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      mpVolIcon.className = audio.muted ? 'fas fa-volume-xmark' : 'fas fa-volume-high';
    });

    audio.addEventListener('ended', () => {
      if (!isRepeat) {
        if (isShuffle) loadTrack(Math.floor(Math.random() * tracks.length), true);
        else if (current < tracks.length - 1) loadTrack(current + 1, true);
        else setPlaying(false);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      mpFill.style.width = pct + '%';
      mpThumb.style.left = pct + '%';
      mpCurrent.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      mpDuration.textContent = fmt(audio.duration);
    });

    /* ── Progress seek ───────────────────────────────────── */
    function seek(e) {
      const bar  = qs('#mpProgressBar');
      const rect = bar.getBoundingClientRect();
      const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (audio.duration) {
        audio.currentTime = pct * audio.duration;
        mpFill.style.width = (pct * 100) + '%';
        mpThumb.style.left = (pct * 100) + '%';
      }
    }

    const progressBar = qs('#mpProgressBar');
    let seeking = false;
    progressBar.addEventListener('mousedown', e => { seeking = true; seek(e); });
    document.addEventListener('mousemove',    e => { if (seeking) seek(e); });
    document.addEventListener('mouseup',      ()  => { seeking = false; });
    progressBar.addEventListener('touchstart', e => { seeking = true; seek(e.touches[0]); }, { passive: true });
    document.addEventListener('touchmove',     e => { if (seeking) seek(e.touches[0]); }, { passive: true });
    document.addEventListener('touchend',      ()  => { seeking = false; });

    /* ── Volume ──────────────────────────────────────────── */
    function setVolUI(v) {
      mpVolFill.style.width  = (v * 100) + '%';
      mpVolThumb.style.left  = (v * 100) + '%';
    }

    function seekVol(e) {
      const bar  = qs('#mpVolBar');
      const rect = bar.getBoundingClientRect();
      volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.volume = volume;
      setVolUI(volume);
      mpVolIcon.className = volume === 0 ? 'fas fa-volume-xmark'
                          : volume < 0.5 ? 'fas fa-volume-low'
                          :                'fas fa-volume-high';
    }

    const volBar = qs('#mpVolBar');
    let volDrag = false;
    volBar.addEventListener('mousedown',  e => { volDrag = true; seekVol(e); });
    document.addEventListener('mousemove', e => { if (volDrag) seekVol(e); });
    document.addEventListener('mouseup',  ()  => { volDrag = false; });

    /* ── Playlist click ──────────────────────────────────── */
    mpPlaylist.addEventListener('click', e => {
      const li = e.target.closest('.mp-track-item');
      if (li) loadTrack(parseInt(li.dataset.index, 10), true);
    });
    mpPlaylist.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const li = e.target.closest('.mp-track-item');
        if (li) { e.preventDefault(); loadTrack(parseInt(li.dataset.index, 10), true); }
      }
    });

    /* ── Pre-load durations ──────────────────────────────── */
    qs('#mpPlaylist').querySelectorAll('.mp-track-dur').forEach(span => {
      const probe = new Audio();
      probe.preload = 'metadata';
      probe.src = span.dataset.src;
      probe.addEventListener('loadedmetadata', () => {
        span.textContent = fmt(probe.duration);
      });
    });

    /* ── Load first track (no autoplay) ─────────────────── */
    loadTrack(0, false);
  }

  /* ══════════════════════════════════════════════════════════
     ARTWORK GALLERY
  ══════════════════════════════════════════════════════════ */
  function buildArtwork(files) {
    const section = document.getElementById('artwork-section');
    if (!section) return;

    if (!files.length) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';

    const grid = qs('.artwork-dynamic-grid', section);
    if (!grid) return;

    grid.innerHTML = '';

    files.forEach((file, i) => {
      const src   = 'artwork/' + file;
      const title = titleFromFile(file);

      const a = el('a');
      a.href            = src;
      a.className       = 'gallery-item glightbox artwork-item';
      a.dataset.gallery = 'artworkGallery';
      a.dataset.title   = title;

      const thumb = el('div', 'gallery-thumb artwork-thumb');
      const img   = el('img');
      img.src     = src;
      img.alt     = title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.className = 'artwork-img';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.6s var(--ease-out,cubic-bezier(.16,1,.3,1))';

      const overlay = el('div', 'gallery-overlay');
      overlay.innerHTML = `<span>${title} &nbsp;<i class="fas fa-arrow-up-right-from-square"></i></span>`;
      overlay.setAttribute('aria-hidden', 'true');

      // Number badge
      const badge = el('div', 'artwork-badge', String(i + 1).padStart(2, '0'));
      thumb.appendChild(img);
      thumb.appendChild(badge);
      a.appendChild(thumb);
      a.appendChild(overlay);
      grid.appendChild(a);
    });

    // Re-init GLightbox to pick up new elements
    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.artwork-item', touchNavigation: true, loop: true });
    }

    // GSAP stagger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const items = grid.querySelectorAll('.artwork-item');
      gsap.from(items, {
        y: 60, opacity: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' },
      });
    }
  }

})();
