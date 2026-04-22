export default async function initModule(config, utils, supabase, currentUser, showToast) {
    const render = `
    <div class="animate-fadeIn">
        <h3 class="text-orange-500 font-bold mb-4 flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation"></i> FORM LAPORAN K3
        </h3>
        <div class="grid gap-4">
            <input type="text" id="k3-lokasi" placeholder="Lokasi (Contoh: Saung Besar)" class="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm">
            <select id="k3-jenis" class="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm">
                <option value="kerusakan">🔧 Kerusakan Fasilitas</option>
                <option value="kehilangan">📦 Kehilangan Barang</option>
                <option value="kebersihan">🧹 Masalah Kebersihan</option>
            </select>
            <textarea id="k3-desc" placeholder="Detail kejadian/kerusakan..." class="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm h-24"></textarea>
            <button id="k3-submit" class="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition">KIRIM LAPORAN</button>
        </div>
    </div>`;

    const viewport = document.getElementById('module-viewport');
    if(viewport) viewport.innerHTML = render;

    setTimeout(() => {
        document.getElementById('k3-submit')?.addEventListener('click', async () => {
            const data = {
                lokasi: document.getElementById('k3-lokasi').value,
                jenis: document.getElementById('k3-jenis').value,
                detail: document.getElementById('k3-desc').value,
                pelapor: currentUser?.name || 'User'
            };
            if(!data.lokasi || !data.detail) return showToast('Isi semua field!', 'warning');
            
            if(supabase) {
                await supabase.from('audit_logs').insert([{
                    action: 'K3_REPORT',
                    detail: `${data.jenis.toUpperCase()} di ${data.lokasi}: ${data.detail}`,
                    user: data.pelapor
                }]);
                showToast('✅ Laporan K3 Terkirim!', 'success');
                document.getElementById('k3-lokasi').value = '';
                document.getElementById('k3-desc').value = '';
            }
        });
    }, 100);
}
