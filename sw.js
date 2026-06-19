const CACHE_NAME = 'dreamos-v13-cache';
const ASSETS = [
  './',
  './index.html',
  './modules/commandcenter.html',
  './assets/logo-sultan.png',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

// GHOST TRIGGER: Periodic Sync, Background Sync & Push
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'dreamos-sync') event.waitUntil(fetch('./data.json'));
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'dreamos-bg-sync') event.waitUntil(fetch('./sync-data'));
});

self.addEventListener('push', (event) => {
  const options = { body: 'Notifikasi Dream OS Enterprise', icon: './assets/icon-192.png' };
  event.waitUntil(self.registration.showNotification('DreamOS', options));
});
