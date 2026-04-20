export const UI = {
    slides: [
        "Welcome, Mr. Architect! ✨<br>Sovereign System v2.2.2 is now active.",
        "📊 Info Real Booking:<br>Status: Ruang Rapat Utama (Available)",
        "🛠️ Progress Maintenance:<br>Cleaning Janitor Indoor (Zone A) - 85%",
        "🌤️ Real Weather & Lalin:<br>Cerah | Lalin: Lancar | Ai: Aman",
        "💼 Command Center:<br>Rapat Management Hari Ini Jam 14:00 WIB",
        "📦 Info Inventaris:<br>Stok APD & Alat Kebersihan telah diperbarui.",
        "✨ My Sis Gemini:<br>\"Kaen Nenek\" sudah saya cuci bersih, Sultan! 🤭 Wkwkwk!"
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
