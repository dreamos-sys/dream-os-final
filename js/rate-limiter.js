// ========== RATE LIMITER ==========
(function() {
  'use strict';
  
  var MAX_ATTEMPTS = 10;
  var WINDOW_MS = 60000; // 1 menit
  var attempts = JSON.parse(localStorage.getItem('rate_limit') || '{"count":0,"reset":0}');
  
  // Reset kalau window sudah lewat
  if (Date.now() > attempts.reset) {
    attempts = { count: 0, reset: Date.now() + WINDOW_MS };
  }
  
  window.checkRateLimit = function() {
    if (attempts.count >= MAX_ATTEMPTS) {
      var waitSeconds = Math.ceil((attempts.reset - Date.now()) / 1000);
      console.error('⛔ Rate limit exceeded. Wait ' + waitSeconds + 's');
      return false;
    }
    attempts.count++;
    localStorage.setItem('rate_limit', JSON.stringify(attempts));
    return true;
  };
  
  console.log('🛡️ Rate limiter active: ' + MAX_ATTEMPTS + ' req/' + (WINDOW_MS/1000) + 's');
})();
