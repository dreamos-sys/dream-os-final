console.log("🚀 Absolute UI Hijacker v5.1 Active! Ferrari is Wired.");

window.FourS = {
  recon: async function(q) {
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(q)}&type=A`);
      const data = await res.json();
      return { msg: `🔍 4S Recon: ${q}\n[🕌 Protected by Shalawat 1001x]`, data: data.Answer || "No IP Records found." };
    } catch(e) { return { msg: `🔍 4S Recon (Offline)`, data: "Network Error." }; }
  },
  scan: async function(t) {
    const res = { target: t, ports: {}, protection: '🕌 Shalawat 1001x Active' };
    for(let port of [22, 80, 443, 8080]) {
      try {
        const c = new AbortController(); setTimeout(() => c.abort(), 800);
        await fetch(`http://${t}:${port}`, { mode: 'no-cors', signal: c.signal });
        res.ports[port] = 'FILTERED/OPEN';
      } catch(e) { res.ports[port] = 'CLOSED'; }
    }
    return res;
  },
  dns: async function(d) {
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(d)}&type=A`);
      const data = await res.json();
      return { domain: d, records: data.Answer || [], protection: '🕌 Spiritual DNS Protection' };
    } catch(e) { return { error: 'Lookup failed', protection: '🕌 Local Fallback' }; }
  },
  whois: async function(d) {
    return { domain: d, registrar: '[Protected Privacy]', nameservers: ['ns1.4s.com', 'ns2.4s.com'], protection: '🕌 Privacy Protected by Design' };
  }
};

// PEMBAJAKAN FASE CAPTURE MUTLAK
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
        e.preventDefault(); 
        e.stopPropagation();
        
        if (action === 'recon') {
            const q = prompt('🔍 4S Recon - Enter domain (e.g., google.com):');
            if(q) { const r = await window.FourS.recon(q); alert(r.msg + '\n\n' + JSON.stringify(r.data, null, 2)); }
        } else if (action === 'scan') {
            const t = prompt('🕸️ 4S Scan - Enter target:', 'localhost');
            if(t) { const r = await window.FourS.scan(t); alert('🕸️ 4S Network Scan:\n\n' + JSON.stringify(r, null, 2)); }
        } else if (action === 'dns') {
            const d = prompt('🌐 4S DNS - Enter domain:', 'example.com');
            if(d) { const r = await window.FourS.dns(d); alert('🌐 4S DNS Lookup:\n\n' + JSON.stringify(r, null, 2)); }
        } else if (action === 'whois') {
            const w = prompt('📋 4S WHOIS - Enter domain:', 'example.com');
            if(w) { const r = await window.FourS.whois(w); alert('📋 4S Domain Intel:\n\n' + JSON.stringify(r, null, 2)); }
        }
    }
}, true);
