// Dream OS Core v1.1 - Fixed Nano Modular
console.log('🧠 Dream OS Core loaded');
let taps = 0, tapTimer;

// Load module langsung dari string (tidak fetch) untuk hindari CORS
window.loadModuleInline = (id, htmlContent) => {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = htmlContent;
    const scripts = container.querySelectorAll('script');
    scripts.forEach(old => {
        const ns = document.createElement('script');
        ns.textContent = old.textContent;
        document.body.appendChild(ns);
    });
};

// Login
window.togglePass = () => {
    const inp = document.getElementById('pass');
    if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
};
window.login = () => {
    if (document.getElementById('pass').value !== 'b15m1ll4h_012443410') {
        alert('Password Salah!');
        return;
    }
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = '';
    renderDashboard();
};

// Ghost Mode
window.tapLogo = () => {
    taps++;
    const c = document.getElementById('tap-counter');
    if (c) { c.textContent = 'Tap ' + taps + '/7'; c.style.opacity = '1'; setTimeout(() => c.style.opacity = '0', 1500); }
    if (taps >= 7) { taps = 0; openGhostHub(); }
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => taps = 0, 2000);
};
window.openGhostHub = () => {
    const hub = document.getElementById('ghost-hub');
    if (!hub) return;
    hub.style.display = 'block';
    injectGhostTools();
};
window.hideGhostHub = () => {
    document.getElementById('ghost-hub').style.display = 'none';
};

// Ghost Tools
window.injectGhostTools = () => {
    const grid = document.getElementById('ghost-tools-inject');
    if (!grid) return;
    grid.innerHTML = '';
    const tools = [
        { l: '4S Mode', i: '🕌', c: '#2dd4bf', a: () => { if(typeof ShadowSoulSpirit!=='undefined')ShadowSoulSpirit.open4SMode();else{const s=document.createElement('script');s.src='js/modules/4s-developer.js';s.onload=()=>ShadowSoulSpirit.open4SMode();document.head.appendChild(s);} } },
        { l: 'Eruda', i: '💻', c: '#3b82f6', a: () => { if(typeof eruda=='undefined'){const s=document.createElement('script');s.src='//cdn.jsdelivr.net/npm/eruda';document.body.appendChild(s);s.onload=()=>eruda.init();}else eruda.show(); } },
        { l: 'Cookie', i: '🍪', c: '#f59e0b', a: () => log('Cookies: '+document.cookie.split(';').length) },
        { l: 'Session', i: '🔑', c: '#8b5cf6', a: () => log('Session: '+sessionStorage.length+' keys') },
        { l: 'LocalDB', i: '🗄️', c: '#06b6d4', a: () => log('Local: '+localStorage.length+' keys') },
        { l: 'Network', i: '📡', c: '#10b981', a: () => log('📡 '+(navigator.onLine?'Online':'Offline')) },
        { l: 'GPS', i: '🛰️', c: '#ef4444', a: () => { navigator.geolocation.getCurrentPosition(p=>log('🛰️ '+p.coords.latitude.toFixed(4)+','+p.coords.longitude.toFixed(4)),e=>log('🛰️ '+e.message)); } },
        { l: 'Shalawat', i: '💖', c: '#ec4899', a: () => { let c=parseInt(localStorage.getItem('shalawat_count')||'0')+1; localStorage.setItem('shalawat_count',c); log('💖 '+c); } },
        { l: 'Threat', i: '🔥', c: '#f97316', a: () => log('🔥 Armed') },
        { l: 'Health', i: '📊', c: '#22c55e', a: () => log('📊 OK') },
        { l: 'Backup', i: '💾', c: '#6366f1', a: () => log('💾 Ready') },
        { l: 'Quantum', i: '⚡', c: '#eab308', a: () => log('⚡ Active') },
        { l: 'NMAP', i: '🕸️', c: '#8b5cf6', a: () => log('🕸️ Ready') },
        { l: 'Shark', i: '🦈', c: '#06b6d4', a: () => log('🦈 Ready') },
        { l: 'OSINT', i: '🕷️', c: '#ec4899', a: () => log('🕷️ Ready') },
        { l: 'Bridge', i: '🔌', c: '#10b981', a: () => log('🔌 Connected') }
    ];
    grid.innerHTML = tools.map(t => 
        `<button onclick="(${t.a.toString()})()" style="background:#1e293b;border:2px solid ${t.c};border-radius:12px;padding:16px 8px;text-align:center;cursor:pointer;color:white;min-height:75px;" onmouseenter="this.style.background='#2d3a4a'" onmouseleave="this.style.background='#1e293b'">
            <div style="font-size:2rem;margin-bottom:6px;">${t.i}</div>
            <div style="font-size:0.65rem;font-weight:600;color:#94a3b8;">${t.l}</div>
        </button>`
    ).join('');
};

