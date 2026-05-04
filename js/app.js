/**
 * Dream OS v1.3.1 - Solid Core Engine (Hotfix Login)
 * Karpathy-Style: Critical path direct, no module dependency for auth
 */
let carouselInterval = null, currentSlide = 0, tapCount = 0, tapTimer = null;

window.DreamOS = {
    version: '1.3.1',
    modules: {},
    role: 'STAFF',
    state: { erudaActive: false, carouselInterval: null, currentSlide: 0, tapCount: 0, tapTimer: null },
    carouselData: [
        { icon: 'calendar', title: 'Jadwal Agenda', text: '09:00 WIB - Rapat Koordinasi' },
        { icon: 'bell', title: 'Pengumuman', text: 'Maintenance server malam ini' },
        { icon: 'users', title: 'Team Update', text: 'Selamat datang member baru!' },
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
    register(name, mod) { this.modules[name] = mod; console.log('✅ Module registered: ' + name); },
    run(mod, fn, ...args) { try { if (this.modules[mod] && typeof this.modules[mod][fn] === 'function') return this.modules[mod][fn](...args); } catch (e) { console.error('Error running ' + mod + '.' + fn + ':', e); } },
    t(key, lang) { const l = lang || localStorage.getItem('dream-lang') || 'id'; return this.translations[l]?.[key] || this.translations['id']?.[key] || key; },
    showMain() { document.getElementById('main-content-wrapper').style.display = 'block'; document.getElementById('command-center').style.display = 'none'; document.getElementById('cmd-dashboard').style.display = 'none'; const bm = document.getElementById('booking-module'); if (bm) bm.remove(); }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS Engine Loaded');
    
    // Init i18n & ghost (non-critical, can wait for modules)
    const savedLang = localStorage.getItem('dream-lang') || 'id';
    DreamOS.run('i18n', 'setLanguage', savedLang);
    DreamOS.run('ghost', 'init');
    // 🔥 HOTFIX: Direct Login Handler (no module dependency)
    const loginBtn = document.getElementById('btn-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const keyInput = document.getElementById('access-key');
            if (!keyInput?.value) { alert('Masukkan Access Key!'); return; }
            
            DreamOS.role = (keyInput.value.includes('admin') || keyInput.value.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
            
            // Switch views
            document.getElementById('login-page').classList.remove('active');
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('dashboard').classList.add('active');
            document.getElementById('dashboard').style.display = 'flex';
            const nav = document.getElementById('bottom-nav');
            if (nav) nav.style.display = 'flex';
            
            // Init home modules after view switch (with small delay for DOM readiness)
            setTimeout(() => {
                DreamOS.run('home', 'init');
                if (typeof lucide !== .undefined.) lucide.createIcons();
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }, 300);
        });
    }

    // Direct Logout Handler
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            document.getElementById('dashboard').classList.remove('active');
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('login-page').classList.add('active');
            document.getElementById('login-page').style.display = 'flex';
            const nav = document.getElementById('bottom-nav');
            if (nav) nav.style.display = 'none';
            if (document.getElementById('access-key')) document.getElementById('access-key').value = '';
        });
    }

    // Password Toggle (direct, no module)
    const toggleBtn = document.getElementById('toggle-pw');
    const inputField = document.getElementById('access-key');
    if (toggleBtn && inputField) {
        toggleBtn.addEventListener('click', () => {
            const isPass = inputField.type === 'password';
            inputField.type = isPass ? 'text' : 'password';
            toggleBtn.textContent = isPass ? '🙈' : '👁️';
        });
    }});
