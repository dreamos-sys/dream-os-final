// core/auth.js
// Authentication & Session Management System
// Standard: SHA-256 Hashing • LocalStorage Session • Attempt Limiting

export const auth = {
  // Konfigurasi Keamanan
  SESSION_KEY: 'dream_os_session',
  ATTEMPTS_KEY: 'dream_os_attempts',
  MAX_ATTEMPTS: 4,
  
  // Hash Password Default: "admin" (SHA-256)
  // Jika ingin ganti password, generate hash baru di console browser:
  // crypto.subtle.digest('SHA-256', new TextEncoder().encode('passwordbaru')).then(...)
  TARGET_HASH: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',

  // 1. Fungsi Hashing (Web Crypto API)
  async _hash(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // 2. Proses Login
  async login(password) {
    // Cek sisa percobaan
    let attempts = parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || this.MAX_ATTEMPTS);
    
    if (attempts <= 0) {
      localStorage.setItem(this.ATTEMPTS_KEY, '0');
      throw new Error('🔒 Akses dikunci. Refresh halaman untuk coba lagi.');
    }

    // Validasi Password (Hashing input & compare dengan target)
    const inputHash = await this._hash(password);
    
    if (inputHash === this.TARGET_HASH) {
      // Login Sukses
      localStorage.setItem(this.SESSION_KEY, 'active');
      localStorage.removeItem(this.ATTEMPTS_KEY); // Reset percobaan
      return true;
    } else {
      // Login Gagal
      attempts--;
      localStorage.setItem(this.ATTEMPTS_KEY, attempts.toString());
      return false;
    }
  },

  // 3. Cek Status Login
  isLoggedIn() {
    return localStorage.getItem(this.SESSION_KEY) === 'active';
  },

  // 4. Logout
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    location.reload(); // Reload ke halaman login
  },

  // 5. Ambil Sisa Percobaan
  getAttempts() {
    return parseInt(localStorage.getItem(this.ATTEMPTS_KEY) || this.MAX_ATTEMPTS);
  }
};
