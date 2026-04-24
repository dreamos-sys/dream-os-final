export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader) {
    const shell = `
    <div id="cc-active" class="p-4 bg-slate-950 min-h-screen text-white font-['Urbanist']">
        <div class="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h1 class="text-xl font-bold tracking-widest text-emerald-500">SOVEREIGN <span class="text-white">HUB</span></h1>
            <div class="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">V3.6 - PATH SECURE</div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
            <button id="nav-k3" class="p-5 bg-slate-900 border border-slate-800 rounded-3xl active:scale-95 transition-all shadow-lg">
                <i class="fa-solid fa-triangle-exclamation text-3xl text-orange-500 mb-2"></i>
                <p class="text-xs font-black uppercase">K3 Report</p>
            </button>
            <button id="nav-maint" class="p-5 bg-slate-900 border border-slate-800 rounded-3xl active:scale-95 transition-all shadow-lg">
                <i class="fa-solid fa-tools text-3xl text-blue-500 mb-2"></i>
                <p class="text-xs font-black uppercase">Maintenance</p>
            </button>
        </div>

        <div id="module-viewport" class="bg-slate-900/40 rounded-[2rem] border border-slate-800 p-6 min-h-[400px]">
            <div id="greeting-box" class="text-center mt-12 opacity-40">
                <i class="fa-solid fa-microchip text-5xl mb-4"></i>
                <p class="text-sm tracking-widest italic">CONNECTED TO ROOT...</p>
            </div>
        </div>
    </div>`;

    const runModule = async (folder) => {
        const vp = document.getElementById('module-viewport');
        vp.innerHTML = `<div class="p-20 text-center"><i class="fas fa-circle-notch fa-spin text-emerald-500 text-4xl"></i></div>`;
        
        try {
            // LOGIKA JALUR BARU: Ambil Origin + Pathname tanpa file index.html
            const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, "");
            const path = `${baseUrl}/workspaces/kabag_umum/modules/${folder}/module.js?v=${Date.now()}`;
            
            console.log("🔗 MENYAMBUNG KABEL KE:", path);
            
            const mod = await import(path);
            vp.innerHTML = '';
            await mod.default(config, utils, supabase, currentUser, showToast, showModal, loader);
            
        } catch (err) {
            console.error("❌ KABEL PUTUS:", err);
            // FALLBACK: Coba jalur relatif murni kalau jalur absolut gagal
            try {
                const relPath = `./workspaces/kabag_umum/modules/${folder}/module.js?v=${Date.now()}`;
                const mod = await import(relPath);
                vp.innerHTML = '';
                await mod.default(config, utils, supabase, currentUser, showToast, showModal, loader);
            } catch (err2) {
                showToast("Sinyal Lemah: " + err.message, "error");
                vp.innerHTML = `<div class="p-10 text-center text-red-500 text-[10px] font-mono">CONNECTION FAILED<br>${err.message}</div>`;
            }
        }
    };

    setTimeout(() => {
        const k3 = document.getElementById('nav-k3');
        const maint = document.getElementById('nav-maint');
        if(k3) k3.onclick = () => runModule('k3');
        if(maint) maint.onclick = () => runModule('maintenance');
    }, 500);

    return shell;
}
