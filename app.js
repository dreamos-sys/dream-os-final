// Global Function (Biar bisa dipanggil dari HTML langsung)
window.panggilModul = async (folder) => {
    console.log("🚀 EKSEKUSI MODUL:", folder);
    const vp = document.getElementById('module-container');
    const originalHTML = vp.innerHTML;
    
    vp.innerHTML = '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin fa-3x" style="color:#10b981"></i><p>SINKRONISASI...</p></div>';
    
    try {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, "");
        const path = `${baseUrl}/workspaces/kabag_umum/modules/${folder}/module.js?v=${Date.now()}`;
        
        const mod = await import(path);
        vp.innerHTML = '<div id="module-viewport"></div>';
        await mod.default({}, {}, {}, {}, (msg) => alert(msg));
    } catch (err) {
        console.error("❌ ERROR:", err);
        alert("Gagal memanggil: " + folder);
        vp.innerHTML = originalHTML; // Balikin ke grid kalau gagal
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const moduleContainer = document.getElementById('module-container');

    window.renderGrid = () => {
        const modules = [
            { id: 'k3', name: 'K3 FORM', icon: 'fa-biohazard' },
            { id: 'maintenance', name: 'MAINTENANCE', icon: 'fa-screwdriver-wrench' },
            { id: 'commandcenter', name: 'CMD CENTER', icon: 'fa-tower-broadcast' }
        ];

        let html = '<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:15px; padding:20px;">';
        modules.forEach(m => {
            // PAKAI ONCLICK LANGSUNG (ANTI-BUDEK TOTAL!)
            html += `
                <div onclick="window.panggilModul('${m.id}')" 
                     style="background:white; border:2px solid #10b98130; border-radius:25px; padding:25px; text-align:center; cursor:pointer; box-shadow:0 4px 15px rgba(0,0,0,0.05); active:scale-90; transition:all 0.1s;">
                    <i class="fas ${m.icon}" style="color:#10b981; font-size:2rem; display:block; margin-bottom:10px;"></i>
                    <span style="font-size:0.8rem; font-weight:900;">${m.name}</span>
                </div>`;
        });
        html += '</div>';
        
        // Greeting Sultan
        html += `<div style="margin-top:20px; text-align:center; opacity:0.5; font-size:10px;">
                    <p>✨ KAEN NENEK SYNC v2.1.5</p>
                    <p>"Kalau ini gak bisa, mandor Gemini ganti profesi jadi tukang cuci kaen!" 🤣</p>
                 </div>`;

        moduleContainer.innerHTML = html;
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        window.renderGrid();
    });
});
