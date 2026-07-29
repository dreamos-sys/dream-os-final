/**
 * Dream OS — font-rtl v2 (crafted)
 * On-demand Noto Sans Arabic + RTL hook + FOUT guard + font detective.
 * Public API (JANGAN ganti nama — dipakai i18n.js):
 *   window.DreamFontRTL.loadNotoArabic()
 *   window.DreamFontRTL.applyFontForLang(lang)
 */
(function (g) {
  'use strict';

  var FONT_STACK_AR = "'Noto Sans Arabic','Segoe UI',Tahoma,'Arabic Typesetting','Geeza Pro',sans-serif";
  var loaded = false;
  var preconnected = false;
  var styleInjected = false;

  // --- Preconnect: kenalan sama server font SEBELUM minta file (hemat ~100-300ms) ---
  function preconnect() {
    if (preconnected) return;
    preconnected = true;
    ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(function (host) {
      if (document.querySelector('link[data-dreamos-preconnect="' + host + '"]')) return;
      var l = document.createElement('link');
      l.rel = 'preconnect';
      l.href = host;
      l.crossOrigin = 'anonymous';
      l.setAttribute('data-dreamos-preconnect', host);
      document.head.appendChild(l);
    });
  }

  // --- Style: font stack Arab + transisi halus biar nggak "jedug" (FOUT guard) ---
  function injectStyle() {
    if (styleInjected) return;
    styleInjected = true;
    var s = document.createElement('style');
    s.id = 'dreamos-rtl-style';
    s.textContent =
      'html[dir="rtl"] body, html[lang="ar"] body { font-family:' + FONT_STACK_AR + '; }' +
      'html[dir="rtl"] { text-align:right; }' +
      // harakat-aware: huruf Arab tinggi, kasih napas biar harakat nggak ketabrak
      'html[dir="rtl"] .arabic, html[dir="rtl"] .shalawat, html[lang="ar"] .arabic, html[lang="ar"] .shalawat { line-height:2.1; letter-spacing:0; }' +
      // transisi halus saat arah/layout berubah (micro-interaction yang perceptible)
      'html[dir="rtl"] body, html[dir="ltr"] body { transition:text-align .25s ease; }' +
      // FOUT guard: teks Arab fade-in pelan pas font siap
      '.dreamos-ar-loading [dir="rtl"], .dreamos-ar-loading html[dir="rtl"] body { opacity:.0; }' +
      'html.dreamos-ar-ready[dir="rtl"] body { animation:dreamosArFade .35s ease both; }' +
      '@keyframes dreamosArFade { from { opacity:.35 } to { opacity:1 } }';
    document.head.appendChild(s);
  }

  // --- Load stylesheet Noto Sans Arabic (sekali saja) ---
  function loadNotoArabic() {
    if (loaded) return;
    loaded = true;
    preconnect();
    injectStyle();
    if (document.getElementById('dreamos-noto-arabic')) { detectReady(); return; }

    g.document.documentElement.classList.add('dreamos-ar-loading');
    var link = document.createElement('link');
    link.id = 'dreamos-noto-arabic';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap';
    link.onload = detectReady;
    link.onerror = function () {
      // Jaringan jelek/offline → fallback font Arab bawaan, JANGAN error
      g.document.documentElement.classList.remove('dreamos-ar-loading');
      g.document.documentElement.classList.add('dreamos-ar-ready');
      console.warn('🌍 Noto Arabic gagal load — pakai font Arab bawaan device (graceful fallback)');
    };
    document.head.appendChild(link);
  }

  // --- Font detective: pastiin glyph beneran siap, baru fade-in ---
  function detectReady() {
    var done = function () {
      g.document.documentElement.classList.remove('dreamos-ar-loading');
      g.document.documentElement.classList.add('dreamos-ar-ready');
    };
    if (g.document.fonts && g.document.fonts.load) {
      g.document.fonts.load("600 16px 'Noto Sans Arabic'")
        .then(function () {
          if (g.document.fonts.check("600 16px 'Noto Sans Arabic'")) {
            console.log('🌍 Noto Sans Arabic: ✅ verified & ready');
          } else {
            console.log('🌍 Noto Sans Arabic: ⚠️ requested, fallback aktif');
          }
          done();
        })
        .catch(function () { done(); });
    } else {
      done(); // browser tua tanpa Font Loading API → tetap fade-in
    }
  }

  // --- Public: terapkan arah + font sesuai bahasa ---
  function applyFontForLang(lang) {
    var root = g.document.documentElement;
    var isAr = (lang === 'ar');
    root.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    root.setAttribute('lang', lang || 'id');
    if (isAr) loadNotoArabic();
    else {
      // keluar dari Arab → bersihin state loading biar balik ke Latin mulus
      root.classList.remove('dreamos-ar-loading');
    }
  }

  g.DreamFontRTL = { loadNotoArabic: loadNotoArabic, applyFontForLang: applyFontForLang };

  // dengerin event ganti bahasa dari i18n.js
  g.addEventListener('dreamos-lang-changed', function (e) {
    if (e.detail && e.detail.lang) applyFontForLang(e.detail.lang);
  });

  // boot: kalau user terakhir pakai Arab, langsung siapin font-nya
  var lang = localStorage.getItem('dreamos_lang') || 'id';
  if (lang === 'ar') applyFontForLang('ar');
})(window);
