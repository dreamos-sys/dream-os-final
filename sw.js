// Dream OS SW v4-20260816 — self-cleaning, bounded cache
const CACHE_VERSION = 'v81-gohome-blur';
const CACHE_NAME = 'dreamos-' + CACHE_VERSION;
const CORE = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Jangan tangani: cross-origin (CDN/Supabase) atau query versioned (?v=)
  if (url.hostname !== location.hostname) return;
  if (url.search.includes('v=')) return; // biar network yang urus, JANGAN cache

  if (e.request.destination === 'document') {
    // network-first untuk dokumen (selalu fresh, fallback cache saat offline)
    e.respondWith(
      fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE_NAME).then(cc => cc.put(e.request, c)); return r; })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  // aset statis: stale-while-revalidate (terbatas karena versioned cache)
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(cc => cc.put(e.request, c)); } return r; }).catch(() => cached);
      return cached || net;
    })
  );
});
