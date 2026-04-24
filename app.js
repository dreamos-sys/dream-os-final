window.bukaModul = async (modId) => {
    console.log("🚀 EKSEKUSI MODUL:", modId);
    const vp = document.getElementById('module-container');
    
    // Mapping Folder
    const folders = {
        'cc': 'commandcenter',
        'k3': 'k3',
        'maint': 'maintenance',
        'booking': 'booking'
    };

    const folder = folders[modId];
    if(!folder) return alert("Modul Belum Siap, Jenderal!");

    vp.innerHTML = '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

    try {
        const path = `./workspaces/kabag_umum/modules/${folder}/module.js?t=${Date.now()}`;
        const mod = await import(path);
        await mod.default(); // Panggil fungsi utama module
    } catch (err) {
        console.error(err);
        alert("Kabel Putus ke: " + folder);
        location.reload(); 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    window.renderGrid = () => {
        const modules = [
            { id: 'cc', name: 'CMD CENTER', icon: 'fa-desktop' },
            { id: 'booking', name: 'BOOKING', icon: 'fa-calendar' },
            { id: 'k3', name: 'K3 FORM', icon: 'fa-biohazard' },
            { id: 'maint', name: 'MAINTENANCE', icon: 'fa-tools' }
        ];

        let html = '<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:15px; padding:20px;">';
        modules.forEach(m => {
            // PAKAI ONCLICK LANGSUNG DI TAG HTML (ANTI-BUDEK!)
            html += `
                <div onclick="window.bukaModul('${m.id}')" 
                     style="background:white; border:2px solid #10b98130; border-radius:25px; padding:25px; text-align:center; cursor:pointer; box-shadow:0 10px 20px -5px rgba(0,0,0,0.1); transition: transform 0.1s;"
                     onmousedown="this.style.transform='scale(0.95)'"
                     onmouseup="this.style.transform='scale(1)'">
                    <i class="fas ${m.icon}" style="color:#10b981; font-size:2rem; display:block; margin-bottom:10px;"></i>
                    <span style="font-size:0.75rem; font-weight:900;">${m.name}</span>
                </div>`;
        });
        html += '</div>';
        document.getElementById('module-container').innerHTML = html;
    };

    if(loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            document.getElementById('login-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
            window.renderGrid();
        };
    }
});
