<script>
  import { onMount, onDestroy } from 'svelte';

  // Carousel state
  let currentSlide = 0;
  let isTransitioning = false;
  let carouselInterval;
  const SLIDE_DURATION = 7000; // 7 seconds per slide

  // Weather data
  let weatherData = null;
  const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';
  const DEMO_WEATHER = {
    name: 'Jakarta',
    main: { temp: 31, feels_like: 36, humidity: 72 },
    weather: [{ main: 'Clouds', description: 'mendung, akan hujan', icon: '04d' }],
    wind: { speed: 3.5 }
  };

  // Booking data (real form data)
  const bookings = {
    today: [
      { time: '09:00', name: 'Ruang Rapat SMA', event: 'Rapat Koordinasi Kelas 12', status: 'Confirmed' },
      { time: '13:00', name: 'Aula Utama', event: 'Seminar Nasional', status: 'Pending' },
      { time: '15:30', name: 'Lab Komputer', event: 'Pelatihan Guru', status: 'Confirmed' }
    ],
    tomorrow: [
      { time: '08:00', name: 'Ruang Serbaguna', event: 'Rapat Mingguan', status: 'Confirmed' },
      { time: '10:00', name: 'Perpustakaan', event: 'Workshop Kurikulum', status: 'Pending' }
    ]
  };

  // K3 Progress data
  const k3Data = {
    maintenance: { 
      label: 'Kerusakan', 
      items: [
        { name: 'AC Ruang 102', status: 'In Progress', progress: 65 },
        { name: 'Pintu Gerbang B', status: 'Completed', progress: 100 },
        { name: 'Lift Utama', status: 'Pending', progress: 30 }
      ]
    },
    security: { 
      label: 'Kehilangan', 
      items: [
        { name: 'Laptop Lab 3', status: 'Investigating', progress: 45 },
        { name: 'Kunci Gudang', status: 'Resolved', progress: 100 }
      ]
    },
    janitor: { 
      label: 'Kebersihan', 
      items: [
        { name: 'Lantai 2 Gedung A', status: 'Completed', progress: 100 },
        { name: 'Kantin Area', status: 'In Progress', progress: 70 },
        { name: 'Taman Depan', status: 'Scheduled', progress: 20 }
      ]
    }
  };

  // VIP Command data
  const vipCommands = [
    { time: '10:00', location: 'Ruang Rapat SMA', agenda: 'Rapat Direksi Yayasan', vip: 'CEO & Direksi', priority: 'HIGH' },
    { time: '14:00', location: 'Ruang VIP', agenda: 'Meeting Yayasan Pendidikan', vip: 'Ketua Yayasan', priority: 'CRITICAL' }
  ];

  // GA Command data
  const gaCommands = [
    { time: '08:00', location: 'Ruang Serbaguna', agenda: 'Rapat Mingguan', attendees: 'All Staff' },
    { time: '12:00', location: 'Aula', agenda: 'Briefing Shift Siang', attendees: 'Tim Operasional' }
  ];

  // GA Appreciation data
  const appreciations = [
    { message: 'Terima kasih Tim Umum atas kerja kerasnya minggu ini! 🙏', from: 'Management', time: '1 hour ago' },
    { message: 'Apresiasi setinggi-tingginya untuk Tim Kebersihan yang luar biasa! ✨', from: 'GA Department', time: '3 hours ago' },
    { message: 'Kerja sama tim yang solid! Terima kasih semua! 💪', from: 'Command Center', time: '5 hours ago' }
  ];

  // Slide definitions
  const slides = [
    { id: 'greeting', icon: '🕌', title: 'Greeting', color: '#10b981' },
    { id: 'booking', icon: '📅', title: 'Booking', color: '#3b82f6' },
    { id: 'k3', icon: '🛡️', title: 'K3 Progress', color: '#f59e0b' },
    { id: 'warroom', icon: '🌦️', title: 'War Room', color: '#6366f1' },
    { id: 'vip', icon: '🏢', title: 'VIP Command', color: '#a855f7' },
    { id: 'ga', icon: '📢', title: 'GA Command', color: '#ec4899' },
    { id: 'appreciation', icon: '🤝', title: 'Appreciation', color: '#14b8a6' }
  ];

  // Helper functions
  function getToday() {
    return new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function formatTime(date) {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  // Fetch weather
  async function fetchWeather() {
    if (WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
      weatherData = DEMO_WEATHER;
      return;
    }
    // Real API call would go here
    weatherData = DEMO_WEATHER;
  }

  // Auto-advance slides
  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlide = (currentSlide + 1) % slides.length;
    setTimeout(() => { isTransitioning = false; }, 500);
  }

  function goToSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    isTransitioning = true;
    currentSlide = index;
    setTimeout(() => { isTransitioning = false; }, 500);
    resetTimer();
  }

  function resetTimer() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  // Progress bar animation
  let progress = 0;
  let progressInterval;

  function startProgress() {
    progress = 0;
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      progress += 100 / (SLIDE_DURATION / 50);
      if (progress >= 100) progress = 0;
    }, 50);
  }

  onMount(async () => {
    await fetchWeather();
    carouselInterval = setInterval(nextSlide, SLIDE_DURATION);
    startProgress();
  });

  onDestroy(() => {
    if (carouselInterval) clearInterval(carouselInterval);
    if (progressInterval) clearInterval(progressInterval);
  });
