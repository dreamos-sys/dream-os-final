// Dream OS Service Worker - Auto cache-busting
// Generated: 2026-08-07 15:50:10
// Version: 6c594c1b

const CACHE_VERSION = 'v7-homefix-1786159015';
const CACHE_NAME = `dreamos-cache-${CACHE_VERSION}`;

// Files yang HARUS selalu fresh (no cache)
const NO_CACHE_PATTERNS = [
  /modules\/commandcenter\.html/,
  /modules\/security\.html/,
  /modules\/.*\.html$/,
  /sw\.js$/,
  /manifest\.json$/
];

// Assets untuk cache (CSS, images, fonts)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json'
];

// ===== INSTALL: precache minimal =====
self.addEventListener('install', event => {
  console.log('[SW 6c594c1b] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE: cleanup cache lama =====
self.addEventListener('activate', event => {
  console.log('[SW 6c594c1b] Activating, cleaning old caches...');
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ===== FETCH: Network-first untuk module, cache-first untuk assets =====
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const path = url.pathname;
  
  // Cek apakah harus NO-CACHE
  const shouldBust = NO_CACHE_PATTERNS.some(pattern => pattern.test(path));
  
  if (shouldBust) {
    // NETWORK-FIRST + no-cache headers
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).catch(() => {
        // Offline fallback ke cache
        return caches.match(event.request);
      })
    );
  } else if (event.request.destination === 'document') {
    // HTML pages: network-first dengan fallback
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Assets (CSS, JS, images): cache-first
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
  }
});

// ===== MESSAGE: force update dari client =====
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME);
    console.log('[SW] Cache cleared');
  }
});

console.log('[SW 6c594c1b] Ready - cache busting aktif untuk modules/');
