const navModule = {
    items: [
        { id: 'home', icon: 'home', label: 'nav.home' },
        { id: 'user', icon: 'user', label: 'nav.user' },
        { id: 'qr', icon: 'scan-line', label: 'nav.menu' },
        { id: 'info', icon: 'info', label: 'nav.info' },
        { id: 'config', icon: 'settings', label: 'nav.config' }
    ],
    
    init() {
        const nav = document.getElementById('bottom-nav');
        nav.innerHTML = this.items.map(item => `
            <button class="nav-btn active flex flex-col items-center justify-center gap-1 w-full h-full text-amber-400" data-target="${item.id}">
                <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                <span class="text-[9px] font-medium tracking-wide" data-i18n="${item.label}">${i18n.t(item.label)}</span>
            </button>
        `).join('');
        nav.classList.remove('hidden');
        setTimeout(() => lucide.createIcons(), 50);
    }
};
