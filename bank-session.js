const BankSession = {
  SESSION_DURATION: 7200000,
  create(user) {
    const sessionId = crypto.randomUUID();
    const session = { id: sessionId, user_id: user.id, email: user.email, role: user.role, created_at: Date.now(), expires_at: Date.now() + this.SESSION_DURATION, last_activity: Date.now() };
    localStorage.setItem('session_id', sessionId);
    if (window.BankEncryption) { window.BankEncryption.secureSet('session', session); }
    return session;
  },
  async validate() { const session = window.BankEncryption ? await window.BankEncryption.secureGet('session') : null; if (!session || Date.now() > session.expires_at) { this.destroy(); return false; } session.last_activity = Date.now(); if (window.BankEncryption) await window.BankEncryption.secureSet('session', session); return true; },
  destroy() { localStorage.removeItem('session_id'); localStorage.removeItem('enc_session'); localStorage.removeItem('dreamos_bound_user'); localStorage.removeItem('dreamos_session_active'); }
};
window.BankSession = BankSession;
setInterval(async () => { if (localStorage.getItem('dreamos_session_active') === 'true') { const valid = await BankSession.validate(); if (!valid) { alert('⏰ Sesi berakhir. Silakan login ulang.'); BankSession.destroy(); window.location.reload(); } } }, 30000);
console.log('🏦 Bank-Grade Session Management Ready');
