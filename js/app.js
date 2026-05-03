/**
 * Dream OS v1.3.1 - FINAL FIX (Data Attached to DreamOS)
 */
let carouselInterval = null, currentSlide = 0, tapCount = 0, tapTimer = null;

window.DreamOS = {
    version: '1.3.1',
    modules: {},
    role: 'STAFF',
    state: { erudaActive: false, carouselInterval: null, currentSlide: 0, tapCount: 0, tapTimer: null },
    
    // ✅ DATA ATTACHED TO DreamOS OBJECT (bukan local constant!)
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
    
    translations: {
        id: { appName: 'Dream OS', home: 'BERANDA', user: 'PENGGUNA', menu: 'MENU', info: 'INFO', config: 'PENGATURAN', statsTitle: 'Statistik Hari Ini', users: 'Total Pengguna', uptime: 'Waktu Aktif', logout: 'Keluar' },
        en: { appName: 'Dream OS', home: 'HOME', user: 'USER', menu: 'MENU', info: 'INFO', config: 'CONFIG', statsTitle: 'Today\'s Statistics', users: 'Total Users', uptime: 'Uptime', logout: 'Logout' },
        ar: { appName: 'Dream OS', home: 'الرئيسية', user: 'المستخدم', menu: 'القائمة', info: 'معلومات', config: 'الإعدادات', statsTitle: 'إحصائيات اليوم', users: 'إجمالي المستخدمين', uptime: 'وقت التشغيل', logout: 'تسجيل الخروج' }
    },
    
    register(name, mod) { this.modules[name] = mod; console.log('✅ Module: ' + name); },
    run(mod, fn, ...args) { try { if (this.modules[mod]?.[fn]) return this.modules[mod][fn](...args); } catch (e) { console.error(e); } },
    t(key, lang) { const l = lang || localStorage.getItem('dream-lang') || 'id'; return this.translations[l]?.[key] || this.translations['id']?.[key] || key; }
};

// 🔐 AUTH MODULE
DreamOS.register('auth', {
    init() {
        const toggle = document.getElementById('toggle-pw'), input = document.getElementById('access-key');
        if (toggle && input) toggle.addEventListener('click', () => {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            toggle.textContent = isPass ? '🙈' : '👁️';        });
        document.getElementById('btn-login')?.addEventListener('click', () => this.handleLogin());
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
        
        // Wait for DOM + init modules
        setTimeout(() => {
            console.log(' Initializing home module...');
            DreamOS.run('home', 'init');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 300);
    },
    openProfile() { alert('👤 User Profile\n\nRole: ' + DreamOS.role + '\nEmail: user@dream.com'); },
    logout() {
        document.getElementById('dashboard').classList.remove('active');
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('login-page').classList.add('active');
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('bottom-nav').style.display = 'none';
        document.getElementById('access-key').value = '';
        if (DreamOS.state.carouselInterval) clearInterval(DreamOS.state.carouselInterval);
    }
});

// 🏠 HOME MODULE
DreamOS.register('home', {
    init() {
        console.log('🏠 Home module initialized');
        console.log('📊 Carousel data:', DreamOS.carouselData.length, 'slides');
        console.log(' Menu items:', DreamOS.menuItems.length, 'items');
        
        this.renderCarousel();
        this.renderMenuGrid();
        this.initNav();
    },
    
    renderCarousel() {
        const c = document.getElementById('carousel-slides');
        const d = document.getElementById('carousel-dots');
        
        console.log('🎠 Carousel elements:', c ? 'found' : 'NOT FOUND', d ? 'found' : 'NOT FOUND');        
        if (!c || !d) {
            console.error('❌ Carousel elements not found!');
            return;
        }
        
        // ✅ Use DreamOS.carouselData (bukan local constant)
        c.innerHTML = DreamOS.carouselData.map((s, i) => 
            `<div class="carousel-slide ${i===0?'active':''}">
                <div class="flex items-center gap-2 mb-1 text-teal-400">
                    <i data-lucide="${s.icon}" class="w-4 h-4"></i>
                    <span class="font-bold text-xs">${s.title}</span>
                </div>
                <p class="text-xs text-white/60 whitespace-pre-line">${s.text}</p>
            </div>`
        ).join('');
        
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
        console.log('✅ Carousel rendered:', c.innerHTML.length, 'bytes');
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
        this.showSlide(i);        this.startCarousel();
    },
    
    renderMenuGrid() {
        const c = document.getElementById('menu-grid');
        
        console.log('🔢 Menu grid element:', c ? 'found' : 'NOT FOUND');
        
        if (!c) {
            console.error('❌ Menu grid not found!');
            return;
        }
        
        // ✅ Use DreamOS.menuItems (bukan local constant)
        c.innerHTML = DreamOS.menuItems.map(m => 
            `<div class="menu-card p-3 rounded-xl flex flex-col items-center justify-center glass cursor-pointer min-h-[90px]">
                <div class="text-2xl mb-1">${m.icon}</div>
                <div class="text-[10px] font-bold text-white text-center">${m.label}</div>
            </div>`
        ).join('');
        
        c.querySelectorAll('.menu-card').forEach((el, i) => {
            el.addEventListener('click', () => alert(DreamOS.menuItems[i].label + ' module - Ready!'));
        });
        
        console.log('✅ Menu grid rendered:', c.innerHTML.length, 'bytes');
    },
    
    initNav() {
        const navBtns = document.querySelectorAll('#bottom-nav .nav-btn');
        if (navBtns.length === 0) {
            console.error('❌ Nav buttons not found!');
            return;
        }
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                navBtns.forEach(b => { b.classList.remove('text-teal-400'); b.classList.add('text-white/60'); });
                this.classList.add('text-teal-400'); this.classList.remove('text-white/60');
                const t = this.dataset.target;
                console.log('🔘 Nav clicked:', t);
                if (t === 'user') DreamOS.run('auth', 'openProfile');
                else if (t === 'menu') { DreamOS.run('command', 'openCommandCenter'); }
                else if (t === 'info') alert('ℹ️ Dream OS v1.3.1');
                else if (t === 'config') DreamOS.run('i18n', 'showPicker');
            });
        });
        console.log('✅ Nav buttons initialized:', navBtns.length, 'buttons');
    }
});
// 🌐 I18N MODULE
DreamOS.register('i18n', {
    setLanguage(lang) {
        if (!DreamOS.translations[lang]) return;
        localStorage.setItem('dream-lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n');
            if (DreamOS.translations[lang][k]) el.textContent = DreamOS.translations[lang][k];
        });
        document.body.style.fontFamily = lang === 'ar' ? "'Amiri', serif" : "'Inter', sans-serif";
        console.log('🌐 Language:', lang);
    },
    showPicker() {
        const c = localStorage.getItem('dream-lang') || 'id';
        const opts = Object.keys(DreamOS.translations).map(l => `${l===c?'🔘':''} ${l.toUpperCase()}`).join('\n');
        const pick = prompt('Select Language:\n' + opts + '\n\nType code (id/en/ar):', c);
        if (pick && DreamOS.translations[pick]) this.setLanguage(pick);
    }
});

