/**
 * Dream OS • Main Entry Point (Modular)
 * Bi idznillah — Clean, Scoped, Blessed
 */

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?v=2.1.1')
      .then(reg => console.log('✅ SW registered:', reg.scope))
      .catch(err => console.warn('⚠️ SW registration failed:', err));
  });
}

// ===== UI: Toggle Password Visibility =====
function initPasswordToggle() {
  const input = document.getElementById('password');
  const toggle = document.getElementById('toggle-pw');
  if (!input || !toggle) return;
  
  toggle.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    toggle.querySelector('i').className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
    toggle.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
  });
}

// ===== UI: Login Flow (Demo) =====
function initLogin() {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');
  const loginScreen = document.getElementById('login-screen');
  const dashboard = document.getElementById('dashboard-screen');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pwd = document.getElementById('password').value;
    
    // Demo validation (ganti dengan logic real nanti)
    if (pwd === 'Mr.M_Architect_2025') {
      loginScreen?.classList.remove('active');
      dashboard?.classList.add('active');
      console.log('✅ Login successful');
    } else {
      errorEl.textContent = 'Kode salah. Silakan coba lagi.';
      errorEl.classList.add('show');
      setTimeout(() => errorEl.classList.remove('show'), 3000);      console.warn('⚠️ Login failed');
    }
  });
}

// ===== NAVIGATION: Simple Router =====
function initNav() {
  document.querySelectorAll('.nav-btn[data-route]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const route = btn.dataset.route;
      
      // Update active state
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Simple route handling (extend later with modular loader)
      console.log(`🔀 Navigating to: ${route}`);
      // Example: loadModule(route.replace('#', ''));
    });
  });
}

// ===== THEME TOGGLE (Light/Dark) =====
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  
  const saved = localStorage.getItem('dreamos_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
  
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dreamos_theme', next);
    updateThemeIcon(next);
  });
  
  function updateThemeIcon(theme) {
    const icon = btn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
}

// ===== INIT ALL =====
function initApp() {
  console.log('🕌 Dream OS v2.1.1 — Initializing...');  initPasswordToggle();
  initLogin();
  initNav();
  initThemeToggle();
  console.log('✅ App ready • Bi idznillah');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
