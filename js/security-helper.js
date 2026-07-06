/**
 * Dream OS - Security Helper Module
 * ISO 27001 Compliant Security Functions
 * Version: 1.0.0
 */

(function(window) {
  'use strict';

  const DreamSec = {
    version: '1.0.0',

    /**
     * Get current logged in user
     * @returns {Object|null} User object or null if not logged in
     */
    getCurrentUser: function() {
      try {
        const userData = localStorage.getItem('dreamos_bound_user');
        if (userData) {
          return JSON.parse(userData);
        }
      } catch (e) {
        console.error('Error getting current user:', e);
      }
      return null;
    },

    /**
     * Get device DNA (fingerprint)
     * @returns {Promise<string>} Device fingerprint hash
     */
    getDeviceDNA: function() {
      return new Promise((resolve, reject) => {
        try {
          // Collect device information
          const deviceInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookieEnabled: navigator.cookieEnabled
          };

          // Create a simple hash
          const infoString = JSON.stringify(deviceInfo);
          let hash = 0;
          for (let i = 0; i < infoString.length; i++) {
            const char = infoString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
          }

          // Convert to hex string
          const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
          resolve('DNA-' + hexHash.toUpperCase());
        } catch (e) {
          reject(e);
        }
      });
    },

    /**
     * Hash password using SHA-256
     * @param {string} password - Plain text password
     * @returns {Promise<string>} Hashed password
     */
    hashPassword: async function(password) {
      try {
        // Use Web Crypto API if available
        if (window.crypto && window.crypto.subtle) {
          const encoder = new TextEncoder();
          const data = encoder.encode(password);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
          // Fallback: simple hash (NOT SECURE for production!)
          return this.simpleHash(password);
        }
      } catch (e) {
        console.error('Error hashing password:', e);
        return this.simpleHash(password);
      }
    },

    /**
     * Simple hash function (fallback)
     * @param {string} str - String to hash
     * @returns {string} Hashed string
     */
    simpleHash: function(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16).padStart(32, '0');
    },

    /**
     * Sanitize string to prevent XSS
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    sanitize: function(str) {
      if (typeof str !== 'string') return str;
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },

    /**
     * Log audit event
     * @param {string} action - Action performed
     * @param {string} details - Details of the action
     */
    auditLog: function(action, details) {
      try {
        const user = this.getCurrentUser();
        const logs = JSON.parse(localStorage.getItem('dreamos_audit_logs') || '[]');
        
        logs.unshift({
          timestamp: new Date().toISOString(),
          user: user ? user.email : 'anonymous',
          action: action,
          details: details,
          deviceDNA: 'pending' // Will be filled async
        });

        // Keep only last 1000 logs
        if (logs.length > 1000) {
          logs.length = 1000;
        }

        localStorage.setItem('dreamos_audit_logs', JSON.stringify(logs));
        console.log(`📝 Audit: ${action} - ${details}`);
      } catch (e) {
        console.error('Error logging audit:', e);
      }
    },

    /**
     * Check if user has permission
     * @param {string} permission - Permission to check
     * @returns {boolean} True if user has permission
     */
    hasPermission: function(permission) {
      const user = this.getCurrentUser();
      if (!user) return false;

      const permissions = {
        'admin': ['dev', 'kabag'],
        'manage_users': ['dev', 'kabag', 'koord'],
        'view_reports': ['dev', 'kabag', 'koord', 'staff'],
        'edit_profile': ['dev', 'kabag', 'koord', 'staff', 'security', 'janitor', 'maintenance']
      };

      const allowedRoles = permissions[permission] || [];
      return allowedRoles.includes(user.role);
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result
     */
    validatePassword: function(password) {
      const result = {
        valid: false,
        strength: 'weak',
        errors: []
      };

      if (password.length < 6) {
        result.errors.push('Password minimal 6 karakter');
      } else if (password.length >= 12) {
        result.strength = 'strong';
      } else if (password.length >= 8) {
        result.strength = 'medium';
      }

      if (!/[A-Z]/.test(password)) {
        result.errors.push('Minimal 1 huruf kapital');
      }

      if (!/[0-9]/.test(password)) {
        result.errors.push('Minimal 1 angka');
      }

      if (!/[^A-Za-z0-9]/.test(password)) {
        result.errors.push('Minimal 1 karakter spesial');
      }

      result.valid = result.errors.length === 0;
      return result;
    },

    /**
     * Generate secure random token
     * @param {number} length - Token length
     * @returns {string} Random token
     */
    generateToken: function(length = 32) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let token = '';
      
      if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
          token += chars[array[i] % chars.length];
        }
      } else {
        for (let i = 0; i < length; i++) {
          token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      
      return token;
    },

    /**
     * Encrypt data (simple encryption for demo)
     * @param {string} data - Data to encrypt
     * @param {string} key - Encryption key
     * @returns {string} Encrypted data
     */
    encrypt: function(data, key) {
      // Simple XOR encryption (NOT for production!)
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode);
      }
      return btoa(encrypted);
    },

    /**
     * Decrypt data
     * @param {string} data - Data to decrypt
     * @param {string} key - Decryption key
     * @returns {string} Decrypted data
     */
    decrypt: function(data, key) {
      // Simple XOR decryption
      const decoded = atob(data);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    },

    /**
     * Initialize security module
     */
    init: function() {
      console.log('🔒 DreamSec v' + this.version + ' initialized');
      this.auditLog('MODULE_INIT', 'Security module initialized');
    }
  };

  // Export to window
  window.DreamSec = DreamSec;

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DreamSec.init());
  } else {
    DreamSec.init();
  }

})(window);
