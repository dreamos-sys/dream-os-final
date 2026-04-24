const CACHE_NAME = 'dreamos-v2.1.7-rebel'; // GANTI VERSION TIAP DEPLOY!
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './app.js',
  './neural_core.wasm'
];

// Install: Simpan aset dasar
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Paksa SW baru langsung aktif!
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(STATIC_ASSETS))
  );
});

// Activate: Hancurkan gudang lama (Kaen Nenek)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(
      ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

// Fetch Strategy: NETWORK FIRST (Biar update Sultan langsung muncul)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
