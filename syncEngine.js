/**
 * 🛡️ DREAM OS - ENTERPRISE SYNC ENGINE (Zero-Cost)
 * Fitur: Real-Time Sync, Offline Queue, Presence System
 */

const SyncEngine = {
  channels: {},
  presenceChannel: null,

  subscribe(tableName, onUpdate, onDelete) {
    if (this.channels[tableName]) {
      console.warn(`⚠️ Channel ${tableName} sudah aktif.`);
      return;
    }
    console.log(`🔄 Menghidupkan Real-Time Sync untuk: ${tableName}`);
    const channel = window.supabaseClient
      .channel('public:' + tableName)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: tableName }, 
        (payload) => {
          try {
            if (payload.eventType === 'DELETE' && onDelete) onDelete(payload.old);
            else if (onUpdate) onUpdate(payload.new);
          } catch (error) {
            console.error(`🚨 Error update UI [${tableName}]:`, error);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') console.log(`✅ Real-Time Sync [${tableName}] AKTIF!`);
        else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Gagal sync [${tableName}], retry 5 detik...`);
          this.unsubscribe(tableName);
          setTimeout(() => this.subscribe(tableName, onUpdate, onDelete), 5000);
        }
      });
    this.channels[tableName] = channel;
  },

  unsubscribe(tableName) {
    if (this.channels[tableName]) {
      this.channels[tableName].unsubscribe();
      delete this.channels[tableName];
    }
  },

  unsubscribeAll() {
    Object.keys(this.channels).forEach(t => this.unsubscribe(t));
    if (this.presenceChannel) this.presenceChannel.unsubscribe();
    console.log('🛑 Semua Real-Time Sync dihentikan.');
  }
};

// ========== OFFLINE QUEUE ==========
window.OfflineQueue = {
  queue: JSON.parse(localStorage.getItem('offline_queue') || '[]'),
  
  add(table, action, data) {
    this.queue.push({ table, action, data, timestamp: Date.now(), synced: false });
    localStorage.setItem('offline_queue', JSON.stringify(this.queue));
    this.updateBadge();
  },
  
  async sync() {
    if (!window.supabaseClient) return;
    const unsynced = this.queue.filter(item => !item.synced);
    if (unsynced.length === 0) return;
    
    console.log(`🔄 Menyinkronkan ${unsynced.length} data offline...`);
    for (const item of unsynced) {
      try {
        if (item.action === 'insert') {
          await window.supabaseClient.from(item.table).insert(item.data);
        } else if (item.action === 'update') {
          await window.supabaseClient.from(item.table).update(item.data).eq('id', item.data.id);
        } else if (item.action === 'delete') {
          await window.supabaseClient.from(item.table).delete().eq('id', item.data.id);
        }
        item.synced = true;
        console.log(`✅ Berhasil sync: ${item.table} ${item.action}`);
      } catch(e) {
        console.error(`❌ Gagal sync ${item.table}:`, e.message);
        // Deteksi konflik: cek apakah data server lebih baru
        if (item.data.id) {
          try {
            const { data: serverData } = await window.supabaseClient
              .from(item.table)
              .select('updated_at')
              .eq('id', item.data.id)
              .single();
            if (serverData && new Date(serverData.updated_at) > new Date(item.timestamp)) {
              console.warn('⚠️ Konflik terdeteksi! Data server lebih baru.');
              if (confirm(`⚠️ Data ${item.table} sudah diubah oleh orang lain. Timpa dengan data Anda?`)) {
                item.synced = true; // Anggap selesai meskipun konflik
              }
            }
          } catch(conflictErr) { /* Biarkan tetap unsynced */ }
        }
      }
    }
    this.queue = this.queue.filter(item => !item.synced);
    localStorage.setItem('offline_queue', JSON.stringify(this.queue));
    this.updateBadge();
  },
  
  updateBadge() {
    const count = this.queue.filter(i => !i.synced).length;
    const badge = document.getElementById('offline-badge');
    if (badge) {
      badge.textContent = count > 0 ? count : '';
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }
};

// Auto-sync saat online
window.addEventListener('online', () => {
  console.log('🌐 Koneksi pulih. Menyinkronkan data...');
  OfflineQueue.sync();
});

// ========== PRESENCE SYSTEM ==========
window.Presence = {
  onlineUsers: new Set(),
  
  track(userId) {
    if (!window.supabaseClient) return;
    this.presenceChannel = window.supabaseClient.channel('presence');
    this.presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = this.presenceChannel.presenceState();
        this.onlineUsers = new Set(Object.keys(state));
        const el = document.getElementById('online-count');
        if (el) el.textContent = this.onlineUsers.size;
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.presenceChannel.track({ 
            user_id: userId, 
            online_at: new Date().toISOString() 
          });
          console.log('✅ Presence system aktif');
        }
      });
  }
};

window.SyncEngine = SyncEngine;
console.log('🛡️ Enterprise Sync Engine Siap (Offline Queue + Presence)');
