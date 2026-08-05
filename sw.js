// ============================================================
// 🏠 DREAM OS — SERVICE WORKER v2.0 (Production-Grade PWA)
// Strategy: Hybrid (Cache-First + Stale-While-Revalidate + Network-Only)
// ============================================================

const SW_VERSION = 'dreamos-sw-v2.0.0';
const CACHE_APP_SHELL = 'dreamos-shell-v2.0.0';
const CACHE_MODULES = 'dreamos-modules-v2.0.0';
const CACHE_ASSETS = 'dreamos-assets-v2.0.0';
const CACHE_CDN = 'dreamos-cdn-v2.0.0';
const OFFLINE_URL = '/dream-os-final/offline.html';

// App Shell: core files yang HARUS offline (cache-first)
const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './css/dashboard.css'
];

// Modules: semua modul (stale-while-revalidate)
const MODULES = [
  './modules/booking.html',
  './modules/qr.html',
  './modules/setting.html',
  './modules/profile.html',
  './modules/about.html',
  './modules/maintenance.html',
  './modules/security.html',
  './modules/asset.html',
  './modules/stok.html',
  './modules/dana.html',
  './modules/k3.html',
  './modules/janitor-indoor.html',
  './modules/janitor-outdoor.html'
];

// Static assets (cache-first, immutable)
const ASSETS = [
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/logo-sultan.png'
];

// CDN dependencies (cache-first dengan expiry)
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js',
  'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js'
];

// ============================================================
// INSTALL: Precache semua asset critical
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing ' + SW_VERSION);
  
  event.waitUntil(
    Promise.all([
      // 1. Cache app shell
      caches.open(CACHE_APP_SHELL).then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(APP_SHELL).catch((err) => {
          console.warn('[SW] App shell cache partial:', err);
        });
      }),
      
      // 2. Cache modules (best-effort, skip yang 404)
      caches.open(CACHE_MODULES).then((cache) => {
        console.log('[SW] Caching modules');
        return Promise.all(
          MODULES.map((url) =>
            cache.add(url).catch((err) => {
              console.warn('[SW] Skip cache:', url, err.message);
            })
          )
        );
      }),
      
      // 3. Cache static assets
      caches.open(CACHE_ASSETS).then((cache) => {
        console.log('[SW] Caching assets');
        return Promise.all(
          ASSETS.map((url) =>
            cache.add(url).catch(() => {})
          )
        );
      })
    ]).then(() => self.skipWaiting())
  );
});

// ============================================================
// ACTIVATE: Cleanup cache lama + claim clients
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating ' + SW_VERSION);
  
  const currentCaches = [CACHE_APP_SHELL, CACHE_MODULES, CACHE_ASSETS, CACHE_CDN];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// ============================================================
// FETCH: Hybrid strategy based on request type
// ============================================================
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // 1. SKIP: Non-GET requests (POST/PUT/DELETE ke Supabase)
  if (request.method !== 'GET') {
    return;
  }
  
  // 2. SKIP: Supabase API (real-time data, harus fresh)
  if (url.hostname.includes('supabase.co') || 
      url.pathname.includes('/rest/v1/') ||
      url.pathname.includes('/auth/v1/') ||
      url.pathname.includes('/realtime/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Offline saat akses API — return empty response
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }
  
  // 3. SKIP: External API (Open-Meteo, Aladhan, QR server)
  if (url.hostname.includes('open-meteo.com') || 
      url.hostname.includes('aladhan.com') ||
      url.hostname.includes('qrserver.com') ||
      url.hostname.includes('quickchart.io')) {
    event.respondWith(
      fetch(request).catch(() => new Response('', { status: 503 }))
    );
    return;
  }
  
  // 4. NAVIGATION: Network-first dengan fallback ke cache/offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache dengan versi fresh
          const copy = response.clone();
          caches.open(CACHE_APP_SHELL).then((cache) => {
            cache.put(request, copy);
          });
          return response;
        })
        .catch(() => {
          // Offline: coba cache, fallback ke offline.html
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }
  
  // 5. CDN ASSETS: Cache-first dengan network fallback
  if (url.hostname.includes('jsdelivr.net') || 
      url.hostname.includes('cdnjs.cloudflare.com') ||
      url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_CDN).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() => new Response('', { status: 503 }));
      })
    );
    return;
  }
  
  // 6. MODULES (HTML): Stale-while-revalidate (cepat + update di background)
  if (request.url.includes('/modules/') && request.url.endsWith('.html')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        // Return cached dulu, update di background
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_MODULES).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() => cached);
        
        return cached || fetchPromise;
      })
    );
    return;
  }
  
  // 7. STATIC ASSETS (images, CSS, JS lokal): Cache-first
  if (request.url.includes('/assets/') || 
      request.url.includes('/css/') ||
      request.url.includes('/js/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_ASSETS).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() => new Response('', { status: 404 }));
      })
    );
    return;
  }
  
  // 8. DEFAULT: Network dengan cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// ============================================================
// PUSH NOTIFICATION: Web Push API
// ============================================================
self.addEventListener('push', (event) => {
  let data = { 
    title: 'Dream OS', 
    body: 'Notifikasi baru', 
    url: './index.html', 
    tag: 'dreamos',
    icon: './assets/icon-192.png'
  };
  
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
      icon: data.icon,
      badge: './assets/icon-192.png',
      tag: data.tag || 'dreamos',
      data: { url: data.url || './index.html' },
      vibrate: [120, 60, 120],
      renotify: true,
      requireInteraction: false
    })
  );
});

// ============================================================
// NOTIFICATION CLICK: Focus/open window
// ============================================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './index.html';
  
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

// ============================================================
// BACKGROUND SYNC: Queue offline actions (booking, K3, dll)
// ============================================================
self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);
  
  if (event.tag === 'dreamos-bg-sync') {
    event.waitUntil(
      // Fetch index untuk trigger refresh data
      fetch('./index.html', { cache: 'no-cache' }).catch(() => {})
    );
  }
  
  if (event.tag === 'dreamos-booking-sync') {
    event.waitUntil(syncOfflineBookings());
  }
  
  if (event.tag === 'dreamos-k3-sync') {
    event.waitUntil(syncOfflineK3());
  }
});

// Sync offline bookings ke Supabase
async function syncOfflineBookings() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({ type: 'SYNC_BOOKINGS' });
    });
  } catch (err) {
    console.warn('[SW] Booking sync failed:', err);
  }
}

// Sync offline K3 reports
async function syncOfflineK3() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({ type: 'SYNC_K3' });
    });
  } catch (err) {
    console.warn('[SW] K3 sync failed:', err);
  }
}

// ============================================================
// PERIODIC SYNC: Refresh data saat app di-background
// ============================================================
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'dreamos-periodic') {
    event.waitUntil(
      fetch('./index.html', { cache: 'no-cache' }).catch(() => {})
    );
  }
});

// ============================================================
// MESSAGE: Communication dengan client
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_MODULES).then((cache) => {
        return Promise.all(
          urls.map((url) => cache.add(url).catch(() => {}))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      }).then(() => {
        event.source.postMessage({ type: 'CACHE_CLEARED' });
      })
    );
  }
});

console.log('[SW] ' + SW_VERSION + ' loaded');
