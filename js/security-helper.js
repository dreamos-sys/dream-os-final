/**
 * ENTERPRISE SECURITY HELPER
 * ISO 27001 • RBAC • Sanitasi • Enkripsi Lokal • Device Binding
 */
(function(global) {
  'use strict';

  // ========== SANITASI OUTPUT ==========
  function sanitize(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ========== DEVICE DNA ==========
  async function getDeviceDNA() {
    try {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('DreamOS-Enterprise', 2, 15);
      const metrics = [
        navigator.hardwareConcurrency || 0,
        screen.colorDepth,
        c.toDataURL()
      ].join('|');
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metrics));
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .substring(0, 32);
    } catch (e) {
      return 'UNKNOWN_DEVICE';
    }
  }

  // ========== HASH PASSWORD ==========
  async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + (salt || 'dreamos_enterprise_salt_2026'));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // ========== RBAC ==========
  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('dreamos_bound_user') || 'null');
    } catch (e) {
      return null;
    }
  }

  function getCurrentRole() {
    const user = getCurrentUser();
    return user ? user.role : 'staff';
  }

  function canAccess(modId) {
    const role = getCurrentRole();
    const permissions = {
      dev: ['cmd', 'sec', 'k3', 'in', 'out', 'book', 'asset', 'stok', 'maint', 'dana', 'profile', 'qr', 'about', 'setting'],
      kabag: ['cmd', 'sec', 'k3', 'in', 'out', 'book', 'asset', 'stok', 'maint', 'dana', 'profile', 'qr', 'about', 'setting'],
      koord: ['cmd', 'sec', 'k3', 'in', 'out', 'book', 'asset', 'stok', 'maint', 'dana', 'profile', 'qr', 'about', 'setting'],
      security: ['sec', 'qr', 'profile', 'about', 'setting'],
      janitor: ['in', 'out', 'profile', 'qr', 'about', 'setting'],
      maintenance: ['maint', 'profile', 'qr', 'about', 'setting'],
      staff: ['book', 'stok', 'asset', 'profile', 'qr', 'about', 'setting']
    };
    return (permissions[role] || permissions.staff).includes(modId);
  }

  // ========== AUDIT LOG ==========
  function auditLog(action, details) {
    const logs = JSON.parse(localStorage.getItem('dreamos_audit_logs') || '[]');
    logs.unshift({
      time: new Date().toISOString(),
      user: getCurrentUser()?.nama || 'System',
      role: getCurrentRole(),
      action,
      details: details || ''
    });
    if (logs.length > 100) logs.pop();
    localStorage.setItem('dreamos_audit_logs', JSON.stringify(logs));
  }

  // ========== ENKRIPSI LOKAL ==========
  async function encryptData(data, key) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key.padEnd(32, '0').substring(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoded
    );
    return {
      iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
      data: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('')
    };
  }

  async function decryptData(encryptedObj, key) {
    const encoder = new TextEncoder();
    const iv = new Uint8Array(encryptedObj.iv.match(/.{2}/g).map(b => parseInt(b, 16)));
    const data = new Uint8Array(encryptedObj.data.match(/.{2}/g).map(b => parseInt(b, 16)));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key.padEnd(32, '0').substring(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  // ========== EXPORT ==========
  global.DreamSec = {
    sanitize,
    getDeviceDNA,
    hashPassword,
    getCurrentUser,
    getCurrentRole,
    canAccess,
    auditLog,
    encryptData,
    decryptData
  };

})(window);
