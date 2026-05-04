(function() {
    'use strict';
    const RAG = {
        knowledge: [
            { id: 1, q: 'jadwal shalat', a: 'Jadwal shalat tersedia di menu CONFIG → Prayer Times.', tags: ['shalat','prayer','waktu'] },
            { id: 2, q: 'kontak darurat', a: 'Security: 0812-3456-7890 / P3K: 0813-9876-5432.', tags: ['darurat','emergency','security'] },
            { id: 3, q: 'sop k3', a: 'SOP K3: 1) APD lengkap 2) Cek jalur evakuasi.', tags: ['k3','sop','safety'] },
            { id: 4, q: 'booking ruangan', a: 'Booking melalui modul sarana, disetujui sesuai aturan.', tags: ['booking','ruangan'] }
        ],
        search(query) {
            if(!query) return [];
            return this.knowledge.filter(k => k.q.includes(query.toLowerCase()) || k.tags.includes(query.toLowerCase()));
        },
        verify() { return typeof this.search === 'function'; }
    };
    if(window.DreamOS) {
        DreamOS.register('ragCore', RAG);
        console.log('✅ RAG Core Loaded');
    }
})();
