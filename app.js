// DREAM OS v2.1.1 — SMART LOGIC ENGINE (Sis Qwen Edition)

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-card');
    const pwInput = document.querySelector('.input-group input');
    const loginBtn = document.querySelector('.btn-primary');
    const togglePw = document.getElementById('toggle-pw');
    const loginScreen = document.getElementById('login-screen');
    
    // 1. Toggle Password Visibility (Mata)
    if (togglePw) {
        togglePw.addEventListener('click', () => {
            const isPw = pwInput.type === 'password';
            pwInput.type = isPw ? 'text' : 'password';
            togglePw.innerHTML = isPw ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    }

    // 2. Logic Akses (Sesuai Memory Mr. M)
    const ACCESS_KEY = "Mr.M_Architect_2025";

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const inputVal = pwInput.value;

            if (inputVal === ACCESS_KEY) {
                alert('🤲 Bismillah! Akses Diterima. Membuka Dashboard...');
                // Animasi Transisi (Pilar Integritas)
                loginScreen.classList.remove('active');
                document.getElementById('dashboard-screen').classList.add('active');
            } else {
                alert('❌ Kode Salah, My Bro! Cek Memory lo.');
                pwInput.value = '';
                pwInput.focus();
            }
        });
    }
});

// 3. Registrasi Service Worker (Biar PWA Jalan)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Dream OS PWA Ready!'))
            .catch(err => console.log('❌ SW Failed', err));
    });
}
