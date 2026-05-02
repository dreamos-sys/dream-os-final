const gridModule = {
    data: [
        { icon: 'shield-check', name: 'Command', desc: 'Ops' },
        { icon: 'calendar', name: 'Booking', desc: 'Res' },
        { icon: 'alert-triangle', name: 'K3 Form', desc: 'Audit' },
        { icon: 'shield', name: 'Sekuriti', desc: 'Safety' },
        { icon: 'package', name: 'Stok', desc: 'Aset' },
        { icon: 'wrench', name: 'Maint', desc: 'Fix' }
    ],
    init() {
        const c = document.getElementById('staff-grid');
        c.innerHTML = this.data.map(item => `
            <div class="glass-nano border border-slate-900 p-3 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-teal-500/30 magnet" onclick="alert('Modul ${item.name} Ready')">
                <i data-lucide="${item.icon}" class="w-5 h-5 text-teal-400"></i>
                <span class="text-[9px] font-bold text-slate-300">${item.name}</span>
                <span class="text-[8px] text-slate-600 font-mono">${item.desc}</span>
            </div>
        `).join('');
        c.classList.remove('hidden');
        lucide.createIcons();
    }
};
