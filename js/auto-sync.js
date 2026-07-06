// ========== AUTO SYNC TO SUPABASE ==========
(function() {
  'use strict';
  
  // Cek config
  if (!window.DREAMOS_CONFIG) {
    console.log('⚠️ Supabase config not found, sync disabled');
    return;
  }
  
  var SUPABASE_URL = window.DREAMOS_CONFIG.supabaseUrl;
  var SUPABASE_KEY = window.DREAMOS_CONFIG.supabaseKey;
  var SYNC_INTERVAL = 30000; // 30 detik
  
  // Data yang perlu disync
  var SYNC_TABLES = [
    'users',
    'dreamos_dana', 
    'dreamos_k3_reports',
    'dreamos_maintenance_tasks',
    'dreamos_bookings',
    'dreamos_stok',
    'dreamos_assets',
    'dreamos_audit_logs'
  ];
  
  // Fungsi sync satu tabel
  async function syncTable(tableName) {
    try {
      var localData = JSON.parse(localStorage.getItem(tableName) || '[]');
      if (!localData.length) return;
      
      // Kirim data ke Supabase
      for (var i = 0; i < localData.length; i++) {
        var item = localData[i];
        
        // Cek apakah sudah ada di Supabase
        var checkUrl = SUPABASE_URL + '/rest/v1/' + tableName + '?id=eq.' + encodeURIComponent(item.id || '');
        var checkRes = await fetch(checkUrl, {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY
          }
        });
        
        var existing = await checkRes.json();
        
        if (existing && existing.length > 0) {
          // Update
          await fetch(SUPABASE_URL + '/rest/v1/' + tableName + '?id=eq.' + encodeURIComponent(item.id || ''), {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': 'Bearer ' + SUPABASE_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(item)
          });
        } else {
          // Insert
          await fetch(SUPABASE_URL + '/rest/v1/' + tableName, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_KEY,
              'Authorization': 'Bearer ' + SUPABASE_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(item)
          });
        }
      }
      
      console.log('✅ Synced: ' + tableName + ' (' + localData.length + ' records)');
    } catch(e) {
      console.error('Sync error (' + tableName + '):', e.message);
    }
  }
  
  // Sync semua tabel
  async function syncAll() {
    if (!navigator.onLine) {
      console.log('📴 Offline - sync skipped');
      return;
    }
    
    console.log('🔄 Syncing to Supabase...');
    
    for (var i = 0; i < SYNC_TABLES.length; i++) {
      await syncTable(SYNC_TABLES[i]);
    }
    
    console.log('✅ Sync complete!');
  }
  
  // Jalankan sync setiap 30 detik
  setInterval(syncAll, SYNC_INTERVAL);
  
  // Sync saat online
  window.addEventListener('online', function() {
    console.log('📡 Online - starting sync...');
    syncAll();
  });
  
  // Sync pertama kali
  setTimeout(syncAll, 5000);
  
  console.log('🔄 Auto-sync activated (every ' + (SYNC_INTERVAL/1000) + 's)');
})();
