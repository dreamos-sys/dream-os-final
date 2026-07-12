/**
 * 🔄 DREAM OS SYNC MANAGER v2.0
 * Otomatis sinkronisasi LocalStorage ke Supabase
 * Support: Real-time sync, Outbox queue, Manual sync all
 */

const SYNC_CONFIG = {
  'dreamos_users_db': 'users',
  'dreamos_k3_reports': 'k3_reports',
  'dreamos_maintenance_tasks': 'maintenance_tasks',
  'dreamos_bookings': 'bookings',
  'dreamos_dana': 'dana'
};

let syncQueue = [];
let isSyncing = false;

// Fungsi utama sync
async function processSyncQueue() {
  if (isSyncing || syncQueue.length === 0) return;
  if (!window.supabaseClient) return;
  
  isSyncing = true;
  const batch = [...syncQueue];
  syncQueue = [];
  
  console.log(`🔄 Syncing ${batch.length} items to Supabase...`);
  
  for (const item of batch) {
    try {
      const { error } = await window.supabaseClient
        .from(item.table)
        .upsert(item.data, { onConflict: 'id' });
        
      if (error) {
        console.warn(`⚠️ Sync failed for ${item.table}:`, error.message);
      }
    } catch (e) {
      console.error('Sync error:', e);
    }
  }
  
  isSyncing = false;
  console.log('✅ Sync batch complete!');
}

// Hook ke localStorage.setItem
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  originalSetItem.apply(this, arguments);
  
  if (SYNC_CONFIG[key]) {
    try {
      const data = JSON.parse(value);
      if (Array.isArray(data)) {
        const lastItem = data[data.length - 1];
        if (lastItem && lastItem.id) {
          syncQueue.push({
            table: SYNC_CONFIG[key],
            data: {
              id: lastItem.id,
              ...lastItem,
              user_id: (window.SEC && window.SEC.getCurrentUser()) ? window.SEC.getCurrentUser().id : null
            }
          });
          
          clearTimeout(window._syncTimeout);
          window._syncTimeout = setTimeout(processSyncQueue, 2000);
        }
      }
    } catch(e) {}
  }
};

// Fungsi manual sync semua
window.syncAllToCloud = async function() {
  if (!window.supabaseClient) return alert('⚠️ Database belum connect!');
  
  alert('🔄 Memulai sinkronisasi penuh...');
  
  let totalSynced = 0;
  let totalFailed = 0;
  
  for (const [localKey, tableName] of Object.entries(SYNC_CONFIG)) {
    const data = JSON.parse(localStorage.getItem(localKey) || '[]');
    if (data.length > 0) {
      console.log(`☁️ Uploading ${data.length} items to ${tableName}...`);
      const { error } = await window.supabaseClient.from(tableName).upsert(data, { onConflict: 'id' });
      if (error) {
        console.warn(`Failed ${tableName}:`, error.message);
        totalFailed += data.length;
      } else {
        totalSynced += data.length;
      }
    }
  }
  
  alert(`✅ Sinkronisasi selesai!\n\nBerhasil: ${totalSynced} items\nGagal: ${totalFailed} items`);
};

console.log('🔄 Sync Manager v2.0 Active');
