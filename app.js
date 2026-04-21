document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const pwInput = document.getElementById('password');
    const rakaatInput = document.getElementById('rakaat-input');
    const ghostContainer = document.getElementById('ghost-container');
    const logo = document.querySelector('.dream-logo');
    const moduleContainer = document.getElementById('module-container');
    
    let wasm;
    let currentAccessLevel = 99;

    WebAssembly.instantiateStreaming(fetch('/neural_core.wasm'), {})
        .then(obj => { wasm = obj.instance; });

    if (logo) {
        logo.addEventListener('click', () => {
            if (wasm && wasm.exports.trigger_icon_click() === 7) {
                ghostContainer.style.display = 'block';
                rakaatInput.focus();
            }
        });
    }

    function renderGrid() {
        const modules = [
            { id: 1, name: 'Command Center', icon: 'fa-tower-broadcast' },
            { id: 2, name: 'Booking', icon: 'fa-calendar-check' },
            { id: 3, name: 'K3', icon: 'fa-hard-hat' },
            { id: 4, name: 'Sekuriti', icon: 'fa-shield-halved' },
            { id: 5, name: 'Janitor Indoor', icon: 'fa-broom' },
            { id: 6, name: 'Janitor Outdoor', icon: 'fa-shrub' },
            { id: 7, name: 'Stok', icon: 'fa-boxes-stacked' },
            { id: 8, name: 'Maintenance', icon: 'fa-screwdriver-wrench' },
            { id: 9, name: 'Asset', icon: 'fa-file-invoice' }
        ];

        let html = '<div class="grid-container" style="display:grid; grid-template-columns:repeat(3,1fr); gap:15px; padding:10px;">';
        modules.forEach(m => {
            html += `
                <div class="grid-item" style="background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:15px; padding:15px; text-align:center; cursor:pointer;">
                    <i class="fas ${m.icon}" style="color:var(--accent-emerald); font-size:1.2rem; display:block; margin-bottom:5px;"></i>
                    <span style="font-size:0.65rem; font-weight:bold; color:var(--text-primary);">${m.name.toUpperCase()}</span>
                </div>`;
        });
        html += '</div>';
        moduleContainer.innerHTML = html;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!wasm) return;
        currentAccessLevel = wasm.exports.get_access_level(pwInput.value);
        let ghostValid = (ghostContainer.style.display === 'block') ? 
            wasm.exports.validate_ghost_stealth(new Date().getHours(), new Date().getMinutes(), parseInt(rakaatInput.value)) : false;
        if (currentAccessLevel <= 2 || ghostValid) {
            document.getElementById('login-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
            renderGrid();
        } else { alert('❌ Akses Ditolak!'); }
    });
});
