/**
 * 🛡️ DREAM OS - WORKFLOW ENGINE (Zero-Cost)
 * Prinsip: "Approval otomatis, Admin tinggal klik, User langsung tau"
 * @author: Ghost Architect
 */

const WorkflowEngine = {
  /**
   * Mengirim notifikasi ke Telegram Admin.
   * (Memanggil fungsi yang sudah ada di worker-config.js)
   */
  notifyAdmin(type, data) {
    if (window.SecurityWorker) {
      window.SecurityWorker.sendAlert(`APPROVAL_REQUEST_${type}`, {
        email: data.email || 'Unknown',
        judul: data.judul || data.nama_peminjam || 'Permintaan Baru',
        nominal: data.nominal || '',
        ruang: data.ruang || '',
        lokasi: data.lokasi || ''
      });
    } else {
      console.warn('⚠️ SecurityWorker belum siap. Notif tidak terkirim.');
    }
  },

  /**
   * Menyetujui permintaan.
   * @param {string} tableName - Nama tabel di Supabase.
   * @param {string} id - ID dari baris yang akan disetujui.
   */
  async approve(tableName, id) {
    console.log(`✅ Menyetujui ${tableName} ID: ${id}`);
    const { data, error } = await window.supabaseClient
      .from(tableName)
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Gagal approve:', error);
      (typeof window.showToast === 'function' ? window.showToast('Gagal menyetujui: ' + error.message, 'warning') : alert('Gagal menyetujui: ' + error.message));
    } else {
      console.log('✅ Berhasil disetujui:', data);
      // Notif ke user akan di-handle oleh Edge Function (opsional) atau cukup lewat UI Sync
    }
  },

  /**
   * Menolak permintaan.
   * @param {string} tableName - Nama tabel di Supabase.
   * @param {string} id - ID dari baris yang akan ditolak.
   */
  async reject(tableName, id) {
    console.log(`❌ Menolak ${tableName} ID: ${id}`);
    const { data, error } = await window.supabaseClient
      .from(tableName)
      .update({ status: 'rejected', rejected_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Gagal reject:', error);
      (typeof window.showToast === 'function' ? window.showToast('Gagal menolak: ' + error.message, 'warning') : alert('Gagal menolak: ' + error.message));
    } else {
      console.log('✅ Berhasil ditolak:', data);
    }
  }
};

// Pasang ke global scope
window.WorkflowEngine = WorkflowEngine;
console.log('🛡️ Workflow Engine Siap.');
