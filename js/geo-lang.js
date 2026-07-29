(function (g) {
  'use strict';
  var CACHE_KEY = 'dreamos_geo_lang_cache';
  var CACHE_TTL_MS = 6 * 60 * 60 * 1000;
  function settings() { try { return JSON.parse(localStorage.getItem('dreamos_settings') || '{}'); } catch (e) { return {}; } }
  function isLocked() { return localStorage.getItem('dreamos_lang_locked') === '1'; }
  function readCache() {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (!c || !c.lang || !c.at) return null;
      if (Date.now() - c.at > CACHE_TTL_MS) return null;
      return c.lang;
    } catch (e) { return null; }
  }
  function writeCache(lang) { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ lang: lang, at: Date.now() })); } catch (e) {} }
  function langFromCoords(lat, lng) {
    if (lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141) return 'id';
    if (lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135) return 'zh';
    if (lat >= 12 && lat <= 38 && lng >= 25 && lng <= 60) return 'ar';
    return 'en';
  }
  function langFromTimezone() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (/Jakarta|Makassar|Jayapura|Pontianak/i.test(tz)) return 'id';
      if (/Riyadh|Dubai|Qatar|Kuwait|Cairo|Beirut|Baghdad/i.test(tz)) return 'ar';
      if (/Shanghai|Chongqing|Hong_Kong|Taipei|Urumqi/i.test(tz)) return 'zh';
      if (/New_York|London|Chicago|Europe\//i.test(tz)) return 'en';
    } catch (e) {}
    return null;
  }
  function langFromBrowser() {
    try {
      var c = (navigator.language || 'id').toLowerCase().split('-')[0];
      if (['id', 'en', 'ar', 'zh'].indexOf(c) >= 0) return c;
      if (c === 'ms') return 'id';
    } catch (e) {}
    return 'id';
  }
  function getPosition(timeoutMs) {
    timeoutMs = timeoutMs || 8000;
    return new Promise(function (resolve, reject) {
      if (!navigator.geolocation) { reject(new Error('Geolocation unsupported')); return; }
      var done = false;
      var timer = setTimeout(function () { if (done) return; done = true; reject(new Error('Geolocation timeout')); }, timeoutMs);
      navigator.geolocation.getCurrentPosition(
        function (pos) { if (done) return; done = true; clearTimeout(timer); resolve(pos); },
        function (err) { if (done) return; done = true; clearTimeout(timer); reject(err); },
        { enableHighAccuracy: false, maximumAge: 600000, timeout: timeoutMs }
      );
    });
  }
  async function resolveLangHint() {
    var st = settings();
    if (st.autoDetect === false || isLocked()) return localStorage.getItem('dreamos_lang') || 'id';
    if (st.geoLang !== true) return langFromTimezone() || langFromBrowser() || 'id';
    var cached = readCache();
    if (cached) return cached;
    try {
      var pos = await getPosition(8000);
      var lang = langFromCoords(pos.coords.latitude, pos.coords.longitude);
      writeCache(lang);
      return lang;
    } catch (e) {
      console.warn('[GeoLang] GPS fallback:', e.message || e);
      return langFromTimezone() || langFromBrowser() || 'id';
    }
  }
  async function applyGeoLangHint() {
    var st = settings();
    if (st.autoDetect === false || isLocked()) return null;
    var lang = await resolveLangHint();
    if (lang && typeof g.setLanguage === 'function') g.setLanguage(lang, { fromUser: false, silent: true });
    return lang;
  }
  g.DreamGeoLang = { resolveLangHint: resolveLangHint, applyGeoLangHint: applyGeoLangHint, getPosition: getPosition, langFromCoords: langFromCoords };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(function () { applyGeoLangHint(); }, 800); });
  } else {
    setTimeout(function () { applyGeoLangHint(); }, 800);
  }
})(window);
