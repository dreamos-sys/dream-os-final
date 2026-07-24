const CACHE_NAME = 'dreamos-v2-1784856110.3-offline';
const ASSETS_TO_CACHE = [
  '/dream-os-final/',
  '/dream-os-final/index.html',
  '/dream-os-final/manifest.json',
  '/dream-os-final/assets/logo-sultan.png',
  '/dream-os-final/modules/commandcenter.html',
  '/dream-os-final/modules/profile.html',
  '/dream-os-final/modules/k3.html',
  '/dream-os-final/modules/booking.html',
  '/dream-os-final/modules/maintenance.html',
  '/dream-os-final/modules/asset.html',
  '/dream-os-final/modules/stok.html',
  '/dream-os-final/modules/setting.html',
  '/dream-os-final/modules/about.html',
  '/dream-os-final/modules/qr.html'
];

// Install - cache semua aset penting
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('🟢 Service Worker: Caching aset...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch - cache first, fallback ke network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Offline fallback - tampilkan halaman utama
        if (event.request.mode === 'navigate') {
          return caches.match('/dream-os-final/index.html');
        }
        return new Response('Offline - Data akan disinkronkan saat online.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    })
  );
});

// Activate - hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
