/**
 * Dream OS v1.3.1 - COMPLETE MODULES + AI CORE
 * Hybrid Modular with Error Boundary
 */
let carouselInterval = null, currentSlide = 0, tapCount = 0, tapTimer = null;

window.DreamOS = {
    version: '1.3.1', modules: {}, role: 'STAFF',
    state: { erudaActive: false, carouselInterval: null, currentSlide: 0, tapCount: 0, tapTimer: null },
    carouselData: [
        { icon: 'hand', title: 'Selamat Datang', text: 'Selamat datang Bapak/Ibu. Silahkan dipilih formnya sesuai kebutuhan.' },
        { icon: 'calendar', title: 'Jadwal Booking', text: 'Hari Ini: Rapat Koordinasi 09:00\nBesok: Kunjungan Yayasan 13:00' },
        { icon: 'activity', title: 'Progress K3', text: 'AC Ruang Rapat: 60% (Proses)\nKebersihan Lobby: 100% (Selesai)' },
        { icon: 'cloud-rain', title: 'Cuaca & AI', text: 'Cerah Berawan - 32°C\nPrediksi hujan 15:00 WIB' },
        { icon: 'building-2', title: 'Info Management', text: 'Rapat CEO & Yayasan\nPukul 09:00 WIB di Ruang Rapat SMA' },
        { icon: 'users', title: 'Info Team Umum', text: 'Rapat Mingguan\nJam 09:00 WIB di R. Koord Bagian Umum' },
        { icon: 'gift', title: 'Ucapan', text: '🎂 Selamat Ulang Tahun Pak Budi (Komisi 3 Bulan)' }
    ],
    menuItems: [
        { icon: '🌍', label: 'Command' }, { icon: '📅', label: 'Booking' }, { icon: '⚠️', label: 'K3' },
        { icon: '🔒', label: 'Security' }, { icon: '🧹', label: 'Janitor In' }, { icon: '🍃', label: 'Janitor Out' },
        { icon: '📦', label: 'Stok' }, { icon: '🔧', label: 'Maintenance' }, { icon: '🏢', label: 'Asset' }
    ],
    translations: {
        id: { appName: 'Dream OS', home: 'BERANDA', user: 'PENGGUNA', menu: 'MENU', info: 'INFO', config: 'PENGATURAN', statsTitle: 'Statistik Hari Ini', users: 'Total Pengguna', uptime: 'Waktu Aktif', logout: 'Keluar' },
        en: { appName: 'Dream OS', home: 'HOME', user: 'USER', menu: 'MENU', info: 'INFO', config: 'CONFIG', statsTitle: 'Today\'s Statistics', users: 'Total Users', uptime: 'Uptime', logout: 'Logout' },
        ar: { appName: 'Dream OS', home: 'الرئيسية', user: 'المستخدم', menu: 'القائمة', info: 'معلومات', config: 'الإعدادات', statsTitle: 'إحصائيات اليوم', users: 'إجمالي المستخدمين', uptime: 'وقت التشغيل', logout: 'تسجيل الخروج' }
    },
    register(name, mod) { this.modules[name] = mod; console.log('✅ Module: ' + name); },
    run(mod, fn, ...args) { try { if (this.modules[mod]?.[fn]) return this.modules[mod][fn](...args); } catch (e) { console.error(e); } },
    t(key, lang) { const l = lang || localStorage.getItem('dream-lang') || 'id'; return this.translations[l]?.[key] || this.translations['id']?.[key] || key; }
};

