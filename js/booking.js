DreamOS.register('booking', {
    config: {
        sarana: ["Aula SMP", "Aula SMA", "Serbaguna", "Mushalla SMA", "Saung Besar", "Lapangan Basket"],
        peralatan: ["Kursi Futura", "Projektor", "Sound Portable", "Mic Wireless"],
        holidays: ['2026-05-01','2026-05-21']
    },
    validate(data) {
        const errors = [];
        const dateObj = new Date(data.tanggal + 'T00:00:00');
        if (dateObj.getDay() === 0) errors.push('❌ Hari Minggu Libur');
        return { errors };
    },
    create(data) {
        const b = JSON.parse(localStorage.getItem('dreamos_bookings') || '[]');
        b.push({...data, id: Date.now(), status: 'approved', created_at: new Date().toISOString()});
        localStorage.setItem('dreamos_bookings', JSON.stringify(b));
    },
    getAll: () => JSON.parse(localStorage.getItem('dreamos_bookings') || '[]'),

    init() {
        const wrapper = document.getElementById('main-content-wrapper');
        const cc = document.getElementById('command-center');
        if (wrapper) wrapper.style.display = 'none';
        if (cc) cc.style.display = 'none';

        let bm = document.getElementById('booking-module');
        if (!bm) {
            bm = document.createElement('div');
            bm.id = 'booking-module';
            document.getElementById('dashboard').appendChild(bm);
        }
        
        bm.innerHTML = this.renderForm();
        this.bindEvents();
    },

    renderForm() {
        return `
            <div class="max-w-4xl mx-auto p-4 text-white">
                <div class="flex items-center gap-4 mb-6">
                    <button onclick="DreamOS.showMain(); document.getElementById('booking-module').remove();" class="px-4 py-2 bg-slate-800 rounded-xl border border-slate-600">← Kembali</button>
                    <h2 class="text-2xl font-bold">📅 Booking Sarana</h2>
                </div>
                <form id="bookingForm" class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-4">
                    <input name="nama_peminjam" required placeholder="Nama Lengkap" class="w-full p-3 bg-slate-900 border border-slate-600 rounded">
                    <select name="sarana" class="w-full p-3 bg-slate-900 border border-slate-600 rounded">
                        ${this.config.sarana.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                    <input type="date" name="tanggal" required class="w-full p-3 bg-slate-900 border border-slate-600 rounded">
                    <div class="grid grid-cols-2 gap-4">
                        <input type="time" name="jam_mulai" required value="08:00" class="p-3 bg-slate-900 border border-slate-600 rounded">
                        <input type="time" name="jam_selesai" required value="10:00" class="p-3 bg-slate-900 border border-slate-600 rounded">
                    </div>
                    <textarea name="keperluan" class="w-full p-3 bg-slate-900 border border-slate-600 rounded" placeholder="Keperluan..."></textarea>
                    <button type="submit" class="w-full p-4 bg-emerald-600 rounded font-bold">✅ SIMPAN BOOKING</button>
                </form>
                <div id="booking-list" class="mt-4 space-y-2"></div>
            </div>
        `;
    },

    bindEvents() {
        const form = document.getElementById('bookingForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const v = this.validate({ tanggal: data.tanggal, sarana: data.sarana });
            if(v.errors.length > 0) {
                alert(v.errors.join('\n'));
                return;
            }

            this.create(data);
            alert('✅ Booking berhasil disimpan!');
            form.reset();
            this.renderList();
        });
        this.renderList();
    },

    renderList() {
        const l = document.getElementById('booking-list');
        if(!l) return;
        const items = this.getAll();
        if(!items.length) { l.innerHTML = '<p class="text-slate-500 text-center">Belum ada data</p>'; return; }
        l.innerHTML = items.map(x => `
            <div class="p-3 bg-slate-800 border border-slate-700 rounded flex justify-between">
                <div>
                    <div class="font-bold text-teal-400">${x.sarana}</div>
                    <div class="text-xs text-slate-400">${x.tanggal} | ${x.jam_mulai} - ${x.jam_selesai} · ${x.nama_peminjam}</div>
                </div>
                <span class="text-xs text-emerald-400">Approved</span>
            </div>
        `).join('');
    }
});
