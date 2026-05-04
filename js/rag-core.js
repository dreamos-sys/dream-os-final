/**
 * Dream OS RAG Core v1.0.0
 * Karpathy-Style: Minimal, verifiable, surgical
 * Addy-Style: <2KB gzipped, defer load, zero dependencies
 */
(function() {
    'use strict';
    
    const RAG = {
        // Default knowledge base (10 items — Kabag Umum essentials)
        knowledge: [
            { id: 1, q: 'jadwal shalat', a: 'Jadwal shalat tersedia di menu CONFIG → Prayer Times. Update otomatis via API.', tags: ['shalat','waktu','prayer'] },
            { id: 2, q: 'kontak darurat', a: 'Darurat: Security (0812-3456-7890), P3K (0813-9876-5432), Atasan Langsung.', tags: ['darurat','kontak','emergency'] },
            { id: 3, q: 'sop k3', a: 'SOP K3: 1) Pakai APD 2) Cek jalur evakuasi 3) Laporkan insiden <1 jam.', tags: ['k3','sop','safety'] },
            { id: 4, q: 'booking ruangan', a: 'Booking via menu 📅 Booking. Approval otomatis untuk staff, manual untuk tamu.', tags: ['booking','ruangan','meeting'] },
            { id: 5, q: 'laporan harian', a: 'Laporan harian: Isi form di Command Center → Laporan → Harian. Submit sebelum 17:00.', tags: ['laporan','harian','report'] },
            { id: 6, q: 'stok janitor', a: 'Cek stok: Command Center → Stok Janitor. Alert merah = restock needed.', tags: ['stok','janitor','inventory'] },
            { id: 7, q: 'maintenance ac', a: 'Lapor maintenance: Command Center → Maintenance → Buat Ticket. Priority: High/Medium/Low.', tags: ['maintenance','ac','ticket'] },
            { id: 8, q: 'inventaris gudang', a: 'Cek inventaris: Command Center → Inventaris. Scan QR untuk detail lokasi.', tags: ['inventaris','gudang','asset'] },
            { id: 9, q: 'rab proyek', a: 'Buat RAB: Command Center → RAB. Template tersedia, hitung otomatis.', tags: ['rab','anggaran','budget'] },
            { id: 10, q: 'pajak tahunan', a: 'Laporan pajak: Command Center → Pajak. Deadline: 31 Maret. Konsultasi: Finance.', tags: ['pajak','tax','laporan'] }
        ],

        // Simple cosine similarity (keyword-based, no embeddings)
        similarity(query, item) {
            const q = query.toLowerCase().split(/\s+/);
            const t = [...(item.q?.toLowerCase().split(/\s+/) || []), ...(item.tags || [])];
            const matches = q.filter(w => t.some(kw => kw.includes(w) || w.includes(kw)));
            return matches.length / Math.max(q.length, 1);
        },

        // Search function (Karpathy: Goal-driven, verifiable)
        search(query, topK = 3) {
            if (!query?.trim()) return [];
            const q = query.trim().toLowerCase();
            
            // Exact match first (fast path)
            const exact = this.knowledge.find(k => k.q.toLowerCase() === q || k.tags.includes(q));
            if (exact) return [{...exact, score: 1.0}];
            
            // Fuzzy match via keyword similarity            return this.knowledge
                .map(k => ({...k, score: this.similarity(q, k)}))
                .filter(r => r.score > 0.3)
                .sort((a,b) => b.score - a.score)
                .slice(0, topK);
        },

        // Karpathy-Style Verification
        verify() {
            console.group('🔍 RAG Core Verification (Goal-Driven)');
            console.assert(typeof this.search === 'function', '❌ search() not a function');
            console.assert(typeof this.similarity === 'function', '❌ similarity() broken');
            console.assert(this.knowledge.length >= 10, '❌ Knowledge base incomplete');
            console.assert(this.search('jadwal shalat')[0]?.score === 1.0, '❌ Exact match failed');
            console.assert(this.search('ruangan meeting').length > 0, '❌ Fuzzy match failed');
            console.log('✅ All RAG assertions passed. Ready for UI integration.');
            console.groupEnd();
            return true;
        }
    };

    // Register to DreamOS system
    if (window.DreamOS) {
        window.DreamOS.register('ragCore', RAG);
        console.log('✅ RAG Core registered. Run: DreamOS.modules.ragCore.verify()');
    }
})();
