console.log("🚀 DREAM OS V3.2 MEMULAI KEDAULATAN!");

window.bukaModul = async (modId) => {
    console.log("🔥 Tombol", modId, "DITEKAN!");
    const folders = { 'cc': 'commandcenter', 'k3': 'k3', 'maint': 'maintenance', 'booking': 'booking' };
    const folder = folders[modId];

    try {
        // ✅ FIX PATH: Pakai origin + base repo
        const baseRepo = '/dream-os-final'; // Ganti kalau nama repo beda
        const path = `${window.location.origin}${baseRepo}/workspaces/kabag_umum/modules/${folder}/module.js?v=${Date.now()}`;
        
        console.log("🔗 Load module:", path);
        const mod = await import(path);
        
        document.getElementById('module-container').innerHTML = '<div id="module-viewport" class="p-4"></div>';
        await mod.default();
    } catch (err) {
        console.error("❌ GAGAL:", err);
        alert("Kabel Putus ke " + folder + ". Cek Console!");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM Siap, Jenderal!");
    const loginForm = document.getElementById('login-form');

    window.renderGrid = () => {
        let html = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; padding:20px;">
                <button id="btn-k3" style="padding:30px; background:#10b981; color:white; border-radius:20px; font-weight:bold; border:none; box-shadow:0 10px 0 #059669; cursor:pointer;">
                    <i class="fas fa-biohazard"></i><br>K3 FORM
                </button>
                <button id="btn-cc" style="padding:30px; background:#3b82f6; color:white; border-radius:20px; font-weight:bold; border:none; box-shadow:0 10px 0 #2563eb; cursor:pointer;">
                    <i class="fas fa-desktop"></i><br>CMD CENTER
                </button>
            </div>
            <div style="text-align:center; color:#10b981; font-weight:bold; margin-top:20px;">
                --- SOVEREIGN V3.2 BOOTED ---
            </div>`;
        
        document.getElementById('module-container').innerHTML = html;
        
        // ✅ FIX EVENT: Pasang listener SETELAH innerHTML
        setTimeout(() => {
            const btnK3 = document.getElementById('btn-k3');
            const btnCC = document.getElementById('btn-cc');
            if (btnK3) btnK3.onclick = () => window.bukaModul('k3');
            if (btnCC) btnCC.onclick = () => window.bukaModul('cc');
            console.log("✅ Event listeners attached");
        }, 50);
    };

    if(loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('dashboard-screen').classList.add('active');
            window.renderGrid();
        };
    }
});
