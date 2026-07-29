// 🎨 Dream OS: Global Settings Applier (Dipanggil oleh index.html & modules)
window.applyDreamSettings = function(state) {
  if (!state) return;
  const root = document.documentElement;
  const body = document.body;
  
  // Theme
  root.setAttribute('data-theme', state.theme === 'light' ? 'light' : 'dark');
  body.style.background = state.highContrast ? '#000' : (state.theme === 'light' ? '#f0f4ff' : '#0a0e27');
  
  // Accessibility
  root.setAttribute('data-high-contrast', state.highContrast ? 'true' : 'false');
  root.setAttribute('data-reduce-motion', state.reduceMotion ? 'true' : 'false');
  root.setAttribute('dir', state.lang === 'ar' ? 'rtl' : 'ltr');
  
  // Typography & Glass
  root.style.fontSize = state.fontSize + '%';
  const alpha = (state.glassIntensity / 100).toFixed(2);
  root.style.setProperty('--glass-bg', state.theme === 'light' ? `rgba(240,245,255,${alpha})` : `rgba(15,23,42,${alpha})`);
  
  // Starfield (asumsi ada canvas dengan id 'star-field' di index.html)
  const starCanvas = document.getElementById('star-field');
  if (starCanvas) {
    starCanvas.style.display = state.starfield ? 'block' : 'none';
  }

  console.log('✅ Settings applied globally:', state);
};

// Listener untuk perubahan dari module lain
window.addEventListener('dreamos-settings-changed', (e) => {
  window.applyDreamSettings(e.detail);
});
