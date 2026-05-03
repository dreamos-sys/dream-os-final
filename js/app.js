/**
 * Dream OS v1.3.1 - Scalable i18n System (Hybrid)
 * Tips: Tambah bahasa baru = copy-paste dari spreadsheet!
 */
let carouselInterval = null, currentSlide = 0, tapCount = 0, tapTimer = null;

// 🌐 TRANSLATIONS DICTIONARY (Tambah bahasa baru di sini!)
// Format: lang_code: { key: value, ... }
const translations = {
    // === DEFAULT LANGUAGES ===
    id: {
        appName: 'Dream OS', home: 'BERANDA', user: 'PENGGUNA', menu: 'MENU',
        info: 'INFO', config: 'PENGATURAN', welcome: 'Selamat Datang',
        statsTitle: 'Statistik Hari Ini', users: 'Total Pengguna', uptime: 'Waktu Aktif', logout: 'Keluar'
    },
    en: {
        appName: 'Dream OS', home: 'HOME', user: 'USER', menu: 'MENU',
        info: 'INFO', config: 'CONFIG', welcome: 'Welcome',
        statsTitle: 'Today\'s Statistics', users: 'Total Users', uptime: 'Uptime', logout: 'Logout'
    },
    ar: {
        appName: 'Dream OS', home: 'الرئيسية', user: 'المستخدم', menu: 'القائمة',
        info: 'معلومات', config: 'الإعدادات', welcome: 'أهلاً بك',
        statsTitle: 'إحصائيات اليوم', users: 'إجمالي المستخدمين', uptime: 'وقت التشغيل', logout: 'تسجيل الخروج'
    },
    
    // === TAMBAH BAHASA BARU DI BAWAH INI (Copy-paste dari spreadsheet!) ===
    // Contoh: French (fr)
    /*
    fr: {
        appName: 'Dream OS', home: 'Accueil', user: 'Utilisateur', menu: 'Menu',
        info: 'Info', config: 'Config', welcome: 'Bienvenue',
        statsTitle: 'Statistiques du jour', users: 'Total utilisateurs', uptime: 'Temps de fonctionnement', logout: 'Déconnexion'
    },
    */
    
    // Contoh: Spanish (es)
    /*
    es: {
        appName: 'Dream OS', home: 'Inicio', user: 'Usuario', menu: 'Menú',
        info: 'Info', config: 'Configuración', welcome: 'Bienvenido',
        statsTitle: 'Estadísticas de hoy', users: 'Total de usuarios', uptime: 'Tiempo de actividad', logout: 'Cerrar sesión'
    },
    */
    
    // 📋 TEMPLATE KOSONG (Copy ini untuk tambah bahasa baru!)    /*
    xx: {
        appName: 'Dream OS', home: '', user: '', menu: '',
        info: '', config: '', welcome: '',
        statsTitle: '', users: '', uptime: '', logout: ''
    },
    */
};

// Helper: Tambah bahasa baru secara dinamis (opsional)
function addLanguage(langCode, translationsObj) {
    translations[langCode] = translationsObj;
    console.log(`✅ Added language: ${langCode}`);
}

// Helper: Dapatkan terjemahan dengan fallback
function t(key, lang = null) {
    const l = lang || localStorage.getItem('dream-lang') || 'id';
    return translations[l]?.[key] || translations['id']?.[key] || key;
}

// Carousel & Menu Data (bisa juga di-i18n-kan kalau mau)
const carouselData = [
    { icon: 'calendar', title: 'Jadwal Agenda', text: '09:00 WIB - Rapat Koordinasi' },
    { icon: 'bell', title: 'Pengumuman', text: 'Maintenance server malam ini' },
    { icon: 'users', title: 'Team Update', text: 'Selamat datang member baru!' }
];

const menuItems = [
    { icon: '🌍', label: 'Command' }, { icon: '📅', label: 'Booking' }, { icon: '⚠️', label: 'K3' },
    { icon: '🔒', label: 'Security' }, { icon: '🧹', label: 'Janitor In' }, { icon: '🍃', label: 'Janitor Out' },
    { icon: '📦', label: 'Stok' }, { icon: '🔧', label: 'Maintenance' }, { icon: '🏢', label: 'Asset' }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS Scalable i18n Loaded');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    const savedLang = localStorage.getItem('dream-lang') || 'id';
    setLanguage(savedLang);
    
    initLogin(); initLogout(); initNav(); initGhostMode();
    window.doLogin = doLogin; window.doLogout = doLogout; 
    window.openMenuModal = openMenuModal; window.setLanguage = setLanguage;
    window.addLanguage = addLanguage; // Expose untuk tambah bahasa dinamis
});

// ... [fungsi initLogin, doLogin, initLogout, doLogout sama seperti sebelumnya] ...
function initLogin() {    const btn = document.getElementById('btn-login');
    if (btn) btn.addEventListener('click', doLogin);
}
function doLogin() {
    const key = document.getElementById('access-key')?.value;
    if (!key) return alert('Masukkan Access Key!');
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('dashboard').style.display = 'flex';
    const nav = document.getElementById('bottom-nav');
    if (nav) { nav.classList.remove('hidden'); nav.style.display = 'flex'; }
    renderCarousel(); renderMenuGrid();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}
