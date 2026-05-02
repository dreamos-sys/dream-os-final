// Dream OS Router - Modular & State-Driven
const routes = {
  '#auth': () => import('../modules/auth/login.js').then(m => m.init()),
  '#dashboard': () => import('../modules/dashboard/index.js').then(m => m.init()),
  '#command': () => import('../modules/command/center.js').then(m => m.init()),
  '#qr': () => import('../modules/qr/scanner.js').then(m => m.init()),
  '#settings': () => import('../modules/settings/config.js').then(m => m.init())
};

window.addEventListener('hashchange', () => {
  const hash = window.location.hash || '#auth';
  if (routes[hash]) routes[hash]();
});

// Init pertama
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash || '#auth';
  if (routes[hash]) routes[hash]();
});
