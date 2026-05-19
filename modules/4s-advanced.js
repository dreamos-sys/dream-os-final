/**
 * Dream OS - 4S Advanced Mode (Shadow Soul Spirit of Shalawat)
 * Real Client-Side Forensic Engine - Safe & Defensive Only
 */

window.ShadowSoulSpiritAdvanced = {
  // Safe audit logging
  logAudit: function(action, detail) {
    try {
      const logs = JSON.parse(localStorage.getItem('dream_os_4s_audit') || '[]');
      logs.push({ 
        time: new Date().toISOString(), 
        action: action, 
        detail: String(detail).substring(0, 500), // Limit length
        hash: 'sha256:demo' // Placeholder for MVP
      });
      localStorage.setItem('dream_os_4s_audit', JSON.stringify(logs));
      console.log(`[4S AUDIT] ${action}: ${detail}`);
    } catch(e) {
      console.warn('Audit log failed:', e);
    }
  },

  // Safe DOM scan (no eval, no dangerous patterns)
  run4SRecon: function() {
    try {
      const scripts = Array.from(document.scripts)
        .map(s => s.src).filter(Boolean)
        .slice(0, 50); // Limit to prevent freeze
      
      const report = `🔍 4S RECON (Safe Scan):\n\nScripts: ${scripts.length}\n\nNote: Full scan available in console`;
      
      console.group('🔍 4S Recon');
      console.log('Scripts:', scripts);
      console.groupEnd();
      
      this.logAudit('4S Recon', `Scanned ${scripts.length} scripts`);
      alert(report);
    } catch(e) {
      console.error('4S Recon error:', e);
      alert('⚠️ Recon scan failed (safe mode)');
    }
  },
  // Safe network analysis
  run4SScan: function() {
    try {
      const resources = performance.getEntriesByType("resource").slice(0, 100);
      let thirdParty = 0;
      
      resources.forEach(r => {
        try {
          if(new URL(r.name).hostname !== window.location.hostname) thirdParty++;
        } catch(e) {}
      });
      
      const conn = navigator.connection ? navigator.connection.effectiveType : 'Unknown';
      const report = `🕸️ 4S NETWORK (Safe):\n\nRequests: ${resources.length}\nThird-Party: ${thirdParty}\nConnection: ${conn}`;
      
      this.logAudit('4S Scan', `Analyzed ${resources.length} resources`);
      alert(report);
    } catch(e) {
      console.error('4S Scan error:', e);
      alert('⚠️ Network scan failed (safe mode)');
    }
  },

  // Safe DNS lookup with CORS fallback
  run4SDNS: async function() {
    try {
      const domain = prompt('Enter Domain for 4S DNS:', window.location.hostname || 'example.com');
      if(!domain) return;
      
      // Try Google DNS API
      try {
        const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
          mode: 'cors',
          headers: {'Accept': 'application/dns-json'}
        });
        const data = await res.json();
        const ips = data.Answer ? data.Answer.map(a => a.data).join(', ') : 'No A record';
        this.logAudit('4S DNS', `${domain} → ${ips}`);
        alert(`🌐 4S DNS:\n${domain}\nIP: ${ips}`);
      } catch(corsError) {
        // Fallback: show manual instruction
        this.logAudit('4S DNS', `${domain} - CORS fallback`);
        alert(`🌐 4S DNS (CORS Limitation):\n\nFor ${domain}:\n• Use Termux: dig +short ${domain}\n• Or check: https://dns.google/query?name=${domain}`);
      }
    } catch(e) {
      console.error('4S DNS error:', e);
      alert('⚠️ DNS lookup failed');
    }
  },
  // Safe integrity check (no dangerous eval checks)
  scanThreats: function() {
    try {
      const isSecure = window.location.protocol === 'https:';
      const hasCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      
      const status = `🔥 4S INTEGRITY (Safe):\n\nHTTPS: ${isSecure ? '✅' : '⚠️'}\nCSP Header: ${hasCSP ? '✅' : '⚠️'}\n\nNote: Deep scan requires server-side`;
      
      this.logAudit('Integrity Scan', `HTTPS:${isSecure} CSP:${hasCSP}`);
      alert(status);
    } catch(e) {
      console.error('Integrity scan error:', e);
      alert('⚠️ Integrity check failed');
    }
  },

  // Safe encoding (not real encryption - demo only)
  encodeData: function() {
    try {
      const text = prompt('Enter text to encode (demo):');
      if(!text) return;
      
      // Base64 encoding only (NOT encryption - for demo)
      const encoded = btoa(unescape(encodeURIComponent(text)));
      this.logAudit('Encode', 'Text encoded (demo)');
      prompt('🔐 Encoded (Base64 Demo):', encoded);
    } catch(e) {
      console.error('Encode error:', e);
      alert('⚠️ Encoding failed');
    }
  },

  // Safe decoding
  decodeData: function() {
    try {
      const text = prompt('Enter encoded text:');
      if(!text) return;
      
      const decoded = decodeURIComponent(escape(atob(text)));
      this.logAudit('Decode', 'Text decoded (demo)');
      alert('🔓 Decoded:\n' + decoded);
    } catch(e) {
      console.error('Decode error:', e);
      alert('❌ Invalid encoded string');
    }
  },

  // Safe audit viewer
  showAudit: function() {    try {
      const logs = JSON.parse(localStorage.getItem('dream_os_4s_audit') || '[]');
      if(logs.length === 0) return alert('📋 Audit log empty');
      
      const display = logs.slice(-10).reverse()
        .map(l => `[${new Date(l.time).toLocaleTimeString()}] ${l.action}`)
        .join('\n');
      
      console.table(logs.slice(-10));
      alert(`📋 Recent Audits:\n\n${display}\n\n(Full in Console)`);
    } catch(e) {
      console.error('Audit view error:', e);
      alert('⚠️ Could not load audit log');
    }
  }
};

// SAFE OVERRIDE: Check if ShadowSoulSpirit exists before overriding
function safeOverride() {
  if(window.ShadowSoulSpirit && typeof window.ShadowSoulSpirit === 'object') {
    // Only override if function exists and is a function
    const overrides = {
      'run4SRecon': 'run4SRecon',
      'run4SScan': 'run4SScan', 
      'run4SDNS': 'run4SDNS',
      'scanThreats': 'scanThreats',
      'encryptData': 'encodeData', // Map to safe encode
      'decryptData': 'decodeData', // Map to safe decode
      'showAudit': 'showAudit'
    };
    
    for(const [oldFn, newFn] of Object.entries(overrides)) {
      if(typeof window.ShadowSoulSpirit[oldFn] === 'function') {
        window.ShadowSoulSpirit[oldFn] = () => ShadowSoulSpiritAdvanced[newFn]();
        console.log(`✅ Overridden: ${oldFn} → ${newFn}`);
      }
    }
    console.log('✅ 4S Advanced modules safely injected');
  } else {
    console.warn('⚠️ ShadowSoulSpirit not ready, retrying in 500ms...');
    setTimeout(safeOverride, 500); // Retry with shorter interval
  }
}

// Start override process when DOM is ready
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeOverride);
} else {
  safeOverride();
}
console.log('✅ 4S Advanced Module Loaded (Safe Mode)');
