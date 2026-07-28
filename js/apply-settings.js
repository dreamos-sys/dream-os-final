/**
 * Dream OS — apply settings ke app shell (index)
 * Dipanggil saat boot, storage event, postMessage dari modules/setting.html
 */
(function (global) {
  'use strict';

  function loadState() {
    try {
      return Object.assign({
        theme: 'dark',
        fontSize: 100,
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
        starfield: true,
        glassIntensity: 70,
        lang: 'id',
        autoDetect: false,
        devMode: false,
        autoSave: true,
        cacheBust: false
      }, JSON.parse(localStorage.getItem('dreamos_settings') || '{}'));
    } catch (e) {
      return { theme: 'dark', fontSize: 100, starfield: true, lang: 'id' };
    }
  }

  function applyDreamSettings(state) {
    state = state || loadState();
    var root = document.documentElement;
    var body = document.body;
    if (!root || !body) return state;

    root.setAttribute('data-theme', state.theme === 'light' ? 'light' : 'dark');
    root.setAttribute('data-high-contrast', state.highContrast ? 'true' : 'false');
    root.setAttribute('data-reduce-motion', state.reduceMotion ? 'true' : 'false');
    root.setAttribute('dir', state.lang === 'ar' ? 'rtl' : 'ltr');
    root.lang = state.lang || 'id';

    if (state.fontSize) root.style.fontSize = Number(state.fontSize) + '%';

    var alpha = Math.min(0.95, Math.max(0.3, (Number(state.glassIntensity) || 70) / 100));
    root.style.setProperty('--glass-bg',
      state.theme === 'light'
        ? 'rgba(240,245,255,' + alpha + ')'
        : 'rgba(15,23,42,' + alpha + ')'
    );

    var sf = document.getElementById('star-field');
    if (sf) {
      var preferReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      sf.style.display = (state.starfield === false || state.reduceMotion || preferReduce) ? 'none' : 'block';
    }

    if (state.screenReader) {
      root.setAttribute('aria-live', 'polite');
    } else {
      root.removeAttribute('aria-live');
    }

    localStorage.setItem('dreamos_lang', state.lang || 'id');
    global.currentLang = state.lang || 'id';

    if (typeof global.setLanguage === 'function') {
      try { global.setLanguage(state.lang || 'id'); } catch (e) {}
    }
    if (typeof global.i18nTranslate === 'function' && state.lang !== 'id') {
      try { global.i18nTranslate(); } catch (e) {}
    }

    return state;
  }

  /** Force cache — HANYA untuk role dev */
  async function forceCacheBustDevOnly() {
    var user = {};
    try { user = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}'); } catch (e) {}
    var role = String(user.role || '').toLowerCase();
    if (role !== 'dev' && role !== 'admin') {
      throw new Error('Force cache hanya untuk Developer');
    }
    if ('caches' in global) {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    }
    if ('serviceWorker' in navigator) {
      var regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(function (r) { return r.update(); }));
      // kirim skip waiting jika ada waiting worker
      regs.forEach(function (r) {
        if (r.waiting) r.waiting.postMessage({ type: 'SKIP_WAITING' });
      });
    }
    localStorage.setItem('dreamos_cache_bust_at', new Date().toISOString());
    return true;
  }

  /**
   * WCAG 2.2 — cek kontras relatif kasar (sRGB)
   * target AA normal text 4.5:1, large 3:1
   */
  function relativeLuminance(hex) {
    hex = String(hex || '').replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length !== 6) return 0;
    var rgb = [0, 2, 4].map(function (i) {
      var v = parseInt(hex.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }
  function contrastRatio(fg, bg) {
    var L1 = relativeLuminance(fg);
    var L2 = relativeLuminance(bg);
    var hi = Math.max(L1, L2);
    var lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function auditWCAGContrast() {
    var pairs = [
      { name: 'neon on dark', fg: '#00ff9d', bg: '#0a0e27', min: 4.5 },
      { name: 'body text on dark', fg: '#e2e8f0', bg: '#0a0e27', min: 4.5 },
      { name: 'muted on dark', fg: '#cbd5e1', bg: '#0a0e27', min: 4.5 },
      { name: 'gold badge', fg: '#d97706', bg: '#0a0e27', min: 3 },
      { name: 'light theme text', fg: '#1e293b', bg: '#f0f4ff', min: 4.5 },
      { name: 'light neon', fg: '#065f46', bg: '#f0f4ff', min: 4.5 }
    ];
    var report = pairs.map(function (p) {
      var ratio = contrastRatio(p.fg, p.bg);
      return {
        name: p.name,
        ratio: Math.round(ratio * 100) / 100,
        passAA: ratio >= p.min,
        min: p.min
      };
    });
    var fail = report.filter(function (r) { return !r.passAA; });
    console.table(report);
    return { report: report, pass: fail.length === 0, fail: fail };
  }

  async function pushSettingsToCloud(state) {
    if (!global.supabaseClient) return;
    var user = {};
    try { user = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}'); } catch (e) {}
    if (!user.email) return;
    try {
      await global.supabaseClient.from('users').update({
        settings: state,
        settings_updated_at: new Date().toISOString()
      }).eq('email', user.email);
    } catch (e) {
      console.warn('[settings] cloud', e);
    }
  }

  async function pullSettingsFromCloud() {
    if (!global.supabaseClient) return null;
    var user = {};
    try { user = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}'); } catch (e) {}
    if (!user.email) return null;
    try {
      var res = await global.supabaseClient.from('users').select('settings').eq('email', user.email).maybeSingle();
      if (res.error || !res.data || !res.data.settings) return null;
      var merged = Object.assign(loadState(), res.data.settings);
      localStorage.setItem('dreamos_settings', JSON.stringify(merged));
      applyDreamSettings(merged);
      return merged;
    } catch (e) {
      return null;
    }
  }

  global.applyDreamSettings = applyDreamSettings;
  global.forceCacheBustDevOnly = forceCacheBustDevOnly;
  global.auditWCAGContrast = auditWCAGContrast;
  global.pushSettingsToCloud = pushSettingsToCloud;
  global.pullSettingsFromCloud = pullSettingsFromCloud;
  global.loadDreamSettings = loadState;

  global.addEventListener('storage', function (e) {
    if (e.key === 'dreamos_settings') applyDreamSettings();
  });
  global.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'DREAMOS_SETTINGS') {
      applyDreamSettings(e.data.payload);
    }
  });
  global.addEventListener('dreamos-settings-changed', function (e) {
    applyDreamSettings(e.detail);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyDreamSettings(); });
  } else {
    applyDreamSettings();
  }
})(window);