</script>

<div class="carousel-container">
  <!-- Slide Header with Navigation Dots -->
  <div class="slide-header">
    <div class="slide-indicators">
      {#each slides as slide, index}
        <button 
          class="indicator {index === currentSlide ? 'active' : ''}" 
          style="--active-color: {slide.color}"
          on:click={() => goToSlide(index)}
          aria-label="Go to {slide.title} slide">
          <span class="indicator-icon">{slide.icon}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Progress Bar -->
  <div class="progress-bar">
    <div class="progress-fill" style="width: {progress}%; background: linear-gradient(90deg, {slides[currentSlide].color}, {slides[currentSlide].color}dd)"></div>
  </div>

  <!-- Slides Content -->
  <div class="slides-wrapper">
    <!-- SLIDE 1: Greeting Religi -->
    {#if currentSlide === 0}
      <div class="slide-content greeting-slide">
        <div class="greeting-icon">🕌</div>
        <h2 class="greeting-title">Assalamu'alaikum Warahmatullahi Wabarakatuh</h2>
        <p class="greeting-subtitle">Selamat Datang di Dream OS - Master Architect Dashboard</p>
        
        <div class="greeting-body">
          <p class="gratitude">
            "Segala puji bagi Allah SWT yang telah memberikan kita nikmat iman, islam, dan kesehatan. 
            Semoga hari ini dipenuhi berkah dan rahmat-Nya."
          </p>
          
          <div class="sholawat-box">
            <p class="sholawat-arabic">اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ</p>
            <p class="sholawat-translation">
              "Ya Allah, limpahkanlah sholawat dan salam atas junjungan kita Nabi Muhammad SAW, 
              semoga kita mendapat syafaat beliau di dunia dan akhirat. Aamiin Ya Rabbal 'Alamin."
            </p>
          </div>
          
          <div class="date-display">
            <i class="fas fa-calendar-day"></i>
            <span>{getToday()}</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- SLIDE 2: Booking Reminder -->
    {#if currentSlide === 1}
      <div class="slide-content booking-slide">
        <div class="slide-title-row">
          <span class="slide-icon">📅</span>
          <h2>Booking Reminder</h2>
          <span class="slide-badge">{bookings.today.length + bookings.tomorrow.length} Bookings</span>
        </div>

        <div class="booking-section">
          <h3 class="booking-date">
            <i class="fas fa-calendar-day"></i> Hari Ini - {getToday()}
          </h3>
          {#each bookings.today as booking}
            <div class="booking-card">
              <div class="booking-time">{booking.time}</div>
              <div class="booking-details">
                <div class="booking-location">{booking.name}</div>
                <div class="booking-event">{booking.event}</div>
              </div>
              <span class="booking-status {booking.status.toLowerCase()}">{booking.status}</span>
            </div>
          {/each}
        </div>

        <div class="booking-section">
          <h3 class="booking-date tomorrow">
            <i class="fas fa-calendar-plus"></i> Besok - {getTomorrow()}
          </h3>
          {#each bookings.tomorrow as booking}
            <div class="booking-card tomorrow-card">
              <div class="booking-time">{booking.time}</div>
              <div class="booking-details">
                <div class="booking-location">{booking.name}</div>
                <div class="booking-event">{booking.event}</div>
              </div>
              <span class="booking-status {booking.status.toLowerCase()}">{booking.status}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- SLIDE 3: K3 Progress -->
    {#if currentSlide === 2}
      <div class="slide-content k3-slide">
        <div class="slide-title-row">
          <span class="slide-icon">🛡️</span>
          <h2>K3 Progress Report</h2>
          <span class="slide-badge">Real-time Status</span>
        </div>

        <div class="k3-sections">
          <!-- Maintenance -->
          <div class="k3-section">
            <h3 class="k3-section-title" style="border-color: #f59e0b">
              <i class="fas fa-wrench" style="color: #f59e0b"></i>
              {k3Data.maintenance.label} (Maintenance)
            </h3>
            {#each k3Data.maintenance.items as item}
              <div class="k3-item">
                <div class="k3-item-info">
                  <span class="k3-item-name">{item.name}</span>
                  <span class="k3-item-status">{item.status}</span>
                </div>
                <div class="k3-progress-bar">
                  <div class="k3-progress-fill" style="width: {item.progress}%; background: {item.progress === 100 ? '#10b981' : '#f59e0b'}"></div>
                </div>
                <span class="k3-progress-text">{item.progress}%</span>
              </div>
            {/each}
          </div>

          <!-- Security -->
          <div class="k3-section">
            <h3 class="k3-section-title" style="border-color: #3b82f6">
              <i class="fas fa-shield-halved" style="color: #3b82f6"></i>
              {k3Data.security.label} (Security)
            </h3>
            {#each k3Data.security.items as item}
              <div class="k3-item">
                <div class="k3-item-info">
                  <span class="k3-item-name">{item.name}</span>
                  <span class="k3-item-status">{item.status}</span>
                </div>
                <div class="k3-progress-bar">
                  <div class="k3-progress-fill" style="width: {item.progress}%; background: {item.progress === 100 ? '#10b981' : '#3b82f6'}"></div>
                </div>
                <span class="k3-progress-text">{item.progress}%</span>
              </div>
            {/each}
          </div>

          <!-- Janitor -->
          <div class="k3-section">
            <h3 class="k3-section-title" style="border-color: #10b981">
              <i class="fas fa-broom" style="color: #10b981"></i>
              {k3Data.janitor.label} (Janitor Indoor/Outdoor)
            </h3>
            {#each k3Data.janitor.items as item}
              <div class="k3-item">
                <div class="k3-item-info">
                  <span class="k3-item-name">{item.name}</span>
                  <span class="k3-item-status">{item.status}</span>
                </div>
                <div class="k3-progress-bar">
                  <div class="k3-progress-fill" style="width: {item.progress}%; background: {item.progress === 100 ? '#10b981' : '#10b981'}"></div>
                </div>
                <span class="k3-progress-text">{item.progress}%</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <!-- SLIDE 4: War Room (Weather + AI) -->
    {#if currentSlide === 3}
      <div class="slide-content warroom-slide">
        <div class="slide-title-row">
          <span class="slide-icon">🌦️</span>
          <h2>War Room Command</h2>
          <span class="slide-badge">AI Progressive</span>
        </div>

        {#if weatherData}
          <div class="weather-warroom">
            <div class="weather-icon-large">
              {weatherData.weather[0].icon.includes('04') || weatherData.weather[0].icon.includes('09') ? '🌧️' : 
               weatherData.weather[0].icon.includes('11') ? '⛈️' : 
               weatherData.weather[0].icon.includes('01') ? '☀️' : '⛅'}
            </div>
            <div class="weather-warroom-info">
              <div class="weather-temp">{Math.round(weatherData.main.temp)}°C</div>
              <div class="weather-condition">{weatherData.weather[0].description}</div>
              <div class="weather-details">
                <span><i class="fas fa-droplet"></i> {weatherData.main.humidity}%</span>
                <span><i class="fas fa-wind"></i> {weatherData.wind.speed} m/s</span>
              </div>
            </div>
          </div>

          <div class="ai-instruction-box">
            <div class="ai-instruction-header">
              <i class="fas fa-robot"></i>
              <span>AI Progressive Instruction</span>
            </div>
            <p class="ai-instruction-text">
              "Cuaca mendung akan hujan, mohon semua tim standby di area masing-masing 
              demi kenyamanan dan keamanan. Pastikan semua jendela dan pintu tertutup. 
              Siaga peralatan darurat di setiap lantai."
            </p>
          </div>

          <div class="traffic-status">
            <h4><i class="fas fa-road"></i> Status Lalu Lintas</h4>
            <div class="traffic-item">
              <span class="traffic-dot" style="background: #f59e0b"></span>
              <span>Sektor A: Ramai Terkendali</span>
            </div>
            <div class="traffic-item">
              <span class="traffic-dot" style="background: #10b981"></span>
              <span>Sektor B: Lancar</span>
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- SLIDE 5: VIP Command -->
    {#if currentSlide === 4}
      <div class="slide-content vip-slide">
        <div class="slide-title-row">
          <span class="slide-icon">🏢</span>
          <h2>VIP Command Center</h2>
          <span class="slide-badge vip-badge">Yayasan, CEO & Direksi</span>
        </div>

        <div class="vip-commands">
          {#each vipCommands as cmd}
            <div class="vip-command-card" style="border-left-color: {cmd.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b'}">
              <div class="vip-header">
                <span class="vip-time">{cmd.time}</span>
                <span class="vip-priority" style="background: {cmd.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b'}">
                  {cmd.priority}
                </span>
              </div>
              <div class="vip-agenda">{cmd.agenda}</div>
              <div class="vip-details">
                <span><i class="fas fa-location-dot"></i> {cmd.location}</span>
                <span><i class="fas fa-user-tie"></i> {cmd.vip}</span>
              </div>
            </div>
          {/each}
        </div>

        <div class="vip-note">
          <i class="fas fa-circle-info"></i>
          <span>Input khusus dari Command Center untuk agenda Yayasan, CEO, dan Direksi</span>
        </div>
      </div>
    {/if}

    <!-- SLIDE 6: GA Command -->
    {#if currentSlide === 5}
      <div class="slide-content ga-slide">
        <div class="slide-title-row">
          <span class="slide-icon">📢</span>
          <h2>GA Command Center</h2>
          <span class="slide-badge">Agenda Umum</span>
        </div>

        <div class="ga-commands">
          {#each gaCommands as cmd}
            <div class="ga-command-card">
              <div class="ga-time">{cmd.time}</div>
              <div class="ga-command-info">
                <div class="ga-agenda">{cmd.agenda}</div>
                <div class="ga-details">
                  <span><i class="fas fa-location-dot"></i> {cmd.location}</span>
                  <span><i class="fas fa-users"></i> {cmd.attendees}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <div class="ga-note">
          <i class="fas fa-circle-info"></i>
          <span>Input khusus agenda umum untuk seluruh staff dan tim</span>
        </div>
      </div>
    {/if}

    <!-- SLIDE 7: GA Appreciation -->
    {#if currentSlide === 6}
      <div class="slide-content appreciation-slide">
        <div class="slide-title-row">
          <span class="slide-icon">🤝</span>
          <h2>GA Appreciation Wall</h2>
          <span class="slide-badge">Terima Kasih & Apresiasi</span>
        </div>

        <div class="appreciations">
          {#each appreciations as app}
            <div class="appreciation-card">
              <div class="appreciation-message">"{app.message}"</div>
              <div class="appreciation-footer">
                <span class="appreciation-from">
                  <i class="fas fa-user-check"></i> {app.from}
                </span>
                <span class="appreciation-time">{app.time}</span>
              </div>
            </div>
          {/each}
        </div>

        <div class="appreciation-note">
          <i class="fas fa-heart"></i>
          <span>Ucapan terima kasih dan apresiasi untuk seluruh bagian Umum</span>
        </div>
      </div>
    {/if}
  </div>

  <!-- Quick Navigation Menu (3x3 Grid - Now Inside Carousel) -->
  <div class="quick-nav">
    <div class="quick-nav-title">
      <i class="fas fa-grid-2"></i> Quick Navigation
    </div>
    <div class="quick-nav-grid">
      {#each slides as slide, index}
        <button 
          class="quick-nav-item {index === currentSlide ? 'active' : ''}"
          style="--nav-color: {slide.color}"
          on:click={() => goToSlide(index)}>
          <span class="quick-nav-icon">{slide.icon}</span>
          <span class="quick-nav-label">{slide.title}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .carousel-container {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-radius: 24px;
    margin-bottom: 12px;
    border: 1px solid rgba(255, 255, 255, 0.8);
    overflow: hidden;
    position: relative;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.05),
      0 1px 3px rgba(0, 0, 0, 0.03);
  }

  /* Slide Header & Indicators */
  .slide-header {
    padding: 12px 15px 8px;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    border-bottom: 1px solid #e2e8f0;
  }

  .slide-indicators {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 4px;
  }

  .indicator {
    flex: 1;
    max-width: 42px;
    height: 42px;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .indicator:hover {
    transform: scale(1.1);
    border-color: var(--active-color);
  }

  .indicator.active {
    background: var(--active-color);
    border-color: var(--active-color);
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .indicator-icon {
    font-size: 1.2rem;
    filter: grayscale(100%);
    opacity: 0.6;
    transition: all 0.3s;
  }

  .indicator.active .indicator-icon {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.2);
  }

  /* Progress Bar */
  .progress-bar {
    width: 100%;
    height: 3px;
    background: #f1f5f9;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.05s linear, background 0.3s;
  }

  /* Slides Wrapper */
  .slides-wrapper {
    min-height: 380px;
    position: relative;
  }

  .slide-content {
    padding: 18px;
    animation: slideIn 0.5s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .slide-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #f1f5f9;
  }

  .slide-icon {
    font-size: 1.8rem;
  }

  .slide-title-row h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: #1e293b;
    flex: 1;
  }

  .slide-badge {
    background: #10b981;
    color: white;
    font-size: 0.6rem;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .vip-badge {
    background: #a855f7;
  }

  /* Greeting Slide */
  .greeting-slide {
    text-align: center;
    background: linear-gradient(135deg, #10b98108 0%, #10b98115 100%);
  }

  .greeting-icon {
    font-size: 3.5rem;
    margin-bottom: 12px;
    filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3));
  }

  .greeting-title {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    font-weight: 900;
    color: #10b981;
    line-height: 1.3;
  }

  .greeting-subtitle {
    margin: 0 0 15px 0;
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
  }

  .greeting-body {
    text-align: left;
  }

  .gratitude {
    font-size: 0.85rem;
    line-height: 1.6;
    color: #334155;
    margin: 0 0 15px 0;
    font-style: italic;
    padding: 12px;
    background: white;
    border-radius: 12px;
    border-left: 3px solid #10b981;
  }

  .sholawat-box {
    background: white;
    padding: 15px;
    border-radius: 16px;
    margin-bottom: 15px;
    border: 1px solid #10b98130;
  }

  .sholawat-arabic {
    font-size: 1.1rem;
    color: #10b981;
    font-weight: 700;
    margin: 0 0 8px 0;
    text-align: center;
    line-height: 1.8;
  }

  .sholawat-translation {
    font-size: 0.8rem;
    color: #475569;
    margin: 0;
    line-height: 1.5;
    font-style: italic;
  }

  .date-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    background: white;
    border-radius: 12px;
    font-size: 0.85rem;
    color: #1e293b;
    font-weight: 700;
  }

  .date-display i {
    color: #10b981;
  }

  /* Booking Slide */
  .booking-section {
    margin-bottom: 15px;
  }

  .booking-date {
    font-size: 0.8rem;
    color: #10b981;
    font-weight: 700;
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .booking-date.tomorrow {
    color: #3b82f6;
  }

  .booking-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 12px;
    margin-bottom: 8px;
    border-left: 3px solid #10b981;
    transition: all 0.2s;
  }

  .booking-card:hover {
    background: #f1f5f9;
    transform: translateX(5px);
  }

  .tomorrow-card {
    border-left-color: #3b82f6;
  }

  .booking-time {
    font-size: 0.95rem;
    font-weight: 800;
    color: #1e293b;
    min-width: 50px;
  }

  .booking-details {
    flex: 1;
  }

  .booking-location {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 2px;
  }

  .booking-event {
    font-size: 0.75rem;
    color: #64748b;
  }

  .booking-status {
    font-size: 0.6rem;
    padding: 4px 8px;
    border-radius: 8px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .booking-status.confirmed {
    background: #10b98120;
    color: #10b981;
  }

  .booking-status.pending {
    background: #f59e0b20;
    color: #f59e0b;
  }

  /* K3 Slide */
  .k3-sections {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .k3-section {
    background: #f8fafc;
    padding: 12px;
    border-radius: 12px;
  }

  .k3-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 10px 0;
    font-size: 0.8rem;
    font-weight: 700;
    color: #1e293b;
    padding-bottom: 8px;
    border-bottom: 2px solid;
  }

  .k3-section-title i {
    font-size: 1.1rem;
  }

  .k3-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .k3-item:last-child {
    border-bottom: none;
  }

  .k3-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .k3-item-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1e293b;
  }

  .k3-item-status {
    font-size: 0.65rem;
    color: #64748b;
  }

  .k3-progress-bar {
    width: 80px;
    height: 6px;
    background: #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
  }

  .k3-progress-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.5s ease;
  }

  .k3-progress-text {
    font-size: 0.75rem;
    font-weight: 700;
    color: #1e293b;
    min-width: 35px;
    text-align: right;
  }

  /* War Room Slide */
  .weather-warroom {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: linear-gradient(135deg, #6366f110 0%, #6366f120 100%);
    border-radius: 16px;
    margin-bottom: 15px;
    border: 1px solid #6366f130;
  }

  .weather-icon-large {
    font-size: 3rem;
    filter: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.3));
  }

  .weather-warroom-info {
    flex: 1;
  }

  .weather-temp {
    font-size: 2rem;
    font-weight: 900;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 4px;
  }

  .weather-condition {
    font-size: 0.85rem;
    color: #6366f1;
    font-weight: 700;
    margin-bottom: 6px;
    text-transform: capitalize;
  }

  .weather-details {
    display: flex;
    gap: 15px;
    font-size: 0.75rem;
    color: #64748b;
  }

  .weather-details i {
    color: #6366f1;
    margin-right: 4px;
  }

  .ai-instruction-box {
    background: linear-gradient(135deg, #10b98108 0%, #10b98115 100%);
    border: 1px solid #10b98130;
    border-radius: 16px;
    padding: 15px;
    margin-bottom: 15px;
  }

  .ai-instruction-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 0.8rem;
    font-weight: 700;
    color: #10b981;
  }

  .ai-instruction-header i {
    font-size: 1.2rem;
  }

  .ai-instruction-text {
    font-size: 0.85rem;
    line-height: 1.6;
    color: #1e293b;
    margin: 0;
    font-style: italic;
  }

  .traffic-status {
    background: #f8fafc;
    padding: 12px;
    border-radius: 12px;
  }

  .traffic-status h4 {
    margin: 0 0 10px 0;
    font-size: 0.8rem;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .traffic-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    font-size: 0.8rem;
    color: #475569;
  }

  .traffic-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* VIP Slide */
  .vip-commands {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 15px;
  }

  .vip-command-card {
    background: #f8fafc;
    padding: 15px;
    border-radius: 12px;
    border-left: 4px solid;
    transition: all 0.2s;
  }

  .vip-command-card:hover {
    background: #f1f5f9;
    transform: translateX(5px);
  }

  .vip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .vip-time {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1e293b;
  }

  .vip-priority {
    font-size: 0.6rem;
    padding: 4px 10px;
    border-radius: 8px;
    color: white;
    font-weight: 700;
    text-transform: uppercase;
  }

  .vip-agenda {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .vip-details {
    display: flex;
    gap: 15px;
    font-size: 0.75rem;
    color: #64748b;
  }

  .vip-details i {
    margin-right: 4px;
    color: #a855f7;
  }

  .vip-note {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: #a855f108;
    border-radius: 10px;
    font-size: 0.75rem;
    color: #64748b;
  }

  .vip-note i {
    color: #a855f7;
  }

  /* GA Slide */
  .ga-commands {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 15px;
  }

  .ga-command-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 12px;
    border-left: 3px solid #ec4899;
    transition: all 0.2s;
  }

  .ga-command-card:hover {
    background: #f1f5f9;
    transform: translateX(5px);
  }

  .ga-time {
    font-size: 1rem;
    font-weight: 800;
    color: #1e293b;
    min-width: 50px;
  }

  .ga-command-info {
    flex: 1;
  }

  .ga-agenda {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .ga-details {
    font-size: 0.75rem;
    color: #64748b;
    display: flex;
    gap: 12px;
  }

  .ga-details i {
    color: #ec4899;
    margin-right: 4px;
  }

  .ga-note {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: #ec489908;
    border-radius: 10px;
    font-size: 0.75rem;
    color: #64748b;
  }

  .ga-note i {
    color: #ec4899;
  }

  /* Appreciation Slide */
  .appreciations {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 15px;
  }

  .appreciation-card {
    background: linear-gradient(135deg, #14b8a608 0%, #14b8a615 100%);
    padding: 15px;
    border-radius: 16px;
    border: 1px solid #14b8a630;
    transition: all 0.2s;
  }

  .appreciation-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(20, 184, 166, 0.15);
  }

  .appreciation-message {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #1e293b;
    margin: 0 0 10px 0;
    font-weight: 600;
    font-style: italic;
  }

  .appreciation-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.7rem;
    color: #64748b;
  }

  .appreciation-from {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
  }

  .appreciation-from i {
    color: #14b8a6;
  }

  .appreciation-note {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: #14b8a608;
    border-radius: 10px;
    font-size: 0.75rem;
    color: #64748b;
  }

  .appreciation-note i {
    color: #ef4444;
    animation: heartbeat 1.5s infinite;
  }

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  /* Quick Navigation (3x3 Grid) */
  .quick-nav {
    padding: 12px 15px 15px;
    background: linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%);
    border-top: 1px solid rgba(226, 232, 240, 0.5);
  }

  .quick-nav-title {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .quick-nav-title i {
    color: #10b981;
  }

  .quick-nav-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .quick-nav-item {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(226, 232, 240, 0.6);
    border-radius: 14px;
    padding: 10px 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .quick-nav-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    border-color: var(--nav-color);
  }

  .quick-nav-item.active {
    background: linear-gradient(135deg, var(--nav-color) 0%, var(--nav-color)dd 100%);
    border-color: var(--nav-color);
    color: white;
    transform: scale(1.05);
    box-shadow: 
      0 8px 20px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .quick-nav-icon {
    font-size: 1.3rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .quick-nav-item:hover .quick-nav-icon {
    transform: scale(1.15);
  }

  .quick-nav-item.active .quick-nav-icon {
    transform: scale(1.2);
  }

  .quick-nav-label {
    font-family: 'Inter', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    color: #64748b;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .quick-nav-item.active .quick-nav-label {
    color: white;
    font-weight: 800;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .slide-content {
      padding: 15px;
    }

    .slides-wrapper {
      min-height: 350px;
    }

    .indicator {
      height: 38px;
      max-width: 38px;
    }

    .indicator-icon {
      font-size: 1rem;
    }

    .quick-nav-grid {
      gap: 6px;
    }

    .quick-nav-item {
      padding: 8px 6px;
    }
  }
</style>
