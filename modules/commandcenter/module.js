/**
 * Dream OS v2.1 — Command Center (FINAL CALIBRATION)
 * Status: Bi idznillah, CLICKABLE & SYNCED!
 */

export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader) {
    
    const shell = `
    <div id="cc-active" class="p-4 bg-slate-950 min-h-screen font-['Urbanist'] text-white">
        <div class="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h1 class="text-xl font-bold tracking-widest text-emerald-500">SOVEREIGN HUB <span class="text-white">v2.1</span></h1>
            <div class="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">AGENT READY</div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button id="nav-k3" class="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-orange-500 transition-all text-center">
                <i class="fa-solid fa-triangle-exclamation text-2xl text-orange-500"></i>
                <p class="text-[10px] font-bold mt-2">K3 REPORT</p>
            </button>
            <button id="nav-maint" class="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all text-center">
                <i class="fa-solid fa-tools text-2xl text-blue-500"></i>
                <p class="text-[10px] font-bold mt-2">MAINTENANCE</p>
            </button>
            <button id="nav-booking" class="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500 transition-all text-center">
                <i class="fa-solid fa-calendar-check text-2xl text-emerald-500"></i>
                <p class="text-[10px] font-bold mt-2">BOOKING</p>
            </button>
            <button id="nav-stock" class="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-yellow-500 transition-all text-center">
                <i class="fa-solid fa-boxes-stacked text-2xl text-yellow-500"></i>
                <p class="text-[10px] font-bold mt-2">STOCK</p>
            </button>
        </div>

        <div id="module-viewport" class="bg-slate-900/30 rounded-3xl border border-slate-800 p-6 min-h-[400px]">
            <div id="greeting-box" class="text-center mt-10">
                <h2 class="text-2xl font-bold mb-2">Assalamualaikum</h2>
                <p class="text-slate-500 text-sm">Pilih modul untuk eksekusi, Jenderal.</p>
            </div>
        </div>
    </div>`;

    setTimeout(() => {
        const viewport = document.getElementById('module-viewport');

        const runModule = async (folderName, label) => {
            viewport.innerHTML = `<div class="text-center p-10"><i class="fas fa-spinner fa-spin text-3xl text-emerald-500 mb-4"></i><p>Loading ${label}...</p></div>`;
            
            try {
                // JALUR SAKTI: Disesuaikan dengan penemuan Sultan di GitHub
                // Pakai ./workspaces/... karena kita panggil dari root app
                const path = `./workspaces/kabag_umum/modules/${folderName}/module.js?v=${Date.now()}`;
                const mod = await import(path);
                
                viewport.innerHTML = ''; // Bersihkan loading
                await mod.default(config, utils, supabase, currentUser, showToast, showModal, loader);
            } catch (err) {
                console.error("Gagal load:", err);
                viewport.innerHTML = `<div class="text-center text-red-500 p-10"><p>Gagal memanggil modul ${label}.</p><p class="text-[10px] mt-2 opacity-50">${err.message}</p></div>`;
            }
        };

        // PASANG KLIK
        document.getElementById('nav-k3').onclick = () => runModule('k3', 'K3 Report');
        document.getElementById('nav-maint').onclick = () => runModule('maintenance', 'Maintenance');
        
        document.getElementById('nav-booking').onclick = () => showToast('Booking Modul is Coming Soon', 'info');
        document.getElementById('nav-stock').onclick = () => showToast('Stock Modul is Coming Soon', 'info');

    }, 100);

    return shell;
}