// 👻 GHOST MODE MODULE
DreamOS.register('ghost', {
    init() {
        const logo = document.getElementById('dream-logo');
        const counter = document.getElementById('tap-counter');
        if (logo) {
            const handleTap = (e) => {
                e.preventDefault();
                DreamOS.state.tapCount++;
                if (counter) { counter.textContent = 'Tap ' + DreamOS.state.tapCount + '/7'; counter.style.opacity = '1'; }
                logo.classList.add('shake'); setTimeout(() => logo.classList.remove('shake'), 300);
                if (DreamOS.state.tapCount === 1) DreamOS.state.tapTimer = setTimeout(() => { DreamOS.state.tapCount = 0; if(counter) counter.style.opacity = '0'; }, 2000);
                if (DreamOS.state.tapCount >= 7) {
                    clearTimeout(DreamOS.state.tapTimer); DreamOS.state.tapCount = 0;
                    if(counter) { counter.textContent = 'ACTIVATED!'; counter.style.color = '#ef4444'; }
                    setTimeout(() => {
                        document.getElementById('ghost-dashboard').classList.add('active');
                        DreamOS.run('ghost', 'renderTools');
                        if(counter) { counter.style.opacity = '0'; counter.style.color = '#2dd4bf'; }
                    }, 500);
                }
            };
            logo.addEventListener('touchstart', handleTap, { passive: false });
            logo.addEventListener('pointerdown', handleTap);
        }
        document.getElementById('close-ghost')?.addEventListener('click', () => document.getElementById('ghost-dashboard').classList.remove('active'));
    },    renderTools() {
        const c = document.getElementById('ghost-tools'); if (!c) return;
        c.innerHTML = `
            <div class="ghost-card"><div class="flex justify-between items-center mb-3"><h3 class="text-base font-bold text-teal-400">💻 Eruda</h3><button class="ghost-btn" onclick="DreamOS.modules.ghost.toggleEruda()">INJECT</button></div></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🔍 OSINT</h3><div class="flex gap-2 mb-2"><input type="text" id="osint-user" placeholder="Username" class="term-input"><button class="ghost-btn" onclick="DreamOS.modules.ghost.runOSINT()">SCAN</button></div><div id="osint-res" class="hidden bg-black/50 p-3 rounded text-xs font-mono text-emerald-400"></div></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🌐 Nmap</h3><div class="flex gap-2 mb-2"><input type="text" id="nmap-ip" placeholder="192.168.1.1" class="term-input"><button class="ghost-btn" onclick="DreamOS.modules.ghost.copyText('nmap -sV -sC '+(document.getElementById('nmap-ip')?.value||'127.0.0.1'))">COPY</button></div></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🕷️ Spider</h3><div class="flex gap-2 mb-2"><input type="text" id="spider-url" placeholder="https://target.com" class="term-input"><button class="ghost-btn" onclick="DreamOS.modules.ghost.copyText('scrapy startproject target && cd target && scrapy genspider target '+(document.getElementById('spider-url')?.value||'https://target.com'))">COPY</button></div></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🐉 Kali</h3><button class="ghost-btn w-full" onclick="DreamOS.modules.ghost.copyText('pkg install proot-distro && proot-distro install kali-linux')">INSTALL</button></div>
            <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">📡 TShark</h3><button class="ghost-btn w-full bg-purple-500/20 text-purple-300" onclick="DreamOS.modules.ghost.copyText('pkg install tshark')">INSTALL</button></div>
        `;
    },
    toggleEruda() {
        if (DreamOS.state.erudaActive) { if (typeof eruda !== 'undefined') eruda.destroy(); DreamOS.state.erudaActive = false; alert('✅ Eruda removed'); }
        else { const s = document.createElement('script'); s.src = "https://cdn.jsdelivr.net/npm/eruda"; s.onload = () => { if (typeof eruda !== 'undefined') { eruda.init(); DreamOS.state.erudaActive = true; alert('✅ Eruda injected!'); } }; document.body.appendChild(s); }
    },
    async runOSINT() {
        const u = document.getElementById('osint-user')?.value, r = document.getElementById('osint-res');
        if (!u || !r) return; r.classList.remove('hidden'); r.innerHTML = '🔍 Scanning...';
        try { const d = await (await fetch('https://api.github.com/users/' + u)).json(); r.innerHTML = d.login ? '✅ ' + d.login + '\n📍 ' + (d.location||'N/A') : '❌ Not found'; } catch(e) { r.innerHTML = '❌ Error'; }
    },
    copyText(t) { navigator.clipboard.writeText(t).then(() => alert('✅ Copied')).catch(() => alert('📋 Copy: ' + t)); }
});

