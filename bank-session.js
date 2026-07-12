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
    localStorage.setItem('sid', session.id);
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
setInterval(async () => {
  if (localStorage.getItem('dreamos_session_active') === 'true') {
    const valid = await BankSession.valid();
    if (!valid) {
      alert('⏰ Sesi berakhir. Silakan login ulang.');
      BankSession.logout();
    }
  }
}, 30000);

console.log('🏦 Session Management Ready');
