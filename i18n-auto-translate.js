(function () {
  'use strict';
  var translateCache = {};

  function getDict() {
    var lang = window.currentLang || localStorage.getItem('dreamos_lang') || 'id';
    if (lang === 'id') return null;
    if (window.DREAM_I18N && window.DREAM_I18N[lang]) return window.DREAM_I18N[lang];
    return null;
  }

  function translateText(text) {
    if (!text || typeof text !== 'string') return text;
    var trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) return text;
    var lang = window.currentLang || 'id';
    if (lang === 'id') return text;
    var cacheKey = lang + '|' + trimmed;
    if (translateCache[cacheKey] !== undefined) return translateCache[cacheKey];
    var dict = getDict();
    if (!dict) { translateCache[cacheKey] = text; return text; }
    if (dict[trimmed]) { translateCache[cacheKey] = dict[trimmed]; return dict[trimmed]; }
    if (dict._fromId && dict._fromId[trimmed]) {
      translateCache[cacheKey] = dict._fromId[trimmed];
      return dict._fromId[trimmed];
    }
    translateCache[cacheKey] = text;
    return text;
  }

  function translateElement(element) {
    if (!element || element.nodeType !== 1) return;
    var tag = element.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE') return;
    if (element.hasAttribute('data-i18n')) {
      var key = element.getAttribute('data-i18n');
      var dict = getDict();
      if (dict && dict[key]) element.textContent = dict[key];
    }
    for (var i = 0; i < element.childNodes.length; i++) {
      var child = element.childNodes[i];
      if (child.nodeType === 3) {
        var raw = child.textContent, t = raw.trim();
        if (!t) continue;
        var tr = translateText(t);
        if (tr !== t) child.textContent = raw.replace(t, tr);
      } else if (child.nodeType === 1) translateElement(child);
    }
    ['placeholder', 'title', 'aria-label'].forEach(function (attr) {
      if (!element.hasAttribute(attr)) return;
      var v = element.getAttribute(attr);
      var tr = translateText(v);
      if (tr !== v) element.setAttribute(attr, tr);
    });
  }

  var observer = null;
  function startObserver() {
    if (observer) observer.disconnect();
    if (!document.body) return;
    observer = new MutationObserver(function (mutations) {
      if ((window.currentLang || 'id') === 'id') return;
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) translateElement(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.i18nTranslate = function () {
    translateCache = {};
    if ((window.currentLang || 'id') === 'id') return;
    if (document.body) translateElement(document.body);
  };

  window.setLanguage = window.setLanguage || function (lang) {
    window.currentLang = lang || 'id';
    localStorage.setItem('dreamos_lang', window.currentLang);
    document.documentElement.lang = window.currentLang;
    document.documentElement.setAttribute('dir', window.currentLang === 'ar' ? 'rtl' : 'ltr');
    window.i18nTranslate();
  };

  function boot() {
    window.currentLang = localStorage.getItem('dreamos_lang') || window.currentLang || 'id';
    startObserver();
    setTimeout(function () { window.i18nTranslate(); }, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  console.log('🌍 i18n Auto-Translate v2 ready');
})();