// 🚀 INIT
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS v' + DreamOS.version + ' Loaded');
    console.log('📊 Carousel data:', DreamOS.carouselData.length, 'slides ready');
    console.log('🔢 Menu items:', DreamOS.menuItems.length, 'items ready');
    DreamOS.run('i18n', 'setLanguage', localStorage.getItem('dream-lang') || 'id');
    DreamOS.run('auth', 'init');
    DreamOS.run('ghost', 'init');
    document.getElementById('btn-logout')?.addEventListener('click', () => DreamOS.run('auth', 'logout'));
    window.DreamOS = DreamOS;
});

// ==========================================
// 📝 ADMIN SLIDE EDITOR (Slide 5,6,7 Dynamic)
// ==========================================
DreamOS.register('adminSlides', {
    indices: [4, 5, 6], // Index slide 5,6,7 (0-based)
    defaultTitles: ['Info Management', 'Info Team Umum', 'Ucapan'],
    defaultTexts: [
        'Rapat CEO & Yayasan\nPukul 09:00 WIB di Ruang Rapat SMA',
        'Rapat Mingguan\nJam 09:00 WIB di R. Koord Bagian Umum',
        '🎂 Selamat Ulang Tahun Pak Budi (Komisi 3 Bulan)'
    ],

    init() {
        const saved = localStorage.getItem('dreamos_admin_slides');
        if (saved) {
            const parsed = JSON.parse(saved);
            parsed.forEach((slide, i) => {
                if (DreamOS.carouselData[this.indices[i]]) {
                    DreamOS.carouselData[this.indices[i]].title = slide.title;
                    DreamOS.carouselData[this.indices[i]].text = slide.text;
                }
            });
        } else {
            this.saveToStorage();
        }
    },

    saveToStorage() {
        const slides = this.indices.map(i => ({
            title: DreamOS.carouselData[i]?.title || this.defaultTitles[this.indices.indexOf(i)],
            text: DreamOS.carouselData[i]?.text || this.defaultTexts[this.indices.indexOf(i)]
        }));
        localStorage.setItem('dreamos_admin_slides', JSON.stringify(slides));
    },

    renderEditor() {
        const container = document.getElementById('command-content');
        if (!container) return;

        container.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-center">                    <h2 class="text-lg font-bold">📝 Kelola Info Slide (Admin)</h2>
                    <button onclick="DreamOS.run('command', 'renderDashboard')" class="px-3 py-1 bg-white/10 rounded text-xs">← Kembali</button>
                </div>
                <p class="text-xs text-white/60">Edit Slide 5, 6, 7 untuk Info Management, Team Umum & Ucapan</p>
                
                <div class="space-y-3">
                    ${this.indices.map((idx, i) => `
                        <div class="glass p-4 rounded-xl">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm font-bold text-teal-400">Slide ${idx + 1}</span>
                                <span class="text-[10px] text-white/40">${this.defaultTitles[i]}</span>
                            </div>
                            <input type="text" id="slide-title-${i}" value="${DreamOS.carouselData[idx].title}" 
                                class="w-full bg-white/10 border border-white/20 rounded p-2 text-sm text-white mb-2" placeholder="Judul Slide">
                            <textarea id="slide-text-${i}" rows="3" 
                                class="w-full bg-white/10 border border-white/20 rounded p-2 text-sm text-white whitespace-pre-line" 
                                placeholder="Isi Slide">${DreamOS.carouselData[idx].text}</textarea>
                        </div>
                    `).join('')}
                </div>
                
                <button onclick="DreamOS.run('adminSlides', 'saveAndRefresh')" 
                    class="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl shadow-lg mt-2">
                    💾 SIMPAN & UPDATE CAROUSEL
                </button>
            </div>
        `;
    },

    saveAndRefresh() {
        this.indices.forEach((idx, i) => {
            const titleEl = document.getElementById(`slide-title-${i}`);
            const textEl = document.getElementById(`slide-text-${i}`);
            if (titleEl && textEl && DreamOS.carouselData[idx]) {
                DreamOS.carouselData[idx].title = titleEl.value;
                DreamOS.carouselData[idx].text = textEl.value;
            }
        });
        this.saveToStorage();
        DreamOS.run('home', 'renderCarousel'); // Refresh carousel langsung
        alert('✅ Slide 5,6,7 berhasil diupdate!');
        this.renderEditor(); // Tetap di halaman editor
    }
});

// ==========================================
// 🎯 MODULE NAVIGATION SYSTEM
// ==========================================
DreamOS.modules.navigation = {
    showModule(moduleId) {
        // Hide all sections
        document.querySelectorAll('.module-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('#stats-card, #carousel-container, #menu-grid').forEach(el => {
            el.style.display = 'none';
        });
        
        // Show command center container
        document.getElementById('command-center').classList.add('active');
        
        // Show specific module
        const targetModule = document.getElementById(moduleId);
        if (targetModule) {
            targetModule.classList.add('active');
        }
        
        // Update nav active state
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('text-teal-400');
            btn.classList.add('text-white/60');
        });
    },
    
    showHome() {
        // Hide command center
        document.getElementById('command-center').classList.remove('active');
        document.querySelectorAll('.module-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show main dashboard
        document.getElementById('stats-card').style.display = 'block';
        document.getElementById('carousel-container').style.display = 'block';
        document.getElementById('menu-grid').style.display = 'block';
        
        // Update nav active state
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('text-teal-400');
            btn.classList.add('text-white/60');
        });
        document.querySelector('[data-target="home"]').classList.add('text-teal-400');
        document.querySelector('[data-target="home"]').classList.remove('text-white/60');    }
};

// Update Command module to use new navigation
DreamOS.modules.command.renderDashboard = function() {
    const container = document.getElementById('cmd-dashboard');
    if (!container) return;
    
    container.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">Command Center - Kabag Umum</h2>
            <button onclick="DreamOS.modules.navigation.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
        </div>
        <div class="space-y-4">
            <!-- Quick Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="glass p-3 rounded-xl">
                    <div class="text-xs text-white/60 mb-1">Pending Approval</div>
                    <div class="text-2xl font-bold text-amber-400">${this.data.approvals.filter(a => a.status === 'pending').length}</div>
                </div>
                <div class="glass p-3 rounded-xl">
                    <div class="text-xs text-white/60 mb-1">Total Budget</div>
                    <div class="text-lg font-bold text-emerald-400">Rp ${this.formatNumber(this.data.budget.reduce((sum, b) => sum + b.allocated, 0))}</div>
                </div>
                <div class="glass p-3 rounded-xl">
                    <div class="text-xs text-white/60 mb-1">Indoor Stock</div>
                    <div class="text-2xl font-bold text-blue-400">${this.data.janitorStock.indoor.reduce((sum, i) => sum + i.qty, 0)}</div>
                </div>
                <div class="glass p-3 rounded-xl">
                    <div class="text-xs text-white/60 mb-1">Outdoor Stock</div>
                    <div class="text-2xl font-bold text-green-400">${this.data.janitorStock.outdoor.reduce((sum, i) => sum + i.qty, 0)}</div>
                </div>
            </div>

            <!-- Menu Grid Command Center -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="DreamOS.modules.navigation.showModule('cmd-approval'); DreamOS.modules.command.showApprovals();">
                    <div class="text-3xl mb-2">✅</div>
                    <div class="text-xs font-bold">Approval</div>
                    <div class="text-[10px] text-white/60">${this.data.approvals.filter(a => a.status === 'pending').length} pending</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="DreamOS.modules.navigation.showModule('cmd-budget'); DreamOS.modules.command.showBudget();">
                    <div class="text-3xl mb-2">💰</div>
                    <div class="text-xs font-bold">Dana Umum</div>
                    <div class="text-[10px] text-white/60">Kelola anggaran</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="DreamOS.modules.navigation.showModule('cmd-spj'); DreamOS.modules.command.showSPJ();">
                    <div class="text-3xl mb-2">📋</div>
                    <div class="text-xs font-bold">SPJ</div>
                    <div class="text-[10px] text-white/60">Pertanggungjawaban</div>                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="DreamOS.modules.navigation.showModule('cmd-reports'); DreamOS.modules.command.showReports();">
                    <div class="text-3xl mb-2">📊</div>
                    <div class="text-xs font-bold">Laporan</div>
                    <div class="text-[10px] text-white/60">Harian/Mingguan</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="DreamOS.modules.navigation.showModule('cmd-inventory'); DreamOS.modules.command.showInventory();">
                    <div class="text-3xl mb-2">📦</div>
                    <div class="text-xs font-bold">Inventaris</div>
                    <div class="text-[10px] text-white/60">${this.data.inventory.length} items</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="DreamOS.modules.navigation.showModule('cmd-janitor'); DreamOS.modules.command.showJanitorStock();">
                    <div class="text-3xl mb-2">🧹</div>
                    <div class="text-xs font-bold">Stok Janitor</div>
                    <div class="text-[10px] text-white/60">Indoor/Outdoor</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="DreamOS.modules.navigation.showModule('cmd-rab'); DreamOS.modules.command.showRAB();">
                    <div class="text-3xl mb-2">📝</div>
                    <div class="text-xs font-bold">RAB</div>
                    <div class="text-[10px] text-white/60">Rencana Anggaran</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="DreamOS.modules.navigation.showModule('cmd-tax'); DreamOS.modules.command.showTax();">
                    <div class="text-3xl mb-2">🧾</div>
                    <div class="text-xs font-bold">Pajak</div>
                    <div class="text-[10px] text-white/60">Laporan Tahunan</div>
                </div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition" onclick="DreamOS.modules.navigation.showModule('cmd-slides'); DreamOS.modules.adminSlides.renderEditor();">
                    <div class="text-3xl mb-2">📝</div>
                    <div class="text-xs font-bold">Kelola Slide</div>
                    <div class="text-[10px] text-white/60">Admin Input</div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="glass p-4 rounded-xl">
                <h3 class="text-sm font-bold mb-3">Recent Activity</h3>
                <div class="space-y-2">
                    ${this.data.approvals.slice(0, 3).map(a => `
                        <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                            <div>
                                <div class="text-xs font-bold">${a.title}</div>
                                <div class="text-[10px] text-white/60">${a.type} • ${a.date}</div>
                            </div>
                            <span class="px-2 py-1 rounded text-[10px] ${a.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">${a.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;};

// Update openCommandCenter to use new navigation
DreamOS.modules.command.openCommandCenter = function() {
    DreamOS.modules.navigation.showModule('cmd-dashboard');
    this.renderDashboard();
};

// Update MENU nav button handler
document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
    if (btn.dataset.target === 'menu') {
        btn.addEventListener('click', function() {
            DreamOS.modules.command.openCommandCenter();
        });
    } else if (btn.dataset.target === 'home') {
        btn.addEventListener('click', function() {
            DreamOS.modules.navigation.showHome();
        });
    }
});

console.log('✅ Module navigation system ready!');

// ==========================================
// 🎯 MAIN MODULES NAVIGATION
// ==========================================
DreamOS.modules.mainNav = {
    showModule(moduleId) {
        // Hide main dashboard elements
        document.getElementById('stats-card').style.display = 'none';
        document.getElementById('carousel-container').style.display = 'none';
        document.getElementById('menu-grid').style.display = 'none';
        
        // Hide all module containers
        document.getElementById('command-center').classList.remove('active');
        document.getElementById('main-modules').classList.remove('active');
        document.getElementById('ai-core').classList.remove('active');
        
        // Show main modules container
        document.getElementById('main-modules').classList.add('active');
        
        // Hide all sections, show target
        document.querySelectorAll('#main-modules .module-section').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(moduleId);
        if (target) target.classList.add('active');
    },
    
    showCommandCenter() {
        document.getElementById('stats-card').style.display = 'none';
        document.getElementById('carousel-container').style.display = 'none';
        document.getElementById('menu-grid').style.display = 'none';
        document.getElementById('main-modules').classList.remove('active');
        document.getElementById('ai-core').classList.remove('active');
        document.getElementById('command-center').classList.add('active');
        document.querySelectorAll('#command-center .module-section').forEach(s => s.classList.remove('active'));
        document.getElementById('cmd-dashboard').classList.add('active');
    },
    
    showAI() {
        document.getElementById('stats-card').style.display = 'none';
        document.getElementById('carousel-container').style.display = 'none';
        document.getElementById('menu-grid').style.display = 'none';
        document.getElementById('main-modules').classList.remove('active');
        document.getElementById('command-center').classList.remove('active');
        document.getElementById('ai-core').classList.add('active');
        document.querySelectorAll('#ai-core .module-section').forEach(s => s.classList.remove('active'));
        document.getElementById('ai-chat').classList.add('active');
    },
    
    showHome() {
        document.getElementById('stats-card').style.display = 'block';        document.getElementById('carousel-container').style.display = 'block';
        document.getElementById('menu-grid').style.display = 'block';
        document.getElementById('main-modules').classList.remove('active');
        document.getElementById('command-center').classList.remove('active');
        document.getElementById('ai-core').classList.remove('active');
    }
};

// ==========================================
// 📅 BOOKING MODULE
// ==========================================
DreamOS.register('booking', {
    data: { bookings: [] },
    init() {
        const container = document.getElementById('mod-booking');
        if (!container) return;
        container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">📅 Booking System</h2>
                <button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            <div class="glass p-4 rounded-xl space-y-3">
                <div class="form-group">
                    <label class="form-label">Nama Peminjam</label>
                    <input type="text" id="booking-name" class="form-control" placeholder="Masukkan nama">
                </div>
                <div class="form-group">
                    <label class="form-label">Ruangan</label>
                    <select id="booking-room" class="form-control">
                        <option>Ruang Rapat Utama</option>
                        <option>Ruang Training</option>
                        <option>Aula</option>
                        <option>Meeting Room A</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="form-group">
                        <label class="form-label">Tanggal</label>
                        <input type="date" id="booking-date" class="form-control">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Jam</label>
                        <input type="time" id="booking-time" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Keperluan</label>
                    <textarea id="booking-purpose" class="form-control" rows="2" placeholder="Deskripsi kegiatan"></textarea>
                </div>
                <button onclick="DreamOS.modules.booking.submit()" class="btn-primary w-full">📝 Ajukan Booking</button>            </div>
            <div class="glass p-4 rounded-xl">
                <h3 class="text-sm font-bold mb-3">Booking Terbaru</h3>
                <div id="booking-list" class="space-y-2"></div>
            </div>
        `;
        this.renderList();
    },
    submit() {
        const name = document.getElementById('booking-name').value;
        const room = document.getElementById('booking-room').value;
        const date = document.getElementById('booking-date').value;
        const time = document.getElementById('booking-time').value;
        const purpose = document.getElementById('booking-purpose').value;
        if (!name || !date) return alert('Nama dan tanggal wajib diisi!');
        
        this.data.bookings.unshift({ id: Date.now(), name, room, date, time, purpose, status: 'pending' });
        localStorage.setItem('dreamos_bookings', JSON.stringify(this.data.bookings));
        alert('✅ Booking diajukan! Menunggu approval.');
        this.renderList();
    },
    renderList() {
        const list = document.getElementById('booking-list');
        if (!list) return;
        const bookings = JSON.parse(localStorage.getItem('dreamos_bookings') || '[]');
        list.innerHTML = bookings.slice(0, 5).map(b => `
            <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                <div>
                    <div class="text-xs font-bold">${b.name}</div>
                    <div class="text-[10px] text-white/60">${b.room} • ${b.date} ${b.time}</div>
                </div>
                <span class="status-badge status-${b.status}">${b.status.toUpperCase()}</span>
            </div>
        `).join('') || '<p class="text-xs text-white/40">Belum ada booking</p>';
    }
});

// ==========================================
// ⚠️ K3 MODULE (Safety)
// ==========================================
DreamOS.register('k3', {
    data: { incidents: [], checklists: [] },
    init() {
        const container = document.getElementById('mod-k3');
        if (!container) return;
        container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">⚠️ K3 - Safety Management</h2>
                <button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>            <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="glass p-4 rounded-xl text-center">
                    <div class="text-2xl mb-1">🟢</div>
                    <div class="text-xs font-bold">Aman</div>
                    <div class="text-lg font-bold text-emerald-400">98%</div>
                </div>
                <div class="glass p-4 rounded-xl text-center">
                    <div class="text-2xl mb-1">🟡</div>
                    <div class="text-xs font-bold">Perlu Perhatian</div>
                    <div class="text-lg font-bold text-amber-400">2%</div>
                </div>
            </div>
            <div class="glass p-4 rounded-xl">
                <h3 class="text-sm font-bold mb-3">📋 Checklist Harian</h3>
                <div class="space-y-2">
                    <label class="flex items-center gap-2 text-sm"><input type="checkbox" class="rounded"> APAR dalam kondisi baik</label>
                    <label class="flex items-center gap-2 text-sm"><input type="checkbox" class="rounded"> Jalur evakuasi jelas</label>
                    <label class="flex items-center gap-2 text-sm"><input type="checkbox" class="rounded"> P3K lengkap</label>
                    <label class="flex items-center gap-2 text-sm"><input type="checkbox" class="rounded"> Area kerja bersih</label>
                </div>
                <button class="btn-primary w-full mt-3">✅ Submit Checklist</button>
            </div>
        `;
    }
});

// ==========================================
// 🔒 SECURITY MODULE
// ==========================================
DreamOS.register('security', {
    data: { logs: [], access: [] },
    init() {
        const container = document.getElementById('mod-security');
        if (!container) return;
        container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">🔒 Security Center</h2>
                <button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            <div class="glass p-4 rounded-xl">
                <h3 class="text-sm font-bold mb-3">🔐 Access Log</h3>
                <div class="space-y-2">
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Admin • Login berhasil</div>
                        <div class="text-[10px] text-white/40">10:30 WIB</div>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Staff • Akses ditolak</div>
                        <div class="text-[10px] text-white/40">09:15 WIB</div>
                    </div>                </div>
            </div>
            <div class="glass p-4 rounded-xl mt-3">
                <h3 class="text-sm font-bold mb-3">🛡️ Quick Actions</h3>
                <div class="grid grid-cols-2 gap-2">
                    <button class="glass p-3 rounded text-center hover:bg-white/10"><div class="text-xl">🔔</div><div class="text-[10px]">Alert</div></button>
                    <button class="glass p-3 rounded text-center hover:bg-white/10"><div class="text-xl">📊</div><div class="text-[10px]">Report</div></button>
                    <button class="glass p-3 rounded text-center hover:bg-white/10"><div class="text-xl">👥</div><div class="text-[10px]">Users</div></button>
                    <button class="glass p-3 rounded text-center hover:bg-white/10"><div class="text-xl">⚙️</div><div class="text-[10px]">Settings</div></button>
                </div>
            </div>
        `;
    }
});

// ==========================================
// 🧹 JANITOR INDOOR MODULE
// ==========================================
DreamOS.register('janitorIn', {
    data: { tasks: [] },
    init() {
        const container = document.getElementById('mod-janitor-in');
        if (!container) return;
        container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">🧹 Janitor - Indoor</h2>
                <button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            <div class="glass p-4 rounded-xl">
                <h3 class="text-sm font-bold mb-3">📋 Task List Indoor</h3>
                <div class="space-y-2">
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Sapu lantai lobby</div>
                        <span class="status-badge status-pending">Pending</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Bersihkan toilet L1</div>
                        <span class="status-badge status-approved">Done</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Lap kaca meeting room</div>
                        <span class="status-badge status-pending">Pending</span>
                    </div>
                </div>
            </div>
        `;
    }
});

// ==========================================// 🍃 JANITOR OUTDOOR MODULE
// ==========================================
DreamOS.register('janitorOut', {
    data: { tasks: [] },
    init() {
        const container = document.getElementById('mod-janitor-out');
        if (!container) return;
        container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">🍃 Janitor - Outdoor</h2>
                <button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            <div class="glass p-4 rounded-xl">
                <h3 class="text-sm font-bold mb-3">📋 Task List Outdoor</h3>
                <div class="space-y-2">
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Sapu halaman depan</div>
                        <span class="status-badge status-pending">Pending</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Potong rumput taman</div>
                        <span class="status-badge status-approved">Done</span>
                    </div>
                </div>
            </div>
        `;
    }
});

// ==========================================
// 📦 STOK MODULE
// ==========================================
DreamOS.register('stok', {
    data: { items: [] },
    init() {
        const container = document.getElementById('mod-stok');
        if (!container) return;
        container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">📦 Stok & Gudang</h2>
                <button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            <div class="glass p-4 rounded-xl">
                <h3 class="text-sm font-bold mb-3">📊 Inventory Overview</h3>
                <div class="space-y-2">
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Kertas A4 (Rim)</div>
                        <div class="text-sm font-bold text-emerald-400">45</div>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">                        <div class="text-xs">Tinta Printer</div>
                        <div class="text-sm font-bold text-amber-400">8</div>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Sarung Tangan</div>
                        <div class="text-sm font-bold text-red-400">2 ⚠️</div>
                    </div>
                </div>
            </div>
        `;
    }
});

// ==========================================
// 🔧 MAINTENANCE MODULE
// ==========================================
DreamOS.register('maintenance', {
    data: { tickets: [] },
    init() {
        const container = document.getElementById('mod-maintenance');
        if (!container) return;
        container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">🔧 Maintenance</h2>
                <button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            <div class="glass p-4 rounded-xl">
                <h3 class="text-sm font-bold mb-3">🎫 Active Tickets</h3>
                <div class="space-y-2">
                    <div class="p-2 bg-white/5 rounded">
                        <div class="text-xs font-bold">AC Ruang Rapat - Tidak dingin</div>
                        <div class="text-[10px] text-white/40">Dilapor: 15 Jan • Priority: High</div>
                    </div>
                    <div class="p-2 bg-white/5 rounded">
                        <div class="text-xs font-bold">Lampu koridor L2 - Mati</div>
                        <div class="text-[10px] text-white/40">Dilapor: 14 Jan • Priority: Medium</div>
                    </div>
                </div>
                <button class="btn-primary w-full mt-3">➕ Buat Ticket Baru</button>
            </div>
        `;
    }
});

// ==========================================
// 🏢 ASSET MODULE
// ==========================================
DreamOS.register('asset', {
    data: { assets: [] },
    init() {        const container = document.getElementById('mod-asset');
        if (!container) return;
        container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">🏢 Asset Management</h2>
                <button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            <div class="glass p-4 rounded-xl">
                <h3 class="text-sm font-bold mb-3">📋 Asset List</h3>
                <div class="space-y-2">
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Laptop Dell #AST-001</div>
                        <div class="text-[10px] text-white/40">Ruang IT</div>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div class="text-xs">Proyektor Epson #AST-015</div>
                        <div class="text-[10px] text-white/40">Gudang</div>
                    </div>
                </div>
            </div>
        `;
    }
});

// ==========================================
// 🤖 AI CORE ENGINE (Hybrid 120B + Fallback)
// ==========================================
DreamOS.register('aiCore', {
    config: {
        // Priority: Local Ollama first, then fallback to cloud
        providers: [
            { id: 'ollama-local', name: 'Ollama Local', endpoint: 'http://localhost:11434', model: 'qwen2.5:0.5b', priority: 1, enabled: true },
            { id: 'openrouter', name: 'OpenRouter API', endpoint: 'https://openrouter.ai/api/v1', model: 'qwen/qwen-2.5-72b-instruct', priority: 2, enabled: true },
            { id: 'gemini', name: 'Gemini Flash', endpoint: 'https://generativelanguage.googleapis.com', model: 'gemini-2.0-flash', priority: 3, enabled: false }
        ],
        fallbackEnabled: true,
        maxRetries: 2,
        timeout: 30000
    },
    
    state: {
        currentProvider: null,
        isProcessing: false,
        history: []
    },
    
    async init() {
        const container = document.getElementById('ai-chat');
        if (!container) return;
                container.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">🤖 AI Core Engine</h2>
                <button onclick="DreamOS.modules.mainNav.showHome()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            <div class="glass p-3 rounded-xl mb-3">
                <div class="flex items-center gap-2 text-xs">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>AI Status: <span id="ai-status">Ready</span></span>
                    <span class="ml-auto text-white/40">Model: <span id="ai-model">qwen2.5:0.5b</span></span>
                </div>
            </div>
            <div id="ai-messages" class="glass p-4 rounded-xl h-64 overflow-y-auto space-y-3 mb-3"></div>
            <div class="flex gap-2">
                <input type="text" id="ai-input" class="form-control flex-1" placeholder="Tanya AI...">
                <button onclick="DreamOS.modules.aiCore.send()" class="btn-primary px-4">Send</button>
            </div>
        `;
        
        this.addMessage('system', '🤖 Dream OS AI Core ready. Hybrid mode: Local Ollama + Cloud fallback. Ask me anything!');
    },
    
    addMessage(role, content) {
        const container = document.getElementById('ai-messages');
        if (!container) return;
        const msg = document.createElement('div');
        msg.className = `p-3 rounded-lg ${role === 'user' ? 'bg-teal-500/20 ml-8' : 'bg-white/5 mr-8'}`;
        msg.innerHTML = `<div class="text-[10px] text-white/40 mb-1">${role === 'user' ? 'You' : 'AI'}</div><div class="text-sm whitespace-pre-wrap">${content}</div>`;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
        this.state.history.push({ role, content, timestamp: Date.now() });
    },
    
    async send() {
        const input = document.getElementById('ai-input');
        const query = input?.value.trim();
        if (!query || this.state.isProcessing) return;
        
        this.addMessage('user', query);
        input.value = '';
        this.state.isProcessing = true;
        document.getElementById('ai-status').textContent = 'Thinking...';
        
        try {
            // Try providers in priority order
            for (const provider of this.config.providers.filter(p => p.enabled)) {
                try {
                    const response = await this.queryProvider(provider, query);
                    if (response) {
                        this.addMessage('assistant', response);                        document.getElementById('ai-status').textContent = 'Ready';
                        document.getElementById('ai-model').textContent = provider.model;
                        this.state.currentProvider = provider.id;
                        return;
                    }
                } catch (e) {
                    console.warn(`Provider ${provider.id} failed:`, e);
                    if (!this.config.fallbackEnabled) throw e;
                }
            }
            // All providers failed
            this.addMessage('assistant', '❌ Semua AI provider tidak tersedia. Pastikan Ollama running atau cek koneksi internet untuk fallback.');
            document.getElementById('ai-status').textContent = 'Error';
        } catch (error) {
            console.error('AI Core error:', error);
            this.addMessage('assistant', '⚠️ Error: ' + error.message);
            document.getElementById('ai-status').textContent = 'Error';
        } finally {
            this.state.isProcessing = false;
        }
    },
    
    async queryProvider(provider, query) {
        // Local Ollama (priority 1)
        if (provider.id === 'ollama-local') {
            const response = await fetch(`${provider.endpoint}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: provider.model, prompt: query, stream: false }),
                signal: AbortSignal.timeout(this.config.timeout)
            });
            if (!response.ok) throw new Error('Ollama error');
            const data = await response.json();
            return data.response?.trim();
        }
        
        // OpenRouter fallback (priority 2)
        if (provider.id === 'openrouter') {
            const apiKey = localStorage.getItem('openrouter_key') || '';
            if (!apiKey) throw new Error('OpenRouter API key not set');
            
            const response = await fetch(`${provider.endpoint}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Dream OS'
                },
                body: JSON.stringify({                    model: provider.model,
                    messages: [{ role: 'user', content: query }],
                    max_tokens: 1024
                }),
                signal: AbortSignal.timeout(this.config.timeout)
            });
            if (!response.ok) throw new Error('OpenRouter error');
            const data = await response.json();
            return data.choices?.[0]?.message?.content?.trim();
        }
        
        return null;
    }
});

// Update nav button handlers for new modules
document.addEventListener('DOMContentLoaded', () => {
    // Update existing nav handlers
    document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Reset nav styles
            document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => {
                b.classList.remove('text-teal-400');
                b.classList.add('text-white/60');
            });
            this.classList.add('text-teal-400');
            this.classList.remove('text-white/60');
            
            const target = this.dataset.target;
            if (target === 'home') DreamOS.modules.mainNav.showHome();
            else if (target === 'menu') DreamOS.modules.mainNav.showCommandCenter();
            else if (target === 'config') DreamOS.run('i18n', 'showPicker');
            else if (target === 'user') DreamOS.run('auth', 'openProfile');
            else if (target === 'info') alert('ℹ️ Dream OS v1.3.1\n\nBuilt with ❤️ for Dream Team');
        });
    });
    
    // Add click handlers for menu grid items to open modules
    document.getElementById('menu-grid')?.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-card');
        if (!card) return;
        const label = card.querySelector('.text-center')?.textContent?.trim();
        
        const moduleMap = {
            'Command': () => DreamOS.modules.mainNav.showCommandCenter(),
            'Booking': () => { DreamOS.modules.mainNav.showModule('mod-booking'); DreamOS.modules.booking.init(); },
            'K3': () => { DreamOS.modules.mainNav.showModule('mod-k3'); DreamOS.modules.k3.init(); },
            'Security': () => { DreamOS.modules.mainNav.showModule('mod-security'); DreamOS.modules.security.init(); },
            'Janitor In': () => { DreamOS.modules.mainNav.showModule('mod-janitor-in'); DreamOS.modules.janitorIn.init(); },
            'Janitor Out': () => { DreamOS.modules.mainNav.showModule('mod-janitor-out'); DreamOS.modules.janitorOut.init(); },            'Stok': () => { DreamOS.modules.mainNav.showModule('mod-stok'); DreamOS.modules.stok.init(); },
            'Maintenance': () => { DreamOS.modules.mainNav.showModule('mod-maintenance'); DreamOS.modules.maintenance.init(); },
            'Asset': () => { DreamOS.modules.mainNav.showModule('mod-asset'); DreamOS.modules.asset.init(); }
        };
        
        if (moduleMap[label]) {
            moduleMap[label]();
        }
    });
    
    console.log('✅ All modules + AI Core Engine loaded!');
});
