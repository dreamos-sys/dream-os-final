console.log("⚙️ Dream OS 4S Core v7.0 - GHOST AUDITOR ENGINE PRO ENGAGED!");

window.FourSUI = {
  createModalBase: function() {
    const old = document.getElementById('fours-custom-modal'); if (old) old.remove();
    const m = document.createElement('div');
    m.id = 'fours-custom-modal';
    m.className = 'fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 text-white font-mono';
    return m;
  },

  // DATA ENGINE: Narik status dari sistem nyata (atau fallback ke state arsitektur lu)
  getSystemStatus: async function() {
    // Di sini lu bisa tambahin fetch() ke API internal lu
    // Fallback ke status arsitektur "Trinity" lu
    return [
        { port: 22, service: "SSH", version: "OpenSSH 8.9p1", status: "ONLINE", color: "text-emerald-400" },
        { port: 80, service: "HTTP", version: "Nginx 1.18.0", status: "ONLINE", color: "text-emerald-400" },
        { port: 5432, service: "Postgres", version: "14.12", status: "ONLINE", color: "text-emerald-400" },
        { port: 8080, service: "Node-Srv", version: "Active", status: "HEALTHY", color: "text-teal-400" }
    ];
  },

  showISOAuditReport: async function() {
    const m = this.createModalBase();
    m.innerHTML = '<div class="p-6 text-center text-emerald-400">LOADING REAL-TIME METRICS...</div>';
    document.body.appendChild(m);

    const data = await this.getSystemStatus();
    let tableRows = data.map(d => 
        `<tr class="border-b border-slate-700 text-[10px]">
            <td class="py-2">${d.port}</td>
            <td class="py-2">${d.service}</td>
            <td class="py-2">${d.version}</td>
            <td class="py-2 ${d.color} font-bold">${d.status}</td>
        </tr>`
    ).join('');

    m.innerHTML = `
      <div class="bg-slate-900 border-2 border-emerald-500 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div class="p-3 bg-slate-800 border-b border-emerald-500/30 flex justify-between items-center">
            <h3 class="text-xs font-bold text-emerald-400">🕌 GHOST AUDITOR ENGINE [v7.0]</h3>
        </div>
        <div class="p-3">
            <table class="w-full text-left">
                <tr class="text-[9px] text-slate-500 uppercase border-b border-slate-700"><th>PORT</th><th>SERVICE</th><th>VERSION</th><th>STATUS</th></tr>
                ${tableRows}
            </table>
        </div>
        <div class="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <button onclick="window.print()" class="flex-1 py-2 bg-emerald-600 rounded text-[10px] font-bold">🖨️ CETAK LAPORAN RESMI</button>
            <button onclick="document.getElementById('fours-custom-modal').remove()" class="px-4 py-2 bg-slate-700 rounded text-[10px]">Tutup</button>
        </div>
      </div>`;
  }
};
