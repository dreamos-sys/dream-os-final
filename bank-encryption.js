/**
 * 🏦 BANK-GRADE ENCRYPTION - AES-256-GCM
 */
const BankEncryption = {
  async deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']);
    return await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: enc.encode(salt), iterations: 200000, hash: 'SHA-256' },
      keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
  },
  async encrypt(plainText, password) {
    const key = await this.deriveKey(password, 'dreamos-bank-salt-v2');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv); combined.set(new Uint8Array(ciphertext), iv.length);
    return btoa(String.fromCharCode(...combined));
  },
  async decrypt(cipherB64, password) {
    const key = await this.deriveKey(password, 'dreamos-bank-salt-v2');
    const combined = new Uint8Array(atob(cipherB64).split('').map(c => c.charCodeAt(0)));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
  },
  getEncryptionKey() { const user = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}'); return (user.id || 'system') + '-dreamos-secret'; },
  async secureSet(key, value) { const json = JSON.stringify(value); const encrypted = await this.encrypt(json, this.getEncryptionKey()); localStorage.setItem('enc_' + key, encrypted); },
  async secureGet(key) { const encrypted = localStorage.getItem('enc_' + key); if (!encrypted) return null; try { const json = await this.decrypt(encrypted, this.getEncryptionKey()); return JSON.parse(json); } catch(e) { return null; } }
};
window.BankEncryption = BankEncryption;
console.log('🏦 Bank-Grade Encryption Ready');
