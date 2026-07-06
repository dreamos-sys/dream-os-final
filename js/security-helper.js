/**
 * Dream OS Security Helper v3.0
 * With automatic log rotation and quota management
 */

(function() {
  'use strict';
  
  console.log(' Loading DreamSec module...');
  
  // ========== CONFIG ==========
  var MAX_LOG_ENTRIES = 100;
  var MAX_USERS = 50;
  
  // ========== STORAGE HELPERS ==========
  function getStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      console.error('Error reading storage:', key, e);
      return [];
    }
  }
  
  function setStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('️ Quota exceeded! Rotating logs...');
        rotateLogs();
        try {
          localStorage.setItem(key, JSON.stringify(data));
          return true;
        } catch (e2) {
          console.error('❌ Still quota exceeded');
          return false;
        }
      }
      console.error('Storage error:', e);
      return false;
    }
  }
  
  function rotateLogs() {
    var logs = getStorage('dreamos_audit_logs');
    if (logs.length > MAX_LOG_ENTRIES) {
      logs = logs.slice(-MAX_LOG_ENTRIES);
      setStorage('dreamos_audit_logs', logs);
      console.log('🔄 Rotated logs. Kept last', MAX_LOG_ENTRIES, 'entries');
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
        console.error('Error getting user:', e);
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
        console.error('Hash error:', e);
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
      
      if (logs.length > MAX_LOG_ENTRIES) {
        logs = logs.slice(-MAX_LOG_ENTRIES);
      }
      
      setStorage('dreamos_audit_logs', logs);
    },
    
    getDeviceDNA: function() {
      return new Promise(function(resolve, reject) {
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
          ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
          ctx.fillText('DreamOS', 4, 17);
          
          var dataURL = canvas.toDataURL();
          var fingerprint = 'DNA_' + btoa(dataURL).substring(0, 32);
          resolve(fingerprint);
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
  
  // ========== AUTO-CLEANUP ==========
  window.addEventListener('load', function() {
    rotateLogs();
    var usage = window.DreamSec.getStorageUsage();
    console.log('💾 Storage usage:', usage.used, '(' + usage.percentage + ')');
  });
  
  console.log('✅ DreamSec loaded successfully');
})();
