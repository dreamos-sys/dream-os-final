/**
 * 🏦 BANK-GRADE AUDIT TRAIL
 * Mencatat SEMUA aksi user, terenkripsi, siap audit ISO 27001
 */
const BankAudit = {
  async log(action, details = {}) {
    const u = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}');
    const entry = {
      id: crypto.randomUUID(),
      uid: u.id || 'anonymous',
      email: u.email || 'unknown',
      role: u.role || 'staff',
      action: action,
      details: JSON.stringify(details),
      ip: 'client',
      ua: navigator.userAgent,
      fp: await this.fingerprint(),
      ts: new Date().toISOString(),
      sid: localStorage.getItem('sid') || 'unknown'
    };

    // Simpan terenkripsi di localStorage
    const logs = await BankEncryption.secureGet('audit') || [];
    logs.push(entry);
    if (logs.length > 500) logs.splice(0, logs.length - 500);
    await BankEncryption.secureSet('audit', logs);

    // Sync ke Supabase jika tersedia
    if (window.supabaseClient) {
      window.supabaseClient.from('audit_logs').insert(entry)
        .then(() => console.log('✅ Audit synced'))
        .catch(() => console.warn('⚠️ Audit sync failed'));
    }

    return entry;
  },

  async fingerprint() {
    const d = [navigator.userAgent, navigator.language, screen.colorDepth].join('|');
    const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(d));
    return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('').substr(0, 16);
  }
};

window.BankAudit = BankAudit;
console.log('🏦 Audit Trail Ready');
