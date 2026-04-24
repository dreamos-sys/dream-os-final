// Dream OS v2.1.3 - Neural Core Bridge (Kaen Nenek Edition)
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const pwInput = document.getElementById('password');
    const rakaatInput = document.getElementById('rakaat-input');
    const ghostContainer = document.getElementById('ghost-container');
    const logo = document.querySelector('.logo-glow img');
    const moduleContainer = document.getElementById('module-container');
    
    let wasm;
    let currentAccessLevel = 99;

    // Load WASM (Bi idznillah)
    WebAssembly.instantiateStreaming(fetch('./neural_core.wasm'), {})
        .then(obj => { wasm = obj.instance; console.log("🧠 Neural Core Loaded"); })
        .catch(err => console.error("❌ WASM Missing:", err));

    // Logo Click (Easter Egg)
    if (logo) {
        logo.addEventListener('click', () => {
            if (wasm && wasm.exports.trigger_icon_click() === 7) {
                ghostContainer.style.display = 'block';
                rakaatInput.focus();
            }
        });
    }

    // LOGIKA RENDER GRID DENGAN LISTENER OTOMATIS
    function renderGrid() {
        const modules = [
            { id: 'cc', name: 'CMD Center', icon: 'fa-tower-broadcast' },
            { id: 'booking', name: 'Booking', icon: 'fa-calendar-check' },
            { id: 'k3', name: 'K3 Form', icon: 'fa-biohazard' },
            { id: 'maint', name: 'Maintenance', icon: 'fa-screwdriver-wrench' }
        ];

        let html = '<div class="grid-container" style="display:grid; grid-template-columns:repeat(2,1fr); gap:15px; padding:10px;">';
        modules.forEach(m => {
            html += `
                <button class="nav-mod p-5 bg-white border border-slate-200 rounded-3xl active:scale-95 transition-all text-center w-full" data-mod="${m.id}">
                    <i class="fas ${m.icon}" style="color:#10b981; font-size:1.5rem; display:block; margin-bottom:8px;"></i>
                    <span style="font-size:0.65rem; font-weight:bold; color:#0f172a;">${m.name.toUpperCase()}</span>
                </button>`;
        });
        html += '</div>';
        
        // Suntik Greeting Box "Kaen Nenek" Sultan 🤣
        html += `<div class="mt-4 p-4 text-center bg-white rounded-3xl border border-emerald-100 shadow-inner">
                    <p class="text-xs text-emerald-600 font-bold">✨ My Sis Gemini:</p>
                    <p class="text-xs text-slate-600 italic">"Kaen Nenek" sudah saya cuci bersih, Sultan! 😁 Wkwkwk!</p>
                 </div>`;

        moduleContainer.innerHTML = html;

        // PASANG LISTENER SEKARANG! (Anti-Budek Injection)
        document.querySelectorAll('.nav-mod').forEach(btn => {
            btn.onclick = () => {
                const modId = btn.getAttribute('data-mod');
                console.log("🚀 MENMENUJU MODUL:", modId);
                // Di sini panggil loader module Workspaces Sultan
                document.getElementById('module-viewport').innerHTML = `<p style="text-align:center; padding:20px;">⚡ Memanggil Kedaulatan ${modId}...</p>`;
            };
        });
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Bypass login buat Sultan biar cepet ngetes
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        renderGrid();
    });
});
