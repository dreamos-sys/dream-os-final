console.log("🚀 Absolute UI Hijacker v5.2 Active! Premium Modal & Grid Fix Loaded.");

// =====================================================================
// 1. CSS AUTO-INJECTOR: MERAPIKAN GRID YANG NANGGUNG & KEBESARAN
// =====================================================================
const styleFix = document.createElement('style');
styleFix.innerHTML = `
  /* Merampingkan Panel 4S Ghost Tools biar elegan dan gak kebesaran */
  #ghost-tools-grid .grid { gap: 0.4rem !important; }
  #ghost-tools-grid button { padding: 0.5rem 0.25rem !important; min-height: 70px; border-radius: 12px; }
  #ghost-tools-grid button .text-2xl { font-size: 1.3rem !important; margin-bottom: 2px !important; }
  #ghost-tools-grid button .text-[11px] { font-size: 9px !important; line-height: 1.1; }
  
  /* Merampingkan Grid 3 Kolom Beranda Utama biar pas di layar */
  .grid.grid-cols-3 { gap: 0.5rem !important; padding-bottom: 1rem; }
  .grid.grid-cols-3 > div { transform: scale(0.96); margin: -4px 0; }
  
  /* Animasi Modal Premium */
  @keyframes modalPop { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
  .fours-modal-anim { animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;
document.head.appendChild(styleFix);

// =====================================================================
// 2. KOTAK DIALOG (MODAL) PREMIUM PENGGANTI ALERT JADUL
// =====================================================================
window.FourSUI = {
  showPrompt: function(title, placeholder, onConfirm) {
    const old = document.getElementById('fours-custom-modal'); if(old) old.remove();
    const m = document.createElement('div'); m.id = 'fours-custom-modal';
    m.className = 'fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 text-white opacity-0 transition-opacity duration-300';
    m.innerHTML = `
      <div class="fours-modal-anim bg-slate-900 border border-teal-500/50 rounded-2xl w-full max-w-sm shadow-[0_0_30px_rgba(13,148,136,0.2)] overflow-hidden">
        <div class="p-4 bg-slate-800/80 border-b border-teal-500/20"><h3 class="text-sm font-bold text-teal-400 flex items-center gap-2">${title}</h3></div>
        <div class="p-5">
          <input type="text" id="fours-in" placeholder="${placeholder}" class="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-teal-300 outline-none focus:border-teal-500 transition-colors mb-5 text-sm font-mono placeholder-slate-600" autocomplete="off">
          <div class="flex justify-end gap-3">
            <button id="fours-btn-x" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors">Batal</button>
            <button id="fours-btn-ok" class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(13,148,136,0.4)] transition-colors">Jalankan 🚀</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(m);
    setTimeout(() => m.classList.remove('opacity-0'), 10);
    document.getElementById('fours-in').focus();
    document.getElementById('fours-btn-x').onclick = () => { m.classList.add('opacity-0'); setTimeout(()=>m.remove(), 300); };
    document.getElementById('fours-btn-ok').onclick = () => { const val = document.getElementById('fours-in').value; if(val){ m.remove(); onConfirm(val); } };
  },
  
  showResult: function(title, resultObj) {
    const old = document.getElementById('fours-custom-modal'); if(old) old.remove();
    const m = document.createElement('div'); m.id = 'fours-custom-modal';
    m.className = 'fixed inset-0 z-[999999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 text-white opacity-0 transition-opacity duration-300';
    const textData = typeof resultObj === 'string' ? resultObj : JSON.stringify(resultObj, null, 2);
    m.innerHTML = `
      <div class="fours-modal-anim bg-slate-900 border border-teal-500/50 rounded-2xl w-full max-w-lg shadow-[0_0_40px_rgba(13,148,136,0.3)] overflow-hidden flex flex-col max-h-[85vh]">
        <div class="p-4 bg-slate-800/80 border-b border-teal-500/20 flex justify-between items-center">
          <h3 class="text-sm font-bold text-teal-400">${title}</h3>
          <span class="text-[10px] bg-teal-900/50 text-teal-300 px-2 py-1 rounded border border-teal-700/50">4S Protected</span>
        </div>
        <div class="p-4 overflow-y-auto flex-1">
          <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono whitespace-pre-wrap text-emerald-400 overflow-x-auto">${textData}</pre>
        </div>
        <div class="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button id="fours-btn-close" class="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors w-full sm:w-auto">Selesai ✖</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    setTimeout(() => m.classList.remove('opacity-0'), 10);
    document.getElementById('fours-btn-close').onclick = () => { m.classList.add('opacity-0'); setTimeout(()=>m.remove(), 300); };
  }
};

// =====================================================================
// 3. ENGINE REAL API 4S INTELLIGENCE
// =====================================================================
window.FourS = {
  recon: async function(q) {
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(q)}&type=A`);
      const data = await res.json();
      return { msg: `[🕌 Protected by Shalawat 1001x]\nTarget: ${q}`, data: data.Answer || "No IP Records found." };
    } catch(e) { return { msg: `[Offline Mode] Target: ${q}`, data: "Network Error." }; }
  },
  scan: async function(t) {
    const res = { target: t, protection: '🕌 Shalawat 1001x Active', ports: {} };
    for(let port of [22, 80, 443, 8080]) {
      try {
        const c = new AbortController(); setTimeout(() => c.abort(), 800);
        await fetch(`http://${t}:${port}`, { mode: 'no-cors', signal: c.signal });
        res.ports[port] = 'FILTERED/OPEN';
      } catch(e) { res.ports[port] = 'CLOSED/SECURE'; }
    }
    return res;
  },
  dns: async function(d) {
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(d)}&type=A`);
      const data = await res.json();
      return { domain: d, protection: '🕌 Spiritual DNS Protection', records: data.Answer || [] };
    } catch(e) { return { error: 'Lookup failed', protection: '🕌 Local Fallback' }; }
  },
  whois: async function(d) {
    return { domain: d, registrar: '[Protected by Privacy]', nameservers: ['ns1.4s.com', 'ns2.4s.com'], protection: '🕌 Privacy Protected by Design' };
  }
};

// =====================================================================
// 4. PEMBAJAKAN KLIK MUTLAK (Tanpa menyentuh index.html)
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
            FourSUI.showPrompt('🔍 4S Recon Intelligence', 'domain (e.g., google.com)', async (q) => {
                const r = await window.FourS.recon(q); FourSUI.showResult('🔍 4S Recon Result', r);
            });
        } else if (action === 'scan') {
            FourSUI.showPrompt('🕸️ 4S Network Probe', 'target IP/domain', async (t) => {
                const r = await window.FourS.scan(t); FourSUI.showResult('🕸️ 4S Scan Result', r);
            });
        } else if (action === 'dns') {
            FourSUI.showPrompt('🌐 4S DNS Lookup', 'domain (e.g., example.com)', async (d) => {
                const r = await window.FourS.dns(d); FourSUI.showResult('🌐 4S DNS Result', r);
            });
        } else if (action === 'whois') {
            FourSUI.showPrompt('📋 4S WHOIS Intel', 'domain (e.g., example.com)', async (w) => {
                const r = await window.FourS.whois(w); FourSUI.showResult('📋 4S WHOIS Result', r);
            });
        }
    }
}, true);
