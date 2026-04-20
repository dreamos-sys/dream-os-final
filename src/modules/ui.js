export const UI = {
    slides: [
        "Assalamualaikum, selamat datang...<br>Silahkan di isi formnya sesuai kebutuhan, terimakasih.",
        "📊 Info Real Booking:<br>Ruang Rapat Utama - Available",
        "🛠️ Progress K3:<br>Cleaning Janitor Indoor - 80% Complete",
        "🌤️ Weather: 29°C - Cerah<br>🚦 Lalin: Lancar | Ai: Aman",
        "💼 Command Center:<br>Rapat Management Jam 14:00 WIB",
        "📦 Bagian Umum:<br>Update Stok Inventaris Selesai",
        "✨ Spirit of Dream OS:<br>Thuma'ninah dalam bekerja, Barakah dalam hasil."
    ],
    initCarousel: () => {
        const box = document.getElementById('carousel-box');
        if(!box) return;
        box.innerHTML = UI.slides.map((text, i) => `<div class="slide ${i === 0 ? 'active' : ''}">${text}</div>`).join('');
        let current = 0;
        const slides = box.querySelectorAll('.slide');
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % UI.slides.length;
            slides[current].classList.add('active');
        }, 7000);
    },
    showDashboard: () => {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard-screen').classList.add('active');
        UI.initCarousel();
    }
};
