export const UI = {
    slides: [
        "Assalamualaikum, selamat datang...<br>Silahkan di isi formnya sesuai kebutuhan, terimakasih.",
        "📊 Info Real Booking:<br>Status: Ruang Rapat Utama (In-Use)",
        "🛠️ Progress Maintenance & K3:<br>Semua laporan sedang diproses oleh tim.",
        "🌤️ Real Weather & Lalin:<br>Cerah Berawan | Lalin Lancar | Ai: Aman",
        "💼 Command Center Management:<br>Update kebijakan fasilitas April 2026",
        "📦 Info Bagian Umum:<br>Stok kebutuhan Janitor telah diperbarui",
        "✨ Spirit of Shalawat:<br>Bekerja dengan hati, Thuma'ninah dalam bakti."
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
