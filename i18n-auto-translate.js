/**
 * 🌍 i18n AUTO-TRANSLATE ENGINE
 * Menerjemahkan SEMUA teks di halaman secara otomatis
 * Tanpa perlu mengubah satu baris kode pun di modul
 */
(function() {
  'use strict';

  // Cache terjemahan untuk performa
  const translateCache = {};

  function translateText(text) {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed) return text;

    // Cek cache
    if (translateCache[trimmed] !== undefined) {
      return translateCache[trimmed];
    }

    // Cari di DREAM_I18N untuk bahasa saat ini
    const lang = window.currentLang || 'id';
    if (lang === 'id') {
      translateCache[trimmed] = text; // Bahasa default, tidak perlu translate
      return text;
    }

    // Cari key yang nilainya cocok dengan teks
    if (window.DREAM_I18N && window.DREAM_I18N[lang]) {
      const dict = window.DREAM_I18N[lang];
      for (const key in dict) {
        if (dict[key] === trimmed) {
          translateCache[trimmed] = dict[key];
          return dict[key];
        }
      }
    }

    // Tidak ditemukan, kembalikan asli
    translateCache[trimmed] = text;
    return text;
  }

  // Observer untuk mendeteksi perubahan DOM
  const observer = new MutationObserver(function(mutations) {
    if (window.currentLang === 'id') return; // Bahasa default, skip

    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            translateElement(node);
          }
        });
      }
    });
  });

  function translateElement(element) {
    if (!element || element.nodeType !== 1) return;
    
    // Skip script & style
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return;

    // Terjemahkan textContent untuk leaf elements (yang hanya berisi teks)
    if (element.children.length === 0 && element.textContent.trim()) {
      const translated = translateText(element.textContent.trim());
      if (translated !== element.textContent.trim()) {
        element.textContent = translated;
      }
    }

    // Terjemahkan atribut
    if (element.hasAttribute('placeholder')) {
      const translated = translateText(element.getAttribute('placeholder'));
      if (translated !== element.getAttribute('placeholder')) {
        element.setAttribute('placeholder', translated);
      }
    }
    if (element.hasAttribute('title')) {
      const translated = translateText(element.getAttribute('title'));
      if (translated !== element.getAttribute('title')) {
        element.setAttribute('title', translated);
      }
    }

    // Rekursif ke children
    for (let i = 0; i < element.children.length; i++) {
      translateElement(element.children[i]);
    }
  }

  // Mulai observer
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: false,
    attributes: false
  });

  // Terjemahkan seluruh halaman saat init
  if (window.currentLang !== 'id') {
    setTimeout(function() {
      translateElement(document.body);
    }, 500);
  }

  // Export fungsi untuk dipanggil manual
  window.i18nTranslate = function() {
    translateCache.length = 0; // Clear cache
    translateElement(document.body);
  };

  // Dengarkan perubahan bahasa
  window.addEventListener('languagechange', function() {
    translateCache.length = 0;
    translateElement(document.body);
  });

  console.log('🌍 i18n Auto-Translate Engine Ready');
})();
