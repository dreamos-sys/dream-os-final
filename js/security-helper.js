// ========== ENTERPRISE SECURITY HELPER v2.0 ==========
(function(global) {
  'use strict';

  // Sanitize
  function sanitize(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Device DNA
  async function getDeviceDNA() {
    try {
      var c = document.createElement('canvas');
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#f60'; ctx.fillRect(125,1,62,20);
      var metrics = [navigator.hardwareConcurrency||0, screen.colorDepth, c.toDataURL()].join('|');
      var hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metrics));
      return Array.from(new Uint8Array(hashBuffer)).map(function(b){return b.toString(16).padStart(2,'0');}).join('').substring(0,32);
    } catch(e) { return 'UNKNOWN'; }
  }

  // Hash password
  async function hashPassword(password, salt) {
    var encoder = new TextEncoder();
    var data = encoder.encode(password + (salt || 'dreamos_salt_2026'));
    var hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
  }

  // User management
  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('dreamos_bound_user') || 'null'); }
    catch(e) { return null; }
  }

  function getCurrentRole() {
    var user = getCurrentUser();
    return user ? user.role : 'staff';
  }

  // ========== RBAC - FINAL ==========
  var ROLE_PERMISSIONS = {
    dev: ['cmd','sec','k3','in','out','book','asset','stok','maint','dana','profile','qr','about','setting'],
    kabag: ['cmd','sec','k3','in','out','book','asset','stok','maint','dana','profile','qr','about','setting'],
    koord: ['cmd','sec','k3','in','out','book','asset','stok','maint','dana','profile','qr','about','setting'],
    admin: ['cmd','sec','k3','in','out','book','asset','stok','maint','dana','profile','qr','about','setting'],
    security: ['sec','qr','profile','about','setting'],
    janitor: ['in','out','profile','qr','about','setting'],
    maintenance: ['maint','profile','qr','about','setting'],
    staff: ['book','stok','asset','profile','qr','about','setting']
  };

  function canAccess(modId) {
    var role = getCurrentRole();
    // Developer selalu bisa akses semua
    if (role === 'dev') return true;
    // Cek permissions
    var permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['staff'];
    return permissions.includes(modId);
  }

  // Audit log
  function auditLog(action, details) {
    var logs = JSON.parse(localStorage.getItem('dreamos_audit_logs') || '[]');
    var user = getCurrentUser();
    logs.unshift({
      time: new Date().toISOString(),
      user: user ? (user.email || user.nama) : 'System',
      role: user ? user.role : 'system',
      action: action,
      details: details || ''
    });
    if (logs.length > 100) logs.pop();
    localStorage.setItem('dreamos_audit_logs', JSON.stringify(logs));
  }

  // Export
  global.DreamSec = {
    sanitize: sanitize,
    getDeviceDNA: getDeviceDNA,
    hashPassword: hashPassword,
    getCurrentUser: getCurrentUser,
    getCurrentRole: getCurrentRole,
    canAccess: canAccess,
    auditLog: auditLog,
    ROLE_PERMISSIONS: ROLE_PERMISSIONS
  };

  console.log('🛡️ DreamSec v2.0 loaded - RBAC active');
})(window);

// ========== DATA ENCRYPTION (AES-GCM) ==========
const DataVault = {
  // Generate encryption key dari password user
  async generateKey(password) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password.padEnd(32, '0').substring(0, 32)),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('dreamos_vault_salt_2026'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  },

  // Enkripsi data
  async encrypt(data, password) {
    try {
      const key = await this.generateKey(password);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(JSON.stringify(data))
      );
      return {
        iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
        data: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('')
      };
    } catch(e) {
      console.error('Encryption error:', e);
      return null;
    }
  },

  // Dekripsi data
  async decrypt(encryptedObj, password) {
    try {
      const key = await this.generateKey(password);
      const iv = new Uint8Array(encryptedObj.iv.match(/.{2}/g).map(b => parseInt(b, 16)));
      const data = new Uint8Array(encryptedObj.data.match(/.{2}/g).map(b => parseInt(b, 16)));
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch(e) {
      console.error('Decryption error:', e);
      return null;
    }
  }
};

// Export
if (typeof global !== 'undefined' && global.DreamSec) {
  global.DreamSec.DataVault = DataVault;
}
