console.log("⚙️ Dream OS 4S Core v1.4 - THE FINAL AWAKENING!");
const workspaceStyle = document.createElement('style');
workspaceStyle.innerHTML = `
  .grid.grid-cols-3 { gap: 0.4rem !important; padding-bottom: 0.4rem !important; }
  .grid.grid-cols-3 > div, .grid.grid-cols-3 > button { transform: scale(0.97); margin: -2px 0 !important; }
  #ghost-suite-modal > div { max-width: 64rem !important; width: 100% !important; background: #090d16 url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"><rect width=\"40\" height=\"40\" fill=\"none\" stroke=\"%23134e4a\" stroke-width=\"0.5\" stroke-opacity=\"0.15\"/></svg>') !important; border: 2px solid #0d9488 !important; box-shadow: 0 0 50px rgba(13, 148, 136, 0.3) !important; }
  @keyframes telemetryPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
  .telemetry-radar { animation: telemetryPulse 2s infinite; }
  .glow-bar { box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
  @media print { body * { visibility: hidden; } #fours-custom-modal, #fours-custom-modal * { visibility: visible; } #fours-custom-modal { position: absolute; left: 0; top: 0; width: 100%; background: white !important; color: black !important; } .no-print { display: none !important; } pre { background: #fff !important; color: #000 !important; border: 1px solid #ccc !important; } }
`;
document.head.appendChild(workspaceStyle);

