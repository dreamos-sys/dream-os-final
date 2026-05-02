// Dream OS i18n — 10 Languages
// Edit disini aja, nggak perlu ubah index.html!

const i18n = {
    currentLang: 'id',
    
    translations: {
        id: {
            // Header
            'header.greeting': 'Selamat Pagi, Saudara.',
            'header.ready': 'Siap Melayani.',
            'command.title': 'Command Center',
            'command.search': 'Cari data...',
            
            // Navigation
            'nav.home': 'HOME',
            'nav.user': 'USER',
            'nav.menu': 'MENU',
            'nav.info': 'INFO',
            'nav.config': 'CONFIG',
            
            // Grid Menu
            'grid.booking': 'Booking',
            'grid.booking_desc': 'Pemesanan',
            'grid.k3': 'K3 Form',
            'grid.k3_desc': 'Laporan',
            'grid.maintenance': 'Maintenance',
            'grid.maintenance_desc': 'Perbaikan',
            'grid.sekuriti': 'Sekuriti',
            'grid.sekuriti_desc': 'Keamanan',
            'grid.janitor_in': 'Janitor In',
            'grid.janitor_in_desc': 'Indoor',
            'grid.janitor_out': 'Janitor Out',
            'grid.janitor_out_desc': 'Outdoor',
            'grid.stok': 'Stok Alat',
            'grid.stok_desc': 'Inventaris',
            'grid.laporan': 'Laporan',
            'grid.laporan_desc': 'Harian',
            'grid.inventaris': 'Inventaris',
            'grid.inventaris_desc': 'Aset',
            
            // Carousel
            'carousel.welcome_title': 'Selamat Datang',
            'carousel.welcome_text': 'Selamat datang Bapak/Ibu. Silahkan dipilih formnya sesuai kebutuhan. Terima kasih.',
            'carousel.booking_title': 'Jadwal Booking',
            'carousel.k3_title': 'Progress K3',
            'carousel.weather_title': 'Cuaca & AI Warning',            'carousel.management_title': 'Info Management',
            'carousel.team_title': 'Info Team Umum',
            'carousel.social_title': 'Ucapan & Info'
        },
        
        en: {
            'header.greeting': 'Good Morning, Brother/Sister.',
            'header.ready': 'Ready to Serve.',
            'command.title': 'Command Center',
            'command.search': 'Search data...',
            'nav.home': 'HOME',
            'nav.user': 'USER',
            'nav.menu': 'MENU',
            'nav.info': 'INFO',
            'nav.config': 'CONFIG',
            'grid.booking': 'Booking',
            'grid.booking_desc': 'Reservation',
            'grid.k3': 'K3 Form',
            'grid.k3_desc': 'Report',
            'grid.maintenance': 'Maintenance',
            'grid.maintenance_desc': 'Repair',
            'grid.sekuriti': 'Security',
            'grid.sekuriti_desc': 'Safety',
            'grid.janitor_in': 'Janitor In',
            'grid.janitor_in_desc': 'Indoor',
            'grid.janitor_out': 'Janitor Out',
            'grid.janitor_out_desc': 'Outdoor',
            'grid.stok': 'Stock',
            'grid.stok_desc': 'Inventory',
            'grid.laporan': 'Report',
            'grid.laporan_desc': 'Daily',
            'grid.inventaris': 'Assets',
            'grid.inventaris_desc': 'Inventory',
            'carousel.welcome_title': 'Welcome',
            'carousel.welcome_text': 'Welcome Sir/Ma\'am. Please select the form as needed. Thank you.',
            'carousel.booking_title': 'Booking Schedule',
            'carousel.k3_title': 'K3 Progress',
            'carousel.weather_title': 'Weather & AI Warning',
            'carousel.management_title': 'Management Info',
            'carousel.team_title': 'General Team Info',
            'carousel.social_title': 'Greetings & Info'
        },
        
        ar: {
            'header.greeting': 'صباح الخير، أخي/أختي.',
            'header.ready': 'جاهز للخدمة.',
            'command.title': 'مركز القيادة',
            'command.search': 'بحث...',
            'nav.home': 'الرئيسية',
            'nav.user': 'المستخدم',            'nav.menu': 'القائمة',
            'nav.info': 'معلومات',
            'nav.config': 'الإعدادات',
            'grid.booking': 'الحجز',
            'grid.booking_desc': 'ال_reservation',
            'grid.k3': 'نموذج K3',
            'grid.k3_desc': 'تقرير',
            'carousel.welcome_title': 'مرحبا',
            'carousel.welcome_text': 'مرحبا سيدي/سيدتي. يرجى اختيار النموذج حسب الحاجة. شكرا لك.'
        },
        
        zh: {
            'header.greeting': '早上好，兄弟姐妹。',
            'header.ready': '准备服务。',
            'command.title': '指挥中心',
            'command.search': '搜索数据...',
            'nav.home': '首页',
            'nav.user': '用户',
            'nav.menu': '菜单',
            'nav.info': '信息',
            'nav.config': '配置',
            'carousel.welcome_title': '欢迎',
            'carousel.welcome_text': '欢迎先生/女士。请根据需要选择表格。谢谢。'
        },
        
        // Tambah bahasa lain disini (ur, hi, bn, ms, tl, dll)
        ur: { /* Urdu */ },
        hi: { /* Hindi */ },
        bn: { /* Bengali */ },
        ms: { /* Malay */ },
        tl: { /* Tagalog */ }
    },
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    },
    
    switchLang(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.applyTranslations();
        }
    },
    
    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
    }
};

// Auto-apply on load
document.addEventListener('DOMContentLoaded', () => i18n.applyTranslations());
