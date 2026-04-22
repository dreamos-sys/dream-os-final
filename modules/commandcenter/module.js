export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader) {
    const shell = `
    <div id="cc-active" class="p-4 bg-slate-950 min-h-screen text-white font-['Urbanist']">
        <div class="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h1 class="text-xl font-bold tracking-widest text-emerald-500">SOVEREIGN <span class="text-white">LIVE</span></h1>
            <div class="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">GITHUB DEPLOYED</div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <button id="nav-k3" class="p-4 bg-slate-900 border border-slate-800 rounded-2xl active:scale-95 transition-all text-center">
                <i class="fa-solid fa-triangle-exclamation text-2xl text-orange-500"></i>
                <p class="text-[10px] font-bold mt-2">K3 REPORT</p>
            </button>
            <button id="nav-maint" class="p-4 bg-slate-900 border border-slate-800 rounded-2xl active:scale-95 transition-all text-center">
                <i class="fa-solid fa-tools text-2xl text-blue-500"></i>
                <p class="text-[10px] font-bold mt-2">MAINTENANCE</p>
            </button>
        </div>

        <div id="module-viewport" class="bg-slate-900/30 rounded-3xl border border-slate-800 p-6 min-h-[300px]">
            <div id="greeting-box" class="text-center mt-10">
                <h2 class="text-xl font-bold mb-2">Sovereign Ready</h2>
                <p class="text-slate-500 text-xs">Klik modul untuk memanggil data, Jenderal.</p>
            </div>
        </div>
    </div>`;

    setTimeout(() => {
        const viewport = document.getElementById('module-viewport');
        const runModule = async (folder, label) => {
            viewport.innerHTML = `<div class="p-10 text-center"><i class="fas fa-spinner fa-spin text-emerald-500"></i></div>`;
            try {
                // Jalur Dinamis: Menyesuaikan dengan GitHub Pages
                const path = `./workspaces/kabag_umum/modules/${folder}/module.js?t=${new Date().getTime()}`;
                const mod = await import(path);
                viewport.innerHTML = '';
                await mod.default(config, utils, supabase, currentUser, showToast, showModal, loader);
            } catch (e) {
                showToast("Gagal memanggil modul!", "error");
                viewport.innerHTML = `<div class="p-10 text-center text-red-500 text-xs">Error: ${e.message}</div>`;
            }
        };

        document.getElementById('nav-k3').onclick = () => runModule('k3', 'K3');
        document.getElementById('nav-maint').onclick = () => runModule('maintenance', 'Maintenance');
    }, 100);

    return shell;
}
