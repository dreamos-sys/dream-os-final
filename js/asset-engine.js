window.AssetEngine = {
    getAssets: function() {
        try {
            var data = localStorage.getItem('dreamos_assets');
            return (data && data !== 'undefined') ? JSON.parse(data) : [];
        } catch(e) { 
            console.error("AssetEngine Data Corrupted, Resetting...");
            localStorage.setItem('dreamos_assets', '[]'); // Reset otomatis!
            return []; 
        }
    },
    calc: function(a) {
        if (!a || !a.hargaBeli) return 0;
        var tahun = (new Date().getFullYear() - new Date(a.tglBeli).getFullYear());
        if (a.jenisAset === 'Tanah' || a.jenisAset === 'Gedung') {
            return Math.round(a.hargaBeli * Math.pow(1.03, tahun));
        }
        var nilai = a.hargaBeli - (a.hargaBeli * 0.2 * tahun);
        return nilai > 0 ? Math.round(nilai) : 0;
    },
    getSummary: function() {
        var assets = this.getAssets();
        return {
            totalVal: assets.reduce((s, a) => s + this.calc(a), 0),
            count: assets.length
        };
    }
};
