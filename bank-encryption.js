/**
 * 🏦 BANK-GRADE ENCRYPTION - AES-256-GCM
 * Melindungi SEMUA data sensitif di localStorage
 */
const BankEncryption = {
  _key: null,
  
  async getKey() {
    if (this._key) return this._key;
    const u = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}');
    const m = new TextEncoder();
    const k = await crypto.subtle.importKey(
      'raw', m.encode((u.id || 'system') + '-dreamos-bank-v2'),
      { name: 'PBKDF2' }, false, ['deriveKey']
    );
    this._key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: m.encode('bank-salt-2026'), iterations: 200000, hash: 'SHA-256' },
      k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
    return this._key;
  },

  async encrypt(plainText) {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  async decrypt(cipherB64) {
    const key = await this.getKey();
    const combined = new Uint8Array(atob(cipherB64).split('').map(c => c.charCodeAt(0)));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
  },

  async secureSet(key, value) {
    const encrypted = await this.encrypt(JSON.stringify(value));
    window.safeStorageSet('enc_' + key, encrypted);
  },

  async secureGet(key) {
    const encrypted = localStorage.getItem('enc_' + key);
    if (!encrypted) return null;
    try { return JSON.parse(await this.decrypt(encrypted)); }
    catch (e) { return null; }
  },

  resetKey() { this._key = null; }
};

window.BankEncryption = BankEncryption;
console.log('🏦 AES-256-GCM Encryption Ready');
