/**
 * Dream OS v1.3.1 - Full Login + Navigation
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

// 🔐 AUTH WITH PROPER REDIRECT
DreamOS.register('auth', {
    init() {
        const toggle = document.getElementById('toggle-pw');
        const input = document.getElementById('access-key');
        const btn = document.getElementById('btn-login');
        
        console.log('🔐 Auth init');
        
        // Password toggle
        if (toggle && input) {
            toggle.addEventListener('click', () => {
                input.type = input.type === 'password' ? 'text' : 'password';
                toggle.textContent = input.type === 'password' ? '👁️' : '🙈';
            });
        }
        
        // Login button
        if (btn) {
            btn.addEventListener('click', () => this.handleLogin());
        }        
        // Logout button
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    },
    
    handleLogin() {
        const input = document.getElementById('access-key');
        const key = input?.value;
        
        console.log('🔑 Login clicked - Key:', key);
        
        if (!key) {
            alert('Masukkan Access Key!');
            return;
        }
        
        // Set role based on key
        DreamOS.role = (key.includes('admin') || key.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
        
        // Hide login page
        const loginPage = document.getElementById('login-page');
        if (loginPage) {
            loginPage.classList.remove('active');
            loginPage.style.display = 'none';
        }
        
        // Show dashboard
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.classList.add('active');
            dashboard.style.display = 'flex';
        }
        
        // Show bottom nav
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) {
            bottomNav.style.display = 'flex';
        }
        
        console.log('✅ Login success! Role:', DreamOS.role);
        
        // Initialize modules after short delay
        setTimeout(() => {
            DreamOS.run('home', 'init');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 300);
    },    
    logout() {
        const loginPage = document.getElementById('login-page');
        const dashboard = document.getElementById('dashboard');
        const bottomNav = document.getElementById('bottom-nav');
        const input = document.getElementById('access-key');
        
        if (dashboard) {
            dashboard.classList.remove('active');
            dashboard.style.display = 'none';
        }
        if (loginPage) {
            loginPage.classList.add('active');
            loginPage.style.display = 'flex';
        }
        if (bottomNav) {
            bottomNav.style.display = 'none';
        }
        if (input) {
            input.value = '';
        }
        
        console.log('🚪 Logged out');
    }
});

// 🏠 HOME MODULE
DreamOS.register('home', {
    init() {
        console.log('🏠 Home init');
        this.renderCarousel();
        this.renderMenuGrid();
        this.initNav();
    },
    
    renderCarousel() {
        const c = document.getElementById('carousel-slides');
        const d = document.getElementById('carousel-dots');
        if (!c || !d) return;
        
        c.innerHTML = DreamOS.carouselData.map((s, i) => `
            <div class="carousel-slide ${i===0?'active':''}">
                <div class="flex items-center gap-2 mb-1 text-teal-400">
                    <i data-lucide="${s.icon}" class="w-4 h-4"></i>
                    <span class="font-bold text-xs">${s.title}</span>
                </div>
                <p class="text-xs text-white/60 whitespace-pre-line">${s.text}</p>
            </div>
        `).join('');
                d.innerHTML = DreamOS.carouselData.map((_, i) => 
            `<div class="dot ${i===0?'active':''}" data-slide="${i}"></div>`
        ).join('');
        
        d.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', function() {
                DreamOS.run('home', 'goToSlide', parseInt(this.dataset.slide));
            });
        });
        
        this.startCarousel();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },
    
    startCarousel() {
        if (DreamOS.state.carouselInterval) clearInterval(DreamOS.state.carouselInterval);
        DreamOS.state.carouselInterval = setInterval(() => {
            DreamOS.state.currentSlide = (DreamOS.state.currentSlide + 1) % DreamOS.carouselData.length;
            this.showSlide(DreamOS.state.currentSlide);
        }, 7000);
    },
    
    showSlide(i) {
        document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        if (document.querySelectorAll('.carousel-slide')[i]) document.querySelectorAll('.carousel-slide')[i].classList.add('active');
        if (document.querySelectorAll('.dot')[i]) document.querySelectorAll('.dot')[i].classList.add('active');
    },
    
    goToSlide(i) {
        DreamOS.state.currentSlide = i;
        this.showSlide(i);
        this.startCarousel();
    },
    
    renderMenuGrid() {
        const c = document.getElementById('menu-grid');
        if (!c) return;
        
        c.innerHTML = DreamOS.menuItems.map(m => `
            <div class="menu-card p-3 rounded-xl flex flex-col items-center justify-center glass cursor-pointer min-h-[90px]">
                <div class="text-2xl mb-1">${m.icon}</div>
                <div class="text-[10px] font-bold text-white text-center">${m.label}</div>
            </div>
        `).join('');
        
        c.querySelectorAll('.menu-card').forEach((el, i) => {
            el.addEventListener('click', () => {
                alert(DreamOS.menuItems[i].label + ' module - Coming soon!');
            });        });
    },
    
    initNav() {
        document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => {
                    b.classList.remove('text-teal-400');
                    b.classList.add('text-white/60');
                });
                this.classList.add('text-teal-400');
                this.classList.remove('text-white/60');
                
                const target = this.dataset.target;
                console.log('🔘 Nav clicked:', target);
                
                if (target === 'user') {
                    alert('👤 User Profile\n\nRole: ' + DreamOS.role);
                } else if (target === 'menu') {
                    alert('📋 Menu - Coming soon!');
                } else if (target === 'info') {
                    alert('ℹ️ Dream OS v1.3.1\n\nBuilt with ❤️ for Dream Team');
                } else if (target === 'config') {
                    alert('⚙️ Config - Coming soon!');
                }
            });
        });
    }
});

// 👻 GHOST MODE
DreamOS.register('ghost', {
    init() {
        const logo = document.getElementById('dream-logo');
        const counter = document.getElementById('tap-counter');
        
        if (logo) {
            const handleTap = (e) => {
                e.preventDefault();
                DreamOS.state.tapCount++;
                
                if (counter) {
                    counter.textContent = 'Tap ' + DreamOS.state.tapCount + '/7';
                    counter.style.opacity = '1';
                }
                
                logo.classList.add('shake');
                setTimeout(() => logo.classList.remove('shake'), 300);
                
                if (DreamOS.state.tapCount === 1) {                    DreamOS.state.tapTimer = setTimeout(() => {
                        DreamOS.state.tapCount = 0;
                        if (counter) counter.style.opacity = '0';
                    }, 2000);
                }
                
                if (DreamOS.state.tapCount >= 7) {
                    clearTimeout(DreamOS.state.tapTimer);
                    DreamOS.state.tapCount = 0;
                    
                    if (counter) {
                        counter.textContent = 'ACTIVATED!';
                        counter.style.color = '#ef4444';
                    }
                    
                    setTimeout(() => {
                        const ghostDashboard = document.getElementById('ghost-dashboard');
                        if (ghostDashboard) {
                            ghostDashboard.classList.add('active');
                        }
                        if (counter) {
                            counter.style.opacity = '0';
                            counter.style.color = '#2dd4bf';
                        }
                        alert('👻 Ghost Mode Activated!');
                    }, 500);
                }
            };
            
            logo.addEventListener('touchstart', handleTap, { passive: false });
            logo.addEventListener('pointerdown', handleTap);
        }
        
        const closeGhost = document.getElementById('close-ghost');
        if (closeGhost) {
            closeGhost.addEventListener('click', () => {
                const ghostDashboard = document.getElementById('ghost-dashboard');
                if (ghostDashboard) {
                    ghostDashboard.classList.remove('active');
                }
            });
        }
    }
});

// 🚀 INIT
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS v' + DreamOS.version + ' Loaded');
    DreamOS.run('auth', 'init');
    DreamOS.run('ghost', 'init');    window.DreamOS = DreamOS;
});
