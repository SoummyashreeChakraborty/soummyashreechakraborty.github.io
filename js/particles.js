/* ============================================================
   PARTICLES.JS — Pure canvas ambient particle system
   No external dependencies — fully static compatible
   ============================================================ */
(function () {
  'use strict';

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const PARTICLE_COUNT = 70;
  const LINK_DISTANCE  = 130;
  const MOUSE_REPEL    = 110;

  const mouse = { x: -9999, y: -9999 };

  /* ── Resize ──────────────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── Particle class ──────────────────────────────────────── */
  class Particle {
    constructor() { this.init(); }

    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() - 0.5) * 0.28;
      this.r  = Math.random() * 1.6 + 0.3;
      this.a  = Math.random() * 0.35 + 0.06;
      // Gold-warm hue range 28–52
      this.hue = Math.random() * 24 + 28;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion
      const dx   = this.x - mouse.x;
      const dy   = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < MOUSE_REPEL && dist > 0) {
        const force = (MOUSE_REPEL - dist) / MOUSE_REPEL;
        this.x += (dx / dist) * force * 1.8;
        this.y += (dy / dist) * force * 1.8;
      }

      // Soft wrap
      if (this.x < -10) this.x = W + 10;
      else if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      else if (this.y > H + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 52%, 70%, ${this.a})`;
      ctx.fill();
    }
  }

  /* ── Draw connection lines ───────────────────────────────── */
  function drawLinks() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DISTANCE) {
          const alpha = 0.06 * (1 - dist / LINK_DISTANCE);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(216, 185, 143, ${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Animation loop ──────────────────────────────────────── */
  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawLinks();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    animate();
  }

  window.addEventListener('resize', () => { resize(); });

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  init();
})();
