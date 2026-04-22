/**
 * Dream OS v2.1 — Command Center (FINAL STABLE LINKS)
 * Status: Bi idznillah, FIXED PATHING!
 */

export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader) {
    
    const shell = `
    <div id="cc-active" class="p-4 bg-slate-950 min-h-screen font-['Urbanist'] text-white">
        <div class="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h1 class="text-xl font-bold tracking-widest text-emerald-500">SOVEREIGN HUB <span class="text-white">v2.1</span></h1>
            <div class="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">AGENT ACTIVE</div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <button id="nav-k3" class="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-orange-500 transition-all text-center">
                <i class="fa-solid fa-triangle-exclamation text-3xl text-orange-500"></i>
                <p class="text-[10px] font-bold mt-3 opacity-60">K3 REPORT</p>
            </button>
            <button id="nav-maint" class="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500 transition-all text-center">
                <i class="fa-solid fa-tools text-3xl text-blue-500"></i>
                <p class="text-[10px] font-bold mt-3 opacity-60">MAINTENANCE</p>
            </button>
            <button id="nav-booking" class="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-emerald-500 transition-all text-center">
                <i class="fa-solid fa-calendar-check text-3xl text-emerald-500"></i>
                <p class="text-[10px] font-bold mt-3 opacity-60">BOOKING</p>
            </button>
            <button id="nav-stock" class="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-yellow-500 transition-all text-center">
                <i class="fa-solid fa-boxes-stacked text-3xl text-yellow-500"></i>
                <p class="text-[10px] font-bold mt-3 opacity-60">STOCK</p>
            </button>
        </div>

        <div id="module-viewport" class="bg-slate-900/30 rounded-3xl border border-slate-800 p-8 min-h-[400px]">
            <div id="greeting-box" class="text-center">
                <h2 class="text-3xl font-bold mb-2">Assalamualaikum</h2>
                <p class="text-slate-500 text-sm">Pilih modul di atas untuk eksekusi lapangan, Jenderal.</p>
            </div>
        </div>
    </div>`;

    setTimeout(() => {
        const viewport = document.getElementById('module-viewport');

        const runModule = async (path, name) => {
            viewport.innerHTML = `<div class="text-center p-10"><i class="fas fa-spinner fa-spin text-3xl text-emerald-500 mb-4"></i><p>Loading ${name} Module...</p></div>`;
            
            try {
                // SUNTIKAN PATH ABSOLUT (Relatif dari root domain)
                const modulePath = `./workspaces/kabag_umum/modules/${path}/module.js?v=${Date.now()}`;
                const mod = await import(modulePath);
                viewport.innerHTML = '';
                await mod.default(config, utils, supabase, currentUser, showToast, showModal, loader);
            } catch (err) {
                console.error("Gagal load modul:", err);
                viewport.innerHTML = `<div class="text-center text-red-500"><p>Gagal memanggil modul ${name}. Cek Console!</p></div>`;
            }
        };

        // PASANG KLIK (Sesuaikan path folder Sultan)
        document.getElementById('nav-k3').onclick = () => runModule('k3', 'K3');
        document.getElementById('nav-maint').onclick = () => runModule('maintenance', 'Maintenance');
        
        document.getElementById('nav-booking').onclick = () => showToast('Booking Modul is Coming Soon', 'info');
        document.getElementById('nav-stock').onclick = () => showToast('Stock Modul is Coming Soon', 'info');

    }, 100);

    return shell;
}
