document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const pwInput = document.getElementById('password');
    const rakaatInput = document.getElementById('rakaat-input');
    const ghostContainer = document.getElementById('ghost-container');
    const logo = document.querySelector('.dream-logo');
    const togglePw = document.getElementById('toggle-pw');
    
    let wasm;

    // Load Neural Core 904 Byte
    WebAssembly.instantiateStreaming(fetch('/neural_core.wasm'), {})
        .then(obj => {
            wasm = obj.instance;
            console.log("✅ Neural Core Ghaib Armed.");
        });

    // Toggle Password Visibility (Fitur Sultan)
    if (togglePw) {
        togglePw.addEventListener('click', () => {
            const type = pwInput.getAttribute('type') === 'password' ? 'text' : 'password';
            pwInput.setAttribute('type', type);
            togglePw.querySelector('i').classList.toggle('fa-eye');
            togglePw.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Easter Egg Click Logic (7x Logo)
    if (logo) {
        logo.addEventListener('click', () => {
            if (!wasm) return;
            const clicks = wasm.exports.trigger_icon_click();
            if (clicks === 7) {
                ghostContainer.style.display = 'block';
                rakaatInput.focus();
                alert('🌙 GHOST STEALTH MODE: ACTIVE.');
            }
        });
    }

    // Validasi Login & Ghost Mode
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!wasm) return;

        const pass = pwInput.value;
        const rakaat = parseInt(rakaatInput.value) || 0;

        // Check via WASM Biner
        const accessLevel = wasm.exports.get_access_level(pass);
        
        let ghostValid = false;
        if (ghostContainer.style.display === 'block') {
            const now = new Date();
            ghostValid = wasm.exports.validate_ghost_stealth(now.getHours(), now.getMinutes(), rakaat);
        }

        if (accessLevel <= 2 || ghostValid) {
            alert('🤲 Bismillah! Akses Diterima.');
            document.getElementById('login-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
            // Jalankan fungsi load data Sultan di sini
        } else {
            const errorDisplay = document.getElementById('login-error');
            errorDisplay.innerText = '❌ Kode Akses Salah, Sultan!';
            setTimeout(() => { errorDisplay.innerText = ''; }, 3000);
        }
    });
});
