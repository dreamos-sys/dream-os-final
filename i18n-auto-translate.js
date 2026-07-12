(function() {
  'use strict';
  if (window.currentLang === 'id') return; // Skip untuk bahasa default

  const translateCache = {};

  function translateText(text) {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) return text;
    if (translateCache[trimmed] !== undefined) return translateCache[trimmed];

    const lang = window.currentLang || 'en';
    if (!window.DREAM_I18N || !window.DREAM_I18N[lang]) return text;

    const dict = window.DREAM_I18N[lang];
    for (const key in dict) {
      if (dict[key] === trimmed) {
        translateCache[trimmed] = dict[key];
        return dict[key];
      }
    }
    translateCache[trimmed] = text;
    return text;
  }

  function translateElement(element) {
    if (!element || element.nodeType !== 1) return;
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE' || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') return;

    // Terjemahkan teks di text node
    for (const child of element.childNodes) {
      if (child.nodeType === 3 && child.textContent.trim()) { // Text node
        const translated = translateText(child.textContent.trim());
        if (translated !== child.textContent.trim()) {
          child.textContent = child.textContent.replace(child.textContent.trim(), translated);
        }
      } else if (child.nodeType === 1) {
        translateElement(child);
      }
    }

    // Terjemahkan placeholder
    if (element.hasAttribute('placeholder')) {
      const ph = element.getAttribute('placeholder');
      const translated = translateText(ph);
      if (translated !== ph) element.setAttribute('placeholder', translated);
    }
    if (element.hasAttribute('title')) {
      const t = element.getAttribute('title');
      const translated = translateText(t);
      if (translated !== t) element.setAttribute('title', translated);
    }
  }

  const observer = new MutationObserver(function(mutations) {
    if (window.currentLang === 'id') return;
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) translateElement(node);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.i18nTranslate = function() {
    Object.keys(translateCache).forEach(k => delete translateCache[k]);
    translateElement(document.body);
  };

  // Terjemahkan halaman saat script load
  setTimeout(function() { translateElement(document.body); }, 500);
  console.log('🌍 i18n Auto-Translate Engine Ready');
})();
