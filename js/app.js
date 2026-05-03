/**
 * Dream OS v1.3.1 - Ghost Mode Ultimate Fix (Inline Onclick)
 */

// 🛡️ CORE ENGINE
window.DreamOS = {
    version: '1.3.1',
    modules: {},
    role: 'STAFF',
    state: { erudaActive: false, carouselInterval: null, currentSlide: 0, tapCount: 0, tapTimer: null },
    
    register(name, mod) {
        this.modules[name] = mod;
        // Expose module functions to window for inline onclick
        if (mod) {
            Object.keys(mod).forEach(key => {
                if (typeof mod[key] === 'function') {
                    window['ghost_' + key] = mod[key].bind(mod);
                }
            });
        }
        console.log(`✅ Module registered: ${name}`);
    },
    
    run(mod, fn, ...args) {
        try {
            if (this.modules[mod]?.[fn]) return this.modules[mod][fn](...args);
            console.warn(`⚠️ ${mod}.${fn} not found`);
        } catch (e) { console.error(`❌ Error in ${mod}.${fn}:`, e); }
    },
    
    t(key, lang = null) {
        const l = lang || localStorage.getItem('dream-lang') || 'id';
        return DreamOS.translations[l]?.[key] || DreamOS.translations['id']?.[key] || key;
    }
};

// 🌐 TRANSLATIONS
DreamOS.translations = {
    id: { appName: 'Dream OS', home: 'BERANDA', user: 'PENGGUNA', menu: 'MENU', info: 'INFO', config: 'PENGATURAN', statsTitle: 'Statistik Hari Ini', users: 'Total Pengguna', uptime: 'Waktu Aktif', logout: 'Keluar' },
    en: { appName: 'Dream OS', home: 'HOME', user: 'USER', menu: 'MENU', info: 'INFO', config: 'CONFIG', statsTitle: 'Today\'s Statistics', users: 'Total Users', uptime: 'Uptime', logout: 'Logout' },
    ar: { appName: 'Dream OS', home: 'الرئيسية', user: 'المستخدم', menu: 'القائمة', info: 'معلومات', config: 'الإعدادات', statsTitle: 'إحصائيات اليوم', users: 'إجمالي المستخدمين', uptime: 'وقت التشغيل', logout: 'تسجيل الخروج' }
};

// 🎠 CAROUSEL DATA
DreamOS.carouselData = [    { icon: 'hand', title: 'Selamat Datang', text: 'Selamat datang Bapak/Ibu. Silahkan dipilih formnya sesuai kebutuhan.' },
    { icon: 'calendar', title: 'Jadwal Booking', text: 'Hari Ini: Rapat Koordinasi 09:00\nBesok: Kunjungan Yayasan 13:00' },
    { icon: 'activity', title: 'Progress K3', text: 'AC Ruang Rapat: 60% (Proses)\nKebersihan Lobby: 100% (Selesai)' },
    { icon: 'cloud-rain', title: 'Cuaca & AI', text: 'Cerah Berawan - 32°C\nPrediksi hujan 15:00 WIB' },
    { icon: 'building-2', title: 'Info Management', text: 'Rapat CEO & Yayasan\nPukul 09:00 WIB di Ruang Rapat SMA' },
    { icon: 'users', title: 'Info Team Umum', text: 'Rapat Mingguan\nJam 09:00 WIB di R. Koord Bagian Umum' },
    { icon: 'gift', title: 'Ucapan', text: '🎂 Selamat Ulang Tahun Pak Budi (Komisi 3 Bulan)' }
];

// 🔢 MENU GRID DATA
DreamOS.menuItems = [
    { icon: '🌍', label: 'Command' }, { icon: '📅', label: 'Booking' }, { icon: '⚠️', label: 'K3' },
    { icon: '🔒', label: 'Security' }, { icon: '🧹', label: 'Janitor In' }, { icon: '🍃', label: 'Janitor Out' },
    { icon: '📦', label: 'Stok' }, { icon: '🔧', label: 'Maintenance' }, { icon: '🏢', label: 'Asset' }
];

// ==========================================
// 🔐 MODUL: AUTH
// ==========================================
DreamOS.register('auth', {
    init() {
        const toggle = document.getElementById('toggle-pw'), input = document.getElementById('access-key');
        if (toggle && input) toggle.addEventListener('click', () => {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            toggle.textContent = isPass ? '🙈' : '👁️';
        });
        const loginBtn = document.getElementById('btn-login');
        if (loginBtn) loginBtn.addEventListener('click', () => this.handleLogin());
    },
    handleLogin() {
        const key = document.getElementById('access-key')?.value;
        if (!key) return alert('Masukkan Access Key!');
        DreamOS.role = (key.includes('admin') || key.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        document.getElementById('dashboard').style.display = 'flex';
        const nav = document.getElementById('bottom-nav');
        if (nav) nav.style.display = 'flex';
        DreamOS.run('home', 'init');
        DreamOS.run('ghost', 'init');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },
    logout() {
        document.getElementById('dashboard').classList.remove('active');
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('login-page').classList.add('active');
        document.getElementById('login-page').style.display = 'flex';
        const nav = document.getElementById('bottom-nav');        if (nav) nav.style.display = 'none';
        document.getElementById('access-key').value = '';
        DreamOS.run('home', 'stopCarousel');
    }
});

// ==========================================
// 🏠 MODUL: HOME
// ==========================================
DreamOS.register('home', {
    init() { this.renderCarousel(); this.renderMenuGrid(); this.initNav(); },
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
    stopCarousel() { if (DreamOS.state.carouselInterval) { clearInterval(DreamOS.state.carouselInterval); DreamOS.state.carouselInterval = null; } },
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
        c.querySelectorAll('.menu-card').forEach((el, i) => el.addEventListener('click', () => alert(DreamOS.menuItems[i].label + ' - Ready!')));
    },
    initNav() {
        document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => { b.classList.remove('text-teal-400'); b.classList.add('text-white/60'); });
                this.classList.add('text-teal-400'); this.classList.remove('text-white/60');
                const t = this.dataset.target;
                if (t === 'menu') alert('📋 Quick Menu: Search, QR, Settings, Activity');
                else if (t === 'config') DreamOS.run('i18n', 'showPicker');
                else alert(t.toUpperCase() + ' - Coming soon!');
            });        });
    }
});