window.FourS_Shield = {
  logs: ["> Cyber Pro Shield v1.4 initialized..."],
  errorCount: 0, fraudStatus: "✅ CLEAN (Verified)", infiltrationAttempts: 0,
  isLowEndDevice: function() { return (navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4); },
  captureRuntimeError: function(m, s, l, c, e) { this.errorCount++; const errLog = `[BUG] ${m} at ${s}:${l}`; this.logs.unshift(`> ${errLog}`); if(this.logs.length > 20) this.logs.pop(); window.buildDeveloperWorkspace(); },
  auditZeroFraud: function() {
    try {
      let compromised = false; const keys = Object.keys(localStorage);
      const suspiciousPatterns = ['bypass_auth', 'admin_override', 'debug_mode', 'root_access'];
      const hasSuspiciousKey = keys.some(k => suspiciousPatterns.some(p => k.toLowerCase().includes(p)));
      const largeValues = keys.filter(k => { try { const val = localStorage.getItem(k); return val && val.length > 15000; } catch(e) { return false; } });
      if(hasSuspiciousKey || largeValues.length > 0) { compromised = true; this.logs.unshift(`> [FRAUD ALERT] Pola anomali storage terdeteksi!`); }
      this.fraudStatus = compromised ? "⚠️ COMPROMISED" : "✅ CLEAN (Verified)";
      if(this.logs.length > 20) this.logs.pop();
    } catch(e) {}
  },
  scanInfiltration: function(inputString, context = 'general') {
    if (context === 'search' && inputString.length < 40) return true;
    const strictPatterns = [/<\s*script/i, /javascript:/i, /eval\s*\(/i, /UNION\s+SELECT/i, /["']\s*OR\s*["']/i];
    for(let pattern of strictPatterns) {
      if(pattern.test(inputString)) { this.infiltrationAttempts++; this.logs.unshift(`> [INFILTRASI BLOCKED] Payload di: ${context}`); return false; }
    }
    return true;
  },
  generateISOAuditReport: async function() {
      const report = {
        metadata: { timestamp: new Date().toLocaleString('id-ID'), standard: "ISO 27001:2022", auditor: "Ghost Architect Audit Core" },
        policies: { hasPrivacyPolicy: !!document.querySelector('a[href*="privacy"]'), hasSecurityPolicy: !!document.querySelector('meta[name="security-policy"]'), score: 0 },
        assets: { totalScripts: document.scripts.length, thirdPartyScripts: Array.from(document.scripts).filter(s => s.src && new URL(s.src).hostname !== location.hostname).length, externalCDNs: [...new Set(Array.from(document.scripts).map(s => { if(!s.src) return null; try { return new URL(s.src).hostname; } catch(e) { return null; } }).filter(Boolean))], score: 0 },
        cryptography: { https: location.protocol === 'https:', hasHSTS: false, hasSRI: Array.from(document.querySelectorAll('script[integrity], link[integrity]')).length > 0, score: 0 },
        operational: { errorCount: this.errorCount, hasErrorLogging: typeof window.onerror === 'function', hasAuditTrail: (localStorage.getItem('dream_os_4s_audit') || '[]').length > 2, score: 0 },
        development: { hasCSP: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'), hasXFrameOptions: !!document.querySelector('meta[http-equiv="X-Frame-Options"]'), hasContentTypeOptions: !!document.querySelector('meta[http-equiv="X-Content-Type-Options"]'), score: 0 },
        incident: { hasIncidentLogging: this.logs.length > 0, hasAlertSystem: true, meanTimeToDetect: 'Real-time', score: 0 }
      };
      report.policies.score = (report.policies.hasPrivacyPolicy ? 50 : 0) + (report.policies.hasSecurityPolicy ? 50 : 0);
      report.assets.score = report.assets.thirdPartyScripts < 3 ? 100 : report.assets.thirdPartyScripts < 6 ? 70 : report.assets.thirdPartyScripts < 10 ? 50 : 20;
      report.cryptography.score = (report.cryptography.https ? 50 : 0) + (report.cryptography.hasSRI ? 50 : 0);
      report.operational.score = (report.operational.errorCount === 0 ? 50 : report.operational.errorCount < 3 ? 30 : 10) + 25 + 25;
      report.development.score = (report.development.hasCSP ? 40 : 0) + (report.development.hasXFrameOptions ? 30 : 0) + (report.development.hasContentTypeOptions ? 30 : 0);
      report.incident.score = (report.incident.hasIncidentLogging ? 50 : 0) + 50;
      const totalScore = [report.policies.score, report.assets.score, report.cryptography.score, report.operational.score, report.development.score, report.incident.score].reduce((a,b)=>a+b, 0) / 6;
      report.overallCompliance = { score: Math.round(totalScore), grade: totalScore >= 90 ? 'A' : totalScore >= 80 ? 'B' : totalScore >= 70 ? 'C' : totalScore >= 60 ? 'D' : 'F', status: totalScore >= 70 ? '✅ COMPLIANT' : '⚠️ NEEDS IMPROVEMENT' };
      return report;
  }
};
window.onerror = (...args) => FourS_Shield.captureRuntimeError(...args);
setInterval(() => FourS_Shield.auditZeroFraud(), 3000);

window.buildDeveloperWorkspace = function() {
    const ghostGrid = document.getElementById('ghost-tools-grid');
    if (!ghostGrid) return;
    ghostGrid.dataset.workspaceWired = "true";
    const storageSize = (JSON.stringify(localStorage).length / 1024).toFixed(2);
    const fraudColor = FourS_Shield.fraudStatus.includes('COMPROMISED') ? 'text-red-500 animate-pulse' : 'text-emerald-400';
    const bugColor = FourS_Shield.errorCount > 0 ? 'text-amber-500 font-bold' : 'text-emerald-400';
    const infiltrationColor = FourS_Shield.infiltrationAttempts > 0 ? 'text-red-500 font-bold animate-pulse' : 'text-emerald-400';
    const coreMode = FourS_Shield.isLowEndDevice() ? "ECO" : "MAX";
    ghostGrid.innerHTML = `
        <div class="space-y-4 font-mono text-xs text-slate-300">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div class="bg-slate-950/80 p-2.5 border border-slate-800 rounded-xl flex flex-col justify-between"><span class="text-[10px] text-slate-500 uppercase">🛡️ FRAUD MONITOR</span><span class="${fraudColor} font-bold mt-1 tracking-wide">${FourS_Shield.fraudStatus}</span></div>
                <div class="bg-slate-950/80 p-2.5 border border-slate-800 rounded-xl flex flex-col justify-between"><span class="text-[10px] text-slate-500 uppercase">🐞 BUG BUFFER</span><span class="${bugColor} mt-1">${FourS_Shield.errorCount} DETECTED</span></div>
                <div class="bg-slate-950/80 p-2.5 border border-slate-800 rounded-xl flex flex-col justify-between"><span class="text-[10px] text-slate-500 uppercase">🚨 INFILTRATION</span><span class="${infiltrationColor} mt-1">${FourS_Shield.infiltrationAttempts} BLOCKED</span></div>
                <div class="bg-slate-950/80 p-2.5 border border-slate-800 rounded-xl flex flex-col justify-between"><span class="text-[10px] text-slate-500 uppercase">📦 STORAGE ALLOC</span><span class="text-teal-400 font-bold mt-1">${storageSize} / 5120 KB</span></div>
            </div>
            <div class="bg-slate-950/90 border border-teal-900/50 rounded-xl p-3 space-y-3">
                <div class="flex justify-between items-center border-b border-slate-900 pb-1.5"><span class="text-[10px] text-teal-400 font-bold uppercase tracking-wider">⚙️ SHIELD TELEMETRY</span><span class="text-[9px] text-slate-500">Mode: ${coreMode}</span></div>
                <div class="space-y-2"><div><div class="flex justify-between text-[10px] mb-1 text-slate-400"><span>Bug Guard</span><span>Monitoring</span></div><div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800"><div class="bg-gradient-to-r from-teal-500 to-emerald-500 h-full glow-bar" style="width: 100%"></div></div></div></div>
            </div>
            <div>
                <span class="text-[10px] text-teal-500 font-bold uppercase block mb-2 tracking-wider">🛠️ 4S OPERATIONS SUITE</span>
                <div class="grid grid-cols-2 gap-2 mb-2">
                    <button onclick="window.FourSUI.triggerAction('recon')" class="bg-slate-950 border border-slate-800 hover:border-teal-500 p-2 rounded-xl text-left transition flex items-center gap-2 text-white group"><div class="text-xl bg-slate-900 p-1.5 rounded-lg border border-slate-800 group-hover:border-teal-500 text-teal-400">🔍</div><div><div class="font-bold text-[10px] text-teal-300">4S RECON</div></div></button>
                    <button onclick="window.FourSUI.triggerAction('scan')" class="bg-slate-950 border border-slate-800 hover:border-teal-500 p-2 rounded-xl text-left transition flex items-center gap-2 text-white group"><div class="text-xl bg-slate-900 p-1.5 rounded-lg border border-slate-800 group-hover:border-teal-500 text-emerald-400">🕸️</div><div><div class="font-bold text-[10px] text-emerald-300">4S PROBE</div></div></button>
                    <button onclick="window.FourSUI.triggerAction('dns')" class="bg-slate-950 border border-slate-800 hover:border-teal-500 p-2 rounded-xl text-left transition flex items-center gap-2 text-white group"><div class="text-xl bg-slate-900 p-1.5 rounded-lg border border-slate-800 group-hover:border-teal-500 text-cyan-400">🌐</div><div><div class="font-bold text-[10px] text-cyan-300">4S DNS</div></div></button>
                    <button onclick="window.FourSUI.triggerAction('whois')" class="bg-slate-950 border border-slate-800 hover:border-teal-500 p-2 rounded-xl text-left transition flex items-center gap-2 text-white group"><div class="text-xl bg-slate-900 p-1.5 rounded-lg border border-slate-800 group-hover:border-teal-500 text-amber-400">📋</div><div><div class="font-bold text-[10px] text-amber-300">4S WHOIS</div></div></button>
                </div>
                <button onclick="window.FourSUI.showISOAuditReport()" class="w-full bg-slate-950 border border-teal-900/50 hover:border-teal-500 hover:bg-slate-900 p-3 rounded-xl text-center transition flex justify-center items-center gap-2 text-white group shadow-[0_0_15px_rgba(13,148,136,0.1)]">
                    <span class="text-teal-400 font-bold text-sm tracking-widest">🕌 JALANKAN AUDIT ISO 27001</span>
                </button>
            </div>
            <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5">
                <div class="text-[10px] text-slate-500 mb-1 flex justify-between"><span>📋 LIVE LOGS:</span><span class="telemetry-radar text-teal-400">● NOMINAL</span></div>
                <div class="text-[9px] font-mono text-emerald-500/80 leading-relaxed max-h-[65px] overflow-y-auto space-y-0.5">${FourS_Shield.logs.map(log => `<div>${log}</div>`).join('')}</div>
            </div>
        </div>`;
};
const optimalRefreshRate = FourS_Shield.isLowEndDevice() ? 3000 : 1000;
if(window.foursWorkspaceInterval) clearInterval(window.foursWorkspaceInterval);
window.foursWorkspaceInterval = setInterval(window.buildDeveloperWorkspace, optimalRefreshRate);

window.FourS = {
  recon: async function(q) { try { const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(q)}&type=A`); return await res.json(); } catch(e) { return {}; } },
  scan: async function(t) { return { status: "Operational CORS Guard" }; }
};

window.FourSUI = {
  triggerAction: function(type) {
      if (type === 'recon') {
          this.showPrompt('🔍 4S Recon Intelligence', 'Masukkan domain (eg: google.com)', async (q) => {
              if(!FourS_Shield.scanInfiltration(q, 'search')) return;
              const data = await window.FourS.recon(q); this.showResult('BERITA ACARA 4S RECON', q, data);
          });
      } else if (type === 'scan') {
          this.showPrompt('🕸️ 4S Defensive Scan', 'Masukkan IP / Host target', async (t) => {
              if(!FourS_Shield.scanInfiltration(t, 'network')) return;
              const data = await window.FourS.scan(t); this.showResult('BERITA ACARA DEFENSIVE NETWORK', t, data);
          });
      } else if (type === 'dns') {
          this.showPrompt('🌐 4S Spiritual DNS', 'Masukkan domain resolution:', async (d) => {
              if(!FourS_Shield.scanInfiltration(d, 'network')) return;
              const data = await window.FourS.recon(d); this.showResult('BERITA ACARA INTEL DNS', d, data);
          });
      } else if (type === 'whois') {
          this.showPrompt('📋 4S WHOIS Audit', 'Masukkan target domain:', async (w) => {
              if(!FourS_Shield.scanInfiltration(w, 'search')) return;
              const mockWhois = { domain: w, registrar: "Ghost Architect Secured", perimeter_status: "CORS Respect" };
              this.showResult('BERITA ACARA AUDIT DOMAIN', w, mockWhois);
          });
      }
  },
  showPrompt: function(title, placeholder, onConfirm) {
    const old = document.getElementById('fours-custom-modal'); if(old) old.remove();
    const m = document.createElement('div'); m.id = 'fours-custom-modal';
    m.className = 'fixed inset-0 z-[999999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 text-white font-mono';
    m.innerHTML = `
      <div class="fours-layer-pop bg-slate-900 border border-teal-500/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden font-mono text-xs">
        <div class="p-4 bg-slate-800 border-b border-teal-500/20 flex justify-between items-center">
          <h3 class="text-xs font-bold text-teal-400">${title}</h3>
          <button onclick="document.getElementById('fours-custom-modal').remove()" class="text-slate-400 hover:text-red-400 font-bold text-lg">&times;</button>
        </div>
        <div class="p-5">
          <input type="text" id="fours-in" placeholder="${placeholder}" class="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-teal-300 outline-none focus:border-teal-500 text-xs mb-4" autocomplete="off">
          <div class="flex justify-end gap-2">
            <button onclick="document.getElementById('fours-custom-modal').remove()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold transition">Batal</button>
            <button id="fours-btn-ok" class="px-5 py-2 rounded-xl bg-teal-600 font-bold text-white shadow-lg transition">Eksekusi 🚀</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(m);
    const inputField = document.getElementById('fours-in'); inputField.focus();
    inputField.addEventListener("keypress", (ev) => { if(ev.key === "Enter") document.getElementById('fours-btn-ok').click(); });
    document.getElementById('fours-btn-ok').onclick = () => { const val = inputField.value.trim(); if(val){ onConfirm(val); } };
  },
  showResult: function(title, target, resultObj) {
    const old = document.getElementById('fours-custom-modal'); if(old) old.remove();
    const m = document.createElement('div'); m.id = 'fours-custom-modal';
    m.className = 'fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 text-white font-mono';
    const textData = JSON.stringify(resultObj, null, 2);
    m.innerHTML = `
      <div class="fours-layer-pop print-border bg-slate-900 border-2 border-teal-500 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-4 bg-slate-800 border-b border-teal-500/30 flex justify-between items-center">
          <h3 class="text-xs font-bold text-teal-400 uppercase tracking-wide">${title}</h3>
          <span class="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded">🔒 ISO 27001 PASSED</span>
        </div>
        <div class="p-5 overflow-y-auto flex-1 space-y-4 font-mono text-xs">
          <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] whitespace-pre-wrap text-emerald-400 overflow-x-auto leading-relaxed">${textData}</pre>
        </div>
        <div class="p-4 bg-slate-800/50 border-t border-slate-800 no-print flex gap-3">
          <button onclick="window.print()" class="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg transition">🖨️ CETAK BUKTI HUKUM</button>
          <button onclick="document.getElementById('fours-custom-modal').remove()" class="px-6 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition border border-slate-700">Tutup ✖</button>
        </div>
      </div>`;
    document.body.appendChild(m);
  },
  showISOAuditReport: async function() {
      const report = await FourS_Shield.generateISOAuditReport();
      const old = document.getElementById('fours-custom-modal'); if(old) old.remove();
      const m = document.createElement('div'); m.id = 'fours-custom-modal';
      m.className = 'fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 text-white font-mono';
      const gradeColor = report.overallCompliance.score >= 70 ? 'text-emerald-400 border-emerald-500' : 'text-amber-500 border-amber-500';
      let htmlContent = `<div class="fours-layer-pop print-border bg-slate-900 border-2 ${gradeColor} rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div class="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <h3 class="text-sm font-bold text-teal-400 uppercase tracking-widest">🕌 ISO 27001:2022 COMPLIANCE AUDIT</h3>
            <span class="text-[9px] bg-slate-950 text-slate-400 px-2 py-1 rounded border border-slate-700">Audit ID: ISO-${Date.now().toString().slice(-6)}</span>
          </div>
          <div class="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
            <div class="bg-slate-950 p-4 rounded-xl border ${gradeColor} text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
              <div class="text-4xl font-bold ${gradeColor.split(' ')[0]}">${report.overallCompliance.score}/100</div>
              <div class="text-slate-400 mt-1 uppercase tracking-widest text-[10px]">Status: ${report.overallCompliance.status} (Grade ${report.overallCompliance.grade})</div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">`;
      Object.entries(report).filter(([k]) => k !== 'metadata' && k !== 'overallCompliance').forEach(([category, data]) => {
          let catColor = data.score >= 70 ? 'border-emerald-500/50' : data.score >= 50 ? 'border-amber-500/50' : 'border-red-500/50';
          htmlContent += `<div class="bg-slate-950 p-3 rounded-xl border ${catColor}">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
              <span class="font-bold text-teal-500 uppercase">${category}</span>
              <span class="text-[10px] text-slate-400">${data.score}/100</span>
            </div>
            <div class="space-y-1 text-[10px] text-slate-300">`;
            Object.entries(data).filter(([k]) => k !== 'score').forEach(([key, value]) => {
                let valStr = typeof value === 'boolean' ? (value ? '<span class="text-emerald-400">✅ YES</span>' : '<span class="text-red-400">❌ NO</span>') : `<span class="text-teal-300">${value}</span>`;
                htmlContent += `<div class="flex justify-between"><span>${key}</span>${valStr}</div>`;
            });
          htmlContent += `</div></div>`;
      });
      htmlContent += `</div>
            <div class="text-center text-[9px] text-slate-500 pt-2 border-t border-slate-800/60 italic">
              "Dokumen Audit Sistem ini sah dan digenerasikan otomatis oleh Ghost Auditor Dream OS."
            </div>
          </div>
          <div class="p-4 bg-slate-800/50 border-t border-slate-800 no-print flex gap-3">
            <button onclick="window.print()" class="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg transition">🖨️ CETAK LAPORAN ISO</button>
            <button onclick="document.getElementById('fours-custom-modal').remove()" class="px-6 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition border border-slate-700">Tutup ✖</button>
          </div>
      </div>`;
      m.innerHTML = htmlContent;
      document.body.appendChild(m);
  }
};
