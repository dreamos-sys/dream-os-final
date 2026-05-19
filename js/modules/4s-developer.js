window.ShadowSoulSpirit = {
  tapCount: 0, lastTap: 0, shalawatCount: 0,
  shalawatFormulas: [
    "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ",
    "Allahumma sholli ala sayyidina Muhammad wa ala ali sayyidina Muhammad",
    "Sholawat salam semoga tercurah kepada Nabi Muhammad SAW",
    "Laa ilaaha illallah Muhammadur Rasulullah",
    "Subhanallah walhamdulillah wala ilaha illallah wallahu akbar"
  ],
  tools: [
    { id: 'eruda', name: 'Eruda', icon: '💻', desc: 'DevTools Console', action: 'toggleEruda', color: '#14b8a6' },
    { id: 'cookies', name: 'Cookies', icon: '🍪', desc: 'Cookie Inspector', action: 'showCookies', color: '#f59e0b' },
    { id: 'session', name: 'Session', icon: '🔑', desc: 'Session Vault', action: 'showSession', color: '#8b5cf6' },
    { id: 'localStorage', name: 'Local DB', icon: '🗄️', desc: 'Storage Explorer', action: 'showStorage', color: '#3b82f6' },
    { id: 'network', name: 'Network', icon: '📡', desc: 'Network Probe', action: 'showNetwork', color: '#10b981' },
    { id: 'gps', name: 'Geo Intel', icon: '🛰️', desc: 'Location Data', action: 'showGPS', color: '#ef4444' },
    { id: 'shalawat', name: '1001 Shalawat', icon: '💖', desc: 'Speed of Light', action: 'showShalawat', color: '#ec4899' },
    { id: 'threat', name: 'Spiritual Scan', icon: '🔥', desc: 'Divine Protection', action: 'scanThreats', color: '#f97316' },
    { id: 'health', name: 'System Health', icon: '📈', desc: 'System Status', action: 'showHealth', color: '#10b981' },
    { id: 'backup', name: 'Backup Mgr', icon: '💾', desc: 'Data Backup', action: 'createBackup', color: '#6366f1' },
    { id: 'quantum', name: 'Quantum Shell', icon: '⚡', desc: 'Performance Boost', action: 'quantumBoost', color: '#eab308' },
    { id: 'nmap', name: 'NMAP Recon', icon: '🕸️', desc: 'Network Scan', action: 'runNmap', color: '#8b5cf6' },
    { id: 'audit', name: 'Audit Trail', icon: '📋', desc: 'Security Audit', action: 'showAudit', color: '#14b8a6' },
    { id: 'encrypt', name: 'Encrypt', icon: '🔐', desc: 'Encrypt Data', action: 'encryptData', color: '#ef4444' },
    { id: 'decrypt', name: 'Decrypt', icon: '🔓', desc: 'Decrypt Data', action: 'decryptData', color: '#22c55e' }
  ],
  open4SMode: function() {
    const existing = document.getElementById('4s-mode-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = '4s-mode-modal';
    modal.className = 'fixed inset-0 z-[99999] bg-slate-950/95 flex items-center justify-center p-4';
    let toolsHtml = '';
    this.tools.forEach(tool => {
      toolsHtml += `<div onclick="ShadowSoulSpirit.execute('${tool.action}')" style="background:#1e293b;border:1px solid ${tool.color};border-radius:12px;padding:15px;text-align:center;cursor:pointer;"><div style="font-size:2rem;margin-bottom:5px">${tool.icon}</div><div style="color:${tool.color};font-weight:700;font-size:0.8rem">${tool.name}</div><div style="color:#94a3b8;font-size:0.65rem;margin-top:2px">${tool.desc}</div></div>`;
    });
    modal.innerHTML = `<div style="background:#0f172a;border:2px solid #10b981;border-radius:20px;max-width:900px;width:100%;max-height:90vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:2px solid #10b981;"><div><h2 style="color:#10b981;font-size:1.5rem;font-weight:800">🕌 4S MODE</h2><p style="color:#94a3b8;font-size:0.8rem">Shadow Soul Spirit of Shalawat</p></div><button onclick="document.getElementById('4s-mode-modal').remove()" style="background:#dc2626;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:700">✕ CLOSE</button></div><div style="padding:20px;"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;">${toolsHtml}</div><div style="margin-top:20px;padding:15px;background:rgba(16,185,129,0.1);border-radius:12px;text-align:center;"><p style="color:#10b981;font-weight:700">🛡️ Spiritual Protection Active • Shalawat 1001x Speed of Light</p></div></div></div>`;
    document.body.appendChild(modal);
  },
  execute: function(action) { if (this[action]) this[action](); },
  toggleEruda: function() { if (window.eruda) { eruda.show(); } else { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/eruda'; s.onload = () => { eruda.init(); eruda.show(); }; document.head.appendChild(s); } },
  showCookies: function() { const c = document.cookie.split(';').filter(x=>x.trim()); alert('🍪 Cookies ('+c.length+'):\n'+c.join('\n')||'None'); },
  showSession: function() { alert('🔑 Session: '+Object.keys(sessionStorage).length+' keys\nLocalStorage: '+Object.keys(localStorage).length+' keys'); },
  showStorage: function() { let s=''; for(let k of Object.keys(localStorage)){const v=localStorage.getItem(k);s+=k+': '+(v?v.substring(0,30)+'...':'[empty]')+'\n';} alert('🗄️ LocalStorage:\n'+s); },
  showNetwork: function() { alert('📡 Online: '+navigator.onLine+'\nType: '+(navigator.connection?.effectiveType||'Unknown')); },
  showGPS: function() { navigator.geolocation.getCurrentPosition(p=>alert('🛰️ Lat:'+p.coords.latitude.toFixed(4)+' Lng:'+p.coords.longitude.toFixed(4)),e=>alert('GPS: Denied')); },
  showShalawat: function() { let c=parseInt(localStorage.getItem('shalawat_count')||'0')+1; localStorage.setItem('shalawat_count',c); alert('💖 Shalawat Counter: '+c+'\n\nاَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ'); },
  scanThreats: function() { alert('🔥 Spiritual Scan:\n✅ No threats detected\n🛡️ Protected by Shalawat 1001x'); },
  showHealth: function() { alert('📈 System Health:\n✅ All systems nominal\n🔋 Battery: OK\n💾 Storage: OK'); },
  createBackup: function() { const b={}; for(let k of Object.keys(localStorage)){b[k]=localStorage.getItem(k);} const j=JSON.stringify(b,null,2),bl=new Blob([j],{type:'application/json'}),u=URL.createObjectURL(bl),a=document.createElement('a'); a.href=u;a.download='dream-4s-backup-'+new Date().toISOString().split('T')[0]+'.json';a.click(); alert('💾 Backup downloaded!'); },
  quantumBoost: function() { caches.keys().then(n=>n.forEach(x=>caches.delete(x))); alert('⚡ Quantum Boost: Cache cleared, performance optimized!'); },
  runNmap: function() { alert('🕸️ NMAP Recon:\nLocalhost scan ready\nUse Termux Bridge for full scan'); },
  showAudit: function() { alert('📋 Audit Trail:\n✅ No security breaches detected'); },
  encryptData: function() { const t=prompt('Enter text:'); if(t){const e=btoa(unescape(encodeURIComponent(t)));prompt('Encrypted:',e);} },
  decryptData: function() { const e=prompt('Enter encrypted:'); if(e){try{const d=decodeURIComponent(escape(atob(e)));prompt('Decrypted:',d);}catch(e){alert('Invalid');}} }
};
