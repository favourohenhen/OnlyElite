/* ================================================
   OnlyElite — App Logic
   Navigation scroll behavior, color swatch updates,
   and size configuration.
   ================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // NAVIGATION — Scroll Collapse / Expand
  // ========================================

  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let isExpanded = true;
  let lastScrollY = window.scrollY;
  let scrollOnCollapse = 0;
  let expandedWidth = 0;

  const COLLAPSE_AT = 150;     // px scrolled before collapsing
  const EXPAND_DELTA = 80;     // px scrolled up before re-expanding

  // Measure expanded width after fonts are ready
  function measureNav() {
    if (isExpanded && !nav.style.width) {
      expandedWidth = nav.offsetWidth;
    }
  }

  // Wait for fonts to load so measurement is accurate
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(measureNav));
  } else {
    window.addEventListener('load', () => requestAnimationFrame(measureNav));
  }

  function collapse() {
    if (!isExpanded) return;
    expandedWidth = nav.offsetWidth;       // re-measure before collapse
    nav.style.width = expandedWidth + 'px';
    void nav.offsetHeight;                 // force reflow
    nav.style.width = '48px';
    nav.classList.add('collapsed');
    isExpanded = false;
  }

  function expand() {
    if (isExpanded) return;
    nav.style.width = expandedWidth + 'px';
    nav.classList.remove('collapsed');
    isExpanded = true;
    // After transition, reset to auto so it stays responsive
    setTimeout(() => {
      if (isExpanded) nav.style.width = '';
    }, 550);
  }

  // Scroll listener (passive for performance)
  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (isExpanded && y > lastScrollY && y > COLLAPSE_AT) {
      collapse();
      scrollOnCollapse = y;
    } else if (!isExpanded && y < lastScrollY && (scrollOnCollapse - y) > EXPAND_DELTA) {
      expand();
    }

    lastScrollY = y;
  }, { passive: true });

  // Click collapsed nav to expand
  nav.addEventListener('click', (e) => {
    if (!isExpanded) {
      e.preventDefault();
      expand();
    }
  });

  // ========================================
  // HERO — Image Marquee Loader
  // ========================================

  async function loadHeroMarquee() {
    const container = document.getElementById('hero-marquee');
    if (!container) return;

    // Single API call for 8 images — women wearing corporate outfits only, no accessories
    let urls = await UnsplashAPI.fetchPhotos('woman wearing blazer suit corporate outfit', 8, 'portrait');

    // If too few results, collect fallbacks from each category
    if (urls.length < 4) {
      const cats = ['hero', 'blazers', 'suits', 'dresses', 'coats', 'tops', 'sweaters', 'pants'];
      urls = cats.map((c) => UnsplashAPI.getFallback(c));
    }

    // Duplicate array for seamless infinite loop
    const allUrls = [...urls, ...urls];

    allUrls.forEach((url, i) => {
      const card = document.createElement('div');
      card.className = 'hero-marquee-card';
      // Responsive height: smaller on mobile
      card.style.height = 'clamp(9rem, 20vw, 16rem)';
      card.style.transform = `rotate(${i % 2 === 0 ? -2 : 4}deg)`;

      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Editorial fashion showcase';
      img.loading = 'lazy';

      card.appendChild(img);
      container.appendChild(card);
    });
  }

  loadHeroMarquee();

  // ========================================
  // ABOUT — 3D Image Carousel
  // ========================================

  async function loadAboutCarousel() {
    const carousel = document.getElementById('about-carousel');
    if (!carousel) return;

    // Fetch one image per category for variety (all cached/fallback, efficient)
    const categories = ['hero', 'blazers', 'suits', 'monday', 'wednesday', 'friday', 'tops'];
    const urls = [];
    for (const cat of categories) {
      const url = await UnsplashAPI.fetchPhoto(cat);
      if (url) urls.push(url);
    }

    // Create card elements
    urls.forEach((url) => {
      const card = document.createElement('div');
      card.className = 'about-card';
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'OnlyElite editorial showcase';
      img.loading = 'lazy';
      card.appendChild(img);
      carousel.appendChild(card);
    });

    const cards = carousel.querySelectorAll('.about-card');
    const total = cards.length;
    if (total === 0) return;

    let currentIndex = Math.floor(total / 2);

    function updateCarousel() {
      cards.forEach((card, index) => {
        const offset = index - currentIndex;
        let pos = ((offset % total) + total) % total;
        if (pos > Math.floor(total / 2)) pos -= total;

        const isCenter = pos === 0;
        const isAdj = Math.abs(pos) === 1;

        card.style.transform = `translateX(${pos * 55}%) scale(${isCenter ? 1 : isAdj ? 0.85 : 0.7}) rotateY(${pos * -10}deg)`;
        card.style.zIndex = isCenter ? 10 : isAdj ? 5 : 1;
        card.style.opacity = isCenter ? '1' : isAdj ? '0.4' : '0';
        card.style.filter = isCenter ? 'blur(0px)' : 'blur(4px)';
        card.style.visibility = Math.abs(pos) > 1 ? 'hidden' : 'visible';
      });
    }

    function next() {
      currentIndex = (currentIndex + 1) % total;
      updateCarousel();
    }

    function prev() {
      currentIndex = (currentIndex - 1 + total) % total;
      updateCarousel();
    }

    // Button listeners
    const prevBtn = document.getElementById('about-prev');
    const nextBtn = document.getElementById('about-next');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Auto-advance every 4s, pause on hover
    let timer = setInterval(next, 4000);
    carousel.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.parentElement.addEventListener('mouseleave', () => {
      timer = setInterval(next, 4000);
    });

    // Initial render
    updateCarousel();
  }

  loadAboutCarousel();

  // ========================================
  // COLLECTION — Product Grid
  // ========================================

  const PRODUCTS = [
    { id:1, name:'The Executive Silk Blouse', cat:'tops', label:'Tops & Shirts', price:285, colors:[{n:'Ivory',h:'#FDFBF7',k:'tops'},{n:'Charcoal',h:'#333',k:'monday'}], sizes:['XS','S','M','L','XL'] },
    { id:2, name:'The Boardroom Button-Down', cat:'tops', label:'Tops & Shirts', price:245, colors:[{n:'White',h:'#FFF',k:'tuesday'},{n:'Slate',h:'#708090',k:'wednesday'}], sizes:['XS','S','M','L'] },
    { id:3, name:'The Power Midi Dress', cat:'dresses', label:'Dresses & Jumpsuits', price:425, colors:[{n:'Burgundy',h:'#58111A',k:'dresses'},{n:'Black',h:'#111',k:'thursday'}], sizes:['XS','S','M','L','XL'] },
    { id:4, name:'The Editorial Jumpsuit', cat:'dresses', label:'Dresses & Jumpsuits', price:395, colors:[{n:'Cream',h:'#FDFBF7',k:'friday'},{n:'Noir',h:'#111',k:'dresses'}], sizes:['S','M','L'] },
    { id:5, name:'The Tailored Wide-Leg', cat:'pants', label:'Pants', price:310, colors:[{n:'Black',h:'#111',k:'pants'},{n:'Cream',h:'#FDFBF7',k:'tuesday'}], sizes:['XS','S','M','L','XL'] },
    { id:6, name:'The Cigarette Trouser', cat:'pants', label:'Pants', price:275, colors:[{n:'Charcoal',h:'#333',k:'monday'},{n:'Camel',h:'#C4A882',k:'pants'}], sizes:['XS','S','M','L'] },
    { id:7, name:'The Wool Overcoat', cat:'coats', label:'Coats & Jackets', price:695, colors:[{n:'Camel',h:'#C4A882',k:'coats'},{n:'Black',h:'#111',k:'monday'}], sizes:['S','M','L','XL'] },
    { id:8, name:'The Trench Silhouette', cat:'coats', label:'Coats & Jackets', price:585, colors:[{n:'Sand',h:'#D2B48C',k:'friday'},{n:'Noir',h:'#111',k:'coats'}], sizes:['XS','S','M','L'] },
    { id:9, name:'The Double-Breasted Blazer', cat:'blazers', label:'Blazers', price:465, colors:[{n:'Black',h:'#111',k:'blazers'},{n:'Ivory',h:'#FDFBF7',k:'wednesday'}], sizes:['XS','S','M','L','XL'] },
    { id:10, name:'The Oversized Power Blazer', cat:'blazers', label:'Blazers', price:495, colors:[{n:'Cream',h:'#FDFBF7',k:'hero'},{n:'Charcoal',h:'#333',k:'blazers'}], sizes:['S','M','L'] },
    { id:11, name:'The Cashmere Turtleneck', cat:'sweaters', label:'Sweaters', price:345, colors:[{n:'Oat',h:'#E8DCC8',k:'sweaters'},{n:'Black',h:'#111',k:'monday'}], sizes:['XS','S','M','L','XL'] },
    { id:12, name:'The Ribbed Knit Pullover', cat:'sweaters', label:'Sweaters', price:295, colors:[{n:'Cream',h:'#FDFBF7',k:'tuesday'},{n:'Mocha',h:'#967969',k:'sweaters'}], sizes:['S','M','L'] },
    { id:13, name:'The Power Suit Set', cat:'suits', label:'Suits', price:785, colors:[{n:'Black',h:'#111',k:'suits'},{n:'Charcoal',h:'#333',k:'wednesday'}], sizes:['XS','S','M','L','XL'] },
    { id:14, name:'The Pinstripe Ensemble', cat:'suits', label:'Suits', price:825, colors:[{n:'Navy',h:'#1B2A4A',k:'monday'},{n:'Grey',h:'#808080',k:'suits'}], sizes:['S','M','L'] },
  ];

  async function renderCollection() {
    const grid = document.getElementById('collection-grid');
    if (!grid) return;

    for (const p of PRODUCTS) {
      const url = await UnsplashAPI.fetchPhoto(p.colors[0].k);
      const card = document.createElement('div');
      card.className = 'product-card group';
      card.dataset.category = p.cat;

      const swatches = p.colors.map((c, i) =>
        `<button class="color-swatch ${i === 0 ? 'active' : ''}" style="background:${c.h}" data-key="${c.k}" title="${c.n}"></button>`
      ).join('');

      const sizes = p.sizes.map(s =>
        `<button class="size-pill">${s}</button>`
      ).join('');

      card.innerHTML = `
        <div class="relative overflow-hidden bg-black/5">
          <img class="product-image w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" src="${url}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="pt-3 space-y-1.5">
          <p class="text-[10px] uppercase tracking-[0.2em] text-muted font-medium">${p.label}</p>
          <h3 class="font-serif text-sm sm:text-base font-semibold text-black leading-snug">${p.name}</h3>
          <p class="text-sm text-black font-medium">$${p.price}</p>
          <div class="flex gap-2 pt-1">${swatches}</div>
          <div class="flex flex-wrap gap-1.5 pt-1">${sizes}</div>
          <button class="add-bag-btn w-full mt-2 py-2.5 bg-black text-cream text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-burgundy transition-colors duration-300">Add to Bag</button>
        </div>`;

      const bagBtn = card.querySelector('.add-bag-btn');

      // Helper: get currently selected size & color for this card
      function getSelection() {
        const activeSwatch = card.querySelector('.color-swatch.active');
        const activePill = card.querySelector('.size-pill.active');
        return {
          size: activePill ? activePill.textContent : null,
          color: activeSwatch ? activeSwatch.title : p.colors[0].n,
        };
      }

      // Helper: update button state based on current selection
      function refreshBagBtn() {
        const { size, color } = getSelection();
        if (size && window.isInBag(p.id, size, color)) {
          bagBtn.textContent = 'Remove from Bag';
          bagBtn.classList.remove('bg-black', 'hover:bg-burgundy');
          bagBtn.classList.add('bg-burgundy', 'hover:bg-black');
        } else {
          bagBtn.textContent = 'Add to Bag';
          bagBtn.classList.remove('bg-burgundy', 'hover:bg-black');
          bagBtn.classList.add('bg-black', 'hover:bg-burgundy');
        }
      }

      // Color swatch interaction
      card.querySelectorAll('.color-swatch').forEach(sw => {
        sw.addEventListener('click', async () => {
          card.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
          sw.classList.add('active');
          const newUrl = await UnsplashAPI.fetchPhoto(sw.dataset.key);
          card.querySelector('.product-image').src = newUrl;
          refreshBagBtn();
        });
      });

      // Size pill selection
      card.querySelectorAll('.size-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          card.querySelectorAll('.size-pill').forEach(sp => sp.classList.remove('active'));
          pill.classList.add('active');
          refreshBagBtn();
        });
      });

      // Add / Remove from bag
      bagBtn.addEventListener('click', () => {
        const { size, color } = getSelection();

        // If no size selected, flash the pills
        if (!size) {
          card.querySelectorAll('.size-pill').forEach(sp => {
            sp.classList.add('border-burgundy', 'text-burgundy');
            setTimeout(() => sp.classList.remove('border-burgundy', 'text-burgundy'), 800);
          });
          return;
        }

        if (window.isInBag(p.id, size, color)) {
          window.removeFromBag(p.id, size, color);
        } else {
          window.addToBag(p.id, p.name, size, color);
        }
        refreshBagBtn();
      });

      grid.appendChild(card);
    }
  }

  renderCollection();

  // Category tab filtering
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.category;
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
    });
  });

  console.log('OnlyElite — App initialized.');
});
