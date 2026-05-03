/**
 * Dream OS v1.3.1 - Complete Nav Navigation Fix
 */
let carouselInterval = null, currentSlide = 0, tapCount = 0, tapTimer = null;

const translations = {
    id: { appName: 'Dream OS', home: 'BERANDA', user: 'PENGGUNA', menu: 'MENU', info: 'INFO', config: 'PENGATURAN', statsTitle: 'Statistik Hari Ini', users: 'Total Pengguna', uptime: 'Waktu Aktif', logout: 'Keluar' },
    en: { appName: 'Dream OS', home: 'HOME', user: 'USER', menu: 'MENU', info: 'INFO', config: 'CONFIG', statsTitle: 'Today\'s Statistics', users: 'Total Users', uptime: 'Uptime', logout: 'Logout' },
    ar: { appName: 'Dream OS', home: 'الرئيسية', user: 'المستخدم', menu: 'القائمة', info: 'معلومات', config: 'الإعدادات', statsTitle: 'إحصائيات اليوم', users: 'إجمالي المستخدمين', uptime: 'وقت التشغيل', logout: 'تسجيل الخروج' }
};

const carouselData = [
    { icon: 'hand', title: 'Selamat Datang', text: 'Selamat datang Bapak/Ibu. Silahkan dipilih formnya sesuai kebutuhan.' },
    { icon: 'calendar', title: 'Jadwal Booking', text: 'Hari Ini: Rapat Koordinasi 09:00\nBesok: Kunjungan Yayasan 13:00' },
    { icon: 'activity', title: 'Progress K3', text: 'AC Ruang Rapat: 60% (Proses)\nKebersihan Lobby: 100% (Selesai)' },
    { icon: 'cloud-rain', title: 'Cuaca & AI', text: 'Cerah Berawan - 32°C\nPrediksi hujan 15:00 WIB' },
    { icon: 'building-2', title: 'Info Management', text: 'Rapat CEO & Yayasan\nPukul 09:00 WIB di Ruang Rapat SMA' },
    { icon: 'users', title: 'Info Team Umum', text: 'Rapat Mingguan\nJam 09:00 WIB di R. Koord Bagian Umum' },
    { icon: 'gift', title: 'Ucapan', text: '🎂 Selamat Ulang Tahun Pak Budi (Komisi 3 Bulan)' }
];

const menuItems = [
    { icon: '🌍', label: 'Command' }, { icon: '📅', label: 'Booking' }, { icon: '⚠️', label: 'K3' },
    { icon: '🔒', label: 'Security' }, { icon: '🧹', label: 'Janitor In' }, { icon: '🍃', label: 'Janitor Out' },
    { icon: '📦', label: 'Stok' }, { icon: '🔧', label: 'Maintenance' }, { icon: '🏢', label: 'Asset' }
];

window.DreamOS = {
    version: '1.3.1', modules: {}, role: 'STAFF',
    state: { erudaActive: false, carouselInterval: null, currentSlide: 0, tapCount: 0, tapTimer: null },
    register(name, mod) { this.modules[name] = mod; },
    run(mod, fn, ...args) { try { if (this.modules[mod]?.[fn]) return this.modules[mod][fn](...args); } catch (e) { console.error(e); } },
    t(key, lang) { const l = lang || localStorage.getItem('dream-lang') || 'id'; return this.translations[l]?.[key] || this.translations['id']?.[key] || key; }
};

DreamOS.register('auth', {
    init() {
        const toggle = document.getElementById('toggle-pw'), input = document.getElementById('access-key');
        if (toggle && input) toggle.addEventListener('click', () => {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            toggle.textContent = isPass ? '🙈' : '👁️';
        });
        document.getElementById('btn-login')?.addEventListener('click', () => this.handleLogin());
    },
    handleLogin() {
        const key = document.getElementById('access-key')?.value;
        if (!key) return alert('Masukkan Access Key!');
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        document.getElementById('dashboard').style.display = 'flex';
        document.getElementById('bottom-nav').style.display = 'flex';
        DreamOS.run('home', 'init');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },
    openProfile() {
        const dName = navigator.userAgent || 'Unknown Device';
        alert(`👤 User Profile\n\nRole: ${DreamOS.role}\nEmail: user@dream.com\nDevice: ${dName}`);
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

DreamOS.register('home', {
    init() {
        this.renderCarousel();
        this.renderMenuGrid();
        this.initNav();
        document.getElementById('btn-logout')?.addEventListener('click', () => DreamOS.run('auth', 'logout'));
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
            this.showSlide(DreamOS.state.currentSlide);
        }, 7000);
    },
    showSlide(i) {
        document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        if (document.querySelectorAll('.carousel-slide')[i]) document.querySelectorAll('.carousel-slide')[i].classList.add('active');
        if (document.querySelectorAll('.dot')[i]) document.querySelectorAll('.dot')[i].classList.add('active');
    },
    goToSlide(i) {
        DreamOS.state.currentSlide = i;
        this.showSlide(i);
        this.startCarousel();
    },
    renderMenuGrid() {
        const c = document.getElementById('menu-grid');
        if (!c) return;
        c.innerHTML = DreamOS.menuItems.map(m => `<div class="menu-card p-3 rounded-xl flex flex-col items-center justify-center glass cursor-pointer min-h-[90px]"><div class="text-2xl mb-1">${m.icon}</div><div class="text-[10px] font-bold text-white text-center">${m.label}</div></div>`).join('');
        c.querySelectorAll('.menu-card').forEach((el, i) => el.addEventListener('click', () => alert(DreamOS.menuItems[i].label + ' module - Ready!')));
    },
    initNav() {
        document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => { b.classList.remove('text-teal-400'); b.classList.add('text-white/60'); });
                this.classList.add('text-teal-400');
                this.classList.remove('text-white/60');
                const t = this.dataset.target;
                
                if (t === 'user') DreamOS.run('auth', 'openProfile');
                else if (t === 'menu') DreamOS.run('home', 'openMenuModal');
                else if (t === 'info') DreamOS.run('home', 'openInfoModal');
                else if (t === 'config') DreamOS.run('i18n', 'showPicker');
            });
        });
    },
    openMenuModal() {
        alert('📷 Multipurpose QR Scan:\nQRIS, Produk, URL\n\nKamera siap digunakan.');
    },
    openInfoModal() {
        alert('ℹ️ Dream OS v1.3.1\n\nSay thanks: Alhamdulillah, jazakumullah khair. Dibuat dengan standar ISO 27001 dan ISO 9241 oleh Dream Team.');
    }
});

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
        const c = localStorage.getItem('dream-lang') || 'id';
        const opts = Object.keys(DreamOS.translations).map(l => `${l===c?'🔘':'⚪'} ${l.toUpperCase()}`).join('\n');
        const pick = prompt(`Select Language:\n${opts}\n\nType code (id/en/ar):`, c);
        if (pick && DreamOS.translations[pick]) this.setLanguage(pick);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Final navigation engine started');
    DreamOS.run('i18n', 'setLanguage', localStorage.getItem('dream-lang') || 'id');
    DreamOS.run('auth', 'init');
    window.DreamOS = DreamOS;
});
