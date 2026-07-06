// ========== ANTI-BOT PROTECTION ==========
(function() {
  'use strict';
  
  var BOT_INDICATORS = {
    webdriver: navigator.webdriver || false,
    headless: /HeadlessChrome/.test(navigator.userAgent),
    selenium: /selenium/i.test(navigator.userAgent),
    puppeteer: /puppeteer/i.test(navigator.userAgent),
    noPlugins: !navigator.plugins || navigator.plugins.length === 0,
    noLanguages: !navigator.languages || navigator.languages.length === 0,
    botPattern: /bot|crawler|spider|scraper/i.test(navigator.userAgent)
  };
  
  var botScore = 0;
  Object.keys(BOT_INDICATORS).forEach(function(key) {
    if (BOT_INDICATORS[key]) {
      botScore++;
      console.warn('🤖 Bot indicator: ' + key);
    }
  });
  
  if (botScore >= 3) {
    // Blokir bot
    document.body.innerHTML = 
      '<div style="text-align:center;padding:4rem;color:#ef4444;background:#0a0e27;min-height:100vh;">' +
      '<h1 style="font-size:3rem;">🚫 AKSES DITOLAK</h1>' +
      '<h2 style="color:#f59e0b;">Bot/Automated Access Detected</h2>' +
      '<p style="color:#94a3b8;">Dream OS hanya untuk manusia.</p>' +
      '<p style="color:#64748b;">Bot Score: ' + botScore + '/7</p>' +
      '</div>';
    throw new Error('🤖 BOT DETECTED - Access denied');
  }
  
  console.log('👤 Human verified - Bot score: ' + botScore + '/7');
  
  // Mouse movement detection (bot biasanya tidak gerakin mouse)
  var mouseMoved = false;
  document.addEventListener('mousemove', function() {
    mouseMoved = true;
  });
  
  // Keyboard interaction
  var keyPressed = false;
  document.addEventListener('keydown', function() {
    keyPressed = true;
  });
  
  // Cek setelah 3 detik
  setTimeout(function() {
    if (!mouseMoved && !keyPressed) {
      console.warn('🤖 No human interaction detected - possible bot');
    }
  }, 3000);
})();