// ==========================================
// 🌐 MODUL: I18N
// ==========================================
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

// ==========================================
// 👻 MODUL: GHOST MODE (ULTIMATE FIX - INLINE ONCLICK)
// ==========================================
DreamOS.register('ghost', {
    init() {
        // 7x tap logo
        const logo = document.getElementById('dream-logo');
        if (logo) {
            logo.addEventListener('pointerdown', () => {
                DreamOS.state.tapCount++;
                if (DreamOS.state.tapCount === 1) DreamOS.state.tapTimer = setTimeout(() => { DreamOS.state.tapCount = 0; }, 2000);
                if (DreamOS.state.tapCount >= 7) {
                    clearTimeout(DreamOS.state.tapTimer);
                    DreamOS.state.tapCount = 0;
                    document.getElementById('ghost-dashboard').classList.add('active');
                    this.renderTools();
                }
            });
        }
        // Close button
        const close = document.getElementById('close-ghost');
        if (close) close.addEventListener('click', () => document.getElementById('ghost-dashboard').classList.remove('active'));
    },    
    // Render tools with INLINE ONCLICK (100% reliable!)
    renderTools() {
        const c = document.getElementById('ghost-tools');
        if (!c) return;
        c.innerHTML = `
            <div class="ghost-card"><div class="flex justify-between items-center mb-3"><h3 class="text-base font-bold text-teal-400">💻 Eruda</h3><button class="ghost-btn" onclick="ghost_toggleEruda()">INJECT</button></div></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🔍 OSINT</h3><div class="flex gap-2 mb-2"><input type="text" id="osint-user" placeholder="Username" class="term-input"><button class="ghost-btn" onclick="ghost_runOSINT()">SCAN</button></div><div id="osint-res" class="hidden bg-black/50 p-3 rounded text-xs font-mono text-emerald-400"></div></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🌐 Nmap</h3><div class="flex gap-2 mb-2"><input type="text" id="nmap-ip" placeholder="192.168.1.1" class="term-input"><button class="ghost-btn" onclick="ghost_copyNmap()">COPY</button></div></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🕷️ Spider</h3><div class="flex gap-2 mb-2"><input type="text" id="spider-url" placeholder="https://target.com" class="term-input"><button class="ghost-btn" onclick="ghost_copySpider()">COPY</button></div></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🐉 Kali</h3><button class="ghost-btn w-full" onclick="ghost_copyKali()">INSTALL</button></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">📡 TShark</h3><button class="ghost-btn w-full bg-purple-500/20 text-purple-300" onclick="ghost_copyTShark()">INSTALL</button></div>
        `;
        console.log('👻 Ghost tools rendered with inline onclick');
    },
    
    // Functions exposed via window.ghost_* by DreamOS.register()
    toggleEruda() {
        const btn = document.getElementById('eruda-btn'); if (!btn) return;
        if (DreamOS.state.erudaActive) {
            if (typeof eruda !== 'undefined') eruda.destroy();
            DreamOS.state.erudaActive = false; btn.textContent = 'INJECT';
        } else {
            const s = document.createElement('script');
            s.src = "https://cdn.jsdelivr.net/npm/eruda";
            s.onload = () => { if (typeof eruda !== 'undefined') { eruda.init(); DreamOS.state.erudaActive = true; btn.textContent = 'REMOVE'; } };
            document.body.appendChild(s);
        }
    },
    
    async runOSINT() {
        const u = document.getElementById('osint-user')?.value, r = document.getElementById('osint-res');
        if (!u || !r) return;
        r.classList.remove('hidden'); r.innerHTML = '🔍 Scanning...';
        try {
            const d = await (await fetch(`https://api.github.com/users/${u}`)).json();
            r.innerHTML = d.login ? `✅ ${d.login}\n📍 ${d.location||'N/A'}\n🏢 ${d.bio||'N/A'}` : '❌ Not found';
        } catch(e) { r.innerHTML = '❌ Error'; }
    },
    
    copyNmap() {
        const ip = document.getElementById('nmap-ip')?.value || '127.0.0.1';
        this.copyText(`nmap -sV -sC ${ip}`);
    },
    
    copySpider() {
        const url = document.getElementById('spider-url')?.value || 'https://target.com';
        this.copyText(`scrapy startproject target && cd target && scrapy genspider target ${url}`);
    },
        copyKali() {
        this.copyText('pkg install proot-distro && proot-distro install kali-linux');
    },
    
    copyTShark() {
        this.copyText('pkg install tshark');
    },
    
    copyText(t) { 
        navigator.clipboard.writeText(t).then(() => alert('✅ Copied:\n' + t)).catch(() => alert('📋 Copy:\n' + t)); 
    }
});

// ==========================================
// 🚀 INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log(`✅ Dream OS v${DreamOS.version} - Ultimate Ghost Mode Fix Loaded`);
    const savedLang = localStorage.getItem('dream-lang') || 'id';
    DreamOS.run('i18n', 'setLanguage', savedLang);
    DreamOS.run('auth', 'init');
    document.getElementById('btn-logout')?.addEventListener('click', () => DreamOS.run('auth', 'logout'));
    // Expose DreamOS globally
    window.DreamOS = DreamOS;
});
