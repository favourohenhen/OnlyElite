/* ================================================
   OnlyElite — Unsplash API Integration
   App Name: LuxElite (Unsplash Developer App)
   Dynamic editorial image fetching with caching
   and curated fallback images.
   ================================================ */

'use strict';

const UnsplashAPI = (() => {
  // ---- LuxElite Unsplash Developer App ----
  // Replace with your LuxElite Access Key from https://unsplash.com/oauth/applications
  const ACCESS_KEY = 'YOUR_LUXELITE_ACCESS_KEY';

  const BASE_URL = 'https://api.unsplash.com';

  // In-memory cache to prevent duplicate API calls during session
  const cache = new Map();

  // ---- Curated Search Queries ----
  // Targets: women wearing corporate clothing (blazers, tops, suits, coats). No accessories.
  const CURATED_QUERIES = {
    // Hero Section
    hero: 'woman wearing tailored blazer corporate outfit',

    // Workweek Grid (Monday – Friday)
    monday: 'woman wearing black blazer corporate outfit',
    tuesday: 'woman wearing white blouse shirt office',
    wednesday: 'woman wearing structured blazer corporate',
    thursday: 'woman wearing pencil dress office corporate',
    friday: 'woman wearing blazer smart casual outfit',

    // Core Collection Categories
    tops: 'woman wearing silk blouse shirt corporate',
    dresses: 'woman wearing midi dress corporate office',
    pants: 'woman wearing tailored trousers corporate',
    coats: 'woman wearing long coat overcoat corporate',
    blazers: 'woman wearing blazer jacket corporate',
    sweaters: 'woman wearing knit sweater turtleneck office',
    suits: 'woman wearing power suit corporate office',
  };

  // ---- Fallback Images ----
  // All verified Unsplash photos of women wearing corporate/professional clothing
  const FALLBACK_IMAGES = {
    // Woman in professional blazer
    hero: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&fit=crop',
    // Businesswoman in black suit
    monday: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80&fit=crop',
    // Professional woman in white blouse
    tuesday: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80&fit=crop',
    // Woman in structured blazer
    wednesday: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80&fit=crop',
    // Woman in professional dress
    thursday: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800&q=80&fit=crop',
    // Woman smart casual blazer
    friday: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=800&q=80&fit=crop',
    // Woman in silk blouse
    tops: 'https://images.unsplash.com/photo-1604904612715-47bf9d9bc670?w=600&q=80&fit=crop',
    // Woman in professional midi dress
    dresses: 'https://images.unsplash.com/photo-1727782908845-9d9216c49123?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // Woman in tailored trousers
    pants: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // Woman in professional coat
    coats: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80&fit=crop',
    // Woman in structured blazer
    blazers: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&q=80&fit=crop',
    // Woman in elegant sweater
    sweaters: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=705&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // Woman in power suit
    suits: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop',
    // Generic: professional woman in corporate clothing
    default: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&fit=crop',
  };

  /**
   * Check if a real API key has been configured.
   * @returns {boolean}
   */
  function hasValidKey() {
    return ACCESS_KEY && ACCESS_KEY !== 'YOUR_LUXELITE_ACCESS_KEY';
  }

  /**
   * Get the fallback image URL for a given category key.
   * @param {string} key - Category key matching FALLBACK_IMAGES
   * @returns {string} - Fallback image URL
   */
  function getFallback(key) {
    return FALLBACK_IMAGES[key] || FALLBACK_IMAGES.default;
  }

  /**
   * Get the curated search query for a given category.
   * @param {string} key - Category key matching CURATED_QUERIES
   * @returns {string} - Curated query string
   */
  function getQuery(key) {
    return CURATED_QUERIES[key] || key;
  }

  /**
   * Fetch a single photo by category key or custom query.
   * Uses caching to minimize API requests.
   * Falls back to static images if API key is missing or request fails.
   * @param {string} key - Category key (e.g., 'hero', 'blazers') or custom query
   * @param {string} orientation - 'landscape' | 'portrait' | 'squarish'
   * @returns {Promise<string>} - Image URL
   */
  async function fetchPhoto(key, orientation = 'portrait') {
    const cacheKey = `${key}_${orientation}`;

    // Return cached result
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // If no valid key, return fallback immediately (zero API calls)
    if (!hasValidKey()) {
      const fallback = getFallback(key);
      cache.set(cacheKey, fallback);
      return fallback;
    }

    const query = getQuery(key);

    try {
      const response = await fetch(
        `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`LuxElite API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const imageUrl = data.results[0].urls.regular;
        cache.set(cacheKey, imageUrl);
        return imageUrl;
      }

      // No results — use fallback
      const fallback = getFallback(key);
      cache.set(cacheKey, fallback);
      return fallback;
    } catch (error) {
      console.error(`LuxElite fetch failed for "${key}":`, error);
      const fallback = getFallback(key);
      cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * Fetch multiple photos by category key or custom query.
   * @param {string} key - Category key or custom query
   * @param {number} count - Number of photos (max 30)
   * @param {string} orientation - 'landscape' | 'portrait' | 'squarish'
   * @returns {Promise<string[]>} - Array of image URLs
   */
  async function fetchPhotos(key, count = 5, orientation = 'portrait') {
    const cacheKey = `${key}_${orientation}_${count}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // If no valid key, return fallback as single-item array
    if (!hasValidKey()) {
      const fallback = [getFallback(key)];
      cache.set(cacheKey, fallback);
      return fallback;
    }

    const query = getQuery(key);

    try {
      const response = await fetch(
        `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${count}`,
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`LuxElite API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const urls = data.results.map((photo) => photo.urls.regular);
        cache.set(cacheKey, urls);
        return urls;
      }

      const fallback = [getFallback(key)];
      cache.set(cacheKey, fallback);
      return fallback;
    } catch (error) {
      console.error(`LuxElite fetch failed for "${key}":`, error);
      const fallback = [getFallback(key)];
      cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * Apply a fetched image to a target element as a CSS background.
   * @param {string} selector - CSS selector for the target element
   * @param {string} key - Category key or custom query
   * @param {string} orientation - Image orientation
   */
  async function applyBackground(selector, key, orientation = 'portrait') {
    const element = document.querySelector(selector);
    if (!element) return;

    const url = await fetchPhoto(key, orientation);
    if (url) {
      element.style.backgroundImage = `url(${url})`;
      element.style.backgroundSize = 'cover';
      element.style.backgroundPosition = 'center';
    }
  }

  /**
   * Apply a fetched image to an <img> element's src attribute.
   * @param {string} selector - CSS selector for the <img> element
   * @param {string} key - Category key or custom query
   * @param {string} orientation - Image orientation
   */
  async function applyImage(selector, key, orientation = 'portrait') {
    const element = document.querySelector(selector);
    if (!element) return;

    const url = await fetchPhoto(key, orientation);
    if (url) {
      element.src = url;
      element.alt = CURATED_QUERIES[key] || key;
    }
  }

  // Public API
  return {
    fetchPhoto,
    fetchPhotos,
    applyBackground,
    applyImage,
    getFallback,
    getQuery,
    CURATED_QUERIES,
    FALLBACK_IMAGES,
  };
})();

console.log('OnlyElite — LuxElite Unsplash module ready.');
