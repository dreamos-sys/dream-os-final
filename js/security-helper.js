/**
 * Dream OS Security Helper
 * With automatic log rotation to prevent quota exceeded errors
 */

(function() {
  'use strict';
  
  // ========== CONFIG ==========
  var MAX_LOG_ENTRIES = 100; // Maximum audit logs to keep
  var MAX_USERS = 50; // Maximum users in database
  
  // ========== LOCAL STORAGE HELPERS ==========
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
        console.error('⚠️ Storage quota exceeded! Clearing old data...');
        rotateLogs();
        try {
          localStorage.setItem(key, JSON.stringify(data));
          return true;
        } catch (e2) {
          console.error('❌ Still quota exceeded after rotation');
          return false;
        }
      }
      return false;
    }
  }
  
  // ========== LOG ROTATION ==========
  function rotateLogs() {
    var logs = getStorage('dreamos_audit_logs');
    if (logs.length > MAX_LOG_ENTRIES) {
      logs = logs.slice(-MAX_LOG_ENTRIES);
      setStorage('dreamos_audit_logs', logs);
      console.log('🔄 Rotated logs. Kept last', MAX_LOG_ENTRIES, 'entries');
    }
  }
  
  function rotateUsers() {
    var users = getStorage('dreamos_users_db');
    if (users.length > MAX_USERS) {
      // Keep active users (those who logged in recently)
      var recentUsers = users.filter(function(u) {
        var lastLogin = new Date(u.last_login || 0);
        var daysSince = (Date.now() - lastLogin) / 86400000;
        return daysSince < 30; // Keep users active in last 30 days
      });
      
      // If still too many, keep only last MAX_USERS
      if (recentUsers.length > MAX_USERS) {
        recentUsers = recentUsers.slice(-MAX_USERS);
      }
      
      setStorage('dreamos_users_db', recentUsers);
      console.log('🔄 Rotated users. Kept', recentUsers.length, 'active users');
    }
  }
  
  // ========== SECURITY MODULE ==========
  window.DreamSec = {
    // Get current user
    getCurrentUser: function() {
      try {
        var user = JSON.parse(localStorage.getItem('dreamos_bound_user') || 'null');
        if (!user) {
          // Try to get from session
          var session = JSON.parse(localStorage.getItem('dreamos_session_active') || 'null');
          if (session && session.user) {
            user = session.user;
          }
        }
        return user;
      } catch (e) {
        console.error('Error getting current user:', e);
        return null;
      }
    },
    
    // Hash password (simple SHA-256)
    hashPassword: async function(password) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        console.error('Error hashing password:', e);
        // Fallback: simple hash
        var hash = 0;
        for (var i = 0; i < password.length; i++) {
          var char = password.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return 'fallback_' + Math.abs(hash);
      }
    },
    
    // Audit log with rotation
    auditLog: function(action, details) {
      var logs = getStorage('dreamos_audit_logs');
      var user = this.getCurrentUser();
      
      logs.push({
        time: new Date().toISOString(),
        user: user ? (user.email || user.nama) : 'anonymous',
        action: action,
        details: details || ''
      });
      
      // Rotate if too many
      if (logs.length > MAX_LOG_ENTRIES) {
        logs = logs.slice(-MAX_LOG_ENTRIES);
      }
      
      setStorage('dreamos_audit_logs', logs);
    },
    
    // Get device DNA (fingerprint)
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
          reject(e);
        }
      });
    },
    
    // Sanitize HTML
    sanitize: function(str) {
      if (!str) return '';
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },
    
    // Clear all data (emergency)
    clearAllData: function() {
      if (confirm('⚠️ PERINGATAN: Ini akan menghapus SEMUA data lokal!\n\nLanjutkan?')) {
        localStorage.clear();
        console.log('✅ All data cleared');
        location.reload();
      }
    },
    
    // Get storage usage
    getStorageUsage: function() {
      var usage = 0;
      for (var key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          usage += localStorage[key].length * 2; // UTF-16
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
    // Rotate logs on page load
    rotateLogs();
    rotateUsers();
    
    // Log storage usage
    var usage = window.DreamSec.getStorageUsage();
    console.log('💾 Storage usage:', usage.used, '(' + usage.percentage + ')');
    
    // Warn if over 80%
    if (parseFloat(usage.percentage) > 80) {
      console.warn('⚠️ Storage nearly full! Consider clearing old data.');
    }
  });
  
  // ========== EMERGENCY RECOVERY ==========
  window.recoverFromQuotaError = function() {
    console.log('🚨 Emergency recovery initiated...');
    
    // Clear old logs
    var logs = getStorage('dreamos_audit_logs');
    if (logs.length > 50) {
      logs = logs.slice(-50);
      setStorage('dreamos_audit_logs', logs);
    }
    
    // Clear sessions
    localStorage.removeItem('dreamos_sessions');
    localStorage.removeItem('dreamos_devices');
    
    console.log('✅ Recovery complete. Reload page.');
    location.reload();
  };
  
  // Catch quota errors globally
  window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('QuotaExceeded')) {
      console.error('🚨 Quota exceeded detected!');
      window.recoverFromQuotaError();
    }
  });
  
})();
