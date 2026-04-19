// sw.js — Dream OS v2.1 Service Worker
// Cache Strategy: Cache-First for Assets, Network-First for Data

const CACHE_NAME = 'dreamos-v2.1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/core/router.js',
  '/core/auth.js',
  '/services/ai-agent.js',
  '/modules/home/index.js',
  '/modules/booking/index.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap'
];

// Install: Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Caching assets:', CACHE_NAME);
        return cache.addAll(ASSETS);
      })
      .catch((err) => console.warn('⚠️ Cache failed:', err))
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Cache-First for assets, Network-First for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests → Network-First (fresh data)
  if (url.pathname.startsWith('/api') || url.hostname.includes('openrouter')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets → Cache-First (fast load)
  event.respondWith(
    caches.match(request)
      .then((cached) => cached || 
        fetch(request)
          .then((res) => {
            if (!res || res.status !== 200) return res;
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return res;
          })
          .catch(() => {
            // Fallback to index.html for SPA routing
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          })
      )
  );
});

// Background Sync (for offline form submissions)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-booking') {
    event.waitUntil(
      // Logic to retry pending bookings when online
      console.log('🔄 Background sync: retrying pending bookings...')
    );
  }
});

console.log('🕌 Dream OS Service Worker loaded · Bi idznillah');
