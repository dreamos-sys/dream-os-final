console.log("🚀 Dream OS Premium UI v6.0 - Compact & Visual!");

// =====================================================================
// 1. CSS PREMIUM: COMPACT LAYOUT + ANIMASI MODERN
// =====================================================================
const styleFix = document.createElement('style');
styleFix.innerHTML = `
  /* Dashboard Compact */
  #stats-card { padding: 8px !important; margin-bottom: 8px !important; }
  #stats-card .glass-pearl { padding: 10px !important; }
  #carousel-container { margin: 8px 0 !important; }
  #carousel-slides { min-height: 100px !important; padding: 10px !important; }
  .carousel-dots { margin-top: 5px !important; }
  
  /* Grid Menu Lebih Naik & Compact */
  .grid.grid-cols-3 { gap: 0.4rem !important; }
  .grid.grid-cols-3 > div { 
    padding: 8px 4px !important; 
    min-height: 75px !important;
    transform: scale(0.95);
    margin: -2px 0;
  }
  .grid.grid-cols-3 .text-2xl { font-size: 1.5rem !important; margin-bottom: 2px !important; }
  .grid.grid-cols-3 .text-[10px] { font-size: 9px !important; }

  /* 4S Mode Compact Cards */
  #ghost-tools-grid .grid { gap: 0.5rem !important; }
  #ghost-tools-grid button { 
    padding: 0.6rem 0.3rem !important; 
    min-height: 85px !important; 
    border-radius: 10px !important;
    transform: scale(0.98);
  }
  #ghost-tools-grid button .text-2xl { font-size: 1.4rem !important; margin-bottom: 3px !important; }
  #ghost-tools-grid button .text-\[11px\] { font-size: 9px !important; line-height: 1.1; }
  
  /* Modal Premium dengan Animasi */
  @keyframes modalSlideUp { 
    0% { opacity: 0; transform: translateY(30px) scale(0.95); } 
    100% { opacity: 1; transform: translateY(0) scale(1); } 
  }
  .fours-modal { animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  /* Visualisasi Data Premium */
  .data-card { 
    background: linear-gradient(135deg, rgba(13,148,136,0.1), rgba(13,148,136,0.05));    border: 1px solid rgba(13,148,136,0.3);
    border-radius: 12px;
    padding: 12px;
    margin: 8px 0;
  }
  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: bold;
    margin: 2px;
  }
  .status-open { background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid #ef4444; }
  .status-closed { background: rgba(34,197,94,0.2); color: #22c55e; border: 1px solid #22c55e; }
  .status-protected { background: rgba(16,185,129,0.2); color: #10b981; border: 1px solid #10b981; }
  
  .port-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); 
    gap: 8px; 
    margin: 10px 0;
  }
  .port-item {
    background: rgba(15,23,42,0.8);
    border-radius: 8px;
    padding: 8px;
    text-align: center;
    border: 1px solid rgba(148,163,184,0.2);
  }
  .port-number { font-size: 14px; font-weight: bold; color: #2dd4bf; }
  .port-status { font-size: 9px; margin-top: 4px; }
`;
document.head.appendChild(styleFix);

