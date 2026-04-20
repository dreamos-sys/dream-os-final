import { Auth } from './modules/auth.js';
import { State } from './modules/state.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const togglePass = document.getElementById('togglePass');
    const input = document.getElementById('accessKey');

    // 👁️ Eye Show/Hide Toggle
    togglePass.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        togglePass.classList.toggle('fa-eye-slash');
    });

    // 🚪 Login Logic with Multi-Role & Ghost Mode
    loginBtn.addEventListener('click', async () => {
        const data = await State.sync();
        // Dynamic Key: Maghrib (e.g. 1750) + 3 rakaat = 1753
        const maghribTime = data ? data.pray.data.timings.Maghrib.replace(':','') : "0000";
        const ghostKey = parseInt(maghribTime) + 3;

        const authResult = Auth.check(input.value, ghostKey);

        if (authResult) {
            alert(`🤲 Bismillah! Akses Diterima: ${authResult.role}`);
            document.getElementById('login-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
            
            if(data) document.getElementById('zikir-title').innerText = data.zikir.name;
            startCarousel();
        } else {
            alert('❌ Kunci Tidak Valid! Cek Integritas.');
        }
    });

    // 🔄 Carousel Engine (7 Slides - 7 Seconds)
    function startCarousel() {
        const slides = document.querySelectorAll('.slide');
        let index = 0;
        setInterval(() => {
            slides[index].classList.remove('active');
            index = (index + 1) % slides.length;
            slides[index].classList.add('active');
        }, 7000);
    }
});
