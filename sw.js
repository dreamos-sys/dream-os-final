const CACHE_NAME = 'dreamos-v1.2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/logo-sultan.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/modules/commandcenter.html',
  '/modules/profile.html',
  '/modules/k3.html',
  '/modules/booking.html',
  '/modules/maintenance.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
