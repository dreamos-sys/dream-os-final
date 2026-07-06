// ========== ANTI-PHISHING PROTECTION ==========
(function() {
  'use strict';
  
  // Daftar domain resmi
  var OFFICIAL_DOMAINS = [
    'dreamos-sys.github.io',
    'localhost',
    '127.0.0.1'
  ];
  
  // Cek apakah domain saat ini resmi
  var currentDomain = window.location.hostname;
  var isOfficial = OFFICIAL_DOMAINS.some(function(domain) {
    return currentDomain === domain || currentDomain.endsWith('.' + domain);
  });
  
  if (!isOfficial) {
    // Tampilkan peringatan
    document.body.innerHTML = 
      '<div style="text-align:center;padding:4rem;color:#ef4444;background:#0a0e27;min-height:100vh;">' +
      '<h1 style="font-size:3rem;">⚠️ PERINGATAN!</h1>' +
      '<h2 style="color:#f59e0b;">INI BUKAN DREAM OS RESMI!</h2>' +
      '<p style="font-size:1.2rem;color:#94a3b8;">Domain: ' + currentDomain + '</p>' +
      '<p style="color:#ef4444;">Anda mungkin terkena PHISHING!</p>' +
      '<p style="margin-top:2rem;color:#94a3b8;">Domain resmi: <b style="color:#00ff9d;">dreamos-sys.github.io</b></p>' +
      '<button onclick="window.location.href=\'https://dreamos-sys.github.io/dream-os-final/\'" style="padding:1rem 2rem;background:#10b981;color:white;border:none;border-radius:12px;font-size:1rem;cursor:pointer;margin-top:2rem;">🔒 BUKA DREAM OS RESMI</button>' +
      '</div>';
    
    // Hentikan eksekusi
    throw new Error('⛔ UNOFFICIAL DOMAIN DETECTED - Possible phishing!');
  }
  
  console.log('✅ Domain verified: ' + currentDomain + ' (OFFICIAL)');
  
  // Tampilkan badge resmi
  var badge = document.createElement('div');
  badge.style.cssText = 'position:fixed;bottom:5.5rem;left:1rem;background:rgba(16,185,129,0.2);border:1px solid #10b981;color:#10b981;padding:0.3rem 0.8rem;border-radius:20px;font-size:0.6rem;z-index:9999;font-weight:700;';
  badge.textContent = '🔒 OFFICIAL';
  document.body.appendChild(badge);
})();
