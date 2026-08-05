// ===== PUSH ADMIN PANEL: Trigger push notification ke user =====

window.PushAdmin = {
  // Kirim push ke semua user
  async broadcast(title, body, url = './index.html') {
    return this.sendPush({ title, body, url, target: 'all' });
  },

  // Kirim push ke role tertentu
  async sendToRole(role, title, body, url = './index.html') {
    return this.sendPush({ title, body, url, target: 'role', role });
  },

  // Kirim push ke user tertentu
  async sendToUser(userId, title, body, url = './index.html') {
    return this.sendPush({ title, body, url, target: 'user', userId });
  },

  // Core function: panggil Edge Function
  async sendPush(payload) {
    try {
      if (!window.supabaseClient) throw new Error('Supabase not ready');

      const { data, error } = await window.supabaseClient.functions.invoke('send-push', {
        body: payload
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      console.log('[PushAdmin] Sent:', data);
      if (window.showToast) {
        const count = data.count || 0;
        showToast(`✅ Push terkirim ke ${count} user`, 'success');
      }
      return data;
    } catch (err) {
      console.error('[PushAdmin] Failed:', err);
      if (window.showToast) showToast('❌ Gagal kirim: ' + err.message, 'error');
      throw err;
    }
  },

  // Quick actions untuk use cases umum
  async notifyBooking(booking) {
    const title = '📅 Booking Baru';
    const body = `${booking.nama_peminjam} - ${booking.ruang} (${booking.jam_mulai}-${booking.jam_selesai})`;
    return this.sendToRole('kabag_umum', title, body, './index.html#booking');
  },

  async notifyK3(report) {
    const title = '⚠️ Laporan K3';
    const body = `${report.kategori} di ${report.lokasi}`;
    return this.sendToRole('security', title, body, './index.html#k3');
  },

  async notifyShift(security, shift) {
    const title = '🛡️ Reminder Shift';
    const body = `Shift ${shift} dimulai dalam 15 menit`;
    return this.sendToUser(security.id, title, body, './index.html#security');
  }
};

console.log('[PushAdmin] Loaded');
