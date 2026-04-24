const CACHE_NAME = 'dreamos-v3.2-nuclear';
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))));
});
self.addEventListener('fetch', (e) => e.respondWith(fetch(e.request)));
