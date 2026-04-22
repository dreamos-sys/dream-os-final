/**
 * Dream OS v2.1 — K3 Module (Auto-Routing)
 */
export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader, translations, currentLang) {
    const render = `
    <div class="p-4">
        <div class="bg-slate-800 p-6 rounded-2xl border border-orange-500/30">
            <h2 class="text-2xl font-bold text-orange-500 mb-4">⚠️ K3 Reporting v2.1</h2>
            <form id="k3-form-v21" class="space-y-4">
                <input type="text" id="k3-lokasi" placeholder="Lokasi Kejadian" class="w-full p-3 bg-slate-900 rounded-xl text-white border border-slate-700">
                <select id="k3-jenis" class="w-full p-3 bg-slate-900 rounded-xl text-white border border-slate-700">
                    <option value="kerusakan">🔧 Kerusakan</option>
                    <option value="kebersihan">🧹 Kebersihan</option>
                    <option value="keamanan">🔒 Keamanan</option>
                </select>
                <textarea id="k3-desc" placeholder="Detail Laporan" class="w-full p-3 bg-slate-900 rounded-xl text-white border border-slate-700"></textarea>
                <button type="submit" class="w-full py-3 bg-orange-600 rounded-xl font-bold">KIRIM LAPORAN</button>
            </form>
        </div>
    </div>`;

    setTimeout(() => {
        document.getElementById('k3-form-v21')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                lokasi: document.getElementById('k3-lokasi').value,
                jenis: document.getElementById('k3-jenis').value,
                detail: document.getElementById('k3-desc').value,
                pelapor: currentUser?.name || 'User'
            };
            if(supabase) {
                await supabase.from('audit_logs').insert([{
                    action: 'K3_REPORT',
                    detail: `${data.jenis} di ${data.lokasi}`,
                    user: data.pelapor
                }]);
                utils.showToast('✅ Laporan v2.1 Berhasil!', 'success');
            }
        });
    }, 100);

    return render;
}
