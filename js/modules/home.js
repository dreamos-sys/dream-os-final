window.DreamOSModules = window.DreamOSModules || {};
window.DreamOSModules.home = {
    state: {},
    init() {
        console.log('🏠 Home module initialized');
        this.carouselSlides = [
            { icon: '👋', title: 'Selamat Datang', content: '<p class="text-sm text-white/80 mb-2">Selamat datang Bapak/Ibu. Silahkan dipilih formnya sesuai kebutuhan.</p>' },
            { icon: '📅', title: 'Jadwal Booking', content: '<div class="space-y-2"><div class="bg-white/10 p-3 rounded-xl border border-white/20"><p class="text-xs text-teal-300 mb-0.5">Hari Ini</p><p class="text-sm font-semibold text-white">Rapat Koordinasi - 09:00 WIB</p></div><div class="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30"><p class="text-xs text-emerald-300 mb-0.5">Besok</p><p class="text-sm font-semibold text-white">Kunjungan Yayasan - 13:00 WIB</p></div></div>' },
            { icon: '📊', title: 'Progress K3', content: '<div class="space-y-2"><div class="bg-white/5 p-2.5 rounded-xl border border-white/10"><div class="flex justify-between text-xs mb-1"><span class="text-white/80">AC Ruang Rapat</span><span class="text-orange-400">Proses</span></div><div class="w-full bg-white/10 rounded-full h-1.5"><div class="bg-orange-400 h-1.5 rounded-full" style="width: 60%"></div></div></div><div class="bg-white/5 p-2.5 rounded-xl border border-white/10"><div class="flex justify-between text-xs mb-1"><span class="text-white/80">Kebersihan Lobby</span><span class="text-emerald-400">Selesai</span></div><div class="w-full bg-white/10 rounded-full h-1.5"><div class="bg-emerald-400 h-1.5 rounded-full" style="width: 100%"></div></div></div></div>' },
            { icon: '🌤️', title: 'Cuaca & AI', content: '<div id="weather-ai" class="bg-white/5 p-3 rounded-xl border border-white/10"><p class="text-sm text-white/70">🤖 AI loading...</p></div>' },
            { icon: '🏢', title: 'Info Management', content: '<div class="bg-white/5 p-3 rounded-xl border border-white/10"><p class="text-xs text-white/50 mb-1">Rapat CEO & Yayasan</p><p class="text-sm font-semibold text-white">Pukul 09:00 WIB di Ruang Rapat SMA</p></div>' },
            { icon: '👥', title: 'Info Team Umum', content: '<div class="bg-white/5 p-3 rounded-xl border border-white/10"><p class="text-xs text-white/50 mb-1">Rapat Mingguan</p><p class="text-sm font-semibold text-white">Jam 09:00 WIB di R. Koord Bagian Umum</p></div>' },
            { icon: '🎁', title: 'Ucapan', content: '<div class="bg-white/5 p-3 rounded-xl border border-white/10"><p class="text-sm text-white/70 mb-1">🎂 Selamat Ulang Tahun</p><p class="text-xs text-white/60">Pak Budi (Komisi 3 Bulan). Semoga berkah!</p></div>' }
        ];
        this.gridData = [
            {icon:'🌍', label:'Command', desc:'Operations', route:'command'},
            {icon:'📅', label:'Booking', desc:'Reserve'},
            {icon:'⚠️', label:'K3', desc:'Safety'},
            {icon:'🔒', label:'Security', desc:'Manage'},
            {icon:'🧹', label:'Janitor In', desc:'Indoor'},
            {icon:'🍃', label:'Janitor Out', desc:'Outdoor'},
            {icon:'📦', label:'Stok', desc:'Warehouse'},
            {icon:'🔧', label:'Maintenance', desc:'Repair'},
            {icon:'🏢', label:'Asset', desc:'Building'}
        ];
        this.renderCarousel();
        this.renderGrid('staff-grid', this.gridData);
        this.initNavigation();
    },
    renderCarousel() {
        const container = document.getElementById('carousel-slides');
        const dotsContainer = document.getElementById('carousel-dots');
        if (!container || !dotsContainer) return;
        container.innerHTML = this.carouselSlides.map((slide, i) => `<div class="carousel-slide ${i === 0 ? 'active' : ''}"><div class="flex items-center gap-2 mb-2"><span class="text-2xl">${slide.icon}</span><h3 class="text-sm font-bold text-white">${slide.title}</h3></div>${slide.content}</div>`).join('');
        dotsContainer.innerHTML = this.carouselSlides.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`).join('');
        dotsContainer.querySelectorAll('.dot').forEach(dot => { dot.addEventListener('click', (e) => { this.goToSlide(parseInt(e.target.dataset.slide)); }); });
        this.startCarousel();
        if (DreamOS.modules['ai-service']) DreamOS.modules['ai-service'].loadAIWeather();
    },
    currentSlide: 0,
    startCarousel() { if (this.state.carouselInterval) clearInterval(this.state.carouselInterval); this.state.carouselInterval = setInterval(() => { this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length; this.showSlide(this.currentSlide); }, 7000); },
    showSlide(index) { document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active')); document.querySelectorAll('.dot').forEach(d => d.classList.remove('active')); if (document.querySelectorAll('.carousel-slide')[index]) document.querySelectorAll('.carousel-slide')[index].classList.add('active'); if (document.querySelectorAll('.dot')[index]) document.querySelectorAll('.dot')[index].classList.add('active'); },
    goToSlide(index) { this.currentSlide = index; this.showSlide(this.currentSlide); this.startCarousel(); },
    renderGrid(containerId, data) { const container = document.getElementById(containerId); if (!container) return; container.innerHTML = data.map(item => `<div class="menu-card glass p-4 rounded-xl flex flex-col items-center justify-center gap-2 min-h-[120px] cursor-pointer" onclick="DreamOS.modules.home.GridClick('${item.label}', '${item.route || ''}')"><div class="text-4xl filter drop-shadow-lg">${item.icon}</div><div class="text-center"><h3 class="text-xs font-bold text-white mb-0.5">${item.label}</h3><p class="text-[9px] text-white/60">${item.desc}</p></div></div>`).join(''); },
    GridClick(label, route) { if (route === 'command') { document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden')); document.getElementById('view-command').classList.remove('hidden'); if (DreamOS.modules.command) DreamOS.modules.command.init(); return; } alert(`🔧 Modul ${label}\n\nReady for development`); },
    initNavigation() { document.querySelectorAll('.nav-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('active', 'text-teal-400'); b.classList.add('text-white/60'); }); btn.classList.add('active', 'text-teal-400'); btn.classList.remove('text-white/60'); const target = btn.dataset.target; document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden')); if (target === 'home') document.getElementById('view-home').classList.remove('hidden'); else if (target === 'command') { if (DreamOS.role === 'KEPALA_BAGIAN') { document.getElementById('view-command').classList.remove('hidden'); if (DreamOS.modules.command) DreamOS.modules.command.init(); } else { alert('⚠️ Command Center untuk Kepala/Koordinator'); document.getElementById('view-home').classList.remove('hidden'); } } else { const viewEl = document.getElementById(`view-${target}`); if (viewEl) viewEl.classList.remove('hidden'); } }); }); }
};
