// 🌉 DREAM OS SUPABASE BRIDGE - HYBRID SOUL ENGINE v2.0
// Centralized cloud sync for all modules - Offline-first, Retry-aware
(function() {
  'use strict';
  
  // Konfigurasi Supabase (Anon Key - aman untuk frontend)
  const CONFIG = {
    URL: "https://gbigjdhifispatrrskgh.supabase.co",
    KEY: "sb_publishable_rgSsdppHSeZ8a0I_NWtqZA_jBz2wWwW",
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000 // 2 detik
  };

  // Queue untuk sync yang gagal (biar retry nanti)
  const syncQueue = [];

  // Fungsi sinkronisasi universal dengan retry logic
  window.syncToSupabase = async function(table, payload, options = {}) {
    const { retries = 0, onError = null } = options;
    
    // Offline-first: simpan ke queue kalau nggak ada internet
    if (!navigator.onLine) {
      console.warn('📴 Offline: Queuing for later sync:', { table, payload });
      syncQueue.push({ table, payload, timestamp: Date.now() });
      if (typeof onError === 'function') onError('offline');
      return false;
    }

    try {
      const response = await fetch(`${CONFIG.URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': CONFIG.KEY,
          'Authorization': `Bearer ${CONFIG.KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok || response.status === 201 || response.status === 204) {
        console.log(`✅ [Bridge] Sync OK: ${table}`, payload.nama_pelapor || payload.judul || payload.nama || 'Item');
        return true;
      } else {
        const errText = await response.text();        console.error(`❌ [Bridge] Sync Failed (${response.status}):`, errText);
        
        // Retry logic untuk error transient (429, 5xx)
        if ([429, 500, 502, 503, 504].includes(response.status) && retries < CONFIG.MAX_RETRIES) {
          console.log(`🔄 Retrying in ${CONFIG.RETRY_DELAY}ms... (${retries + 1}/${CONFIG.MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
          return window.syncToSupabase(table, payload, { retries: retries + 1, onError });
        }
        
        if (typeof onError === 'function') onError('http_error', response.status, errText);
        return false;
      }
    } catch (error) {
      console.error('❌ [Bridge] Network Error:', error.message);
      
      // Retry untuk network errors
      if (retries < CONFIG.MAX_RETRIES) {
        console.log(`🔄 Retrying network error in ${CONFIG.RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
        return window.syncToSupabase(table, payload, { retries: retries + 1, onError });
      }
      
      // Simpan ke queue kalau semua retry gagal
      syncQueue.push({ table, payload, timestamp: Date.now(), error: error.message });
      if (typeof onError === 'function') onError('network_error', error.message);
      return false;
    }
  };

  // Fungsi untuk proses queue sync (panggil saat online terdeteksi)
  window.processSyncQueue = async function() {
    if (!navigator.onLine || syncQueue.length === 0) return;
    
    console.log(`🔄 Processing ${syncQueue.length} queued syncs...`);
    const processed = [];
    
    for (const item of syncQueue) {
      const success = await window.syncToSupabase(item.table, item.payload);
      if (success) processed.push(item);
    }
    
    // Hapus item yang sukses dari queue
    syncQueue.splice(0, processed.length);
    console.log(`✅ Processed ${processed.length}/${syncQueue.length + processed.length} queued syncs`);
  };

  // Auto-process queue ketika online terdeteksi
  window.addEventListener('online', () => {
    console.log('🌐 Online detected. Processing sync queue...');
    window.processSyncQueue();  });

  // Expose queue info untuk debugging
  window.getSyncQueueInfo = function() {
    return {
      queued: syncQueue.length,
      items: syncQueue.map(i => ({ table: i.table, timestamp: new Date(i.timestamp).toLocaleTimeString() }))
    };
  };

  console.log('🌉 Supabase Bridge v2.0 loaded - Hybrid Soul Active');
})();
