/**
 * Dream OS v1.0 - Scalable i18n & Modular Environment Engine
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

    register(name, mod) {
        this.modules[name] = mod;
        console.log('✅ Module registered: ' + name);
    },

    run(mod, fn, ...args) {
        try {
            if (this.modules[mod] && typeof this.modules[mod][fn] === 'function') {
                return this.modules[mod][fn](...args);
            }
        } catch (e) {
            console.error('Error running ' + mod + '.' + fn + ':', e);
        }
    },

    t(key, lang) {
        const l = lang || localStorage.getItem('dream-lang') || 'id';
        return this.translations[l]?.[key] || this.translations['id']?.[key] || key;
    },

    showMain() {
        document.getElementById('main-content-wrapper').style.display = 'block';
        document.getElementById('command-center').style.display = 'none';
        document.getElementById('cmd-dashboard').style.display = 'none';
        const bookingModule = document.getElementById('booking-module');
        if (bookingModule) bookingModule.remove();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS Engine Loaded');
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const savedLang = localStorage.getItem('dream-lang') || 'id';
    DreamOS.run('i18n', 'setLanguage', savedLang);
    DreamOS.run('auth', 'init');
    DreamOS.run('ghost', 'init');
    DreamOS.run('home', 'init');

    document.getElementById('btn-logout')?.addEventListener('click', () => DreamOS.run('auth', 'logout'));
});
