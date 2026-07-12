/**
 * 🏦 BANK-GRADE AUDIT TRAIL
 * Mencatat setiap aksi user dengan detail lengkap
 */
const BankAudit = {
  async log(action, details = {}) {
    const user = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}');
    const entry = {
      id: crypto.randomUUID(),
      user_id: user.id || 'anonymous',
      email: user.email || 'unknown',
      role: user.role || 'staff',
      action,
      details: JSON.stringify(details),
      ip: 'client-side', // Akan diisi oleh worker/server
      user_agent: navigator.userAgent,
      device_fingerprint: await this.getFingerprint(),
      timestamp: new Date().toISOString(),
      session_id: localStorage.getItem('session_id') || 'unknown'
    };
    
    // Simpan ke localStorage (terenkripsi)
    if (window.BankEncryption) {
      const logs = await window.BankEncryption.secureGet('audit_logs') || [];
      logs.push(entry);
      if (logs.length > 200) logs.splice(0, logs.length - 200);
      await window.BankEncryption.secureSet('audit_logs', logs);
    }
    
    // Kirim ke Supabase
    if (window.supabaseClient) {
      window.supabaseClient.from('audit_logs').insert(entry).then(() => {}).catch(() => {});
    }
    
    return entry;
  },
  
  async getFingerprint() {
    const data = [navigator.userAgent, navigator.language, screen.colorDepth].join('|');
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').substr(0, 16);
  }
};

window.BankAudit = BankAudit;
console.log('🏦 Bank-Grade Audit Trail Ready');
