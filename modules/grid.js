const gridData = {
    staff: [
        {icon:'calendar',label:'grid.booking',desc:'grid.booking_desc'},
        {icon:'alert-triangle',label:'grid.k3',desc:'grid.k3_desc'},
        {icon:'wrench',label:'grid.maintenance',desc:'grid.maintenance_desc'},
        {icon:'shield',label:'grid.sekuriti',desc:'grid.sekuriti_desc'},
        {icon:'sparkles',label:'grid.janitor_in',desc:'grid.janitor_in_desc'},
        {icon:'leaf',label:'grid.janitor_out',desc:'grid.janitor_out_desc'},
        {icon:'package',label:'grid.stok',desc:'grid.stok_desc'},
        {icon:'clipboard-list',label:'grid.laporan',desc:'grid.laporan_desc'},
        {icon:'building-2',label:'grid.inventaris',desc:'grid.inventaris_desc'}
    ],
    
    render(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = data.map(item => `
            <div class="magnet bg-slate-900/70 border border-slate-800 p-3 rounded-2xl flex flex-col items-center justify-center gap-2 min-h-[96px] glow-border">
                <i data-lucide="${item.icon}" class="w-6 h-6 text-amber-400"></i>
                <span class="text-[10px] font-bold text-slate-300 text-center leading-tight tracking-wide" data-i18n="${item.label}">${i18n.t(item.label)}</span>
                <span class="text-[8px] text-slate-500 font-mono" data-i18n="${item.desc}">${i18n.t(item.desc)}</span>
            </div>
        `).join('');
        
        setTimeout(() => lucide.createIcons(), 50);
    }
};
