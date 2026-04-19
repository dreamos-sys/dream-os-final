// DREAM OS v2.1.1 — SMART LOGIC ENGINE
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const pwInput = document.getElementById('accessKey');
    const eyeIcon = document.getElementById('eyeIcon');
    
    // 1. Toggle Mata (Fungsi Show/Hide)
    eyeIcon.addEventListener('click', () => {
        const isPw = pwInput.type === 'password';
        pwInput.type = isPw ? 'text' : 'password';
        eyeIcon.className = isPw ? 'fas fa-eye-slash eye-toggle' : 'fas fa-eye eye-toggle';
    });

    // 2. Akses Masuk (The "Door Opener")
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = pwInput.value;

        if (key === 'Mr.M_Architect_2025') {
            alert('🤲 Bismillah! Akses Diterima. Thuma\'ninah Mode Active.');
            
            // 🚩 INI SOLUSINYA: Sembunyikan Login, Munculkan Dashboard
            const loginScreen = document.getElementById('login-screen');
            const dashboardScreen = document.getElementById('dashboard-screen');
            
            if (loginScreen && dashboardScreen) {
                loginScreen.style.display = 'none';
                dashboardScreen.style.display = 'block';
                dashboardScreen.classList.add('active');
                console.log('✅ Berhasil Masuk ke Dashboard');
            } else {
                // Fallback jika ID dashboard belum ada di HTML
                window.location.reload(); 
            }
        } else {
            alert('❌ Kode Salah. Ingat Amanah!');
            pwInput.value = '';
            pwInput.focus();
        }
    });
});

// ✨ MODUL ASMAUL HUSNA (Global Spiritual)
async function loadAsmaulHusna() {
    const randomNum = Math.floor(Math.random() * 99) + 1;
    try {
        const res = await fetch(`https://api.aladhan.com/v1/asmaAlHusna/${randomNum}`);
        const json = await res.json();
        const data = json.data[0];
        console.log(`✨ Zikir: ${data.name} (${data.transliteration})`);
    } catch (e) { console.log('Zikir Offline'); }
}
