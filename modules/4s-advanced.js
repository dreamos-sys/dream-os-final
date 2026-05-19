/**
 * Dream OS - 4S Advanced Defense System v1.0.0
 * FULL POWER Developer Tools • Defensive Only • Built with Understanding
 * 
 * ACCESS: 7x tap logo + password (b15m1114h_0124)
 * PURPOSE: System testing, security audit, defensive forensics
 * USERS: Dream OS developers ONLY
 */

window.ShadowSoulSpiritAdvanced = {
  version: '1.0.0',
  
  // ========== AUDIT LOGGING ==========
  logAudit: function(action, detail) {
    try {
      const logs = JSON.parse(localStorage.getItem('dream_os_4s_audit') || '[]');
      logs.push({
        time: new Date().toISOString(),
        action: action,
        detail: String(detail).substring(0, 1000),
        hash: 'sha256:' + btoa(action + detail + Date.now()).substring(0, 32)
      });
      localStorage.setItem('dream_os_4s_audit', JSON.stringify(logs.slice(-100))); // Keep last 100
      console.log(`[4S AUDIT] ${action}: ${detail}`);
    } catch(e) { console.warn('Audit log error:', e); }
  },

  // ========== 4S RECON - FULL DOM/SCRIPT ANALYSIS ==========
  run4SRecon: function() {
    try {
      const scripts = Array.from(document.scripts).map(s => ({src: s.src, async: s.async, type: s.type})).filter(s => s.src);
      const links = Array.from(document.links).map(l => l.href).filter(h => h && h.startsWith('http'));
      const forms = Array.from(document.forms).map(f => ({action: f.action, method: f.method, inputs: Array.from(f.elements).map(e => e.name)}));
      const hidden = Array.from(document.querySelectorAll('input[type="hidden"], meta[name], meta[property]')).map(e => ({name: e.name||e.property, content: e.content}));
      
      const report = `🔍 4S RECON - FULL SCAN\n\nScripts: ${scripts.length}\nExternal Links: ${links.length}\nForms: ${forms.length}\nHidden Fields: ${hidden.length}\n\n⚠️ Full detail in Console`;
      
      console.group('🔍 4S Recon - Full Report');
      console.table({scripts, links, forms, hidden});
      console.groupEnd();
      
      this.logAudit('4S Recon', `Scanned: ${scripts.length} scripts, ${forms.length} forms`);
      alert(report);
    } catch(e) { console.error('Recon error:', e); alert('⚠️ Recon failed'); }
  },
  // ========== 4S SCAN - NETWORK/RESOURCE ANALYSIS ==========
  run4SScan: function() {
    try {
      const resources = performance.getEntriesByType('resource');
      const nav = performance.getEntriesByType('navigation')[0] || {};
      
      let stats = {total: resources.length, byType: {}, thirdParty: 0, slow: 0, errors: 0};
      
      resources.forEach(r => {
        stats.byType[r.initiatorType] = (stats.byType[r.initiatorType] || 0) + 1;
        if(r.name && new URL(r.name, location.href).hostname !== location.hostname) stats.thirdParty++;
        if(r.duration > 1000) stats.slow++;
        if(r.responseStatus && r.responseStatus >= 400) stats.errors++;
      });
      
      const report = `🕸️ 4S NETWORK SCAN\n\nTotal Requests: ${stats.total}\nBy Type: ${JSON.stringify(stats.byType)}\nThird-Party: ${stats.thirdParty}\nSlow (>1s): ${stats.slow}\nErrors (4xx/5xx): ${stats.errors}\n\nPage Load: ${nav.duration?.toFixed(2) || 'N/A'}ms\nDOM Interactive: ${nav.domInteractive?.toFixed(2) || 'N/A'}ms`;
      
      this.logAudit('4S Scan', `Analyzed ${stats.total} resources`);
      alert(report);
    } catch(e) { console.error('Scan error:', e); alert('⚠️ Scan failed'); }
  },

  // ========== 4S DNS - REAL DNS LOOKUP ==========
  run4SDNS: async function() {
    try {
      const domain = prompt('🌐 4S DNS Lookup\nEnter domain:', location.hostname || 'example.com');
      if(!domain) return;
      
      const types = ['A', 'AAAA', 'MX', 'TXT', 'NS'];
      let results = {};
      
      for(const type of types) {
        try {
          const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`, {headers: {'Accept': 'application/dns-json'}});
          const data = await res.json();
          results[type] = data.Answer ? data.Answer.map(a => a.data) : [];
        } catch(e) { results[type] = [`Error: ${e.message}`]; }
      }
      
      const report = `🌐 4S DNS Results for ${domain}:\n\nA: ${results.A.join(', ')}\nAAAA: ${results.AAAA.join(', ')}\nMX: ${results.MX.join(', ')}\nTXT: ${results.TXT.join(', ')}\nNS: ${results.NS.join(', ')}`;
      
      this.logAudit('4S DNS', `${domain} → ${results.A[0] || 'No A record'}`);
      alert(report);
    } catch(e) { console.error('DNS error:', e); alert('⚠️ DNS lookup failed'); }
  },

  // ========== SPIRITUAL SCAN - SYSTEM INTEGRITY ==========
  scanThreats: function() {
    try {
      const checks = {        'HTTPS': location.protocol === 'https:',
        'CSP': !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
        'X-Frame-Options': !!document.querySelector('meta[http-equiv="X-Frame-Options"]'),
        'Referrer-Policy': !!document.querySelector('meta[http-equiv="Referrer-Policy"]'),
        'Secure Context': window.isSecureContext,
        'Service Worker': 'serviceWorker' in navigator,
        'LocalStorage': !!window.localStorage,
        'SessionStorage': !!window.sessionStorage
      };
      
      const passed = Object.values(checks).filter(v => v).length;
      const total = Object.values(checks).length;
      const score = Math.round((passed/total)*100);
      
      const report = `🔥 4S INTEGRITY SCAN\n\nScore: ${score}/100\n\n${Object.entries(checks).map(([k,v]) => `${k}: ${v?'✅':'❌'}`).join('\n')}\n\nPassed: ${passed}/${total}`;
      
      this.logAudit('Integrity Scan', `Score: ${score}/100`);
      alert(report);
    } catch(e) { console.error('Integrity error:', e); alert('⚠️ Scan failed'); }
  },

  // ========== ENCODE/DECODE (DEV TOOLS) ==========
  encodeData: function() {
    try {
      const text = prompt('🔐 Enter text to encode:');
      if(!text) return;
      const encoded = btoa(unescape(encodeURIComponent(text)));
      this.logAudit('Encode', 'Text encoded');
      prompt('✅ Encoded (Base64):', encoded);
    } catch(e) { alert('❌ Encode failed'); }
  },
  
  decodeData: function() {
    try {
      const text = prompt('🔓 Enter encoded text:');
      if(!text) return;
      const decoded = decodeURIComponent(escape(atob(text)));
      this.logAudit('Decode', 'Text decoded');
      alert('✅ Decoded:\n' + decoded);
    } catch(e) { alert('❌ Invalid encoded string'); }
  },

  // ========== COOKIES INSPECTOR ==========
  showCookies: function() {
    try {
      const cookies = document.cookie;
      if(!cookies) return alert('🍪 No cookies found');
      const parsed = cookies.split('; ').map(c => {const [k,...v] = c.split('='); return {name: k, value: v.join('=').substring(0, 100)}});
      this.logAudit('Cookies', `Read ${parsed.length} cookies`);
      console.table(parsed);      alert(`🍪 Cookies (${parsed.length}):\n\n${parsed.map(c => `• ${c.name}: ${c.value}...`).join('\n')}\n\n(Full detail in Console)`);
    } catch(e) { alert('⚠️ Cookie read failed'); }
  },

  // ========== SESSION STORAGE VIEWER ==========
  showSession: function() {
    try {
      if(!sessionStorage.length) return alert('🔑 SessionStorage empty');
      const items = Array.from({length: sessionStorage.length}, (_,i) => ({key: sessionStorage.key(i), value: sessionStorage.getItem(sessionStorage.key(i))?.substring(0, 100)}));
      this.logAudit('Session', `Read ${items.length} items`);
      console.table(items);
      alert(`🔑 SessionStorage (${items.length}):\n\n${items.map(i => `• ${i.key}`).join('\n')}\n\n(Full detail in Console)`);
    } catch(e) { alert('⚠️ Session read failed'); }
  },

  // ========== LOCAL STORAGE VIEWER + SIZE ==========
  showStorage: function() {
    try {
      if(!localStorage.length) return alert('🗄️ LocalStorage empty');
      let totalSize = 0;
      const items = Array.from({length: localStorage.length}, (_,i) => {
        const key = localStorage.key(i);
        const val = localStorage.getItem(key);
        totalSize += (key.length + (val?.length || 0)) * 2;
        return {key, size: ((key.length + (val?.length || 0)) * 2 / 1024).toFixed(2) + ' KB'};
      });
      const kb = (totalSize / 1024).toFixed(2);
      this.logAudit('Storage', `Read ${items.length} items (~${kb} KB)`);
      console.table(items);
      alert(`🗄️ LocalStorage (${items.length} items, ~${kb} KB):\n\n${items.map(i => `• ${i.key} (${i.size})`).join('\n')}\n\n(Full detail in Console)`);
    } catch(e) { alert('⚠️ Storage read failed'); }
  },

  // ========== GPS / GEOLOCATION (FULL POWER) ==========
  showGPS: function() {
    if(!navigator.geolocation) return alert('🛰️ Geolocation not supported');
    
    if(!confirm('🛰️ 4S GPS Test\n\nRequest high-accuracy location for system testing?\n\nCoordinates will be displayed for verification.')) return;
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = pos.coords;
        const report = `🛰️ GPS COORDINATES\n\nLatitude: ${c.latitude}\nLongitude: ${c.longitude}\nAccuracy: ${c.accuracy}m\nAltitude: ${c.altitude?.toFixed(2) || 'N/A'}m\nSpeed: ${c.speed?.toFixed(2) || 'N/A'} m/s\nHeading: ${c.heading?.toFixed(2) || 'N/A'}°\n\nTimestamp: ${new Date(pos.timestamp).toLocaleString()}`;
        this.logAudit('GPS', `Location: ${c.latitude.toFixed(4)}, ${c.longitude.toFixed(4)}`);
        alert(report);
      },
      (err) => {
        this.logAudit('GPS', `Error: ${err.message}`);
        alert(`❌ GPS Error: ${err.message}\n\nCheck: Location permission enabled, GPS on, outdoor test`);
      },      {enableHighAccuracy: true, timeout: 15000, maximumAge: 0}
    );
  },

  // ========== SYSTEM HEALTH - FULL HARDWARE INFO ==========
  showHealth: function() {
    try {
      const mem = navigator.deviceMemory || 'Unknown';
      const cores = navigator.hardwareConcurrency || 'Unknown';
      const platform = navigator.platform;
      const ua = navigator.userAgent;
      const lang = navigator.language;
      const onLine = navigator.onLine;
      const connection = navigator.connection ? `${navigator.connection.effectiveType} (${navigator.connection.downlink} Mbps)` : 'Unknown';
      
      const report = `📈 SYSTEM HEALTH\n\nCPU Cores: ${cores}\nRAM Estimate: ~${mem} GB\nPlatform: ${platform}\nLanguage: ${lang}\nOnline: ${onLine ? '✅ Yes' : '❌ No'}\nConnection: ${connection}\n\nUser Agent: ${ua.substring(0, 100)}...`;
      
      this.logAudit('System Health', `Cores: ${cores}, RAM: ~${mem}GB`);
      alert(report);
    } catch(e) { alert('⚠️ Health check failed'); }
  },

  // ========== BACKUP - FULL LOCALSTORAGE EXPORT ==========
  createBackup: function() {
    try {
      const data = {};
      for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dream_os_full_backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.logAudit('Backup', `Exported ${Object.keys(data).length} keys`);
      alert(`💾 FULL BACKUP CREATED!\n\nKeys: ${Object.keys(data).length}\nFile: dream_os_full_backup_${Date.now()}.json\n\n⚠️ Store securely - contains all localStorage data`);
    } catch(e) { alert('⚠️ Backup failed: ' + e.message); }
  },

  // ========== QUANTUM BOOST - FULL SYSTEM REFRESH ==========
  quantumBoost: function() {
    if(!confirm('⚡ QUANTUM BOOST\n\nThis will:\n• Clear sessionStorage\n• Clear cache (if supported)\n• Reload page with cache-bust\n\nContinue?')) return;
        try {
      sessionStorage.clear();
      if('caches' in window) {
        caches.keys().then(names => names.forEach(name => caches.delete(name)));
      }
      this.logAudit('Quantum Boost', 'System rebooted');
      alert('⚡ Quantum Boost Applied!\n\nReloading with fresh cache...');
      setTimeout(() => {
        window.location.href = window.location.href.split('?')[0] + '?v=quantum-' + Date.now();
      }, 1000);
    } catch(e) {
      this.logAudit('Quantum Boost', `Error: ${e.message}`);
      window.location.reload(true);
    }
  },

  // ========== AUDIT LOG VIEWER ==========
  showAudit: function() {
    try {
      const logs = JSON.parse(localStorage.getItem('dream_os_4s_audit') || '[]');
      if(!logs.length) return alert('📋 Audit log empty');
      
      console.table(logs);
      const summary = logs.slice(-20).reverse().map(l => `[${new Date(l.time).toLocaleTimeString()}] ${l.action}: ${l.detail.substring(0, 50)}`).join('\n');
      alert(`📋 RECENT AUDIT LOGS (Last 20)\n\n${summary}\n\n(Full log in Console)`);
    } catch(e) { alert('⚠️ Audit read failed'); }
  }
};

// ========== SAFE OVERRIDE WITH RETRY ==========
function safeOverride() {
  if(window.ShadowSoulSpirit && typeof window.ShadowSoulSpirit === 'object') {
    const overrides = {
      'run4SRecon': 'run4SRecon', 'run4SScan': 'run4SScan', 'run4SDNS': 'run4SDNS',
      'scanThreats': 'scanThreats', 'encryptData': 'encodeData', 'decryptData': 'decodeData',
      'showAudit': 'showAudit', 'showCookies': 'showCookies', 'showSession': 'showSession',
      'showStorage': 'showStorage', 'showGPS': 'showGPS', 'showHealth': 'showHealth',
      'createBackup': 'createBackup', 'quantumBoost': 'quantumBoost'
    };
    
    let count = 0;
    for(const [oldFn, newFn] of Object.entries(overrides)) {
      if(typeof window.ShadowSoulSpirit[oldFn] === 'function') {
        window.ShadowSoulSpirit[oldFn] = () => ShadowSoulSpiritAdvanced[newFn]();
        count++;
      }
    }
    console.log(`✅ 4S Advanced: ${count}/${Object.keys(overrides).length} functions upgraded`);
  } else {
    setTimeout(safeOverride, 300);  }
}

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeOverride);
} else {
  safeOverride();
}

console.log('🚀 4S Advanced Defense v' + ShadowSoulSpiritAdvanced.version + ' Loaded - FULL POWER');

// ========== FANCY REPORT MODAL (Optional UI Upgrade) ==========
window.ShadowSoulSpiritAdvanced.showFancyReport = function(title, content, consoleData) {
  // Remove existing modal
  const existing = document.getElementById('4s-fancy-modal');
  if(existing) existing.remove();
  
  // Create modal
  const modal = document.createElement('div');
  modal.id = '4s-fancy-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;';
  
  modal.innerHTML = `
    <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border:2px solid #10b981;border-radius:16px;max-width:600px;width:100%;max-height:80vh;overflow-y:auto;color:white;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:15px 20px;border-bottom:1px solid #334155;">
        <h3 style="color:#10b981;margin:0;font-size:1.2rem">${title}</h3>
        <button onclick="document.getElementById('4s-fancy-modal').remove()" style="background:#ef4444;color:white;border:none;padding:5px 15px;border-radius:6px;cursor:pointer;font-weight:700">✕</button>
      </div>
      <div style="padding:20px;font-family:monospace;font-size:0.85rem;white-space:pre-wrap;">${content}</div>
      <div style="padding:0 20px 20px 20px;text-align:center;">
        <button onclick="console.table(${JSON.stringify(consoleData || {})});document.getElementById('4s-fancy-modal').remove()" style="background:#10b981;color:white;border:none;padding:10px 25px;border-radius:8px;cursor:pointer;font-weight:700">📊 View in Console</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
};

// Override alert calls to use fancy modal (optional - uncomment to enable)
/*
ShadowSoulSpiritAdvanced.run4SScan = function() {
  // ... existing scan logic ...
  this.showFancyReport('🕸️ 4S NETWORK SCAN', report, {resources, stats});
};
*/
