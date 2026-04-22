export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader) {
    const shell = `
    <div id="cc-active" class="p-4 bg-slate-950 min-h-screen text-white font-['Urbanist']">
        <div class="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h1 class="text-xl font-bold tracking-widest text-emerald-500">SOVEREIGN <span class="text-white">HUB</span></h1>
            <div class="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">ROOT SYNC ACTIVE</div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
            <button id="nav-k3" class="p-5 bg-slate-900 border border-slate-800 rounded-3xl active:scale-95 transition-all">
                <i class="fa-solid fa-triangle-exclamation text-3xl text-orange-500 mb-2"></i>
                <p class="text-xs font-bold uppercase">K3 Report</p>
            </button>
            <button id="nav-maint" class="p-5 bg-slate-900 border border-slate-800 rounded-3xl active:scale-95 transition-all">
                <i class="fa-solid fa-tools text-3xl text-blue-500 mb-2"></i>
                <p class="text-xs font-bold uppercase">Maintenance</p>
            </button>
        </div>

        <div id="module-viewport" class="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 min-h-[350px]">
            <div id="greeting-box" class="text-center mt-12">
                <p class="text-slate-500 text-sm animate-pulse italic">Menunggu Instruksi Jenderal...</p>
            </div>
        </div>
    </div>`;

    // FUNGSI LOAD MODUL DENGAN "DETEKSI JALUR OTOMATIS"
    const runModule = async (folder) => {
        const vp = document.getElementById('module-viewport');
        vp.innerHTML = `<div class="p-20 text-center text-emerald-500"><i class="fas fa-sync fa-spin text-3xl"></i></div>`;
        
        try {
            // Taktik Jembatan Gantung: Menggunakan window.location untuk cari root
            const root = window.location.pathname.split('/').slice(0, -1).join('/') || '';
            const path = `${root}/workspaces/kabag_umum/modules/${folder}/module.js?t=${Date.now()}`;
            
            console.log("⚡ Mencoba Menyambung Kabel ke:", path);
            
            const mod = await import(path);
            vp.innerHTML = '';
            await mod.default(config, utils, supabase, currentUser, showToast, showModal, loader);
            
        } catch (err) {
            console.error("❌ KABEL PUTUS TOTAL:", err);
            showToast("Kabel Putus: " + err.message, "error");
            vp.innerHTML = `<div class="p-10 text-center text-red-500 text-xs font-mono">
                [CONNECTION ERROR]<br>${err.message}<br><br>
                Coba buka di Incognito Tab, Jenderal.
            </div>`;
        }
    };

    setTimeout(() => {
        const btnK3 = document.getElementById('nav-k3');
        const btnMaint = document.getElementById('nav-maint');

        if(btnK3) btnK3.onclick = () => runModule('k3');
        if(btnMaint) btnMaint.onclick = () => runModule('maintenance');
        
        console.log("✅ Listener Terpasang di Markas Besar!");
    }, 500);

    return shell;
}
