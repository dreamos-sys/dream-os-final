(function() {
  'use strict';
  const DB_NAME = 'dreamos_db';
  const DB_VERSION = 1;
  let db = null;
  let ready = false;

  function openDB() {
    return new Promise((resolve, reject) => {
      if (db) return resolve(db);
      if (!window.indexedDB) { console.warn('⚠️ IndexedDB unsupported. Fallback to localStorage.'); return reject('NO_IDB'); }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv');
        if (!d.objectStoreNames.contains('queue')) d.createObjectStore('queue', { keyPath: 'id' });
        if (!d.objectStoreNames.contains('logs')) d.createObjectStore('logs', { keyPath: 'id' });
        if (!d.objectStoreNames.contains('archive')) d.createObjectStore('archive', { keyPath: 'id' });
      };
      req.onsuccess = e => { db = e.target.result; ready = true; resolve(db); };
      req.onerror = e => { console.warn('IDB open error:', e.target.error); reject(e.target.error); };
    });
  }

  function tx(store, mode) {
    return db.transaction(store, mode).objectStore(store);
  }

  window.DreamDB = {
    async init() { try { await openDB(); console.log('✅ DreamDB (IndexedDB) ready'); } catch(e) { console.warn('DreamDB fallback:', e); } },
    async get(store, key) {
      if (!ready) return localStorage.getItem(key);
      return new Promise((res, rej) => {
        const r = tx(store, 'readonly').get(key);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    },
    async set(store, key, val) {
      if (!ready) return localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
      return new Promise((res, rej) => {
        const r = tx(store, 'readwrite').put(val, key);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
      });
    },
    async getAll(store) {
      if (!ready) return [];
      return new Promise((res, rej) => {
        const r = tx(store, 'readonly').getAll();
        r.onsuccess = () => res(r.result || []);
        r.onerror = () => rej(r.error);
      });
    },
    async delete(store, key) {
      if (!ready) return localStorage.removeItem(key);
      return new Promise((res, rej) => {
        const r = tx(store, 'readwrite').delete(key);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
      });
    },
    async clear(store) {
      if (!ready) return;
      return new Promise((res, rej) => {
        const r = tx(store, 'readwrite').clear();
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
      });
    },
    // 🔄 MIGRASI 1X DARI LOCALSTORAGE KE IDB
    async migrate() {
      if (!ready || localStorage.getItem('dreamos_schema_v') >= '1') return;
      console.log('📦 Migrasi data berat ke IndexedDB...');
      const heavyKeys = ['dreamos_piket_logs', 'dreamos_activity_log', 'dreamos_bookings', 'dreamos_k3_reports', 'dreamos_maintenance_tasks', 'dreamos_offline_queue'];
      for (const k of heavyKeys) {
        try {
          const raw = localStorage.getItem(k);
          if (!raw) continue;
          const data = JSON.parse(raw);
          const store = k.includes('queue') ? 'queue' : 'logs';
          if (Array.isArray(data)) {
            for (const item of data) {
              if (item && item.id) await this.set(store, item.id, item);
            }
          } else if (typeof data === 'object') {
            await this.set('kv', k, data);
          }
          localStorage.removeItem(k);
        } catch(e) { console.warn(`Migrasi ${k} gagal:`, e); }
      }
      localStorage.setItem('dreamos_schema_v', '1');
      console.log('✅ Migrasi selesai. Schema v1 aktif.');
    },
    // 🗄️ AUTO-ARCHIVE >90 HARI (ISO 27001 RETENTION)
    async archiveOldLogs(days = 90) {
      if (!ready) return;
      const cutoff = Date.now() - (days * 86400000);
      try {
        const logs = await this.getAll('logs');
        let archived = 0;
        for (const log of logs) {
          const ts = log.created_at || log.timestamp || log.waktu;
          if (ts && new Date(ts).getTime() < cutoff) {
            await this.set('archive', log.id, log);
            await this.delete('logs', log.id);
            archived++;
          }
        }
        if (archived > 0) console.log(`🗄️ ${archived} log diarsipkan (>90 hari).`);
      } catch(e) { console.warn('Archive error:', e); }
    }
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { DreamDB.init().then(() => { DreamDB.migrate(); DreamDB.archiveOldLogs(); }); });
  } else {
    DreamDB.init().then(() => { DreamDB.migrate(); DreamDB.archiveOldLogs(); });
  }
})();
