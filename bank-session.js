/**
 * 🏦 BANK-GRADE SESSION MANAGEMENT
 * Token session dengan expiry 2 jam
 */
const BankSession = {
  SESSION_DURATION: 7200000, // 2 jam
  
  create(user) {
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      user_id: user.id,
      email: user.email,
      role: user.role,
      created_at: Date.now(),
      expires_at: Date.now() + this.SESSION_DURATION,
      last_activity: Date.now()
    };
    localStorage.setItem('session_id', sessionId);
    if (window.BankEncryption) {
      window.BankEncryption.secureSet('session', session);
    }
    return session;
  },
  
  async validate() {
    const session = window.BankEncryption ? 
      await window.BankEncryption.secureGet('session') : null;
    if (!session) return false;
    if (Date.now() > session.expires_at) {
      this.destroy();
      return false;
    }
    // Update last activity
    session.last_activity = Date.now();
    if (window.BankEncryption) {
      await window.BankEncryption.secureSet('session', session);
    }
    return true;
  },
  
  async refresh() {
    const session = window.BankEncryption ? 
      await window.BankEncryption.secureGet('session') : null;
    if (session) {
      session.expires_at = Date.now() + this.SESSION_DURATION;
      if (window.BankEncryption) {
        await window.BankEncryption.secureSet('session', session);
      }
    }
  },
  
  destroy() {
    localStorage.removeItem('session_id');
    localStorage.removeItem('enc_session');
    localStorage.removeItem('dreamos_bound_user');
    localStorage.removeItem('dreamos_session_active');
  }
};

window.BankSession = BankSession;
console.log('🏦 Bank-Grade Session Management Ready');

// Auto-validate setiap 30 detik
setInterval(async () => {
  if (localStorage.getItem('dreamos_session_active') === 'true') {
    const valid = await BankSession.validate();
    if (!valid) {
      alert('⏰ Sesi berakhir. Silakan login ulang.');
      BankSession.destroy();
      window.location.reload();
    }
  }
}, 30000);
