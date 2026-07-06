/**
 * Dream OS - Security Helper Module
 * Lightweight & Compatible Version
 */

(function(window) {
  'use strict';

  const DreamSec = {
    version: '1.1.0',

    getCurrentUser: function() {
      try {
        const data = localStorage.getItem('dreamos_bound_user');
        return data ? JSON.parse(data) : null;
      } catch (e) {
        return null;
      }
    },

    getDeviceDNA: function() {
      return new Promise((resolve) => {
        try {
          const info = navigator.userAgent + navigator.platform + screen.width + screen.height;
          let hash = 0;
          for (let i = 0; i < info.length; i++) {
            hash = ((hash << 5) - hash) + info.charCodeAt(i);
            hash |= 0;
          }
          resolve('DNA-' + Math.abs(hash).toString(16).toUpperCase());
        } catch (e) {
          resolve('DNA-UNKNOWN');
        }
      });
    },

    hashPassword: async function(password) {
      try {
        if (window.crypto && window.crypto.subtle) {
          const data = new TextEncoder().encode(password + 'dreamos_salt_2026');
          const hash = await crypto.subtle.digest('SHA-256', data);
          return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        }
      } catch (e) {}
      // Fallback
      let h = 0;
      for (let i = 0; i < password.length; i++) {
        h = Math.imul(31, h) + password.charCodeAt(i) | 0;
      }
      return Math.abs(h).toString(16).padStart(32, '0');
    },

    sanitize: function(str) {
      if (!str || typeof str !== 'string') return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },

    auditLog: function(action, details) {
      try {
        const user = this.getCurrentUser();
        const logs = JSON.parse(localStorage.getItem('dreamos_audit_logs') || '[]');
        logs.unshift({
          time: new Date().toISOString(),
          user: user ? user.email : 'system',
          action: action,
          details: details || ''
        });
        if (logs.length > 1000) logs.length = 1000;
        localStorage.setItem('dreamos_audit_logs', JSON.stringify(logs));
      } catch (e) {
        console.error('Audit log error:', e);
      }
    },

    hasPermission: function(permission) {
      const user = this.getCurrentUser();
      if (!user) return false;
      
      const perms = {
        'admin': ['dev', 'kabag'],
        'manage_users': ['dev', 'kabag', 'koord'],
        'edit_profile': ['dev', 'kabag', 'koord', 'staff', 'security', 'janitor', 'maintenance']
      };
      
      const allowed = perms[permission] || [];
      return allowed.includes(user.role);
    },

    validatePassword: function(password) {
      const errors = [];
      if (password.length < 6) errors.push('Minimal 6 karakter');
      if (!/[A-Z]/.test(password)) errors.push('Butuh huruf kapital');
      if (!/[0-9]/.test(password)) errors.push('Butuh angka');
      
      return {
        valid: errors.length === 0,
        strength: password.length >= 12 ? 'strong' : password.length >= 8 ? 'medium' : 'weak',
        errors: errors
      };
    },

    init: function() {
      console.log('🔒 DreamSec v' + this.version + ' loaded');
    }
  };

  // Export
  window.DreamSec = DreamSec;
  
  // Auto-init
  setTimeout(() => DreamSec.init(), 100);

})(window);

console.log('✅ Security helper script loaded');
