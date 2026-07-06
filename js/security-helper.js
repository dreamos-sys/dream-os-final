/**
 * Dream OS Security Helper v3.0
 * Minimal & Stable Version
 */

(function() {
  'use strict';
  
  console.log(' Loading DreamSec module...');
  
  // ========== STORAGE HELPERS ==========
  function getStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      return [];
    }
  }
  
  function setStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        // Auto-rotate logs
        var logs = getStorage('dreamos_audit_logs');
        if (logs.length > 50) {
          logs = logs.slice(-50);
          localStorage.setItem('dreamos_audit_logs', JSON.stringify(logs));
        }
        try {
          localStorage.setItem(key, JSON.stringify(data));
          return true;
        } catch (e2) {
          return false;
        }
      }
      return false;
    }
  }
  
  // ========== SECURITY MODULE ==========
  window.DreamSec = {
    getCurrentUser: function() {
      try {
        var user = JSON.parse(localStorage.getItem('dreamos_bound_user') || 'null');
        if (!user) {
          var session = JSON.parse(localStorage.getItem('dreamos_session_active') || 'null');
          if (session && session.user) user = session.user;
        }
        return user;
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
      var logs = getStorage('dreamos_audit_logs');
      var user = this.getCurrentUser();
      
      logs.push({
        time: new Date().toISOString(),
        user: user ? (user.email || user.nama) : 'anonymous',
        action: action,
        details: details || ''
      });
      
      if (logs.length > 100) {
        logs = logs.slice(-100);
      }
      
      setStorage('dreamos_audit_logs', logs);
    },
    
    getDeviceDNA: function() {
      return new Promise(function(resolve) {
        try {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          canvas.width = 200;
          canvas.height = 50;
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.fillStyle = '#f60';
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = '#069';
          ctx.fillText('DreamOS', 2, 15);
          var dataURL = canvas.toDataURL();
          resolve('DNA_' + btoa(dataURL).substring(0, 32));
        } catch (e) {
          resolve('DNA_' + Math.random().toString(36).substring(2, 15));
        }
      });
    },
    
    sanitize: function(str) {
      if (!str) return '';
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },
    
    getStorageUsage: function() {
      var usage = 0;
      for (var key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          usage += localStorage[key].length * 2;
        }
      }
      return {
        used: (usage / 1024 / 1024).toFixed(2) + ' MB',
        percentage: ((usage / (5 * 1024 * 1024)) * 100).toFixed(1) + '%'
      };
    }
  };
  
  // ========== AUTO-CLEANUP ON LOAD ==========
  window.addEventListener('load', function() {
    var logs = getStorage('dreamos_audit_logs');
    if (logs.length > 100) {
      logs = logs.slice(-100);
      setStorage('dreamos_audit_logs', logs);
    }
    
    var usage = window.DreamSec.getStorageUsage();
    console.log('💾 Storage usage:', usage.used, '(' + usage.percentage + ')');
  });
  
  console.log('✅ DreamSec loaded successfully');
})();
