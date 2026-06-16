const SW_SUPABASE_KEY = 'sb_publishable_rgSsdppHSeZ8a0I_NWtqZA_jBz2wWwW';
const CACHE_NAME = 'dream-os-v1.0';
const ASSETS = [
  './', './index.html', './manifest.json', './assets/logo-sultan.png',
  './js/config-supabase.js', './js/core/supabase-bridge.js', './js/core/dream-lib.js', './js/core/dream-component.js', './css/dream-ui.css',
  './modules/about.html', './modules/core-ai.html', './modules/access-verifier.html', './modules/setting.html', './modules/commandcenter.html', './modules/booking.html', './modules/k3.html', './modules/maintenance.html', './modules/security.html', './modules/stok.html', './modules/profile.html'
];

self.addEventListener('install', e => {
  console.log('[SW] Installing & caching core assets...');
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('[SW] Activating & purging old caches...');
  e.waitUntil(caches.keys().then(keys => 
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // ⚠️ Skip caching Supabase API calls (biar data selalu real-time)
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
