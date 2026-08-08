// Dream OS i18n Core Engine (v6)
(function(){
  'use strict';
  var LANG_KEY = 'dreamos_lang';

  // Kamus kunci [data-i18n]
  var I18N = {
    id: { nav_home:'Beranda', nav_profile:'Profil', nav_qr:'QR', nav_about:'Tentang', nav_system:'Sistem',
          login_error:'Email atau password salah' },
    en: { nav_home:'Home', nav_profile:'Profile', nav_qr:'QR', nav_about:'About', nav_system:'System',
          login_error:'Wrong email or password' },
    zh: { nav_home:'首页', nav_profile:'个人资料', nav_qr:'二维码', nav_about:'关于', nav_system:'设置',
          login_error:'邮箱或密码错误' },
    ar: { nav_home:'الرئيسية', nav_profile:'الملف الشخصي', nav_qr:'QR', nav_about:'حول', nav_system:'النظام',
          login_error:'البريد أو كلمة المرور خاطئة' }
  };

  function detectLang(){
    try {
      var tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
      if (/Jakarta|Pontianak|Makassar|Jayapura/i.test(tz)) return 'id';
      var nav = (navigator.language || 'en').slice(0,2).toLowerCase();
      if (I18N[nav]) return nav;
      return 'en';
    } catch(e) { return 'id'; }
  }

  window.currentLang = (function(){
    var saved = null; try { saved = localStorage.getItem(LANG_KEY); } catch(e){}
    return (saved && I18N[saved]) ? saved : detectLang();
  })();

  window.t = function(key){
    var d = I18N[window.currentLang] || I18N.id;
    return (d && d[key]) || (I18N.id[key]) || key;
  };

  // Terjemahkan semua elemen [data-i18n]
  window.applyTranslations = function(root){
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-i18n]');
    for (var i=0;i<nodes.length;i++){
      var el = nodes[i];
      var key = el.getAttribute('data-i18n');
      var txt = window.t(key);
      if (txt) el.textContent = txt;
    }
    // placeholder [data-i18n-ph]
    var ph = scope.querySelectorAll('[data-i18n-ph]');
    for (var j=0;j<ph.length;j++){
      var el2 = ph[j];
      var k2 = el2.getAttribute('data-i18n-ph');
      var t2 = window.t(k2);
      if (t2) el2.setAttribute('placeholder', t2);
    }
  };

  window.setLanguage = function(lang, opts){
    if (!I18N[lang]) lang = 'id';
    window.currentLang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch(e){}
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    window.applyTranslations(document);
    try {
      window.dispatchEvent(new CustomEvent('dreamos-lang-changed', { detail: { lang: lang } }));
      if (window.parent && window.parent !== window) window.parent.dispatchEvent(new CustomEvent('dreamos-lang-changed', { detail: { lang: lang } }));
    } catch(e){}
    if (!(opts && opts.skipSync) && window.parent && window.parent !== window && window.parent.setLanguage) {
      try { window.parent.setLanguage(lang, { skipSync: true }); } catch(e){}
    }
  };

  window.resetToAutoDetect = function(){
    var d = detectLang();
    window.setLanguage(d);
    return d;
  };

  // Apply saat load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ window.applyTranslations(document); });
  } else {
    window.applyTranslations(document);
  }
})();
