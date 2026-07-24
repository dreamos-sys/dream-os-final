/* 🌐 DREAM OS SERVICE WORKER v2.0
   Strategy: Network-First (API/Data) + Stale-While-Revalidate (Static)
   Compliance: WCAG Offline Graceful, ISO 27001 Data Freshness, PWA Best Practice */
'use strict';

const STATIC_CACHE  = 'dreamos-static-v2';
const DYNAMIC_CACHE = 'dreamos-dynamic-v2';
const BASE_PATH = '/dream-os-final/';

// Aset kritis untuk precache (install phase)
const PRECACHE_ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'assets/icon-192.png'
];

// ===== INSTALL: Precache & Skip Waiting =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting(); // Aktifkan SW baru tanpa menunggu tab ditutup
});

// ===== ACTIVATE: Clean Old Caches & Claim Clients =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim(); // Ambil alih semua tab langsung
});

// ===== FETCH: Intelligent Routing =====
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, chrome-extension, devtools, blob/data
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // 1️⃣ API / Data / Supabase / Weather / Prayer → Network-First (fresh data priority)
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('aladhan.com') ||
    url.pathname.includes('/rest/v1/') ||
    url.pathname.includes('/auth/v1/')
  ) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE, 4000));
    return;
  }

  // 2️⃣ Static Assets & Modules → Stale-While-Revalidate (instant load, background update)
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.includes('/modules/') ||
    url.pathname.includes('/uat-pack/')
  ) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // 3️⃣ Navigation / HTML → Network-First with Offline Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, STATIC_CACHE, 6000).catch(() => offlineFallback())
    );
    return;
  }

  // Default: Network-First
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// ===== STRATEGY: Network-First with Timeout =====
async function networkFirst(request, cacheName, timeout = 5000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    
    const networkResponse = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    return cached || new Response('⚠️ Offline atau timeout. Data cache tidak tersedia.', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// ===== STRATEGY: Stale-While-Revalidate =====
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) cache.put(request, networkResponse.clone());
    return networkResponse;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// ===== OFFLINE FALLBACK (Inline, No Extra File) =====
function offlineFallback() {
  return new Response(`
    <!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Dream OS • Offline</title>
    <style>body{background:#0a0e27;color:#e2e8f0;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:1rem;}
    .box{background:rgba(15,23,42,0.8);border:1px solid rgba(0,255,157,0.2);border-radius:16px;padding:2rem;max-width:400px;}
    h2{color:#00ff9d;margin:0 0 0.5rem;} p{color:#94a3b8;font-size:0.9rem;} button{margin-top:1rem;padding:0.6rem 1.2rem;background:#0ea5e9;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700;}</style>
    </head><body><div class="box"><h2>📡 Dream OS Offline</h2><p>Koneksi terputus. Data tersimpan aman di perangkat & akan tersync otomatis saat online.</p><button onclick="location.reload()">🔄 Coba Lagi</button></div></body></html>
  `, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// ===== DEBUG LOGGING (Non-Production Safe) =====
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
    self.clients.matchAll().then(clients => clients.forEach(c => c.navigate(c.url)));
  }
});
