/* ============================================================
   PARTICLES.JS — Cosmos / Deep-Space Ambient System
   Full-page, mouse-sensitive, professional starfield
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;

  /* ── Mouse state — tracks cursor relative to full document ── */
  const mouse = { x: 0.5, y: 0.5 }; // normalised 0-1
  const lerpedMouse = { x: 0.5, y: 0.5 };

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = (e.clientY + window.scrollY) / document.documentElement.scrollHeight;
  }, { passive: true });

  /* ── Resize ──────────────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize, { passive: true });

  /* ════════════════════════════════════════════════════════════
     LAYER 1 — Background stars (static, very small, high count)
  ════════════════════════════════════════════════════════════ */
  const BG_STAR_COUNT = 180;
  const bgStars = [];

  class BgStar {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random();
      this.y  = Math.random();
      this.r  = Math.random() * 0.8 + 0.2;
      this.a  = Math.random() * 0.55 + 0.1;
      this.twinkleSpeed = Math.random() * 0.015 + 0.004;
      this.twinklePhase = Math.random() * Math.PI * 2;
      // Parallax depth 0 (far) – 1 (close)
      this.depth = Math.random() * 0.25; // bg stars are far
    }
    draw(t, mx, my) {
      const parallaxX = (mx - 0.5) * this.depth * 60;
      const parallaxY = (my - 0.5) * this.depth * 60;
      const px = this.x * W + parallaxX;
      const py = this.y * H + parallaxY;
      const alpha = this.a * (0.6 + 0.4 * Math.sin(t * this.twinkleSpeed + this.twinklePhase));
      ctx.beginPath();
      ctx.arc(px, py, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
  }

  /* ════════════════════════════════════════════════════════════
     LAYER 2 — Mid-field stars (medium, subtle colour tint)
  ════════════════════════════════════════════════════════════ */
  const MID_STAR_COUNT = 60;
  const midStars = [];

  // Colour palette: white, warm gold, cold blue-white
  const STAR_COLORS = [
    [255, 255, 255],
    [216, 185, 143],
    [200, 220, 255],
    [255, 240, 200],
  ];

  class MidStar {
    constructor() { this.init(); }
    init() {
      this.x    = Math.random();
      this.y    = Math.random();
      this.r    = Math.random() * 1.4 + 0.5;
      this.a    = Math.random() * 0.5 + 0.12;
      this.twinkleSpeed = Math.random() * 0.012 + 0.003;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.depth = Math.random() * 0.4 + 0.15;
      this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    }
    draw(t, mx, my) {
      const parallaxX = (mx - 0.5) * this.depth * 120;
      const parallaxY = (my - 0.5) * this.depth * 120;
      const px = this.x * W + parallaxX;
      const py = this.y * H + parallaxY;
      const alpha = this.a * (0.55 + 0.45 * Math.sin(t * this.twinkleSpeed + this.twinklePhase));
      const [r, g, b] = this.color;
      // Soft glow
      const grd = ctx.createRadialGradient(px, py, 0, px, py, this.r * 3.5);
      grd.addColorStop(0,   `rgba(${r},${g},${b},${alpha})`);
      grd.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.4})`);
      grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(px, py, this.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }
  }

  /* ════════════════════════════════════════════════════════════
     LAYER 3 — Foreground drifting particles (gold nebula dust)
  ════════════════════════════════════════════════════════════ */
  const DUST_COUNT = 45;
  const dust = [];

  class Dust {
    constructor() { this.init(); }
    init() {
      this.x      = Math.random();
      this.y      = Math.random();
      this.vx     = (Math.random() - 0.5) * 0.00015;
      this.vy     = (Math.random() - 0.5) * 0.00015;
      this.r      = Math.random() * 1.8 + 0.6;
      this.a      = Math.random() * 0.25 + 0.04;
      this.depth  = Math.random() * 0.6 + 0.3;
      this.hue    = Math.random() * 22 + 30; // gold 30-52 deg
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -0.05) this.x = 1.05;
      else if (this.x > 1.05) this.x = -0.05;
      if (this.y < -0.05) this.y = 1.05;
      else if (this.y > 1.05) this.y = -0.05;
    }
    draw(mx, my) {
      const parallaxX = (mx - 0.5) * this.depth * 180;
      const parallaxY = (my - 0.5) * this.depth * 180;
      const px = this.x * W + parallaxX;
      const py = this.y * H + parallaxY;
      const grd = ctx.createRadialGradient(px, py, 0, px, py, this.r * 4);
      grd.addColorStop(0,   `hsla(${this.hue}, 55%, 68%, ${this.a})`);
      grd.addColorStop(0.5, `hsla(${this.hue}, 55%, 68%, ${this.a * 0.3})`);
      grd.addColorStop(1,   `hsla(${this.hue}, 55%, 68%, 0)`);
      ctx.beginPath();
      ctx.arc(px, py, this.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }
  }

  /* ════════════════════════════════════════════════════════════
     LAYER 4 — Mouse-reactive foreground particles
               (react strongly to cursor proximity)
  ════════════════════════════════════════════════════════════ */
  const REACTIVE_COUNT = 28;
  const reactive = [];
  const REPEL_RADIUS = 0.14; // normalised

  class Reactive {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random();
      this.y  = Math.random();
      this.vx = (Math.random() - 0.5) * 0.0002;
      this.vy = (Math.random() - 0.5) * 0.0002;
      this.r  = Math.random() * 2 + 1;
      this.a  = Math.random() * 0.45 + 0.1;
      this.hue = Math.random() * 30 + 25;
    }
    update(mx, my) {
      // Mouse repulsion in normalised space
      const dx = this.x - mx;
      const dy = this.y - my * (H / document.documentElement.scrollHeight);
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_RADIUS && dist > 0) {
        const strength = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        this.vx += (dx / dist) * strength * 0.0014;
        this.vy += (dy / dist) * strength * 0.0014;
      }
      // Damping
      this.vx *= 0.97;
      this.vy *= 0.97;
      this.x += this.vx;
      this.y += this.vy;
      // Wrap
      if (this.x < -0.05) this.x = 1.05;
      else if (this.x > 1.05) this.x = -0.05;
      if (this.y < -0.05) this.y = 1.05;
      else if (this.y > 1.05) this.y = -0.05;
    }
    draw() {
      const px = this.x * W;
      const py = this.y * H;
      const grd = ctx.createRadialGradient(px, py, 0, px, py, this.r * 5);
      grd.addColorStop(0,   `hsla(${this.hue}, 60%, 72%, ${this.a})`);
      grd.addColorStop(0.4, `hsla(${this.hue}, 60%, 72%, ${this.a * 0.25})`);
      grd.addColorStop(1,   `hsla(${this.hue}, 60%, 72%, 0)`);
      ctx.beginPath();
      ctx.arc(px, py, this.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }
  }

  /* ════════════════════════════════════════════════════════════
     LAYER 5 — Occasional shooting stars
  ════════════════════════════════════════════════════════════ */
  const shooters = [];

  class Shooter {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * 1.2 - 0.1;
      this.y     = Math.random() * 0.5;
      this.len   = Math.random() * 0.12 + 0.04;
      this.speed = Math.random() * 0.006 + 0.004;
      this.angle = Math.PI / 5 + (Math.random() - 0.5) * 0.3;
      this.a     = 0;
      this.alive = true;
      this.life  = 0;
      this.maxLife = Math.random() * 60 + 40;
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.life++;
      this.a = this.life < 10 ? this.life / 10
             : this.life > this.maxLife - 10 ? (this.maxLife - this.life) / 10
             : 1;
      if (this.life >= this.maxLife || this.x > 1.2 || this.y > 1.1) {
        this.alive = false;
      }
    }
    draw() {
      const x1 = this.x * W;
      const y1 = this.y * H;
      const x0 = x1 - Math.cos(this.angle) * this.len * W;
      const y0 = y1 - Math.sin(this.angle) * this.len * W;
      const grd = ctx.createLinearGradient(x0, y0, x1, y1);
      grd.addColorStop(0,   `rgba(255,255,255,0)`);
      grd.addColorStop(0.7, `rgba(216,185,143,${this.a * 0.5})`);
      grd.addColorStop(1,   `rgba(255,255,255,${this.a * 0.9})`);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  let shooterTimer = 0;
  const SHOOTER_INTERVAL = 280; // frames between shooters

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    resize();
    for (let i = 0; i < BG_STAR_COUNT;    i++) bgStars.push(new BgStar());
    for (let i = 0; i < MID_STAR_COUNT;   i++) midStars.push(new MidStar());
    for (let i = 0; i < DUST_COUNT;       i++) dust.push(new Dust());
    for (let i = 0; i < REACTIVE_COUNT;   i++) reactive.push(new Reactive());
  }

  /* ── Render loop ─────────────────────────────────────────── */
  let t = 0;
  const LERP_SPEED = 0.035;

  function lerp(a, b, f) { return a + (b - a) * f; }

  function animate() {
    t++;
    ctx.clearRect(0, 0, W, H);

    // Smooth mouse follow
    lerpedMouse.x = lerp(lerpedMouse.x, mouse.x, LERP_SPEED);
    lerpedMouse.y = lerp(lerpedMouse.y, mouse.y, LERP_SPEED);

    const mx = lerpedMouse.x;
    const my = lerpedMouse.y;

    // Layer 1 — background stars
    bgStars.forEach(s => s.draw(t, mx, my));

    // Layer 2 — mid stars with glow
    midStars.forEach(s => s.draw(t, mx, my));

    // Layer 3 — nebula dust
    dust.forEach(d => { d.update(); d.draw(mx, my); });

    // Layer 4 — reactive particles
    reactive.forEach(r => { r.update(mx, my); r.draw(); });

    // Layer 5 — shooting stars
    shooterTimer++;
    if (shooterTimer >= SHOOTER_INTERVAL + Math.random() * 200) {
      shooters.push(new Shooter());
      shooterTimer = 0;
    }
    for (let i = shooters.length - 1; i >= 0; i--) {
      shooters[i].update();
      if (!shooters[i].alive) { shooters.splice(i, 1); continue; }
      shooters[i].draw();
    }

    requestAnimationFrame(animate);
  }

  init();
  animate();
})();
