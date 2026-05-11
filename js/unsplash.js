/* ================================================
   OnlyElite — Image Library
   Static image map. No API calls.
   Edit the URLs below to swap any image.
   ================================================ */

'use strict';

const UnsplashAPI = (() => {

  // ============================================================
  //  IMAGE MAP — Edit these URLs to change images site-wide
  // ============================================================
  const IMAGES = {

    // ---- Hero & Marquee ----
    hero: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&fit=crop',

    // ---- About Carousel / Workweek ----
    monday: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80&fit=crop',
    tuesday: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80&fit=crop',
    wednesday: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80&fit=crop',
    thursday: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800&q=80&fit=crop',
    friday: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=800&q=80&fit=crop',

    // ---- Collection Product Categories ----
    tops: 'https://images.unsplash.com/photo-1604904612715-47bf9d9bc670?w=600&q=80&fit=crop',
    dresses: 'https://images.unsplash.com/photo-1727782908845-9d9216c49123?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    pants: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    coats: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80&fit=crop',
    blazers: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&q=80&fit=crop',
    sweaters: 'https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=705&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    suits: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&fit=crop',

    // ---- Fallback (used if a key doesn't match) ----
    default: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&fit=crop',
  };

  /**
   * Get image URL by key. Returns the default if key not found.
   * @param {string} key - Image key (e.g., 'hero', 'blazers', 'monday')
   * @returns {string} Image URL
   */
  function getImage(key) {
    return IMAGES[key] || IMAGES.default;
  }

  /**
   * Kept for compatibility — returns the image URL as a resolved promise.
   * No API calls are made.
   */
  async function fetchPhoto(key) {
    return getImage(key);
  }

  /**
   * Returns an array of image URLs. No API calls.
   */
  async function fetchPhotos(key, count) {
    return [getImage(key)];
  }

  /**
   * Get image URL (sync). Same as getImage.
   */
  function getFallback(key) {
    return getImage(key);
  }

  // Public API (same interface, so app.js works without changes)
  return {
    fetchPhoto,
    fetchPhotos,
    getFallback,
    getImage,
    IMAGES,
  };
})();

console.log('OnlyElite — Image library ready.');
