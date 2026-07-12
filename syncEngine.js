/**
 * 🛡️ DREAM OS - REAL-TIME SYNC ENGINE (Zero-Cost)
 * Prinsip: "Trust the Data (Supabase RLS), Not the Code"
 * @author: Ghost Architect + Karpathy's Wisdom
 */

const SyncEngine = {
  channels: {}, // Menyimpan channel yang aktif

  /**
   * Subscribe ke perubahan di tabel Supabase.
   * @param {string} tableName - Nama tabel (contoh: 'bookings')
   * @param {function} onUpdate - Callback saat ada data baru/berubah
   * @param {function} onDelete - Callback saat data dihapus
   */
  subscribe(tableName, onUpdate, onDelete) {
    // Cegah duplikasi channel
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
          console.log(`📡 [${tableName}] Event: ${payload.eventType}`, payload.new || payload.old);
          
          // ** PRINSIP ZERO BUG & ZERO FRAUD **
          try {
            if (payload.eventType === 'DELETE') {
              if (onDelete) onDelete(payload.old);
            } else {
              // INSERT atau UPDATE
              if (onUpdate) onUpdate(payload.new);
            }
          } catch (error) {
            console.error(`🚨 Error saat update UI [${tableName}]:`, error);
            // Rollback UI? Atau cukup log error-nya saja.
            // Kita tidak rollback otomatis karena data di DB sudah benar.
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Real-Time Sync [${tableName}] AKTIF!`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Gagal sync [${tableName}], mencoba lagi...`);
          // ** ZERO BUG: Auto-recovery **
          this.unsubscribe(tableName);
          setTimeout(() => this.subscribe(tableName, onUpdate, onDelete), 5000);
        }
      });

    this.channels[tableName] = channel;
  },

  /**
   * Berhenti subscribe dari tabel.
   */
  unsubscribe(tableName) {
    if (this.channels[tableName]) {
      this.channels[tableName].unsubscribe();
      delete this.channels[tableName];
      console.log(`🛑 Real-Time Sync [${tableName}] dihentikan.`);
    }
  },

  /**
   * Bersihkan semua channel (misal saat logout).
   */
  unsubscribeAll() {
    Object.keys(this.channels).forEach(table => this.unsubscribe(table));
    console.log('🛑 Semua Real-Time Sync dihentikan.');
  }
};

// Pasang ke global scope
window.SyncEngine = SyncEngine;
console.log('🛡️ Real-Time Sync Engine Siap.');
