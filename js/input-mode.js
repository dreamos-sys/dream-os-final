// js/input-mode.js — Dream OS Adaptive Input Engine (Touch <-> Keyboard)
(function () {
  'use strict';
  var root = document.documentElement;

  function setMode(mode) {
    if (root.getAttribute('data-input') === mode) return;
    root.setAttribute('data-input', mode);
    try { window.safeStorageSet('dreamos_input_mode', mode); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('input-mode-changed', { detail: { mode: mode } })); } catch (e) {}
  }

  function detect() {
    var coarse = false, fine = false;
    try {
      coarse = window.matchMedia('(pointer: coarse)').matches;
      fine = window.matchMedia('(pointer: fine)').matches;
    } catch (e) {}
    if (coarse && !fine) return 'touch';
    if (fine && !coarse) return 'keyboard';
    return ('ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0) ? 'touch' : 'keyboard';
  }

  var saved = null;
  try { saved = localStorage.getItem('dreamos_input_mode'); } catch (e) {}
  setMode(saved === 'touch' || saved === 'keyboard' ? saved : detect());

  // Hybrid: input TERAKHIR yang dipakai menang (pola GOV.UK)
  document.addEventListener('touchstart', function () { setMode('touch'); }, { passive: true });
  document.addEventListener('mousedown', function () { setMode('keyboard'); }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
    setMode('keyboard');
  }, { passive: true });

  // ===== KEYBOARD SHORTCUT ENGINE =====
  var MODULE_KEYS = {
    '1': 'cmd', '2': 'security', '3': 'k3', '4': 'janitor-indoor', '5': 'janitor-outdoor',
    '6': 'booking', '7': 'asset', '8': 'stok', '9': 'maintenance'
  };

  function showHelp() {
    var old = document.getElementById('input-help-overlay');
    if (old) { old.remove(); return; }
    var rows = [
      ['Ctrl+K', 'Command Palette'],
      ['Alt+1 … Alt+9', 'Buka Modul (CMD, Security, K3, …)'],
      ['Alt+H', 'Kembali ke Home'],
      ['← / →', 'Navigasi Slide Dashboard'],
      ['? (Shift+/)', 'Bantuan Shortcut (buka/tutup)'],
      ['Esc', 'Tutup Panel / Palette']
    ];
    var ov = document.createElement('div');
    ov.id = 'input-help-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99998;display:flex;align-items:center;justify-content:center;';
    ov.innerHTML = /* esc() protected */ '<div style="background:#0f172a;border:1px solid #00ff9d;border-radius:16px;padding:1.2rem;max-width:420px;width:92%;color:#e2e8f0;">' +
      '<h3 style="color:#00ff9d;margin:0 0 .8rem;">⌨️ Keyboard Shortcuts</h3>' +
      rows.map(function (r) { return '<div style="display:flex;justify-content:space-between;gap:1rem;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:.8rem;"><code style="color:#00ff9d;">' + r[0] + '</code><span>' + r[1] + '</span></div>'; }).join('') +
      '<button onclick="document.getElementById(\'input-help-overlay\').remove()" style="margin-top:1rem;width:100%;padding:.6rem;background:#0ea5e9;border:none;border-radius:10px;color:#fff;font-weight:700;cursor:pointer;">Tutup</button></div>';
    ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov);
  }

  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    var typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable);

    if (e.key === '?' && !typing) { e.preventDefault(); showHelp(); return; }
    if (e.key === 'Escape') { var ov = document.getElementById('input-help-overlay'); if (ov) ov.remove(); }
    if (typing) return;

    if (e.altKey && MODULE_KEYS[e.key]) {
      e.preventDefault();
      if (window.openMod) window.openMod(MODULE_KEYS[e.key]);
      return;
    }
    if (e.altKey && (e.key === 'h' || e.key === 'H')) { e.preventDefault(); if (window.goHome) window.goHome(); return; }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      var mc = document.getElementById('mod-container');
      var modOpen = mc && mc.style.display !== 'none';
      if (!modOpen && window.__sliderNext && window.__sliderPrev) {
        e.preventDefault();
        if (e.key === 'ArrowRight') window.__sliderNext(); else window.__sliderPrev();
      }
    }
  });

  // Hint kecil saat desktop pertama kali
  setTimeout(function () {
    if (root.getAttribute('data-input') !== 'keyboard') return;
    if (document.getElementById('kb-hint')) return;
    var el = document.createElement('div');
    el.id = 'kb-hint';
    el.style.cssText = 'position:fixed;bottom:85px;left:50%;transform:translateX(-50%);z-index:9000;background:rgba(15,23,42,.92);border:1px solid rgba(0,255,157,.3);color:#94a3b8;font-size:.65rem;padding:.3rem .7rem;border-radius:999px;pointer-events:none;';
    el.textContent = '⌨️ Tekan ? untuk daftar shortcut';
    document.body.appendChild(el);
    setTimeout(function () { if (el && el.remove) el.remove(); }, 6000);
  }, 2500);
})();
