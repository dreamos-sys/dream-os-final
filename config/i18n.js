const i18n = {
    currentLang: 'id',
    translations: {
        id: {
            'command.title': 'Command Center',
            'command.search': 'Cari data...',
            'grid.booking': 'Booking', 'grid.booking_desc': 'Pemesanan',
            'grid.k3': 'K3 Form', 'grid.k3_desc': 'Laporan',
            'grid.maintenance': 'Maintenance', 'grid.maintenance_desc': 'Perbaikan',
            'grid.sekuriti': 'Sekuriti', 'grid.sekuriti_desc': 'Keamanan',
            'grid.stok': 'Stok Alat', 'grid.stok_desc': 'Inventaris',
            'grid.inventaris': 'Inventaris', 'grid.inventaris_desc': 'Aset',
            'grid.laporan': 'Laporan', 'grid.laporan_desc': 'Harian'
        }
    },
    t(key) { return this.translations[this.currentLang]?.[key] || key; }
};
