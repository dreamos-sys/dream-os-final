// modules/home/index.js
// Main Dashboard: 7-Slide Carousel + 9 Module Grid

const slides = [
  "🕌 Bismillah. Selamat datang di Dream OS v2.1",
  "📅 Booking ruang anti double, real-time sync",
  "⚠️ K3 Report: Foto, analisis AI, eskalasi cepat",
  "🧹 Janitor Smart: Jadwal otomatis & prioritas",
  "📦 Stok & Alat: Predictive reorder, zero stockout",
  "🔧 Maintenance: Preventive schedule & tracking",
  "🤖 AI Agent: Asisten digital Kabag Umum 24/7"
];

const modules = [
  { id: 'command', icon: 'fa-desktop', title: 'Command Center', desc: 'Pusat kendali' },
  { id: 'booking', icon: 'fa-calendar-check', title: 'Booking', desc: 'Ruang & Sarana' },
  { id: 'k3', icon: 'fa-hard-hat', title: 'K3', desc: 'Safety & Health' },
  { id: 'security', icon: 'fa-shield-alt', title: 'Sekuriti', desc: 'Keamanan' },
  { id: 'janitor-in', icon: 'fa-broom', title: 'Janitor In', desc: 'Indoor' },
  { id: 'janitor-out', icon: 'fa-leaf', title: 'Janitor Out', desc: 'Outdoor' },
  { id: 'stok', icon: 'fa-boxes', title: 'Stok & Alat', desc: 'Inventaris' },
  { id: 'maintenance', icon: 'fa-tools', title: 'Maintenance', desc: 'Perbaikan' },
  { id: 'asset', icon: 'fa-warehouse', title: 'Asset', desc: 'Gudang' }
];

export default function initHome() {
  const container = document.getElementById('module-container');
  if (!container) return;

  // 1. Render Structure
  container.innerHTML = `
    <div class="carousel">
      <div class="carousel-track" id="carousel-track">
        ${slides.map(s => `<div class="carousel-slide"><h3>${s}</h3></div>`).join('')}
      </div>
      <div class="carousel-dots" id="carousel-dots"></div>
    </div>
    <div class="module-grid">
      ${modules.map(m => `
        <div class="module-card" data-route="#${m.id}">
          <i class="fas ${m.icon}"></i>
          <h3>${m.title}</h3>
          <p>${m.desc}</p>
        </div>
      `).join('')}
    </div>
  `;

  // 2. Carousel Logic
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  let currentSlide = 0;
  let slideInterval;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  // Auto-slide 7 detik
  slideInterval = setInterval(nextSlide, 7000);

  // 3. Module Navigation
  container.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
      const route = card.dataset.route;
      if (route) window.location.hash = route;
    });
  });

  // 4. Cleanup Function (Dipanggil Router saat pindah halaman)
  return () => {
    clearInterval(slideInterval);
    console.log('🧹 Home module cleaned up');
  };
}
