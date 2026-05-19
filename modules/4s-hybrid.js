// Dream OS - 4S Hybrid Mode (Inline + Hijacker)
console.log("🚀 4S Hybrid Mode Active!");

// 1. Load 4s-intelligence API
window.FourS = {
  recon: async function(q) {
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(q)}&type=A`);
      const data = await res.json();
      return { msg: `🔍 4S Recon: ${q}\n[🕌 Protected by Shalawat 1001x]`, data: data.Answer || "No records found." };
    } catch(e) { return { msg: `🔍 4S Recon (Offline)`, data: "Network Error." }; }
  },
  scan: async function(t) {
    const res = { target: t, ports: {}, protection: '🕌 Shalawat 1001x Active' };
    for(let port of [22, 80, 443, 8080]) {
      try {
        const c = new AbortController(); setTimeout(() => c.abort(), 800);
        await fetch(`http://${t}:${port}`, { mode: 'no-cors', signal: c.signal });
        res.ports[port] = 'OPEN';
      } catch(e) { res.ports[port] = 'CLOSED'; }
    }
    return res;
  }
};

// 2. ShadowSoulSpirit wrapper untuk compatibility
window.ShadowSoulSpirit = {
  open4SMode: function() {
    console.log('🕌 4S Mode Opening...');
    // Try to use GhostDeveloper if available
    if(typeof GhostDeveloper !== 'undefined') {
      GhostDeveloper.init();
    } else {
      // Fallback to simple 4S tools
      const tools = ['4S Recon', '4S Scan', '4S DNS', '4S WHOIS'];
      const choice = prompt('🕌 4S Mode\n\nAvailable tools:\n' + tools.join('\n') + '\n\nEnter tool name:');
      if(choice === '4S Recon' || choice === 'recon') {
        const q = prompt('Enter domain:', 'google.com');
        if(q) FourS.recon(q).then(r => alert(r.msg + '\n\n' + JSON.stringify(r.data, null, 2)));
      } else if(choice === '4S Scan' || choice === 'scan') {
        const t = prompt('Enter target:', 'localhost');
        if(t) FourS.scan(t).then(r => alert(JSON.stringify(r, null, 2)));
      }
    }
  }
};

console.log('✅ ShadowSoulSpirit wrapper loaded!');
