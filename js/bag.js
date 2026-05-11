/* ================================================
   OnlyElite — Shopping Bag Logic
   Tracks product + size + color combinations.
   Supports add, remove, and duplicate sizes.
   ================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // Bag state — array of { id, name, size, color }
  const bagItems = [];

  function getBadge() {
    return document.getElementById('bag-count');
  }

  function updateBadge() {
    const badge = getBadge();
    if (badge) {
      badge.textContent = bagItems.length;
      badge.classList.toggle('hidden', bagItems.length === 0);
    }
  }

  /**
   * Add an item to the bag.
   * Same product can be added in different sizes.
   * Returns true if added, false if already exists.
   */
  window.addToBag = function (id, name, size, color) {
    // Check if this exact combo already exists
    const exists = bagItems.some(
      (item) => item.id === id && item.size === size && item.color === color
    );
    if (exists) return false;

    bagItems.push({ id, name, size, color });
    updateBadge();
    return true;
  };

  /**
   * Remove a specific item from the bag by id + size + color.
   * Returns true if removed, false if not found.
   */
  window.removeFromBag = function (id, size, color) {
    const index = bagItems.findIndex(
      (item) => item.id === id && item.size === size && item.color === color
    );
    if (index === -1) return false;

    bagItems.splice(index, 1);
    updateBadge();
    return true;
  };

  /**
   * Check if a specific combo is in the bag.
   */
  window.isInBag = function (id, size, color) {
    return bagItems.some(
      (item) => item.id === id && item.size === size && item.color === color
    );
  };

  /**
   * Get current bag count.
   */
  window.getBagCount = function () {
    return bagItems.length;
  };

  // Initialize
  updateBadge();
  console.log('OnlyElite — Bag module ready.');
});
