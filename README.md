# OnlyElite — Quiet Luxury for the Powerful

A high-end, minimalist fashion landing page for **OnlyElite** — boardroom armor designed for high-achieving women. Built with HTML, Tailwind CSS, and Vanilla JavaScript.

---

## ✨ Features

- **Floating Navigation** — Pill-shaped nav that collapses on scroll and expands on scroll-up
- **Hero Section** — Staggered word animation with infinite image marquee
- **Brand Manifesto** — Split layout with 3D perspective image carousel (auto-advances, hover to pause)
- **Marquee Ticker** — Dual-row scrolling text strip with gold diamond separators
- **Core Collection** — 14 products across 7 categories with:
  - Category filter tabs
  - Color swatch image swapping
  - Size selection pills
  - Add/Remove from Bag functionality
- **Shopping Bag** — Tracks product + size + color combos, prevents duplicates, allows same item in different sizes
- **Editorial Footer** — Dark theme with social icons, link columns, and legal bar
- **Smooth Scroll** — Anchor navigation glides between sections
- **Responsive Design** — Mobile-first, scales from 320px to 4K

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure |
| Tailwind CSS v3 | Utility-first styling |
| Vanilla JavaScript | Interactions & logic |
| Google Fonts | Cormorant Garamond + Poppins |
| Unsplash | Static image URLs (no API key needed) |

---

## 📁 File Structure

```
OnlyElite/
├── index.html              # Main page — all sections
├── css/
│   ├── input.css           # Tailwind source (directives + custom CSS)
│   └── styles.css          # Built production CSS
├── js/
│   ├── unsplash.js         # Image library — edit URLs here
│   ├── app.js              # Nav, hero, carousel, collection grid
│   └── bag.js              # Shopping bag logic
├── tailwind.config.js      # Tailwind theme configuration
├── package.json            # Node dependencies
└── .gitignore              # Ignores node_modules
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v18+

### Install
```bash
git clone https://github.com/your-username/OnlyElite.git
cd OnlyElite
npm install
```

### Build CSS
```bash
npx tailwindcss -i ./css/input.css -o ./css/styles.css --minify
```

### Development (watch mode)
```bash
npx tailwindcss -i ./css/input.css -o ./css/styles.css --watch
```

Then open `index.html` in your browser.

---

## 🖼 Changing Images

All images are managed in **`js/unsplash.js`** — a simple key-value map:

```js
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-...',
  blazers: 'https://images.unsplash.com/photo-...',
  suits: 'https://images.unsplash.com/photo-...',
  // ... swap any URL to change images site-wide
};
```

### Product color variants

In `js/app.js`, each product's `colors` array references image keys:

```js
colors: [
  { n: 'Ivory', h: '#FDFBF7', k: 'tops' },      // ← default image
  { n: 'Charcoal', h: '#333', k: 'monday' },      // ← swatch 2 image
]
```

Add new keys to `IMAGES` in `unsplash.js` for additional color variants.

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|---|---|---|
| Black | `#111111` | Primary text, backgrounds |
| Cream | `#FDFBF7` | Page background |
| Gold | `#D4AF37` | Accents, highlights |
| Burgundy | `#58111A` | CTA states, bag badge |
| Muted | `#666666` | Secondary text |

---

## 📦 Deployment

This is a static site — no server required. Deploy to:

- **Netlify** — Drag and drop the folder
- **Vercel** — Connect your Git repo
- **GitHub Pages** — Push and enable Pages
- **Any static host** — Upload all files

---

## 📄 License

This project is for personal/commercial use. All images are sourced from [Unsplash](https://unsplash.com) under their free license.

---

**OnlyElite** — *What you wear speaks louder than your words.*
