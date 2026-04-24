// app.js — Dream OS v3.2.2 (FIXED CLICK HANDLERS)
console.log("🚀 DREAM OS V3.2.2 MEMULAI!");

// ✅ EXPOSE ke global window
window.bukaModul = async (modId) => {
    console.log("🔥 MODUL DIPANGGIL:", modId);
    alert("Tombol " + modId + " ditekan!"); // DEBUG: bukti tombol jalan
    
    const folders = { 
        'cc': 'commandcenter', 
        'k3': 'k3', 
        'maint': 'maintenance', 
        'booking': 'booking',
        'sekuriti': 'sekuriti',
        'jan-indoor': 'janitor-indoor',
        'jan-outdoor': 'janitor-outdoor',
        'stok': 'stok',
        'inventaris': 'inventaris'
    };
    
    const folder = folders[modId];
    if (!folder) {
        alert("Modul " + modId + " tidak ditemukan!");
        return;
    }

    try {
        const basePath = window.location.pathname.includes('dream-os-final') 
            ? '/dream-os-final' 
            : '';
        const path = `${basePath}/workspaces/kabag_umum/modules/${folder}/module.js?v=${Date.now()}`;
        
        console.log("🔗 Loading:", path);
        const mod = await import(path);
        
        const container = document.getElementById('module-container');
        if (container) {
            container.innerHTML = '<div id="module-viewport" class="p-4 min-h-screen"></div>';
        }
        
        if (mod.default) {
            await mod.default();
            console.log("✅ Modul loaded:", folder);
        } else {
            throw new Error("Module tidak punya export default");
        }
    } catch (err) {
        console.error("❌ GAGAL LOAD:", err);
        alert("Gagal load modul " + folder + ": " + err.message);
    }};

// ✅ GENERATE GRID DENGAN ONCLICK ATTRIBUTE
window.renderGrid = () => {
    const modules = [
        { id: 'cc', icon: 'fa-desktop', label: 'CMD CENTER', color: '#3b82f6' },
        { id: 'booking', icon: 'fa-calendar-check', label: 'BOOKING', color: '#10b981' },
        { id: 'k3', icon: 'fa-biohazard', label: 'K3 FORM', color: '#f59e0b' },
        { id: 'sekuriti', icon: 'fa-user-shield', label: 'SEKURITI', color: '#ef4444' },
        { id: 'jan-indoor', icon: 'fa-pump-soap', label: 'JAN INDOOR', color: '#06b6d4' },
        { id: 'jan-outdoor', icon: 'fa-leaf', label: 'JAN OUTDOOR', color: '#84cc16' },
        { id: 'stok', icon: 'fa-box-open', label: 'STOK ALAT', color: '#8b5cf6' },
        { id: 'maint', icon: 'fa-wrench', label: 'MAINTENANCE', color: '#ec4899' },
        { id: 'inventaris', icon: 'fa-warehouse', label: 'INVENTARIS', color: '#14b8a6' }
    ];

    let html = `<div class="grid grid-cols-3 gap-4 p-4">`;
    
    modules.forEach(mod => {
        html += `
            <button 
                onclick="window.bukaModul('${mod.id}')"
                class="p-6 rounded-2xl shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2"
                style="background: ${mod.color}20; border: 2px solid ${mod.color}40;"
            >
                <i class="fas ${mod.icon} text-3xl" style="color: ${mod.color}"></i>
                <span class="text-xs font-bold text-center" style="color: ${mod.color}">${mod.label}</span>
            </button>
        `;
    });
    
    html += `</div>`;
    
    const container = document.getElementById('module-container');
    if (container) {
        container.innerHTML = html;
        console.log("✅ Grid rendered with onclick handlers");
    }
};

// ✅ LOGIN HANDLER
document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ DOM Ready");
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            console.log("🔐 Login submitted");
                        document.getElementById('login-screen').style.display = 'none';
            const dashboard = document.getElementById('dashboard-screen');
            if (dashboard) {
                dashboard.classList.add('active');
                window.renderGrid(); // Render grid setelah login
            }
        };
    }
});
