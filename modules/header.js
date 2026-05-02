const headerModule = {
    init() {
        const header = document.getElementById('app-header');
        header.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="assets/logo-sultan.png" alt="Dream OS" class="w-9 h-9 rounded-xl shadow-lg object-cover">
                <div>
                    <h1 class="text-sm font-bold text-slate-100 leading-tight">Dream OS</h1>
                    <span class="text-[9px] text-emerald-400 font-mono">v1.0 Genesis</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span id="role-badge" class="px-2.5 py-0.5 bg-slate-900/80 border border-slate-800 text-[9px] font-bold rounded uppercase tracking-wider text-emerald-400">STAFF</span>
                <button id="btn-logout-header" class="p-2 text-slate-500 hover:text-red-400 magnet">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        header.classList.remove('hidden');
        setTimeout(() => lucide.createIcons(), 50);
    }
};
