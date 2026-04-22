export default async function initModule(config, utils, supabase, currentUser, showToast) {
    const render = `
    <div class="animate-fadeIn">
        <h3 class="text-blue-500 font-bold mb-4 flex items-center gap-2">
            <i class="fa-solid fa-tools"></i> MAINTENANCE CHECKLIST (ISO)
        </h3>
        <div class="space-y-3">
            <div class="p-3 bg-slate-950 rounded-lg border-l-4 border-blue-500">
                <p class="text-[10px] text-slate-500 uppercase mb-2">Pengecekan Rutin</p>
                <div class="grid gap-2">
                    <label class="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox"> AC & Drainase</label>
                    <label class="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox"> Sound System Saung</label>
                    <label class="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox"> Lampu Area</label>
                </div>
            </div>
            <textarea id="maint-note" placeholder="Catatan perbaikan..." class="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white text-sm h-20"></textarea>
            <button id="maint-submit" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition">UPDATE STATUS</button>
        </div>
    </div>`;

    const viewport = document.getElementById('module-viewport');
    if(viewport) viewport.innerHTML = render;

    setTimeout(() => {
        document.getElementById('maint-submit')?.addEventListener('click', async () => {
            const note = document.getElementById('maint-note').value;
            if(supabase) {
                await supabase.from('audit_logs').insert([{
                    action: 'MAINTENANCE_UPDATE',
                    detail: note || 'Pengecekan rutin selesai',
                    user: currentUser?.name || 'Maintenance'
                }]);
                showToast('✅ Maintenance Updated!', 'success');
                document.getElementById('maint-note').value = '';
            }
        });
    }, 100);
}
