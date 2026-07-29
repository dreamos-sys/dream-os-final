/* Dream OS Service Worker — cache + web push */
const CACHE_NAME = 'dreamos-v15-cache';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './js/auto-sync.js',
  './js/realtime-booking.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Jangan cache API Supabase / realtime
  if (url.hostname.includes('supabase.co') || url.pathname.includes('/rest/') || url.pathname.includes('/realtime/')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});

/** Web Push payload: { title, body, url, tag } */
self.addEventListener('push', (event) => {
  let data = { title: 'Dream OS', body: 'Notifikasi baru', url: './', tag: 'dreamos' };
  try {
    if (event.data) {
      const j = event.data.json();
      data = Object.assign(data, j);
    }
  } catch (err) {
    try {
      data.body = event.data ? event.data.text() : data.body;
    } catch (e2) {}
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './assets/icon-192.png',
      badge: './assets/icon-192.png',
      tag: data.tag || 'dreamos',
      data: { url: data.url || './' },
      vibrate: [120, 60, 120],
      renotify: true
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes(self.registration.scope) && 'focus' in c) {
          c.navigate(target);
          return c.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'dreamos-sync') {
    event.waitUntil(fetch('./index.html').catch(() => {}));
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'dreamos-bg-sync') {
    event.waitUntil(fetch('./index.html').catch(() => {}));
  }
});
