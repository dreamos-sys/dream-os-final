/* idle/session timeout can be disabled via window.DREAMOS_DISABLE_SESSION_TIMEOUT */
/**
 * 🏦 BANK-GRADE SESSION MANAGEMENT
 * Auto-expire 2 jam, auto-logout, refresh token
 */
const BankSession = {
  DURATION: 7200000, // 2 jam

  create(user) {
    const session = {
      id: crypto.randomUUID(),
      uid: user.id,
      email: user.email,
      role: user.role,
      created: Date.now(),
      expires: Date.now() + this.DURATION,
      last: Date.now()
    };
    window.safeStorageSet('sid', session.id);
    BankEncryption.secureSet('session', session);
    return session;
  },

  async valid() {
    const s = await BankEncryption.secureGet('session');
    if (!s || Date.now() > s.expires) {
      this.destroy();
      return false;
    }
    s.last = Date.now();
    await BankEncryption.secureSet('session', s);
    return true;
  },

  async refresh() {
    const s = await BankEncryption.secureGet('session');
    if (s) {
      s.expires = Date.now() + this.DURATION;
      await BankEncryption.secureSet('session', s);
    }
  },

  destroy() {
    ['sid', 'enc_session', 'dreamos_bound_user', 'dreamos_session_active'].forEach(k => localStorage.removeItem(k));
    BankEncryption.resetKey();
  },

  logout() {
    if (window.supabaseClient) window.supabaseClient.auth.signOut().catch(() => {});
    this.destroy();
    window.location.reload();
  }
};

window.BankSession = BankSession;

// Auto-validate setiap 30 detik
window.__dreamosRegisterInterval(setInterval(async () => {
  if (localStorage.getItem('dreamos_session_active') === 'true') {
    const valid = await BankSession.valid();
    if (!valid) {
      (typeof window.showToast === 'function' ? window.showToast('⏰ Sesi berakhir. Silakan login ulang.', 'warning') : alert('⏰ Sesi berakhir. Silakan login ulang.'));
      if (!window.DREAMOS_DISABLE_IDLE_LOGOUT) { BankSession.logout(); } else { console.warn('[BankSession] logout skipped'); }
    }
  }
}, 30000));

console.log('🏦 Session Management Ready');
