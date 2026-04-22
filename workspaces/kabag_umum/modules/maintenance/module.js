/**
 * Dream OS v2.1 — Maintenance Master Form (ISO 41001 Standard)
 * Fokus: AC, Sound System, & Kelistrikan Saung
 */

export default async function initModule(config, utils, supabase, currentUser, showToast) {
    const shell = `
    <div class="p-4 bg-slate-900 rounded-2xl border border-blue-500/30">
        <h2 class="text-xl font-bold text-blue-400 mb-4 tracking-tighter">🛠️ MAINTENANCE CHECKLIST (ISO)</h2>
        
        <form id="maint-form" class="space-y-4">
            <div class="p-3 bg-slate-800/50 rounded-lg border-l-4 border-emerald-500">
                <p class="text-[10px] text-emerald-500 font-bold uppercase mb-2">Harian (Daily)</p>
                <label class="flex items-center gap-3 text-sm text-slate-300">
                    <input type="checkbox" id="check-ac" class="rounded border-slate-700"> Drainase AC & Freon (Suhu 18-22°C)
                </label>
            </div>

            <div class="p-3 bg-slate-800/50 rounded-lg border-l-4 border-blue-500">
                <p class="text-[10px] text-blue-500 font-bold uppercase mb-2">Mingguan (Weekly)</p>
                <div class="space-y-2">
                    <label class="flex items-center gap-3 text-sm text-slate-300">
                        <input type="checkbox" id="check-mic" class="rounded border-slate-700"> Mic Wireless & Receiver (Signal OK)
                    </label>
                    <label class="flex items-center gap-3 text-sm text-slate-300">
                        <input type="checkbox" id="check-audio" class="rounded border-slate-700"> Tweeter & Subwoofer Saung Besar
                    </label>
                </div>
            </div>

            <div class="pt-4 border-t border-slate-800">
                <select id="maint-status" class="w-full p-2 bg-slate-950 rounded border border-slate-700 text-xs text-white mb-2">
                    <option value="NORMAL">✅ NORMAL / SELESAI</option>
                    <option value="REPAIR">🔧 PERLU PERBAIKAN</option>
                    <option value="REPLACE">📦 BUTUH GANTI PART</option>
                </select>
                <textarea id="maint-note" placeholder="Catatan kerusakan (misal: Tweeter jebol/AC bocor)" class="w-full p-2 bg-slate-950 rounded border border-slate-700 text-xs text-white h-20"></textarea>
                
                <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-3 transition">
                    UPDATE STATUS ISO
                </button>
            </div>
        </form>
    </div>`;

    setTimeout(() => {
        document.getElementById('maint-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const status = document.getElementById('maint-status').value;
            const note = document.getElementById('maint-note').value;

            if(supabase) {
                // 1. Catat ke Audit Log agar Slide CC Update
                await supabase.from('audit_logs').insert([{
                    action: 'MAINTENANCE_REPORT',
                    detail: `Status: ${status} | Note: ${note}`,
                    user: currentUser?.name || 'Kabag'
                }]);
                
                // 2. Jika butuh ganti part, lempar ke modul stok
                if(status === 'REPLACE') {
                    await supabase.from('audit_logs').insert([{
                        action: 'STOCK_REQUIRED',
                        detail: `Kebutuhan part: ${note}`
                    }]);
                }

                utils.showToast(`Sovereign Report: ${status} Recorded!`, 'success');
            }
        });
    }, 100);

    return shell;
}
