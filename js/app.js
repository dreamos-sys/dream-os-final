/**
 * Dream OS v1.3.1 - Complete with Command Center
 */
window.DreamOS = {
    version: '1.3.1',
    modules: {},
    role: 'STAFF',
    state: { carouselInterval: null, currentSlide: 0, tapCount: 0, tapTimer: null },
    carouselData: [
        { icon: 'hand', title: 'Selamat Datang', text: 'Selamat datang Bapak/Ibu. Silahkan dipilih formnya sesuai kebutuhan.' },
        { icon: 'calendar', title: 'Jadwal Booking', text: 'Hari Ini: Rapat Koordinasi 09:00\nBesok: Kunjungan Yayasan 13:00' },
        { icon: 'activity', title: 'Progress K3', text: 'AC Ruang Rapat: 60% (Proses)\nKebersihan Lobby: 100% (Selesai)' },
        { icon: 'cloud-rain', title: 'Cuaca & AI', text: 'Cerah Berawan - 32°C\nPrediksi hujan 15:00 WIB' },
        { icon: 'building-2', title: 'Info Management', text: 'Rapat CEO & Yayasan\nPukul 09:00 WIB di Ruang Rapat SMA' },
        { icon: 'users', title: 'Info Team Umum', text: 'Rapat Mingguan\nJam 09:00 WIB di R. Koord Bagian Umum' },
        { icon: 'gift', title: 'Ucapan', text: '🎂 Selamat Ulang Tahun Pak Budi (Komisi 3 Bulan)' }
    ],
    menuItems: [
        { icon: '🌍', label: 'Command' }, { icon: '📅', label: 'Booking' }, { icon: '⚠️', label: 'K3' },
        { icon: '🔒', label: 'Security' }, { icon: '🧹', label: 'Janitor In' }, { icon: '🍃', label: 'Janitor Out' },
        { icon: '📦', label: 'Stok' }, { icon: '🔧', label: 'Maintenance' }, { icon: '🏢', label: 'Asset' }
    ],
    register(name, mod) { this.modules[name] = mod; console.log('✅ Module:', name); },
    run(mod, fn, ...args) { try { if (this.modules[mod]?.[fn]) return this.modules[mod][fn](...args); } catch (e) { console.error(e); } }
};

// 🔐 AUTH
DreamOS.register('auth', {
    init() {
        const toggle = document.getElementById('toggle-pw'), input = document.getElementById('access-key'), btn = document.getElementById('btn-login');
        if (toggle && input) toggle.addEventListener('click', () => { input.type = input.type === 'password' ? 'text' : 'password'; toggle.textContent = input.type === 'password' ? '👁️' : '🙈'; });
        if (btn) btn.addEventListener('click', () => this.handleLogin());
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
    },
    handleLogin() {
        const key = document.getElementById('access-key')?.value;
        if (!key) return alert('Masukkan Access Key!');
        DreamOS.role = (key.includes('admin') || key.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        document.getElementById('dashboard').style.display = 'flex';
        document.getElementById('bottom-nav').style.display = 'flex';
        setTimeout(() => { DreamOS.run('home', 'init'); if (typeof lucide !== 'undefined') lucide.createIcons(); }, 300);
    },    logout() {
        document.getElementById('dashboard').classList.remove('active');
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('login-page').classList.add('active');
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('bottom-nav').style.display = 'none';
        document.getElementById('access-key').value = '';
    }
});

// 🏠 HOME
DreamOS.register('home', {
    init() { this.renderCarousel(); this.renderMenuGrid(); this.initNav(); },
    renderCarousel() {
        const c = document.getElementById('carousel-slides'), d = document.getElementById('carousel-dots');
        if (!c || !d) return;
        c.innerHTML = DreamOS.carouselData.map((s, i) => `<div class="carousel-slide ${i===0?'active':''}"><div class="flex items-center gap-2 mb-1 text-teal-400"><i data-lucide="${s.icon}" class="w-4 h-4"></i><span class="font-bold text-xs">${s.title}</span></div><p class="text-xs text-white/60 whitespace-pre-line">${s.text}</p></div>`).join('');
        d.innerHTML = DreamOS.carouselData.map((_, i) => `<div class="dot ${i===0?'active':''}" data-slide="${i}"></div>`).join('');
        d.querySelectorAll('.dot').forEach(dot => dot.addEventListener('click', function() { DreamOS.run('home', 'goToSlide', parseInt(this.dataset.slide)); }));
        this.startCarousel();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },
    startCarousel() { if (DreamOS.state.carouselInterval) clearInterval(DreamOS.state.carouselInterval); DreamOS.state.carouselInterval = setInterval(() => { DreamOS.state.currentSlide = (DreamOS.state.currentSlide + 1) % DreamOS.carouselData.length; this.showSlide(DreamOS.state.currentSlide); }, 7000); },
    showSlide(i) { document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active')); document.querySelectorAll('.dot').forEach(d => d.classList.remove('active')); if (document.querySelectorAll('.carousel-slide')[i]) document.querySelectorAll('.carousel-slide')[i].classList.add('active'); if (document.querySelectorAll('.dot')[i]) document.querySelectorAll('.dot')[i].classList.add('active'); },
    goToSlide(i) { DreamOS.state.currentSlide = i; this.showSlide(i); this.startCarousel(); },
    renderMenuGrid() {
        const c = document.getElementById('menu-grid'); if (!c) return;
        c.innerHTML = DreamOS.menuItems.map(m => `<div class="menu-card p-3 rounded-xl flex flex-col items-center justify-center glass cursor-pointer min-h-[90px]"><div class="text-2xl mb-1">${m.icon}</div><div class="text-[10px] font-bold text-white text-center">${m.label}</div></div>`).join('');
        c.querySelectorAll('.menu-card').forEach((el, i) => el.addEventListener('click', () => {
            const map = { 'Command': () => DreamOS.run('command', 'open'), 'Booking': () => DreamOS.run('booking', 'open'), 'K3': () => DreamOS.run('k3', 'open'), 'Security': () => DreamOS.run('security', 'open'), 'Janitor In': () => DreamOS.run('janitorIn', 'open'), 'Janitor Out': () => DreamOS.run('janitorOut', 'open'), 'Stok': () => DreamOS.run('stok', 'open'), 'Maintenance': () => DreamOS.run('maintenance', 'open'), 'Asset': () => DreamOS.run('asset', 'open') };
            if (map[m.label]) map[m.label]();
            else alert(m.label + ' - Coming soon!');
        }));
    },
    initNav() {
        document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => { b.classList.remove('text-teal-400'); b.classList.add('text-white/60'); });
                this.classList.add('text-teal-400'); this.classList.remove('text-white/60');
                const t = this.dataset.target;
                if (t === 'user') alert('👤 User Profile\n\nRole: ' + DreamOS.role);
                else if (t === 'info') alert('ℹ️ Dream OS v1.3.1');
                else if (t === 'config') alert('⚙️ Config - Coming soon!');
            });
        });
    }
});

