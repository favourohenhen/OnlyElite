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

  console.log('OnlyElite — App initialized.');
});
