(function (g) {
  'use strict';
  var loaded = false;
  function loadNotoArabic() {
    if (loaded) return;
    loaded = true;
    var id = 'dreamos-noto-arabic';
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap';
    document.head.appendChild(link);
  }
  function applyFontForLang(lang) {
    if (lang === 'ar') loadNotoArabic();
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.lang = lang || 'id';
  }
  g.DreamFontRTL = { loadNotoArabic: loadNotoArabic, applyFontForLang: applyFontForLang };
  g.addEventListener('dreamos-lang-changed', function (e) {
    if (e.detail && e.detail.lang) applyFontForLang(e.detail.lang);
  });
  var lang = localStorage.getItem('dreamos_lang') || 'id';
  if (lang === 'ar') applyFontForLang('ar');
})(window);
