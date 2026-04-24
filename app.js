document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const moduleContainer = document.getElementById('module-container');
    
    // 1. EVENT DELEGATION (TEKNIK SAKTI)
    // Kita pasang listener di moduleContainer, bukan di tombolnya langsung.
    // Jadi biarpun tombolnya baru lahir lewat innerHTML, dia PASTI BISA DIKLIK!
    moduleContainer.addEventListener('click', async (e) => {
        const btn = e.target.closest('.nav-mod');
        if (!btn) return;

        const modId = btn.getAttribute('data-mod');
        console.log("🚀 MELUNCUR KE MODUL:", modId);
        
        // Kasih Feedback Visual biar Sultan tau sistem respon
        btn.style.opacity = '0.5';
        btn.style.transform = 'scale(0.9)';

        try {
            // Tentukan folder berdasarkan ID
            let folder = modId === 'cc' ? 'commandcenter' : (modId === 'k3' ? 'k3' : 'maintenance');
            
            // JALUR SAKTI SULTAN
            const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, "");
            const path = `${baseUrl}/workspaces/kabag_umum/modules/${folder}/module.js?v=${Date.now()}`;
            
            const mod = await import(path);
            moduleContainer.innerHTML = '<div id="module-viewport" class="p-4"></div>';
            await mod.default({}, {}, {}, {}, (msg) => alert(msg));
            
        } catch (err) {
            console.error("❌ KABEL PUTUS:", err);
            alert("Sinyal Lemah ke Modul " + modId);
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
        }
    });

    function renderGrid() {
        const modules = [
            { id: 'cc', name: 'CMD Center', icon: 'fa-tower-broadcast' },
            { id: 'k3', name: 'K3 Form', icon: 'fa-biohazard' },
            { id: 'maint', name: 'Maintenance', icon: 'fa-screwdriver-wrench' }
        ];

        let html = '<div class="grid-container" style="display:grid; grid-template-columns:repeat(2,1fr); gap:15px; padding:10px;">';
        modules.forEach(m => {
            html += `
                <div class="nav-mod p-6 bg-white border-2 border-emerald-50 rounded-[2rem] shadow-sm active:bg-emerald-50 text-center cursor-pointer" data-mod="${m.id}">
                    <i class="fas ${m.icon}" style="color:#10b981; font-size:1.8rem; display:block; margin-bottom:10px;"></i>
                    <span style="font-size:0.75rem; font-weight:900; color:#0f172a;">${m.name}</span>
                </div>`;
        });
        html += '</div>';
        
        // GREETING BOX SULTAN
        html += `<div class="mt-6 p-5 text-center bg-emerald-50/50 rounded-3xl border-2 border-dashed border-emerald-200">
                    <p class="text-[10px] text-emerald-700 font-black uppercase tracking-widest">Sovereign Greeting</p>
                    <p class="text-xs text-slate-600 italic mt-1">"Kaen Nenek sudah bersih & wangi, Sultan! Siap tempur!" 🤣</p>
                 </div>`;

        moduleContainer.innerHTML = html;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        renderGrid();
    });
});