function initLogout() {
    const btn = document.getElementById('btn-logout');
    if (btn) btn.addEventListener('click', doLogout);
}
function doLogout() {
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-page').classList.add('active');
    document.getElementById('login-page').style.display = 'flex';
    const nav = document.getElementById('bottom-nav');
    if (nav) { nav.classList.add('hidden'); nav.style.display = 'none'; }
    document.getElementById('access-key').value = '';
    if (carouselInterval) clearInterval(carouselInterval);
}

// Navigation dengan i18n
function initNav() {
    document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => {
                b.classList.remove('text-teal-400'); b.classList.add('text-white/60');
            });
            this.classList.add('text-teal-400'); this.classList.remove('text-white/60');
            const target = this.dataset.target;
            if (target === 'menu') openMenuModal();
            else if (target === 'config') showLanguageSelector();
            else alert(t(target.toUpperCase()) + ' - Coming soon!');
        });
    });
}

// Language Selector (dinamis dari keys di translations)
function showLanguageSelector() {
    const currentLang = localStorage.getItem('dream-lang') || 'id';
    const langNames = { id: '🇮🇩 Indonesia', en: '🇬🇧 English', ar: '🇸🇦 العربية', fr: '🇫🇷 Français', es: '🇪🇸 Español', de: '🇩🇪 Deutsch', ja: '🇯🇵 日本語', zh: '🇨🇳 中文', ru: '🇷🇺 Русский', pt: '🇵🇹 Português' };    
    const available = Object.keys(translations).map(code => 
        `${code === currentLang ? '🔘' : '⚪'} ${langNames[code] || code.toUpperCase()}`
    ).join('\n');
    
    const choice = prompt(`Pilih Bahasa / Select Language:\n${available}\n\nKetik kode bahasa (id/en/ar/dll)`, currentLang);
    if (choice && translations[choice]) setLanguage(choice);
    else if (choice) alert('Bahasa tidak tersedia / Language not available');
}

// Core i18n Function (dengan RTL & font auto)
function setLanguage(lang) {
    if (!translations[lang]) return;
    localStorage.setItem('dream-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });
    
    // Auto font untuk Arabic
    document.body.style.fontFamily = lang === 'ar' ? "'Amiri', serif" : "'Inter', sans-serif";
    console.log('🌐 Language:', lang);
}

// ... [fungsi carousel, menu grid, ghost mode sama seperti sebelumnya] ...
function renderCarousel() {
    const container = document.getElementById('carousel-slides');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!container || !dotsContainer) return;
    container.innerHTML = carouselData.map((s, i) => 
        `<div class="carousel-slide ${i===0?'active':''}"><div class="flex items-center gap-2 mb-1 text-teal-400"><i data-lucide="${s.icon}" class="w-4 h-4"></i><span class="font-bold text-xs">${s.title}</span></div><p class="text-xs text-white/60">${s.text}</p></div>`
    ).join('');
    dotsContainer.innerHTML = carouselData.map((_, i) => `<div class="dot ${i===0?'active':''}" data-slide="${i}"></div>`).join('');
    dotsContainer.querySelectorAll('.dot').forEach(dot => dot.addEventListener('click', function() { goToSlide(parseInt(this.dataset.slide)); }));
    startCarousel();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}
function startCarousel() { if (carouselInterval) clearInterval(carouselInterval); carouselInterval = setInterval(() => { currentSlide = (currentSlide + 1) % carouselData.length; showSlide(currentSlide); }, 7000); }
function showSlide(index) { document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active')); document.querySelectorAll('.dot').forEach(d => d.classList.remove('active')); if (document.querySelectorAll('.carousel-slide')[index]) document.querySelectorAll('.carousel-slide')[index].classList.add('active'); if (document.querySelectorAll('.dot')[index]) document.querySelectorAll('.dot')[index].classList.add('active'); }
function goToSlide(index) { currentSlide = index; showSlide(index); startCarousel(); }
function renderMenuGrid() {
    const container = document.getElementById('menu-grid'); if (!container) return;
    container.innerHTML = menuItems.map(m => `<div class="menu-card p-3 rounded-xl flex flex-col items-center justify-center glass cursor-pointer min-h-[90px]"><div class="text-2xl mb-1">${m.icon}</div><div class="text-[10px] font-bold text-white text-center">${m.label}</div></div>`).join('');
    container.querySelectorAll('.menu-card').forEach((el, i) => el.addEventListener('click', () => alert(menuItems[i].label + ' module - Ready!')));
}
function openMenuModal() {
    const lang = localStorage.getItem('dream-lang') || 'id';    const messages = { id: '📋 Menu Cepat:\n• Cari\n• Scan QR\n• Pengaturan\n• Aktivitas\n\nSegera hadir!', en: '📋 Quick Menu:\n• Search\n• QR Scan\n• Settings\n• Activity\n\nComing soon!', ar: '📋 القائمة السريعة:\n• بحث\n• مسح رمز الاستجابة\n• الإعدادات\n• النشاط\n\nقريباً!' };
    alert(messages[lang] || messages.id);
}
function initGhostMode() {
    const logo = document.getElementById('dream-logo');
    if (logo) logo.addEventListener('pointerdown', function() { tapCount++; if (tapCount === 1) tapTimer = setTimeout(() => { tapCount = 0; }, 2000); if (tapCount >= 7) { clearTimeout(tapTimer); tapCount = 0; const ghost = document.getElementById('ghost-dashboard'); if (ghost) { ghost.classList.add('active'); alert('👻 Ghost Mode Activated!'); } } });
}
console.log('✅ Scalable i18n Ready!');
