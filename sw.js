const CACHE_NAME = 'dreamos-v4-offline-ready';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/js/auto-sync.js',
  '/js/config-supabase.js',
  '/assets/logo-sultan.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// 1. Install: Paksa simpen file penting ke HP user
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. Activate: Bersihin cache lama biar nggak penuh
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 3. Fetch: Strategi Caching Cerdas (Network First, fallback ke Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
