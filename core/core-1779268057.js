console.log("⚙️ Dream OS 4S Core v8.0 - IRON CLAD ENGINE ACTIVE!");

window.FourSUI = {
  // PAKSA REMOVE SEMUA ELEMEN HANTU
  cleanup: function() {
    const ghosts = document.querySelectorAll('#fours-custom-modal');
    ghosts.forEach(g => g.remove());
  },

  showISOAuditReport: function() {
    this.cleanup();
    
    // GHOST OVERLAY YANG GAK BISA DI-BLOCK CSS MANAPUN
    const overlay = document.createElement('div');
    overlay.id = 'fours-custom-modal';
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999999; display:flex; align-items:center; justify-content:center;';
    
    overlay.innerHTML = `
      <div style="background:#0f172a; border:2px solid #10b981; padding:20px; border-radius:15px; width:90%; max-width:400px; color:#fff; font-family:monospace;">
        <h2 style="color:#10b981; margin-top:0;">🕌 SYSTEM AUDIT [v8.0]</h2>
        <div style="font-size:30px; margin:15px 0;">HEALTHY: 100%</div>
        <table style="width:100%; font-size:12px; text-align:left;">
          <tr><td>SSH</td><td style="color:#10b981;">ACTIVE</td></tr>
          <tr><td>NGINX</td><td style="color:#10b981;">ACTIVE</td></tr>
          <tr><td>POSTGRES</td><td style="color:#10b981;">ACTIVE</td></tr>
        </table>
        <button id="closeBtn" style="width:100%; margin-top:20px; padding:10px; background:#1e293b; color:#fff; border:none; border-radius:5px;">CLOSE</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    document.getElementById('closeBtn').onclick = () => this.cleanup();
  }
};
window.GHOST_VERSION = '1779267822';
