/**
 * Dream OS — WCAG 2.2 contrast audit + auto-adjust ringan
 */
(function (global) {
  'use strict';

  function hexToRgb(hex) {
    hex = String(hex || '').trim().replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length !== 6) return null;
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16)
    };
  }

  function relLum(hex) {
    var rgb = hexToRgb(hex);
    if (!rgb) return 0;
    function chan(c) {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * chan(rgb.r) + 0.7152 * chan(rgb.g) + 0.0722 * chan(rgb.b);
  }

  function contrastRatio(fg, bg) {
    var L1 = relLum(fg), L2 = relLum(bg);
    var hi = Math.max(L1, L2), lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
  }

  /** Pasangan warna default Dream OS */
  function defaultPairs(theme) {
    if (theme === 'light') {
      return [
        { name: 'Body text / light bg', fg: '#1e293b', bg: '#f0f4ff', min: 4.5 },
        { name: 'Primary green / light', fg: '#065f46', bg: '#f0f4ff', min: 4.5 },
        { name: 'Accent / light', fg: '#0369a1', bg: '#f0f4ff', min: 4.5 },
        { name: 'Muted / light', fg: '#475569', bg: '#f0f4ff', min: 4.5 }
      ];
    }
    return [
      { name: 'Body #e2e8f0 / #0a0e27', fg: '#e2e8f0', bg: '#0a0e27', min: 4.5 },
      { name: 'Muted #cbd5e1 / dark', fg: '#cbd5e1', bg: '#0a0e27', min: 4.5 },
      { name: 'Neon #00ff9d / dark', fg: '#00ff9d', bg: '#0a0e27', min: 4.5 },
      { name: 'Accent #0ea5e9 / dark', fg: '#0ea5e9', bg: '#0a0e27', min: 3.0 },
      { name: 'Gold #d97706 / dark', fg: '#d97706', bg: '#0a0e27', min: 3.0 },
      { name: 'Warning #ef4444 / dark', fg: '#ef4444', bg: '#0a0e27', min: 4.5 }
    ];
  }

  function audit(theme) {
    theme = theme || (document.documentElement.getAttribute('data-theme') || 'dark');
    var pairs = defaultPairs(theme);
    var report = pairs.map(function (p) {
      var ratio = contrastRatio(p.fg, p.bg);
      return {
        name: p.name,
        fg: p.fg,
        bg: p.bg,
        ratio: Math.round(ratio * 100) / 100,
        min: p.min,
        passAA: ratio >= p.min,
        passAAA: ratio >= (p.min >= 4.5 ? 7 : 4.5)
      };
    });
    var fail = report.filter(function (r) { return !r.passAA; });
    return { theme: theme, report: report, fail: fail, pass: fail.length === 0 };
  }

  /**
   * Auto-fix:
   * - jika ada yang gagal AA → set data-high-contrast / naikkan --text-muted
   * - hormati preferensi user highContrast di settings
   */
  function autoFix(options) {
    options = options || {};
    var result = audit(options.theme);
    var root = document.documentElement;
    var fixed = [];

    if (!result.pass) {
      // 1) High contrast mode (WCAG path)
      if (options.enableHighContrast !== false) {
        root.setAttribute('data-high-contrast', 'true');
        fixed.push('data-high-contrast=true');
        try {
          var st = JSON.parse(localStorage.getItem('dreamos_settings') || '{}');
          st.highContrast = true;
          localStorage.setItem('dreamos_settings', JSON.stringify(st));
        } catch (e) {}
      }
      // 2) Paksa teks muted lebih terang
      root.style.setProperty('--text-muted', '#e2e8f0');
      root.style.setProperty('--text-body', '#ffffff');
      fixed.push('CSS vars text brighter');
    } else {
      // lulus: jangan paksa high contrast kecuali user sudah set
      try {
        var st2 = JSON.parse(localStorage.getItem('dreamos_settings') || '{}');
        if (!st2.highContrast) root.setAttribute('data-high-contrast', 'false');
      } catch (e) {}
    }

    // prefers-contrast: more dari OS
    try {
      if (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches) {
        root.setAttribute('data-high-contrast', 'true');
        fixed.push('prefers-contrast: more');
      }
    } catch (e) {}

    // prefers-reduced-motion
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        root.setAttribute('data-reduce-motion', 'true');
        fixed.push('prefers-reduced-motion');
        var sf = document.getElementById('star-field');
        if (sf) sf.style.display = 'none';
      }
    } catch (e) {}

    result.autoFixed = fixed;
    result.fixed = fixed.length > 0;
    try { console.table(result.report); } catch (e) {}
    console.log('[WCAG]', result.pass ? 'PASS AA' : 'FAIL → auto-fix', fixed);
    return result;
  }

  function runAndAnnounce(silent) {
    var r = autoFix({});
    if (silent) return r;
    var lines = r.report.map(function (x) {
      return (x.passAA ? '✅' : '❌') + ' ' + x.name + ' ' + x.ratio + ':1 (min ' + x.min + ')';
    });
    var msg = (r.pass ? '✅ WCAG 2.2 AA: semua sampel lulus\n' : '⚠️ WCAG: ada yang gagal — auto-fix diterapkan\n') +
      lines.join('\n');
    if (r.fixed) msg += '\n\nFix: ' + r.autoFixed.join(', ');
    if (typeof alert === 'function' && !silent) alert(msg);
    if (window.announce) try { window.announce(r.pass ? 'Kontras memenuhi AA' : 'Kontras diperbaiki otomatis'); } catch (e) {}
    return r;
  }

  global.auditWCAGContrast = audit;
  global.autoFixWCAG = autoFix;
  global.runWcagAudit = runAndAnnounce;

  function boot() {
    // audit senyap + auto-fix saat load
    setTimeout(function () { autoFix({ enableHighContrast: true }); }, 600);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
