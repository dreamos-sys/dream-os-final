const CACHE_NAME = 'dreamos-v5-perfect-offline';
const urlsToCache = [
  '/',
  '/index.html',
  '/?source=pwa',
  '/manifest.json',
  '/js/auto-sync.js',
  '/js/config-supabase.js',
  '/assets/logo-sultan.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// 1. Install: Simpen semua file penting termasuk start_url
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 2. Activate: Klaim klien segera
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 3. Fetch: Strategi Caching Sempurna
self.addEventListener('fetch', (event) => {
  // Khusus buat navigasi (buka halaman web), langsung kasih index.html kalau offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // Buat file lain (js, css, gambar), pakai strategi Cache First dengan ignoreSearch
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
  );
});
