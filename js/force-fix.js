
// =========================================================================
// JS FORCE FIX v77 — Lawan CSS Override dengan JavaScript
// =========================================================================
(function() {
  'use strict';
  
  var FORCE_CSS_RULES = {
    // Back button: PAKE fixed position, nempel viewport
    '.back-btn, button.back-btn, [class*="back-btn"]': {
      position: 'fixed',
      bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
      left: '1rem',
      top: 'auto',
      right: 'auto',
      zIndex: '9000',
      transform: 'none',
      pointerEvents: 'auto'
    },
    // Button active: NO JUMP
    '.btn:active, button:active, .mod-card:active, .nav-item:active, .check-label:active': {
      transform: 'none',
      transition: 'none'
    },
    // Checkbox: NO SHIFT
    '.check-label, input[type="checkbox"]': {
      transform: 'none'
    },
    // Toast: CENTERED
    '.toast-container, #toast-container': {
      position: 'fixed',
      bottom: '4.5rem',
      left: '0',
      right: '0',
      zIndex: '999999',
      transform: 'none',
      pointerEvents: 'none'
    },
    // Modal: CENTERED
    '.qr-modal.show, .photo-preview.show, [class*="modal"].show': {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '99998',
      transform: 'none'
    },
    // Bottom nav: NEMPEL di bawah
    '#bottom-nav': {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      zIndex: '999',
      transform: 'none'
    }
  };
  
  // Fungsi untuk apply inline style force
  function forceApplyStyles(selector, styles) {
    try {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function(el) {
        if (!el || !el.style) return;
        Object.keys(styles).forEach(function(prop) {
          try {
            // Pakai setProperty dengan !important untuk inline style
            var cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            el.style.setProperty(cssProp, styles[prop], 'important');
          } catch(e) {}
        });
      });
    } catch(e) {}
  }
  
  // Apply SEMUA force rules
  function applyAllForce() {
    Object.keys(FORCE_CSS_RULES).forEach(function(selector) {
      forceApplyStyles(selector, FORCE_CSS_RULES[selector]);
    });
  }
  
  // MutationObserver: apply force setiap ada perubahan DOM
  var observer = new MutationObserver(function(mutations) {
    // Debounce: max 1x per 50ms
    if (window.__forceDebounce) return;
    window.__forceDebounce = true;
    setTimeout(function() {
      applyAllForce();
      window.__forceDebounce = false;
    }, 50);
  });
  
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  // Apply sekarang juga (initial)
  applyAllForce();
  setTimeout(applyAllForce, 100);
  setTimeout(applyAllForce, 500);
  setTimeout(applyAllForce, 1000);
  
  // Patch event listener: apply force setiap tap/click
  document.addEventListener('click', function() {
    setTimeout(applyAllForce, 10);
    setTimeout(applyAllForce, 50);
  }, true);
  
  document.addEventListener('touchstart', function() {
    setTimeout(applyAllForce, 10);
  }, true);
  
  document.addEventListener('touchend', function() {
    setTimeout(applyAllForce, 10);
    setTimeout(applyAllForce, 50);
  }, true);
  
  // Expose global untuk debug
  window.__JS_FORCE_ACTIVE = true;
  window.__applyForceStyles = applyAllForce;
  
  console.log('[JS FORCE v77] Active — applying force styles on every DOM change');
})();
