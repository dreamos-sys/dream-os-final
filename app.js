console.log("🚀 DREAM OS V3.2 MEMULAI KEDAULATAN!");

window.bukaModul = async (modId) => {
    alert("Tombol " + modId + " Ditekan!"); // BUKTI HIDUP
    const folders = { 'cc': 'commandcenter', 'k3': 'k3', 'maint': 'maintenance', 'booking': 'booking' };
    const folder = folders[modId];
    
    try {
        const path = `./workspaces/kabag_umum/modules/${folder}/module.js?v=${Date.now()}`;
        console.log("🔗 Mencoba akses:", path);
        const mod = await import(path);
        document.getElementById('module-container').innerHTML = '<div id="module-viewport"></div>';
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
                <button onclick="window.bukaModul('k3')" style="padding:30px; background:#10b981; color:white; border-radius:20px; font-weight:bold; border:none; box-shadow:0 10px 0 #059669;">
                    <i class="fas fa-biohazard"></i><br>K3 FORM
                </button>
                <button onclick="window.bukaModul('cc')" style="padding:30px; background:#3b82f6; color:white; border-radius:20px; font-weight:bold; border:none; box-shadow:0 10px 0 #2563eb;">
                    <i class="fas fa-desktop"></i><br>CMD CENTER
                </button>
            </div>
            <div style="text-align:center; color:#10b981; font-weight:bold; margin-top:20px;">
                --- SOVEREIGN V3.2 BOOTED ---
            </div>`;
        document.getElementById('module-container').innerHTML = html;
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
