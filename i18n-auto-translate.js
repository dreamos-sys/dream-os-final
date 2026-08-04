/**
 * Dream OS — i18n auto-translate v5 (Anti-Infinite-Loop)
 * 
 * Guard: isTranslating flag mencegah recursive call
 * Debounce: batch mutations sebelum translate
 */
(function () {
  'use strict';
  var translateCache = {};
  var isTranslating = false; // Guard flag
  var debounceTimer = null;

  function getLang() { return window.currentLang || 'id'; }
  function getPack() {
    var lang = getLang();
    if (lang === 'id') return null;
    return (window.DREAM_I18N && window.DREAM_I18N[lang]) || null;
  }

  function translateText(text) {
    if (!text || typeof text !== 'string') return text;
    var trimmed = text.trim();
    if (trimmed.length < 2) return text;
    if (getLang() === 'id') return text;
    
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
    
    // Skip elements dengan data-i18n-skip
    if (el.hasAttribute('data-i18n-skip')) return;
    
    // data-i18n attribute (key-based)
    if (el.hasAttribute('data-i18n')) {
      var key = el.getAttribute('data-i18n');
      if (typeof window.t === 'function') {
        el.textContent = window.t(key);
      } else {
        var pack = getPack() || (window.DREAM_I18N && window.DREAM_I18N.id);
        if (pack && pack[key]) el.textContent = pack[key];
      }
    }
    
    // Translate child nodes
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
    
    // Translate attributes
    ['placeholder', 'title', 'aria-label'].forEach(function (attr) {
      if (!el.hasAttribute(attr)) return;
      var v = el.getAttribute(attr);
      var tr = translateText(v);
      if (tr !== v) el.setAttribute(attr, tr);
    });
  }

  var observer = null;
  function startObserver() {
    if (observer) observer.disconnect();
    if (!document.body) return;
    
    observer = new MutationObserver(function (mutations) {
      // Guard: jangan translate saat sedang translate (prevent infinite loop)
      if (isTranslating) return;
      if (getLang() === 'id') return;
      
      // Debounce: batch mutations (tunggu 100ms sebelum translate)
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        isTranslating = true;
        try {
          mutations.forEach(function (m) {
            m.addedNodes.forEach(function (node) {
              if (node.nodeType === 1) translateElement(node);
            });
          });
        } finally {
          isTranslating = false;
        }
      }, 100);
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.i18nTranslate = function () {
    // Guard: prevent recursive call
    if (isTranslating) return;
    
    translateCache = {};
    if (getLang() === 'id') return;
    
    isTranslating = true;
    try {
      if (document.body) translateElement(document.body);
    } finally {
      isTranslating = false;
    }
  };

  function boot() {
    startObserver();
    setTimeout(function () { window.i18nTranslate(); }, 400);
  }

  // Re-translate saat bahasa berubah
  window.addEventListener('dreamos-lang-changed', function () {
    translateCache = {};
    window.i18nTranslate();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  console.log('🌍 i18n-auto-translate v5 (anti-infinite-loop)');
})();
