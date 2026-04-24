// Dream OS v2.1.2 - Anti-Budek & Neural Bridge
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const pwInput = document.getElementById('password');
    const rakaatInput = document.getElementById('rakaat-input');
    const ghostContainer = document.getElementById('ghost-container');
    const logo = document.querySelector('.logo-glow img');
    const moduleContainer = document.getElementById('module-container');
    
    let wasm;
    let currentAccessLevel = 99;

    // 1. LOAD NEURAL CORE (Bi idznillah)
    WebAssembly.instantiateStreaming(fetch('./neural_core.wasm'), {})
        .then(obj => { wasm = obj.instance; console.log("🧠 Neural Core Online"); })
        .catch(() => console.warn("⚠️ WASM Offline, bypass mode active for Jenderal."));

    // 2. LOGIKA RENDER GRID DENGAN LISTENER
    function renderGrid() {
        const modules = [
            { id: 'k3', name: 'K3 REPORT', icon: 'fa-hard-hat' },
            { id: 'maintenance', name: 'MAINTENANCE', icon: 'fa-screwdriver-wrench' },
            { id: 'booking', name: 'BOOKING', icon: 'fa-calendar-check' },
            { id: 'stok', name: 'STOK', icon: 'fa-boxes-stacked' }
        ];

        let html = '<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:15px; padding:10px;">';
        modules.forEach(m => {
            html += `
                <button class="mod-btn" data-folder="${m.id}" style="background:white; border:2px solid #10b98120; border-radius:20px; padding:20px; transition:all 0.2s;">
                    <i class="fas ${m.icon}" style="color:#10b981; font-size:1.5rem; display:block; margin-bottom:8px;"></i>
                    <span style="font-size:0.7rem; font-weight:900;">${m.name}</span>
                </button>`;
        });
        html += '</div><div id="module-viewport" class="mt-4"></div>';
        moduleContainer.innerHTML = html;

        // 3. PASANG LISTENER (THE ANTI-BUDEK INJECTION)
        document.querySelectorAll('.mod-btn').forEach(btn => {
            btn.onclick = async () => {
                const folder = btn.getAttribute('data-folder');
                const viewport = document.getElementById('module-viewport');
                viewport.innerHTML = '<p style="text-align:center; padding:20px;">⚡ Memanggil Kedaulatan...</p>';
                
                try {
                    // JALUR SAKTI SULTAN
                    const path = `./workspaces/kabag_umum/modules/${folder}/module.js?v=${Date.now()}`;
                    const mod = await import(path);
                    viewport.innerHTML = '';
                    // Jalankan initModule bawaan Sultan
                    await mod.default({}, {}, {}, {}, (msg) => alert(msg));
                } catch (err) {
                    console.error(err);
                    viewport.innerHTML = `<p style="color:red; font-size:10px; text-align:center;">❌ Kabel Putus: ${folder}</p>`;
                }
            };
        });
    }

    // 4. LOGIN HANDLER
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Bypass logika buat Jenderal biar cepet ngetes
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        renderGrid();
    });
});
