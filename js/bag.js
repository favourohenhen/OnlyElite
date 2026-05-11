/* ================================================
   OnlyElite — Shopping Bag Logic
   E-commerce bag counter increment
   ================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  let bagCount = 0;

  /**
   * Get the bag counter badge element.
   * @returns {HTMLElement|null}
   */
  function getBadge() {
    return document.getElementById('bag-count');
  }

  /**
   * Update the displayed bag count.
   */
  function updateBadge() {
    const badge = getBadge();
    if (badge) {
      badge.textContent = bagCount;
      badge.classList.toggle('hidden', bagCount === 0);
    }
  }

  /**
   * Increment the bag count by 1.
   * Called by "Add to Bag" buttons.
   */
  window.addToBag = function () {
    bagCount++;
    updateBadge();
  };

  // Initialize badge state
  updateBadge();

  console.log('OnlyElite — Bag module ready.');
});