// Dashboard
window.renderDashboard = () => {
    const grid = document.getElementById('module-grid');
    if (!grid) return;
    const modules = [
        { i: '📊', n: 'CMD Center', id: 'cmd', b: '#3b82f6' },
        { i: '📅', n: 'Booking', id: 'book', b: '#f59e0b' },
        { i: '⚠️', n: 'K3 Safety', id: 'k3', b: '#ef4444' },
        { i: '🛡️', n: 'Security', id: 'sec', b: '#8b5cf6' },
        { i: '🧹', n: 'Jan In', id: 'in', b: '#10b981' },
        { i: '🌿', n: 'Jan Out', id: 'out', b: '#22c55e' },
        { i: '📦', n: 'Stok', id: 'stok', b: '#eab308' },
        { i: '🔧', n: 'Maint', id: 'maint', b: '#f97316' },
        { i: '🏢', n: 'Asset', id: 'asset', b: '#06b6d4' }
    ];
    grid.innerHTML = modules.map(m => 
        `<div onclick="openMod('${m.id}')" style="background:linear-gradient(135deg,#1e293b,#0f172a);border:2px solid ${m.b}40;border-radius:1rem;padding:1.25rem 0.75rem;text-align:center;cursor:pointer;transition:all 0.3s;box-shadow:0 0 20px ${m.b}30;" onmouseenter="this.style.transform='translateY(-4px)';this.style.borderColor='${m.b}';" onmouseleave="this.style.transform='translateY(0)';this.style.borderColor='${m.b}40';">
            <div style="font-size:2rem;margin-bottom:0.5rem;">${m.i}</div>
            <p style="color:#e2e8f0;font-size:0.7rem;font-weight:700;">${m.n}</p>
        </div>`
    ).join('');
};
window.openMod = (id) => {
    if (id === 'book') {
        let container = document.getElementById('booking-module');
        if (!container) {
            container = document.createElement('div');
            container.id = 'booking-module';
            container.style.cssText = 'position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#0f172a;';
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        fetch('js/modules/booking.html').then(function(r){return r.text();}).then(function(h){
            container.innerHTML = h;
            var scripts = container.querySelectorAll('script');
            scripts.forEach(function(old){
                var ns = document.createElement('script');
                ns.textContent = old.textContent;
                document.body.appendChild(ns);
            });
        }).catch(function(){
            container.innerHTML = '<div style="color:red;padding:2rem;text-align:center;">Gagal memuat modul booking</div>';
        });
        return;
    }
    if (id === 'k3') {
        let container = document.getElementById('k3-module');
        if (!container) {
            container = document.createElement('div');
            container.id = 'k3-module';
            container.style.cssText = 'position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#0f172a;';
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        fetch('js/modules/k3.html').then(function(r){return r.text();}).then(function(h){
            container.innerHTML = h;
            var scripts = container.querySelectorAll('script');
            scripts.forEach(function(old){
                var ns = document.createElement('script');
                ns.textContent = old.textContent;
                document.body.appendChild(ns);
            });
        }).catch(function(){
            container.innerHTML = '<div style="color:red;padding:2rem;text-align:center;">Gagal memuat modul K3</div>';
        });
        return;
    }
    if (id === 'in') {
        let container = document.getElementById('janitor-in-module');
        if (!container) {
            container = document.createElement('div');
            container.id = 'janitor-in-module';
            container.style.cssText = 'position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#0f172a;';
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        fetch('js/modules/janitor-indoor.html').then(function(r){return r.text();}).then(function(h){
            container.innerHTML = h;
            var scripts = container.querySelectorAll('script');
            scripts.forEach(function(old){
                var ns = document.createElement('script');
                ns.textContent = old.textContent;
                document.body.appendChild(ns);
            });
        }).catch(function(){
            container.innerHTML = '<div style="color:red;padding:2rem;text-align:center;">Gagal memuat modul Janitor Indoor</div>';
        });
        return;
    }
    if (id === 'out') {
        let container = document.getElementById('janitor-out-module');
        if (!container) {
            container = document.createElement('div');
            container.id = 'janitor-out-module';
            container.style.cssText = 'position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#0f172a;';
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        fetch('js/modules/janitor-outdoor.html').then(function(r){return r.text();}).then(function(h){
            container.innerHTML = h;
            var scripts = container.querySelectorAll('script');
            scripts.forEach(function(old){
                var ns = document.createElement('script');
                ns.textContent = old.textContent;
                document.body.appendChild(ns);
            });
        }).catch(function(){
            container.innerHTML = '<div style="color:red;padding:2rem;text-align:center;">Gagal memuat modul Janitor Outdoor</div>';
        });
        return;
    }
    if (id === 'maint') {
        let container = document.getElementById('maintenance-module');
        if (!container) {
            container = document.createElement('div');
            container.id = 'maintenance-module';
            container.style.cssText = 'position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#0f172a;';
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        fetch('js/modules/maintenance.html').then(function(r){return r.text();}).then(function(h){
            container.innerHTML = h;
            var scripts = container.querySelectorAll('script');
            scripts.forEach(function(old){
                var ns = document.createElement('script');
                ns.textContent = old.textContent;
                document.body.appendChild(ns);
            });
        }).catch(function(){
            container.innerHTML = '<div style="color:red;padding:2rem;text-align:center;">Gagal memuat modul Maintenance</div>';
        });
        return;
    }
    if (id === 'sec') {
        let container = document.getElementById('security-module');
        if (!container) {
            container = document.createElement('div');
            container.id = 'security-module';
            container.style.cssText = 'position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#0f172a;';
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        fetch('js/modules/security.html').then(function(r){return r.text();}).then(function(h){
            container.innerHTML = h;
            var scripts = container.querySelectorAll('script');
            scripts.forEach(function(old){
                var ns = document.createElement('script');
                ns.textContent = old.textContent;
                document.body.appendChild(ns);
            });
        }).catch(function(){
            container.innerHTML = '<div style="color:red;padding:2rem;text-align:center;">Gagal memuat modul Security</div>';
        });
        return;
    }
    if (id === 'stok') {
        let container = document.getElementById('stok-module');
        if (!container) {
            container = document.createElement('div');
            container.id = 'stok-module';
            container.style.cssText = 'position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#0f172a;';
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        fetch('js/modules/stok.html').then(function(r){return r.text();}).then(function(h){
            container.innerHTML = h;
            var scripts = container.querySelectorAll('script');
            scripts.forEach(function(old){
                var ns = document.createElement('script');
                ns.textContent = old.textContent;
                document.body.appendChild(ns);
            });
        }).catch(function(){
            container.innerHTML = '<div style="color:red;padding:2rem;text-align:center;">Gagal memuat modul Stok</div>';
        });
        return;
    }
    if (id === 'asset') {
        let container = document.getElementById('asset-module');
        if (!container) {
            container = document.createElement('div');
            container.id = 'asset-module';
            container.style.cssText = 'position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#0f172a;';
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        fetch('js/modules/asset.html').then(function(r){return r.text();}).then(function(h){
            container.innerHTML = h;
            var scripts = container.querySelectorAll('script');
            scripts.forEach(function(old){
                var ns = document.createElement('script');
                ns.textContent = old.textContent;
                document.body.appendChild(ns);
            });
        }).catch(function(){
            container.innerHTML = '<div style="color:red;padding:2rem;text-align:center;">Gagal memuat modul Asset</div>';
        });
        return;
    }
    if (id === 'cmd') {
        let container = document.getElementById('cmd-module');
        if (!container) {
            container = document.createElement('div');
            container.id = 'cmd-module';
            container.style.cssText = 'position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#0f172a;';
            document.body.appendChild(container);
        }
        container.style.display = 'block';
        fetch('js/modules/commandcenter.html').then(function(r){return r.text();}).then(function(h){
            container.innerHTML = h;
            var scripts = container.querySelectorAll('script');
            scripts.forEach(function(old){
                var ns = document.createElement('script');
                ns.textContent = old.textContent;
                document.body.appendChild(ns);
            });
        }).catch(function(){
            container.innerHTML = '<div style="color:red;padding:2rem;text-align:center;">Gagal memuat Command Center</div>';
        });
        return;
    }
    var names = {cmd:'Command Center',book:'Booking',k3:'K3 Safety',in:'Janitor Indoor',out:'Janitor Outdoor',maint:'Maintenance',sec:'Security',stok:'Stok & Inventaris',asset:'Asset & Gudang'};
    alert('📂 ' + (names[id]||id.toUpperCase()) + '\n\nComing soon in v2.0');
};;;;;;;;;;;;
window.nav = (name) => { if (name !== 'HOME') alert('Navigasi: ' + name); };

// Log
window.log = (msg) => {
    const el = document.getElementById('ghost-log');
    if (el) { el.innerHTML += '> ' + msg + '\n'; el.scrollTop = el.scrollHeight; }
};

// Init - render langsung tanpa fetch
document.addEventListener('DOMContentLoaded', () => {
    // Login HTML langsung
    loadModuleInline('login-container', '<div id="login-screen" class="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-100 via-white to-emerald-50"><div class="text-center mb-10"><img src="assets/logo-sultan.png" class="w-24 h-24 mx-auto rounded-3xl border-2 border-amber-400/40 shadow-2xl mb-6 cursor-pointer" onclick="tapLogo()" onerror="this.style.display=\'none\'"><p class="text-5xl font-bold text-emerald-600 arabic-glow mb-3" style="font-family:\'Amiri\',serif">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p><p class="text-lg text-emerald-600/80 italic" style="font-family:\'Amiri\',serif">اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ</p><p class="text-xs text-gray-500 mt-4 font-semibold">Dream OS • v1.0 Limited Edition 2026</p></div><div class="w-full max-w-xs space-y-4"><div class="glass-light rounded-2xl p-1 flex items-center pr-3"><input type="password" id="pass" class="flex-1 p-4 bg-white/60 text-center outline-none font-mono tracking-[0.3em] text-emerald-600 placeholder-gray-400 rounded-xl" placeholder="••••"><button onclick="togglePass()" class="p-2 text-gray-400 hover:text-emerald-600 transition"><span id="eye">👁️</span></button></div><button onclick="login()" class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg transition active:scale-95 text-sm tracking-widest uppercase">Access Core</button></div><div id="tap-counter" class="text-xs text-emerald-600 font-mono mt-4 opacity-0 font-semibold">Tap 0/7</div></div>');
    
    // Dashboard HTML langsung
    loadModuleInline('dashboard-container', '<div id="main-app" style="display:none;min-height:100vh;background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%);font-family:\'Inter\',sans-serif;"><header style="padding:2rem 1.5rem 1rem;text-align:center;background:linear-gradient(180deg,rgba(16,185,129,0.15),transparent);border-bottom:1px solid rgba(16,185,129,0.2);backdrop-filter:blur(20px);"><img src="assets/logo-sultan.png" style="width:56px;height:56px;border-radius:16px;border:2px solid rgba(251,191,36,0.4);box-shadow:0 0 30px rgba(16,185,129,0.3);cursor:pointer;margin-bottom:0.75rem;" onclick="tapLogo()" onerror="this.style.display=\'none\'"><p style="font-size:1.8rem;font-weight:800;color:#2dd4bf;text-shadow:0 0 30px rgba(45,212,191,0.4);margin-bottom:0.25rem;font-family:\'Amiri\',serif;">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p><p style="font-size:0.8rem;color:rgba(45,212,191,0.7);font-style:italic;font-family:\'Amiri\',serif;">اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ</p><div style="display:flex;justify-content:center;gap:0.75rem;margin-top:1rem;flex-wrap:wrap;"><span style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);padding:0.5rem 1rem;border-radius:2rem;font-size:0.7rem;color:#2dd4bf;font-weight:600;">🕌 Dzuhur</span><span style="background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);padding:0.5rem 1rem;border-radius:2rem;font-size:0.7rem;color:#818cf8;font-weight:600;">⏱️ <span id="countdown">00:00:00</span></span><span style="background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);padding:0.5rem 1rem;border-radius:2rem;font-size:0.7rem;color:#4ade80;font-weight:600;">🔋 47%</span></div></header><main style="padding:1.5rem;padding-bottom:6rem;"><div style="background:rgba(30,41,59,0.6);border:1px solid rgba(45,212,191,0.2);border-radius:1.5rem;padding:1.25rem;margin-bottom:1.5rem;backdrop-filter:blur(10px);"><h3 style="color:#2dd4bf;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-align:center;margin-bottom:0.5rem;">Today\'s Booking</h3><p style="color:#94a3b8;font-size:0.8rem;text-align:center;">No bookings today</p></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;" id="module-grid"></div></main><nav style="position:fixed;bottom:0;left:0;right:0;height:4rem;background:rgba(15,23,42,0.95);border-top:1px solid rgba(45,212,191,0.2);display:flex;justify-content:space-around;align-items:center;z-index:40;backdrop-filter:blur(20px);"><button onclick="nav(\'HOME\')" style="color:#2dd4bf;display:flex;flex-direction:column;align-items:center;font-size:0.65rem;font-weight:600;"><span style="font-size:1.3rem;">🏠</span>Home</button><button onclick="nav(\'PROFILE\')" style="color:#94a3b8;display:flex;flex-direction:column;align-items:center;font-size:0.65rem;font-weight:600;"><span style="font-size:1.3rem;">👤</span>Profile</button><button onclick="nav(\'QR\')" style="color:#94a3b8;display:flex;flex-direction:column;align-items:center;font-size:0.65rem;font-weight:600;"><span style="font-size:1.3rem;">📱</span>QR</button><button onclick="nav(\'ABOUT\')" style="color:#94a3b8;display:flex;flex-direction:column;align-items:center;font-size:0.65rem;font-weight:600;"><span style="font-size:1.3rem;">ℹ️</span>About</button><button onclick="nav(\'SETTING\')" style="color:#94a3b8;display:flex;flex-direction:column;align-items:center;font-size:0.65rem;font-weight:600;"><span style="font-size:1.3rem;">⚙️</span>Setting</button></nav></div>');
    
    // Ghost Hub HTML langsung
    loadModuleInline('ghost-container', '<div id="ghost-hub" style="display:none;position:fixed;inset:0;z-index:99999;background:linear-gradient(135deg,#0a0e27,#1a1f3a,#0f1419);overflow-y:auto;font-family:\'Segoe UI\',Roboto,Arial,sans-serif;"><div style="background:linear-gradient(90deg,rgba(15,23,42,0.95),rgba(30,41,59,0.95));border-bottom:2px solid #2dd4bf;padding:1rem 1.25rem;display:flex;justify-content:space-between;align-items:center;backdrop-filter:blur(10px);"><div style="display:flex;align-items:center;gap:0.75rem;"><div style="width:40px;height:40px;background:linear-gradient(135deg,#2dd4bf,#06b6d4);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;box-shadow:0 0 20px rgba(45,212,191,0.5);">🕌</div><div><h2 style="color:#2dd4bf;font-size:1rem;font-weight:800;margin:0;letter-spacing:0.5px;">4S DevOps Center</h2><p style="color:#64748b;font-size:0.6rem;margin:0;">Shadow Soul Spirit • v2.0</p></div></div><div style="display:flex;gap:0.75rem;align-items:center;"><span style="display:flex;align-items:center;gap:0.3rem;color:#10b981;font-size:0.65rem;font-weight:600;"><span style="width:6px;height:6px;background:#10b981;border-radius:50%;animation:pulse 2s infinite;"></span>ONLINE</span><button onclick="hideGhostHub()" style="background:linear-gradient(135deg,#ef4444,#dc2626);color:white;border:none;padding:0.5rem 1rem;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.75rem;box-shadow:0 4px 15px rgba(239,68,68,0.3);">✕</button></div></div><div style="padding:1rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(85px,1fr));gap:8px;" id="ghost-tools-inject"></div><div style="margin:0 1rem 1rem;background:rgba(0,0,0,0.8);border:1px solid rgba(45,212,191,0.3);border-radius:12px;padding:0.75rem;font-family:\'Courier New\',monospace;font-size:0.7rem;color:#2dd4bf;height:120px;overflow-y:auto;" id="ghost-log"><div style="color:#64748b;">> 4S DevOps Center ready...</div></div></div>');
});
