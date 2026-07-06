/**
 * Dream OS Security Helper
 * Minimal version for authentication
 */

(function() {
  'use strict';
  
  window.DreamSec = {
    getCurrentUser: function() {
      try {
        return JSON.parse(localStorage.getItem('dreamos_bound_user') || 'null');
      } catch (e) {
        return null;
      }
    },
    
    hashPassword: async function(password) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        var hash = 0;
        for (var i = 0; i < password.length; i++) {
          var char = password.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return 'fallback_' + Math.abs(hash);
      }
    },
    
    auditLog: function(action, details) {
      try {
        var logs = JSON.parse(localStorage.getItem('dreamos_audit_logs') || '[]');
        var user = this.getCurrentUser();
        logs.push({
          time: new Date().toISOString(),
          user: user ? (user.email || user.nama) : 'anonymous',
          action: action,
          details: details || ''
        });
        // Keep only last 50 logs
        if (logs.length > 50) logs = logs.slice(-50);
        localStorage.setItem('dreamos_audit_logs', JSON.stringify(logs));
      } catch (e) {
        console.error('Audit log error:', e);
      }
    },
    
    getDeviceDNA: function() {
      return Promise.resolve('DNA_' + Math.random().toString(36).substring(2, 15));
    },
    
    sanitize: function(str) {
      if (!str) return '';
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  };
  
  console.log('✅ DreamSec loaded successfully');
})();
