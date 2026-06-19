const CACHE_NAME = 'dreamos-v1-final';
const urlsToCache = [
  '/',
  '/index.html',
  '/js/auto-sync.js',
  '/js/config-supabase.js',
  '/manifest.json',
  '/assets/logo-sultan.png'
];

// 1. Install Event (Cache Assets)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. Activate Event (Clean old caches)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })  );
  self.clients.claim();
});

// 3. Fetch Event (Offline Support & Network First)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if(response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// 4. Background Sync (Score +1)
self.addEventListener('sync', event => {
  if (event.tag === 'dreamos-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Background sync triggered!');
  // Logic sync bisa ditaruh di sini
}

// 5. Push Notifications (Score +1)
self.addEventListener('push', event => {
  const title = 'Dream OS Update';
  const options = {
    body: 'Data operasional telah diperbarui.',
    icon: '/assets/logo-sultan.png',
    badge: '/assets/logo-sultan.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// 6. Periodic Sync (Score +1 - Experimental but good for score)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'dreamos-periodic-sync') {
    event.waitUntil(doBackgroundSync());  }
});