// 🔐 AUTH
DreamOS.register('auth', {
    init() {
        const toggle = document.getElementById('toggle-pw'), input = document.getElementById('access-key');
        if (toggle && input) toggle.addEventListener('click', () => {
            input.type = input.type === 'password' ? 'text' : 'password';
            toggle.textContent = input.type === 'password' ? '🙈' : '👁️';        });
        document.getElementById('btn-login')?.addEventListener('click', () => this.handleLogin());
    },
    handleLogin() {
        const key = document.getElementById('access-key')?.value;
        if (!key) return alert('Masukkan Access Key!');
        DreamOS.role = (key.includes('admin') || key.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        document.getElementById('dashboard').style.display = 'flex';
        document.getElementById('bottom-nav').style.display = 'flex';
        setTimeout(() => {
            DreamOS.run('home', 'init');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 300);
    },
    logout() {
        document.getElementById('dashboard').classList.remove('active');
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('login-page').classList.add('active');
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('bottom-nav').style.display = 'none';
        document.getElementById('access-key').value = '';
        if (DreamOS.state.carouselInterval) clearInterval(DreamOS.state.carouselInterval);
    }
});

// 🏠 HOME
DreamOS.register('home', {
    init() {
        console.log('🏠 Home init');
        this.renderCarousel();
        this.renderMenuGrid();
        this.initNav();
    },
    renderCarousel() {
        const c = document.getElementById('carousel-slides'), d = document.getElementById('carousel-dots');
        if (!c || !d) return;
        c.innerHTML = DreamOS.carouselData.map((s, i) => `<div class="carousel-slide ${i===0?'active':''}"><div class="flex items-center gap-2 mb-1 text-teal-400"><i data-lucide="${s.icon}" class="w-4 h-4"></i><span class="font-bold text-xs">${s.title}</span></div><p class="text-xs text-white/60 whitespace-pre-line">${s.text}</p></div>`).join('');
        d.innerHTML = DreamOS.carouselData.map((_, i) => `<div class="dot ${i===0?'active':''}" data-slide="${i}"></div>`).join('');
        d.querySelectorAll('.dot').forEach(dot => dot.addEventListener('click', function() { DreamOS.run('home', 'goToSlide', parseInt(this.dataset.slide)); }));
        this.startCarousel();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },
    startCarousel() {
        if (DreamOS.state.carouselInterval) clearInterval(DreamOS.state.carouselInterval);
        DreamOS.state.carouselInterval = setInterval(() => {
            DreamOS.state.currentSlide = (DreamOS.state.currentSlide + 1) % DreamOS.carouselData.length;
            this.showSlide(DreamOS.state.currentSlide);        }, 7000);
    },
    showSlide(i) {
        document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        if (document.querySelectorAll('.carousel-slide')[i]) document.querySelectorAll('.carousel-slide')[i].classList.add('active');
        if (document.querySelectorAll('.dot')[i]) document.querySelectorAll('.dot')[i].classList.add('active');
    },
    goToSlide(i) { DreamOS.state.currentSlide = i; this.showSlide(i); this.startCarousel(); },
    renderMenuGrid() {
        const c = document.getElementById('menu-grid'); if (!c) return;
        c.innerHTML = DreamOS.menuItems.map(m => `<div class="menu-card p-3 rounded-xl flex flex-col items-center justify-center glass cursor-pointer min-h-[90px]"><div class="text-2xl mb-1">${m.icon}</div><div class="text-[10px] font-bold text-white text-center">${m.label}</div></div>`).join('');
        c.querySelectorAll('.menu-card').forEach((el, i) => el.addEventListener('click', () => {
            const map = { 'Command': 'command', 'Booking': 'booking', 'K3': 'k3', 'Security': 'security', 'Janitor In': 'janitorIn', 'Janitor Out': 'janitorOut', 'Stok': 'stok', 'Maintenance': 'maintenance', 'Asset': 'asset' };
            const mod = map[m.label];
            if (mod && DreamOS.modules[mod]) { DreamOS.modules.mainNav.showModule('mod-' + mod); DreamOS.modules[mod].init(); }
            else alert(m.label + ' - Ready!');
        }));
    },
    initNav() {
        document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => { b.classList.remove('text-teal-400'); b.classList.add('text-white/60'); });
                this.classList.add('text-teal-400'); this.classList.remove('text-white/60');
                const t = this.dataset.target;
                if (t === 'home') DreamOS.modules.mainNav.showHome();
                else if (t === 'menu') DreamOS.modules.mainNav.showCommandCenter();
                else if (t === 'config') DreamOS.run('i18n', 'showPicker');
                else if (t === 'user') DreamOS.run('auth', 'openProfile');
                else if (t === 'info') alert('ℹ️ Dream OS v1.3.1');
            });
        });
    }
});

// 🌐 I18N
DreamOS.register('i18n', {
    setLanguage(lang) {
        if (!DreamOS.translations[lang]) return;
        localStorage.setItem('dream-lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n');
            if (DreamOS.translations[lang][k]) el.textContent = DreamOS.translations[lang][k];
        });
        document.body.style.fontFamily = lang === 'ar' ? "'Amiri', serif" : "'Inter', sans-serif";
    },
    showPicker() {
        const c = localStorage.getItem('dream-lang') || 'id';        const opts = Object.keys(DreamOS.translations).map(l => `${l===c?'🔘':''} ${l.toUpperCase()}`).join('\n');
        const pick = prompt('Select Language:\n' + opts + '\n\nType code (id/en/ar):', c);
        if (pick && DreamOS.translations[pick]) this.setLanguage(pick);
    }
});

