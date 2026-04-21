document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const pwInput = document.getElementById('password');
    const rakaatInput = document.getElementById('rakaat-input');
    const ghostContainer = document.getElementById('ghost-container');
    const logo = document.querySelector('.dream-logo');
    let wasm;
    WebAssembly.instantiateStreaming(fetch('/neural_core.wasm'), {}).then(obj => { wasm = obj.instance; });
    logo.addEventListener('click', () => {
        if (wasm && wasm.exports.trigger_icon_click() === 7) {
            ghostContainer.style.display = 'block';
            rakaatInput.focus();
        }
    });
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const accessLevel = wasm.exports.get_access_level(pwInput.value);
        let ghostValid = (ghostContainer.style.display === 'block') ? 
            wasm.exports.validate_ghost_stealth(new Date().getHours(), new Date().getMinutes(), parseInt(rakaatInput.value)) : false;
        if (accessLevel <= 2 || ghostValid) {
            alert('🤲 Bismillah! Akses Diterima.');
            document.getElementById('login-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
        } else { alert('❌ Kode Salah!'); }
    });
});