// 🌍 COMMAND CENTER MODULE
DreamOS.register('command', {    open() {
        // Hide main content
        document.getElementById('stats-card').style.display = 'none';
        document.getElementById('carousel-container').style.display = 'none';
        document.getElementById('menu-grid').style.display = 'none';
        
        // Create command center container if not exists
        let container = document.getElementById('command-center');
        if (!container) {
            container = document.createElement('div');
            container.id = 'command-center';
            container.className = 'space-y-3';
            document.querySelector('#dashboard main').appendChild(container);
        }
        
        // Render Command Center UI
        container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">🌍 Command Center - Kabag Umum</h2>
                <button onclick="DreamOS.run('home', 'showMain')" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            
            <!-- Quick Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="glass p-3 rounded-xl">
                    <div class="text-xs text-white/60 mb-1">Pending Approval</div>
                    <div class="text-2xl font-bold text-amber-400">3</div>
                </div>
                <div class="glass p-3 rounded-xl">
                    <div class="text-xs text-white/60 mb-1">Total Budget</div>
                    <div class="text-lg font-bold text-emerald-400">Rp 50Jt</div>
                </div>
                <div class="glass p-3 rounded-xl">
                    <div class="text-xs text-white/60 mb-1">Indoor Stock</div>
                    <div class="text-2xl font-bold text-blue-400">45</div>
                </div>
                <div class="glass p-3 rounded-xl">
                    <div class="text-xs text-white/60 mb-1">Outdoor Stock</div>
                    <div class="text-2xl font-bold text-green-400">23</div>
                </div>
            </div>

            <!-- Menu Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="alert('Approval Module')">
                    <div class="text-3xl mb-2">✅</div>
                    <div class="text-xs font-bold">Approval</div>
                    <div class="text-[10px] text-white/60">3 pending</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="alert('Budget Module')">                    <div class="text-3xl mb-2">💰</div>
                    <div class="text-xs font-bold">Dana Umum</div>
                    <div class="text-[10px] text-white/60">Kelola anggaran</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="alert('SPJ Module')">
                    <div class="text-3xl mb-2">📋</div>
                    <div class="text-xs font-bold">SPJ</div>
                    <div class="text-[10px] text-white/60">Pertanggungjawaban</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="alert('Reports Module')">
                    <div class="text-3xl mb-2">📊</div>
                    <div class="text-xs font-bold">Laporan</div>
                    <div class="text-[10px] text-white/60">Harian/Mingguan</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="alert('Inventory Module')">
                    <div class="text-3xl mb-2">📦</div>
                    <div class="text-xs font-bold">Inventaris</div>
                    <div class="text-[10px] text-white/60">Manage assets</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="alert('Janitor Module')">
                    <div class="text-3xl mb-2">🧹</div>
                    <div class="text-xs font-bold">Stok Janitor</div>
                    <div class="text-[10px] text-white/60">Indoor/Outdoor</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="alert('RAB Module')">
                    <div class="text-3xl mb-2">📝</div>
                    <div class="text-xs font-bold">RAB</div>
                    <div class="text-[10px] text-white/60">Rencana Anggaran</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="alert('Tax Module')">
                    <div class="text-3xl mb-2">🧾</div>
                    <div class="text-xs font-bold">Pajak</div>
                    <div class="text-[10px] text-white/60">Laporan Tahunan</div>
                </div>
            </div>
        `;
    },
    showMain() {
        document.getElementById('stats-card').style.display = 'block';
        document.getElementById('carousel-container').style.display = 'block';
        document.getElementById('menu-grid').style.display = 'block';
        const container = document.getElementById('command-center');
        if (container) container.remove();
    }
});

// 📅 BOOKING MODULE
DreamOS.register('booking', { open() { alert('📅 Booking Module - Coming soon!'); DreamOS.run('command', 'showMain'); } });
// ⚠️ K3 MODULE
DreamOS.register('k3', { open() { alert('⚠️ K3 Safety Module - Coming soon!'); DreamOS.run('command', 'showMain'); } });// 🔒 SECURITY MODULE
DreamOS.register('security', { open() { alert('🔒 Security Module - Coming soon!'); DreamOS.run('command', 'showMain'); } });
// 🧹 JANITOR IN MODULE
DreamOS.register('janitorIn', { open() { alert('🧹 Janitor Indoor Module - Coming soon!'); DreamOS.run('command', 'showMain'); } });
// 🍃 JANITOR OUT MODULE
DreamOS.register('janitorOut', { open() { alert('🍃 Janitor Outdoor Module - Coming soon!'); DreamOS.run('command', 'showMain'); } });
// 📦 STOK MODULE
DreamOS.register('stok', { open() { alert('📦 Stok Module - Coming soon!'); DreamOS.run('command', 'showMain'); } });
// 🔧 MAINTENANCE MODULE
DreamOS.register('maintenance', { open() { alert('🔧 Maintenance Module - Coming soon!'); DreamOS.run('command', 'showMain'); } });
// 🏢 ASSET MODULE
DreamOS.register('asset', { open() { alert('🏢 Asset Module - Coming soon!'); DreamOS.run('command', 'showMain'); } });

// 👻 GHOST MODE
DreamOS.register('ghost', {
    init() {
        const logo = document.getElementById('dream-logo'), counter = document.getElementById('tap-counter');
        if (logo) {
            const handleTap = (e) => {
                e.preventDefault(); DreamOS.state.tapCount++;
                if (counter) { counter.textContent = 'Tap ' + DreamOS.state.tapCount + '/7'; counter.style.opacity = '1'; }
                logo.classList.add('shake'); setTimeout(() => logo.classList.remove('shake'), 300);
                if (DreamOS.state.tapCount === 1) DreamOS.state.tapTimer = setTimeout(() => { DreamOS.state.tapCount = 0; if(counter) counter.style.opacity = '0'; }, 2000);
                if (DreamOS.state.tapCount >= 7) {
                    clearTimeout(DreamOS.state.tapTimer); DreamOS.state.tapCount = 0;
                    if (counter) { counter.textContent = 'ACTIVATED!'; counter.style.color = '#ef4444'; }
                    setTimeout(() => { const ghost = document.getElementById('ghost-dashboard'); if (ghost) ghost.classList.add('active'); if (counter) { counter.style.opacity = '0'; counter.style.color = '#2dd4bf'; } alert('👻 Ghost Mode Activated!'); }, 500);
                }
            };
            logo.addEventListener('touchstart', handleTap, { passive: false });
            logo.addEventListener('pointerdown', handleTap);
        }
        const closeGhost = document.getElementById('close-ghost');
        if (closeGhost) closeGhost.addEventListener('click', () => { const ghost = document.getElementById('ghost-dashboard'); if (ghost) ghost.classList.remove('active'); });
    }
});

// 🚀 INIT
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS v' + DreamOS.version + ' Loaded');
    DreamOS.run('auth', 'init');
    DreamOS.run('ghost', 'init');
    window.DreamOS = DreamOS;
});
