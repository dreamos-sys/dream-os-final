/**
 * Dream OS Service Worker v2.1.1
 * Strategy: Hybrid (Network-First for HTML, Cache-First for Assets)
 * Features: Offline fallback, cache versioning, background refresh
 * Bi idznillah — Modular, Secure, Blessed
 */

// ===== CONFIGURATION =====
const CACHE_VERSION = 'v2.1.1';
const CACHE_NAME = `dreamos-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Assets to cache on install (critical for offline)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/src/main.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  // CDN assets (with SRI in HTML)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;600&display=swap'
];

// Dynamic cache for API responses (optional)
const DYNAMIC_CACHE = `dreamos-dynamic-${CACHE_VERSION}`;

// ===== INSTALL: Cache Static Assets =====
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing ${CACHE_NAME}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skipping waiting');
        return self.skipWaiting();
      })
      .catch((err) => console.error('[SW] Install failed:', err))
  );
});

// ===== ACTIVATE: Clean Old Caches =====
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating ${CACHE_NAME}`);
  event.waitUntil(    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('dreamos-') && name !== CACHE_NAME)
            .map((oldCache) => {
              console.log(`[SW] Deleting old cache: ${oldCache}`);
              return caches.delete(oldCache);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
      .catch((err) => console.error('[SW] Activate failed:', err))
  );
});

// ===== FETCH: Hybrid Strategy =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension, blob, etc.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // STRATEGY 1: Navigation (HTML pages) → Network-First
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache in background
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache or offline page
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;  }

  // STRATEGY 2: Static Assets (JS, CSS, Images) → Cache-First + Background Refresh
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            // Update cache silently
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
            });
            return response;
          })
          .catch(() => null); // Ignore network errors

        // Return cached if available, else wait for network
        return cached || networkFetch;
      })
    );
    return;
  }

  // STRATEGY 3: API Calls → Network-First with Cache Fallback (optional)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses (with TTL logic if needed)
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached API response
          return caches.match(request);
        })
    );
    return;
  }

  // DEFAULT: Let browser handle
  event.respondWith(fetch(request));
});

// ===== MESSAGE: Skip Waiting on Command =====self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING');
    self.skipWaiting();
  }
});

// ===== BACKGROUND SYNC (Optional Future Feature) =====
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'sync-reports') {
//     event.waitUntil(syncReports());
//   }
// });
