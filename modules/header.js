// Dream OS Header Module — Spiritual & Clean
const headerModule = {
    init() {
        const header = document.getElementById('app-header');
        if (!header) return;
        
        header.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="assets/logo-sultan.png" alt="Dream OS" class="w-9 h-9 rounded-xl shadow-lg object-cover">
                <div>
                    <h1 class="text-sm font-bold text-slate-100 leading-tight">Dream OS</h1>
                    <span class="text-[9px] text-emerald-400 font-mono">v1.0 Genesis</span>
                </div>
            </div>
            
            <!-- Bismillah & Shalawat (Desktop: visible, Mobile: hidden but accessible) -->
            <div class="hidden md:flex flex-col items-end text-right font-arabic mr-4">
                <span class="text-[10px] text-amber-500">بِسْمِ اللَّهِ</span>
                <span class="text-[8px] text-emerald-400 font-sans tracking-wide">اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ</span>
            </div>
            
            <!-- Mobile: Bismillah in tooltip style -->
            <div class="md:hidden flex flex-col items-end">
                <span class="text-[8px] text-amber-500/80 font-arabic">بِسْمِ اللَّهِ</span>
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

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    if (window.headerModule) headerModule.init();
});
