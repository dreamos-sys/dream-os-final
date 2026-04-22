export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader) {
    const shell = `
    <div id="cc-active" class="p-4 bg-slate-950 min-h-screen text-white font-['Urbanist']">
        <div class="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h1 class="text-xl font-bold tracking-widest text-emerald-500 text-shadow-glow">SOVEREIGN <span class="text-white">HUB</span></h1>
            <div class="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded animate-pulse">SYSTEM ACTIVE</div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8" id="button-area">
            <button data-mod="k3" class="nav-btn p-5 bg-slate-900 border border-slate-800 rounded-3xl active:scale-90 transition-all">
                <i class="fa-solid fa-triangle-exclamation text-3xl text-orange-500 mb-2"></i>
                <p class="text-xs font-black">K3 REPORT</p>
            </button>
            <button data-mod="maintenance" class="nav-btn p-5 bg-slate-900 border border-slate-800 rounded-3xl active:scale-90 transition-all">
                <i class="fa-solid fa-tools text-3xl text-blue-500 mb-2"></i>
                <p class="text-xs font-black">MAINTENANCE</p>
            </button>
        </div>

        <div id="module-viewport" class="bg-slate-900/40 rounded-[2rem] border border-slate-800 p-6 min-h-[350px] shadow-2xl">
            <div id="greeting-box" class="text-center mt-12 opacity-50">
                <i class="fa-solid fa-fingerprint text-4xl mb-4"></i>
                <p class="text-sm">Awaiting Command, Jenderal...</p>
            </div>
        </div>
    </div>`;

    // FUNGSI EKSEKUSI SAKTI
    const runModule = async (folder) => {
        const vp = document.getElementById('module-viewport');
        vp.innerHTML = `<div class="p-20 text-center animate-bounce"><i class="fas fa-microchip text-emerald-500 text-3xl"></i></div>`;
        
        try {
            const path = `./workspaces/kabag_umum/modules/${folder}/module.js?v=${Date.now()}`;
            console.log("Memanggil Jalur Kedaulatan:", path);
            const mod = await import(path);
            vp.innerHTML = '';
            await mod.default(config, utils, supabase, currentUser, showToast, showModal, loader);
        } catch (e) {
            console.error("KABEL PUTUS:", e);
            showToast("Modul " + folder + " Gagal Load!", "error");
            vp.innerHTML = `<div class="p-10 text-center text-red-500 text-xs font-mono">[ERROR] ${e.message}</div>`;
        }
    };

    // TECHNIQUE: EVENT DELEGATION (ANTI-BUDEK!)
    setTimeout(() => {
        const area = document.getElementById('button-area');
        if(area) {
            area.addEventListener('click', (e) => {
                const btn = e.target.closest('.nav-btn');
                if (btn) {
                    const modName = btn.getAttribute('data-mod');
                    console.log("TOMBOL TERDETEKSI:", modName);
                    runModule(modName);
                }
            });
            console.log("LISTENER SUDAH SIAP TEMPUR!");
        }
    }, 300);

    return shell;
}
