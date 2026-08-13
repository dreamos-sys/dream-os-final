/**
 * Dream OS Security Layer
 * - XSS sanitization (OWASP Top 10 A03:2021)
 * - Error boundary (React-style)
 * - Safe event delegation
 */

const DreamOSSecurity = (function() {
  'use strict';
  
  // === XSS SANITIZER ===
  // Escape HTML untuk prevent injection
  function escHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"'`=/]/g, function(c) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;',
        '=': '&#61;',
        '/': '&#47;'
      })[c];
    });
  }
  
  // Sanitize URL (prevent javascript: protocol)
  function safeUrl(url) {
    if (!url) return '#';
    const str = String(url).trim().toLowerCase();
    if (str.startsWith('javascript:') || str.startsWith('data:') || str.startsWith('vbscript:')) {
      console.warn('[Security] Blocked dangerous URL:', url);
      return '#';
    }
    return url;
  }
  
  // === ERROR BOUNDARY ===
  // Wrapper untuk safe execution (catch error, log, fallback)
  async function safeExec(fn, context, fallbackFn) {
    try {
      return await fn.call(context);
    } catch (err) {
      console.error('[ErrorBoundary]', err);
      reportError(err, context);
      if (typeof fallbackFn === 'function') {
        try { return fallbackFn(err); } catch(e) {}
      }
      return null;
    }
  }
  
  // Report error ke Supabase (optional, non-blocking)
  function reportError(err, context) {
    try {
      const errors = JSON.parse(localStorage.getItem('dreamos_errors') || '[]');
      errors.unshift({
        time: new Date().toISOString(),
        msg: (err && err.message) || String(err),
        stack: (err && err.stack) || '',
        url: location.href,
        ua: (navigator.userAgent || '').slice(0, 120)
      });
      // Max 50 entries
      if (errors.length > 50) errors.length = 50;
      localStorage.setItem('dreamos_errors', JSON.stringify(errors));
      
      // Kirim ke Supabase kalau online (rate limit 1/10s)
      if (window.supabaseClient && Date.now() - (window.__lastErrorReport || 0) > 10000) {
        window.__lastErrorReport = Date.now();
        window.supabaseClient.from('client_errors').insert({
          message: String(err && err.message || err).slice(0, 500),
          stack: String(err && err.stack || '').slice(0, 2000),
          url: location.href,
          user_agent: (navigator.userAgent || '').slice(0, 200)
        }).catch(function(){}); // silent
      }
    } catch(e) {}
  }
  
  // === SAFE EVENT DELEGATION ===
  // Bind event sekali, handle banyak tombol (anti inline onclick)
  function delegate(rootSelector, eventType, childSelector, handler) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    root.addEventListener(eventType, function(e) {
      const target = e.target.closest(childSelector);
      if (!target) return;
      try { handler.call(target, e, target); } 
      catch(err) { reportError(err); }
    });
  }
  
  // === CONTENT SECURITY POLICY HELPER ===
  function sanitizeHtml(html) {
    // Strip script tags, event handlers, javascript: URLs
    return String(html || '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');
  }
  
  // Public API
  return {
    esc: escHtml,
    escHtml: escHtml,
    safeUrl: safeUrl,
    safeExec: safeExec,
    report: reportError,
    delegate: delegate,
    sanitizeHtml: sanitizeHtml
  };
})();

// Global helper
window.esc = DreamOSSecurity.esc;
window.safeExec = DreamOSSecurity.safeExec;
window.DreamOSSecurity = DreamOSSecurity;

// Global error handler
window.addEventListener('error', function(e) {
  DreamOSSecurity.report(e.error || e.message);
});
window.addEventListener('unhandledrejection', function(e) {
  DreamOSSecurity.report(e.reason);
});
