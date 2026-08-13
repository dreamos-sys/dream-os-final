// Load DOMPurify untuk XSS protection
(function() {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js';
  script.onload = function() {
    console.log('[Security] DOMPurify loaded');
  };
  script.onerror = function() {
    console.warn('[Security] DOMPurify failed to load - using fallback sanitization');
  };
  document.head.appendChild(script);
})();
