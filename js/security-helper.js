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
