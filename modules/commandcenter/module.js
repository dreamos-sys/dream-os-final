/**
 * Dream OS v2.1 — Command Center (FIXED LINKS)
 * Status: Bi idznillah, Clickable & Integrated!
 */

export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader) {
    
    const shell = `
    <div id="cc-active" class="p-4 bg-slate-950 min-h-screen font-['Urbanist'] text-white">
        <div class="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h1 class="text-xl font-bold tracking-widest text-emerald-500">SOVEREIGN HUB <span class="text-white">v2.1</span></h1>
            <div class="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">AGENT READY</div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <button id="nav-k3" class="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-orange-500/10 hover:border-orange-500 transition-all group text-center">
                <i class="fa-solid fa-triangle-exclamation text-3xl text-orange-500 group-hover:scale-110 transition"></i>
                <p class="text-[10px] font-bold mt-3 opacity-60">K3 REPORT</p>
            </button>
            <button id="nav-maint" class="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-blue-500/10 hover:border-blue-500 transition-all group text-center">
                <i class="fa-solid fa-tools text-3xl text-blue-500 group-hover:scale-110 transition"></i>
                <p class="text-[10px] font-bold mt-3 opacity-60">MAINTENANCE</p>
            </button>
            <button id="nav-booking" class="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-emerald-500/10 hover:border-emerald-500 transition-all group text-center">
                <i class="fa-solid fa-calendar-check text-3xl text-emerald-500 group-hover:scale-110 transition"></i>
                <p class="text-[10px] font-bold mt-3 opacity-60">BOOKING</p>
            </button>
            <button id="nav-stock" class="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:bg-yellow-500/10 hover:border-yellow-500 transition-all group text-center">
                <i class="fa-solid fa-boxes-stacked text-3xl text-yellow-500 group-hover:scale-110 transition"></i>
                <p class="text-[10px] font-bold mt-3 opacity-60">STOCK</p>
            </button>
        </div>

        <div id="module-viewport" class="relative bg-slate-900/30 rounded-3xl border border-slate-800 p-8 min-h-[400px] flex items-center justify-center">
            <div id="greeting-box" class="text-center animate-pulse">
                <h2 class="text-3xl font-bold mb-2">Assalamualaikum</h2>
                <p class="text-slate-500 text-sm italic">Silakan pilih modul untuk mulai bekerja, Jenderal.</p>
            </div>
        </div>
    </div>`;

    setTimeout(() => {
        const viewport = document.getElementById('module-viewport');

        // FUNGSI LOAD MODUL DINAMIS
        const runModule = async (path, name) => {
            viewport.innerHTML = `<div class="text-center"><i class="fas fa-spinner fa-spin text-3xl text-emerald-500 mb-4"></i><p class="text-xs">Memanggil Modul ${name}...</p></div>`;
            
            try {
                // Trik memanggil file modul yang sudah kita buat tadi
                const mod = await import(`${path}?v=${Date.now()}`);
                viewport.innerHTML = ''; // Bersihkan loading
                
                // Jalankan initModule milik modul tersebut
                await mod.default(config, utils, supabase, currentUser, showToast, showModal, loader);
                showToast(`Modul ${name} Aktif!`, 'success');
            } catch (err) {
                console.error(err);
                viewport.innerHTML = `<div class="text-center text-red-500"><i class="fas fa-exclamation-triangle mb-2"></i><p class="text-xs">Gagal: ${err.message}</p></div>`;
            }
        };

        // PASANG LISTENER KLIK KE JALUR FILE ASLI
        document.getElementById('nav-k3').onclick = () => 
            runModule('../../workspaces/kabag_umum/modules/k3/module.js', 'K3');
            
        document.getElementById('nav-maint').onclick = () => 
            runModule('../../workspaces/kabag_umum/modules/maintenance/module.js', 'Maintenance');

        // Booking & Stock (Jika sudah ada filenya)
        document.getElementById('nav-booking').onclick = () => showToast('Modul Booking menyusul!', 'info');
        document.getElementById('nav-stock').onclick = () => showToast('Modul Stock menyusul!', 'info');

    }, 100);

    return shell;
}