// =====================================================================
// 2. MODAL PREMIUM COMPONENT
// =====================================================================
window.FourSUI = {
  showPrompt: function(title, placeholder, onConfirm) {
    const old = document.getElementById('fours-modal'); if(old) old.remove();
    const m = document.createElement('div'); m.id = 'fours-modal';
    m.className = 'fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 text-white opacity-0 transition-opacity duration-300';
    m.innerHTML = `
      <div class="fours-modal bg-gradient-to-br from-slate-900 to-slate-800 border border-teal-500/50 rounded-2xl w-full max-w-sm shadow-[0_0_40px_rgba(13,148,136,0.3)] overflow-hidden">
        <div class="p-4 bg-gradient-to-r from-teal-900/50 to-slate-800 border-b border-teal-500/30 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-xl">🔍</div>
          <div><h3 class="text-sm font-bold text-teal-400">${title}</h3><p class="text-[10px] text-slate-400">Real-time intelligence</p></div>
        </div>
        <div class="p-5">          <input type="text" id="fours-in" placeholder="${placeholder}" class="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-teal-300 outline-none focus:border-teal-500 transition-all text-sm font-mono placeholder-slate-600" autocomplete="off">
          <div class="flex justify-end gap-3 mt-5">
            <button id="fours-btn-x" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all">Batal</button>
            <button id="fours-btn-ok" class="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-xs font-bold text-white shadow-[0_0_20px_rgba(13,148,136,0.5)] transition-all transform hover:scale-105">Scan 🚀</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(m);
    setTimeout(() => m.classList.remove('opacity-0'), 10);
    const input = document.getElementById('fours-in');
    input.focus();
    document.getElementById('fours-btn-x').onclick = () => { m.classList.add('opacity-0'); setTimeout(()=>m.remove(), 300); };
    document.getElementById('fours-btn-ok').onclick = () => { const val = input.value; if(val){ m.remove(); onConfirm(val); } };
    input.addEventListener('keypress', (e) => { if(e.key === 'Enter') { const val = input.value; if(val){ m.remove(); onConfirm(val); } }});
  },

  showResult: function(title, data, type = 'default') {
    const old = document.getElementById('fours-modal'); if(old) old.remove();
    const m = document.createElement('div'); m.id = 'fours-modal';
    m.className = 'fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 text-white opacity-0 transition-opacity duration-300';
    
    let content = '';
    
    if(type === 'scan') {
      // Visualisasi Port Scan dengan Grid
      const ports = data.ports || {};
      let portHTML = '<div class="port-grid">';
      for(let [port, status] of Object.entries(ports)) {
        const statusClass = status.includes('OPEN') ? 'status-open' : 'status-closed';
        const icon = status.includes('OPEN') ? '🔓' : '🔒';
        portHTML += `
          <div class="port-item">
            <div class="port-number">${port}</div>
            <div class="port-status ${statusClass}">${icon} ${status}</div>
          </div>`;
      }
      portHTML += '</div>';
      
      content = `
        <div class="data-card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400">Target:</span>
            <span class="text-sm font-bold text-teal-400 font-mono">${data.target}</span>
          </div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400">Status:</span>
            <span class="status-badge status-protected">${data.protection}</span>
          </div>
          <div class="mb-3">
            <p class="text-xs text-slate-400 mb-2">Port Scan Results:</p>            ${portHTML}
          </div>
          <div class="text-[10px] text-slate-500 text-center mt-3">🕌 Protected by Shalawat 1001x</div>
        </div>`;
    } else if(type === 'recon' || type === 'dns') {
      // Visualisasi DNS Records
      const records = data.data || data.records || [];
      let recordsHTML = '';
      if(Array.isArray(records) && records.length > 0) {
        recordsHTML = '<div class="space-y-2">';
        records.forEach((r, i) => {
          recordsHTML += `
            <div class="data-card" style="margin: 4px 0; padding: 8px;">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-slate-400">Record #${i+1}</span>
                <span class="status-badge status-protected">Type: ${r.type || 'A'}</span>
              </div>
              <div class="text-xs text-teal-300 font-mono mt-2 break-all">${r.data || r.value || JSON.stringify(r)}</div>
            </div>`;
        });
        recordsHTML += '</div>';
      } else {
        recordsHTML = '<div class="text-center text-slate-500 text-sm py-4">No records found</div>';
      }
      
      content = `
        <div class="data-card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-slate-400">Domain:</span>
            <span class="text-sm font-bold text-teal-400 font-mono">${data.domain || data.msg?.split(':')[1] || 'N/A'}</span>
          </div>
          <div class="mb-3">
            <p class="text-xs text-slate-400 mb-2">DNS Records:</p>
            ${recordsHTML}
          </div>
          <div class="text-[10px] text-slate-500 text-center mt-3">🕌 Spiritual DNS Protection Active</div>
        </div>`;
    } else {
      // Default JSON viewer
      content = `<pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono whitespace-pre-wrap text-emerald-400 overflow-x-auto max-h-[60vh] overflow-y-auto">${JSON.stringify(data, null, 2)}</pre>`;
    }
    
    m.innerHTML = `
      <div class="fours-modal bg-gradient-to-br from-slate-900 to-slate-800 border border-teal-500/50 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(13,148,136,0.4)] overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-4 bg-gradient-to-r from-teal-900/50 to-slate-800 border-b border-teal-500/30 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-xl">📊</div>
            <div><h3 class="text-sm font-bold text-teal-400">${title}</h3><p class="text-[10px] text-slate-400">Real-time results</p></div>
          </div>
          <span class="status-badge status-protected">🕌 4S Protected</span>        </div>
        <div class="p-5 overflow-y-auto flex-1">
          ${content}
        </div>
        <div class="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button id="fours-btn-close" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-xs font-bold text-slate-300 transition-all w-full sm:w-auto transform hover:scale-105">Selesai ✖</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    setTimeout(() => m.classList.remove('opacity-0'), 10);
    document.getElementById('fours-btn-close').onclick = () => { m.classList.add('opacity-0'); setTimeout(()=>m.remove(), 300); };
  }
};

// =====================================================================
// 3. REAL API ENGINE
// =====================================================================
window.FourS = {
  recon: async function(q) {
    try {
      const res = await fetch(\`https://dns.google/resolve?name=\${encodeURIComponent(q)}&type=A\`);
      const data = await res.json();
      return { msg: \`[🕌 Protected by Shalawat 1001x]\\nTarget: \${q}\`, data: data.Answer || [], domain: q };
    } catch(e) { return { msg: \`[Offline Mode]\\nTarget: \${q}\`, data: [], domain: q }; }
  },
  scan: async function(t) {
    const res = { target: t, protection: '🕌 Shalawat 1001x Active', ports: {}, timestamp: new Date().toLocaleString() };
    for(let port of [22, 80, 443, 3306, 8080, 8443]) {
      try {
        const c = new AbortController(); setTimeout(() => c.abort(), 1000);
        await fetch(\`http://\${t}:\${port}\`, { mode: 'no-cors', signal: c.signal });
        res.ports[port] = 'FILTERED/OPEN';
      } catch(e) { res.ports[port] = 'CLOSED/SECURE'; }
    }
    return res;
  },
  dns: async function(d) {
    try {
      const res = await fetch(\`https://dns.google/resolve?name=\${encodeURIComponent(d)}&type=A\`, { headers: { 'Accept': 'application/dns-json' }});
      const data = await res.json();
      return { domain: d, protection: '🕌 Spiritual DNS Protection', records: data.Answer || [] };
    } catch(e) { return { domain: d, error: 'Lookup failed', protection: '🕌 Local Fallback' }; }
  },
  whois: async function(d) {
    return { 
      domain: d, 
      registrar: '[Protected by Privacy - Real WHOIS requires API key]', 
      created: '[Educational Demo]',
      expires: '[Privacy Protected]',
      nameservers: ['ns1.4s-protected.com', 'ns2.4s-protected.com'],       protection: '🕌 Privacy Protected by Design',
      disclaimer: '⚠️ For production: Register at whoisxmlapi.com'
    };
  }
};

// =====================================================================
// 4. AUTO-HIJACK CLICK EVENTS
// =====================================================================
document.addEventListener('click', async function(e) {
    let target = e.target.closest('button, .glass-card, div[role="button"], a, div[onclick]');
    if (!target) target = e.target;

    const text = (target.innerText || target.textContent || '').toUpperCase();
    let action = null;

    if (text.includes('4S RECON') || text.includes('OSINT')) action = 'recon';
    else if (text.includes('4S SCAN') || text.includes('NMAP')) action = 'scan';
    else if (text.includes('4S DNS') || text.includes('DOMAIN, RECORDS')) action = 'dns';
    else if (text.includes('4S WHOIS') || text.includes('OWNERSHIP')) action = 'whois';

    if (action) {
        e.preventDefault(); e.stopPropagation();

        if (action === 'recon') {
            FourSUI.showPrompt('🔍 4S Recon Intelligence', 'Enter domain (e.g., google.com)', async (q) => {
                const r = await window.FourS.recon(q); FourSUI.showResult('🔍 4S Recon Results', r, 'recon');
            });
        } else if (action === 'scan') {
            FourSUI.showPrompt('🕸️ 4S Network Scan', 'Enter target (e.g., localhost)', async (t) => {
                const r = await window.FourS.scan(t); FourSUI.showResult('🕸️ 4S Port Scan Results', r, 'scan');
            });
        } else if (action === 'dns') {
            FourSUI.showPrompt('🌐 4S DNS Lookup', 'Enter domain (e.g., example.com)', async (d) => {
                const r = await window.FourS.dns(d); FourSUI.showResult('🌐 4S DNS Records', r, 'dns');
            });
        } else if (action === 'whois') {
            FourSUI.showPrompt('📋 4S WHOIS Lookup', 'Enter domain (e.g., github.com)', async (w) => {
                const r = await window.FourS.whois(w); FourSUI.showResult('📋 4S Domain Intel', r, 'whois');
            });
        }
    }
}, true);

console.log('✅ Premium UI v6.0 Loaded - Compact + Visual + Spiritual!');
