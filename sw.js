// Dream OS SW v4-20260816 — self-cleaning, bounded cache
const CACHE_VERSION = 'v124-fix-supabase-doctrine';
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
    // stale-while-revalidate: tampilkan cache dulu, update di belakang (hemat data)
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
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
