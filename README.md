# Soummyashree Chakraborty — Personal Portfolio

> A luxury personal brand portfolio for **Soummyashree Chakraborty** — artist, vegan activist, translator of sacred scriptures, voice artist, and spiritual counsellor.

---

## 🔗 Live Site

**[https://soummyashreechakraborty.github.io](https://soummyashreechakraborty.github.io)**

---

## ✨ Features

| Feature | Description |
|---|---|
| **GSAP + ScrollTrigger** | Scroll-driven animations, stagger reveals, parallax |
| **SplitType hero** | Character-by-character animated heading entrance |
| **Custom cursor** | Magnetic cursor with lerp follower (desktop) |
| **Canvas particles** | Ambient gold particle system with mouse repulsion |
| **Mobile hamburger menu** | Full-screen slide-in overlay navigation |
| **Gallery + Lightbox** | GLightbox-powered gallery with touch support |
| **Animated counters** | Stats count up on scroll into view |
| **Education timeline** | Vertical timeline with animated dots |
| **Scroll progress bar** | Gold gradient progress indicator at top |
| **OG / Twitter meta** | Full social sharing metadata |
| **SEO optimised** | Canonical URL, robots, sitemap-ready |
| **Accessible** | ARIA labels, roles, keyboard navigation, reduced-motion support |
| **Fully responsive** | Mobile, tablet, desktop — all devices |
| **Static** | Zero server required — hosted on GitHub Pages |

---

## 🖼️ Adding Your Portrait Photo

Place your professional photo at:

```
assets/images/portrait.png
```

**Recommended specs:**
- Format: JPG or WebP
- Dimensions: **800 × 1000 px** (4:5 aspect ratio)
- File size: under 300 KB (compress at [squoosh.app](https://squoosh.app))

The site is designed to gracefully hide the image area if the file is missing, showing a gold gradient placeholder instead.

---

## 🖼️ Adding Gallery Images

Replace the placeholder gallery items in `index.html` with real artwork images:

1. Copy images to `assets/images/` (e.g., `art-01.jpg`, `art-02.jpg`)
2. In `index.html`, update each `.gallery-item` anchor's `href` and add an `<img>` tag inside `.gallery-thumb`:

```html
<a href="assets/images/art-01.jpg" class="gallery-item glightbox"
   data-gallery="gallery1" data-title="Your Artwork Title">
  <div class="gallery-thumb">
    <img src="assets/images/art-01.jpg" alt="Artwork description" />
  </div>
  <div class="gallery-overlay">
    <span>View <i class="fas fa-arrow-up-right-from-square"></i></span>
  </div>
</a>
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic markup, ARIA accessibility |
| **CSS3** | Custom properties, Grid, Flexbox, glassmorphism |
| **Vanilla JS (ES6+)** | All interactivity, no framework required |
| **GSAP 3** | Professional animation engine |
| **ScrollTrigger** | Scroll-driven animation plugin for GSAP |
| **SplitType** | Character/word text splitting for hero animation |
| **GLightbox** | Touch-enabled gallery lightbox |
| **Font Awesome 6** | UI and section icons |
| **Google Fonts** | Cormorant Garamond + Inter typefaces |

---

## 📁 Project Structure

```
soummyashreechakraborty.github.io/
├── index.html              ← Main page
├── .nojekyll               ← Disables Jekyll processing on GitHub Pages
├── robots.txt              ← SEO crawl directives
├── README.md               ← This file
│
├── assets/
│   ├── favicon.svg         ← "SC" monogram favicon
│   └── images/
│       └── portrait.png    ← ⭐ Add your photo here
│
├── css/
│   ├── main.css            ← Variables, reset, typography, layout
│   ├── components.css      ← All UI components
│   ├── animations.css      ← CSS keyframes
│   └── responsive.css      ← Media queries (all breakpoints)
│
└── js/
    ├── particles.js        ← Canvas particle system
    ├── cursor.js           ← Custom magnetic cursor
    ├── animations.js       ← GSAP + ScrollTrigger + SplitType
    └── main.js             ← Loader, mobile menu, GLightbox init
```

---

## 🚀 Deployment

This site is 100% static — just push to GitHub and it deploys automatically via **GitHub Pages**.

**Setup (first time):**
1. Go to your repository on GitHub
2. Settings → Pages → Source → **Deploy from branch: `main`, folder: `/ (root)`**
3. Save — site will be live at `https://soummyashreechakraborty.github.io` within minutes

**Update:** Just `git push origin main` and changes deploy automatically.

---

## 📬 Contact

| | |
|---|---|
| 📞 Phone | +91 7872796518 |
| 📧 Email | yeshudhun97@gmail.com |
| 💼 LinkedIn | [soummya-chakraborty-011719343](https://www.linkedin.com/in/soummya-chakraborty-011719343/) |
| 🐙 GitHub | [SoummyashreeChakraborty](https://github.com/SoummyashreeChakraborty) |

---

*Crafted with elegance, compassion, and conscious purpose.*