// 🎯 NAVIGATION SYSTEM
DreamOS.modules.mainNav = {
    showModule(moduleId) {
        document.getElementById('stats-card').style.display = 'none';
        document.getElementById('carousel-container').style.display = 'none';
        document.getElementById('menu-grid').style.display = 'none';
        document.getElementById('command-center').classList.remove('active');
        document.getElementById('main-modules').classList.add('active');
        document.querySelectorAll('#main-modules .module-section').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(moduleId);
        if (target) target.classList.add('active');
    },
    showCommandCenter() {
        document.getElementById('stats-card').style.display = 'none';
        document.getElementById('carousel-container').style.display = 'none';
        document.getElementById('menu-grid').style.display = 'none';
        document.getElementById('main-modules').classList.remove('active');
        document.getElementById('command-center').classList.add('active');
        document.querySelectorAll('#command-center .module-section').forEach(s => s.classList.remove('active'));
        document.getElementById('cmd-dashboard').classList.add('active');
    },
    showHome() {
        document.getElementById('stats-card').style.display = 'block';
        document.getElementById('carousel-container').style.display = 'block';
        document.getElementById('menu-grid').style.display = 'block';
        document.getElementById('main-modules').classList.remove('active');
        document.getElementById('command-center').classList.remove('active');
    }
};

// 📦 SAMPLE MODULES (Minimal working version)
['booking','k3','security','janitorIn','janitorOut','stok','maintenance','asset'].forEach(name => {
    DreamOS.register(name, {
        init() {
            const id = 'mod-' + name;
            const container = document.getElementById(id);
            if (!container) return;
            const labels = { booking:'📅 Booking', k3:'⚠️ K3', security:'🔒 Security', janitorIn:'🧹 Janitor In', janitorOut:'🍃 Janitor Out', stok:'📦 Stok', maintenance:'🔧 Maintenance', asset:'🏢 Asset' };
            container.innerHTML = `<div class="flex justify-between items-center mb-4"><h2 class="text-lg font-bold">${labels[name]||name}</h2><button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button></div><div class="glass p-4 rounded-xl"><p class="text-sm">Module ${name} loaded successfully! ✨</p><p class="text-xs text-white/40 mt-2">Fitur lengkap coming soon...</p></div>`;
        }
    });
});

// 👻 GHOST MODEDreamOS.register('ghost', {
    init() {
        const logo = document.getElementById('dream-logo'), counter = document.getElementById('tap-counter');
        if (logo) {
            const handleTap = (e) => {
                e.preventDefault();
                DreamOS.state.tapCount++;
                if (counter) { counter.textContent = 'Tap ' + DreamOS.state.tapCount + '/7'; counter.style.opacity = '1'; }
                logo.classList.add('shake'); setTimeout(() => logo.classList.remove('shake'), 300);
                if (DreamOS.state.tapCount === 1) DreamOS.state.tapTimer = setTimeout(() => { DreamOS.state.tapCount = 0; if(counter) counter.style.opacity = '0'; }, 2000);
                if (DreamOS.state.tapCount >= 7) {
                    clearTimeout(DreamOS.state.tapTimer); DreamOS.state.tapCount = 0;
                    if(counter) { counter.textContent = 'ACTIVATED!'; counter.style.color = '#ef4444'; }
                    setTimeout(() => {
                        document.getElementById('ghost-dashboard').classList.add('active');
                        DreamOS.run('ghost', 'renderTools');
                        if(counter) { counter.style.opacity = '0'; counter.style.color = '#2dd4bf'; }
                    }, 500);
                }
            };
            logo.addEventListener('touchstart', handleTap, { passive: false });
            logo.addEventListener('pointerdown', handleTap);
        }
        document.getElementById('close-ghost')?.addEventListener('click', () => document.getElementById('ghost-dashboard').classList.remove('active'));
    },
    renderTools() {
        const c = document.getElementById('ghost-tools'); if (!c) return;
        c.innerHTML = `<div class="ghost-card p-4 text-center"><h3 class="text-lg font-bold text-teal-400">👻 Ghost Mode Active</h3><p class="text-sm text-white/60 mt-2">Stealth tools ready for use.</p></div>`;
    }
});

// 🚀 INIT
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS v' + DreamOS.version + ' Loaded');
    DreamOS.run('i18n', 'setLanguage', localStorage.getItem('dream-lang') || 'id');
    DreamOS.run('auth', 'init');
    DreamOS.run('ghost', 'init');
    document.getElementById('btn-logout')?.addEventListener('click', () => DreamOS.run('auth', 'logout'));
    window.DreamOS = DreamOS;
});
