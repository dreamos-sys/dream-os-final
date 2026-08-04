/**
 * Dream OS — i18n auto-translate v6 (Absolute Shield)
 * 
 * Teknik: Disconnect Observer saat DOM dimanipulasi agar 
 * perubahan yang dilakukan engine sendiri tidak memicu Observer (Zero-Loop).
 * 
 * @author Kanjeng Arsitek + My Bro
 * @version 6.0.0
 */
(function () {
  'use strict';
  var translateCache = {};
  var debounceTimer = null;
  var observer = null; // Naikkan scope observer

  function getLang() { return window.currentLang || 'id'; }
  function getPack() {
    var lang = getLang();
    if (lang === 'id') return null;
    return (window.DREAM_I18N && window.DREAM_I18N[lang]) || null;
  }

  function translateText(text) {
    if (!text || typeof text !== 'string') return text;
    var trimmed = text.trim();
    if (trimmed.length < 2 || getLang() === 'id') return text;
    
    var cacheKey = getLang() + '|' + trimmed;
    if (translateCache[cacheKey] !== undefined) return translateCache[cacheKey];
    
    var pack = getPack();
    if (!pack) { translateCache[cacheKey] = text; return text; }
    
    if (pack[trimmed]) { translateCache[cacheKey] = pack[trimmed]; return pack[trimmed]; }
    if (pack._fromId && pack._fromId[trimmed]) {
      translateCache[cacheKey] = pack._fromId[trimmed];
      return pack._fromId[trimmed];
    }
    
    translateCache[cacheKey] = text;
    return text;
  }

  function translateElement(el) {
    if (!el || el.nodeType !== 1) return;
    var tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE' || tag === 'SVG') return;
    if (el.hasAttribute('data-i18n-skip')) return;
    
    if (el.hasAttribute('data-i18n')) {
      var key = el.getAttribute('data-i18n');
      if (typeof window.t === 'function') {
        el.textContent = window.t(key);
      } else {
        var pack = getPack() || (window.DREAM_I18N && window.DREAM_I18N.id);
        if (pack && pack[key]) el.textContent = pack[key];
      }
    }
    
    for (var i = 0; i < el.childNodes.length; i++) {
      var child = el.childNodes[i];
      if (child.nodeType === 3) {
        var raw = child.textContent;
        var t = raw.trim();
        if (!t) continue;
        var tr = translateText(t);
        if (tr !== t) child.textContent = raw.replace(t, tr);
      } else if (child.nodeType === 1) {
        translateElement(child);
      }
    }
    
    ['placeholder', 'title', 'aria-label'].forEach(function (attr) {
      if (!el.hasAttribute(attr)) return;
      var v = el.getAttribute(attr);
      var tr = translateText(v);
      if (tr !== v) el.setAttribute(attr, tr);
    });
  }

  // 🛡️ FUNGSI EKSEKUTOR AMAN (Absolute Shield)
  function performTranslation(nodesToTranslate) {
    // 1. CABUT KABEL OBSERVER (Mencegah deteksi mutasi diri sendiri)
    if (observer) observer.disconnect();
    
    try {
      if (nodesToTranslate && nodesToTranslate.length > 0) {
        nodesToTranslate.forEach(function(node) { translateElement(node); });
      } else {
        if (document.body) translateElement(document.body);
      }
    } finally {
      // 2. COLOK KEMBALI KABEL SETELAH SELESAI
      if (observer && document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  }

  function startObserver() {
    if (observer) observer.disconnect();
    if (!document.body) return;
    
    observer = new MutationObserver(function (mutations) {
      if (getLang() === 'id') return;
      
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        var elementsToTranslate = [];
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) elementsToTranslate.push(node);
          });
        });
        
        // Panggil Eksekutor Aman
        if (elementsToTranslate.length > 0) {
          performTranslation(elementsToTranslate);
        }
      }, 100);
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.i18nTranslate = function () {
    translateCache = {};
    if (getLang() === 'id') return;
    // Panggil Eksekutor Aman untuk seluruh body
    performTranslation();
  };

  function boot() {
    startObserver();
    setTimeout(function () { window.i18nTranslate(); }, 400);
  }

  window.addEventListener('dreamos-lang-changed', function () {
    window.i18nTranslate();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  console.log('🌍 i18n-auto-translate v6 (Absolute Shield Active)');
})();
