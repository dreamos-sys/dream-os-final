const headerModule = {
    init() {
        const h = document.getElementById('app-header');
        h.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="assets/logo-sultan.png" class="w-9 h-9 rounded-xl shadow-lg object-cover">
                <div>
                    <h1 class="text-xs font-bold text-white">Dream OS</h1>
                    <span class="text-[9px] text-teal-400 font-mono">Nano-Quantum</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span id="role-badge" class="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[8px] font-bold uppercase tracking-wider text-teal-400">STAFF</span>
                <button id="btn-logout" class="p-2 text-slate-500 hover:text-red-400"><i data-lucide="log-out" class="w-4 h-4"></i></button>
            </div>`;
        h.classList.remove('hidden');
        lucide.createIcons();
        document.getElementById('btn-logout').onclick = () => authModule.logout();
    }
};
