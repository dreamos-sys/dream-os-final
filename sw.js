const CACHE_NAME = 'dreamos-v1';
const urlsToCache = [
  '/dream-os-final/',
  '/dream-os-final/index.html',
  '/dream-os-final/assets/logo-sultan.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
