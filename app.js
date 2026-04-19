// app.js — Dream OS v2.1 Main Entry Point
// Zero Build Step • Vanilla JS • PWA Ready

import { router } from './core/router.js';
import { auth } from './core/auth.js';

// ===== MODULE IMPORTS (Lazy Load) =====
const initHome = () => import('./modules/home/index.js').then(m => m.default());
const initBooking = () => import('./modules/booking/index.js').then(m => m.default());
const initK3 = () => import('./modules/k3/index.js').then(m => m.default());
const initSecurity = () => import('./modules/security/index.js').then(m => m.default());
const initJanitorIn = () => import('./modules/janitor-in/index.js').then(m => m.default());
const initJanitorOut = () => import('./modules/janitor-out/index.js').then(m => m.default());
const initStok = () => import('./modules/stok/index.js').then(m => m.default());
const initMaintenance = () => import('./modules/maintenance/index.js').then(m => m.default());
const initAsset = () => import('./modules/asset/index.js').then(m => m.default());
const initProfile = () => import('./modules/profile/index.js').then(m => m.default());
const initAbout = () => import('./modules/about/index.js').then(m => m.default());
const initSetting = () => import('./modules/setting/index.js').then(m => m.default());
const initQR = () => import('./modules/qr/index.js').then(m => m.default());
const initCommand = () => import('./modules/command/index.js').then(m => m.default());

// ===== REGISTER ROUTES =====
router.register('#home', initHome);
router.register('#booking', initBooking);
router.register('#k3', initK3);
router.register('#security', initSecurity);
router.register('#janitor-in', initJanitorIn);
router.register('#janitor-out', initJanitorOut);
router.register('#stok', initStok);
router.register('#maintenance', initMaintenance);
router.register('#asset', initAsset);
router.register('#profile', initProfile);
router.register('#about', initAbout);
router.register('#setting', initSetting);
router.register('#qr', initQR);
router.register('#command', initCommand);

// ===== AUTH FLOW =====
function initAuth() {
  const loginScreen = document.getElementById('login-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');
  const loginForm = document.getElementById('login-form');
  const togglePw = document.getElementById('toggle-pw');
  const errorMsg = document.getElementById('login-error');
  const attemptsEl = document.getElementById('attempts');

  // Toggle password visibility
  if (togglePw) {
    togglePw.addEventListener('click', () => {      const pwd = document.getElementById('password');
      const icon = togglePw.querySelector('i');
      if (pwd.type === 'password') {
        pwd.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        pwd.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  }

  // Login handler
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pwd = document.getElementById('password').value;
      const attempts = auth.getAttempts();

      if (attempts <= 0) {
        errorMsg.textContent = '🔒 Akses dikunci. Refresh untuk coba lagi.';
        errorMsg.classList.add('show');
        return;
      }

      const success = await auth.login(pwd);
      
      if (success) {
        // Login berhasil → switch screen
        loginScreen?.classList.remove('active');
        dashboardScreen?.classList.add('active');
        window.location.hash = '#home';
      } else {
        // Login gagal → tampilkan error
        const remaining = auth.getAttempts();
        errorMsg.innerHTML = `Kode salah. Sisa percobaan: <span id="attempts">${remaining}</span>`;
        errorMsg.classList.add('show');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
      }
    });
  }

  // Check session on load
  if (auth.isLoggedIn()) {
    loginScreen?.classList.remove('active');
    dashboardScreen?.classList.add('active');
    if (!window.location.hash) window.location.hash = '#home';
  }
}
// ===== PWA SERVICE WORKER =====
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('✅ SW registered:', reg.scope))
        .catch(err => console.warn('⚠️ SW failed:', err));
    });
  }
}

// ===== APP INIT =====
function init() {
  // 1. Auth first
  initAuth();
  
  // 2. PWA support
  initPWA();
  
  // 3. Start router (will handle initial hash)
  // Router already auto-starts via constructor
  
  // 4. Global error handler (graceful fallback)
  window.addEventListener('error', (e) => {
    console.error('Global error:', e);
    // Don't crash the whole app — just log
  });
  
  // 5. Online/offline indicator (optional UX)
  window.addEventListener('online', () => console.log('🟢 Online'));
  window.addEventListener('offline', () => console.log('🔴 Offline'));
  
  console.log('🕌 Dream OS v2.1 initialized · Bi idznillah');
}

// Start everything when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
