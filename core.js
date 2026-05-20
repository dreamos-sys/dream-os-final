// Dream OS Core v1.0 - Nano Modular System
console.log('🧠 Dream OS Core loaded');

// === GLOBAL STATE ===
let taps = 0, tapTimer;

// === MODULE LOADER ===
window.loadModule = async (id, url) => {
    const container = document.getElementById(id);
    if (!container) return;
    try {
        const res = await fetch(url);
        const html = await res.text();
        container.innerHTML = html;
        // Execute scripts
        const scripts = container.querySelectorAll('script');
        scripts.forEach(old => {
            const ns = document.createElement('script');
            ns.textContent = old.textContent;
            document.body.appendChild(ns);
        });
    } catch(e) {
        console.error('Failed to load module:', id, e);
    }
};

// === LOGIN ===
window.togglePass = () => {
    const inp = document.getElementById('pass');
    if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
};

window.login = () => {
    if (document.getElementById('pass').value !== 'b15m1ll4h_012443410') {
        alert('❌ Password Salah!');
        return;
    }
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    renderDashboard();
};

// === GHOST MODE ===
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

window.injectGhostTools = () => {
    const grid = document.getElementById('ghost-tools-inject');
    if (!grid) return;
    // Hapus isi lama dulu (hindari double)
    grid.innerHTML = '';
    
    const tools = [
        { l: '4S Mode', i: '🕌', c: '#2dd4bf', a: () => { if(typeof ShadowSoulSpirit!=='undefined')ShadowSoulSpirit.open4SMode();else{const s=document.createElement('script');s.src='js/modules/4s-developer.js';s.onload=()=>ShadowSoulSpirit.open4SMode();document.head.appendChild(s);} } },
        { l: 'Eruda', i: '💻', c: '#3b82f6', a: () => { if(typeof eruda=='undefined'){const s=document.createElement('script');s.src='//cdn.jsdelivr.net/npm/eruda';document.body.appendChild(s);s.onload=()=>eruda.init();}else eruda.show(); } },
        { l: 'Cookie', i: '🍪', c: '#f59e0b', a: () => log('🍪 Cookies: '+document.cookie.split(';').length) },
        { l: 'Session', i: '🔑', c: '#8b5cf6', a: () => log('🔑 Session: '+sessionStorage.length+' keys') },
        { l: 'LocalDB', i: '🗄️', c: '#06b6d4', a: () => log('🗄️ Local: '+localStorage.length+' keys') },
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
        `<button onclick="(${t.a.toString()})()" style="background:#1e293b;border:2px solid ${t.c};border-radius:12px;padding:16px 8px;text-align:center;cursor:pointer;color:white;min-height:75px;transition:all 0.2s;" onmouseenter="this.style.background='#2d3a4a'" onmouseleave="this.style.background='#1e293b'">
            <div style="font-size:2rem;margin-bottom:6px;">${t.i}</div>
            <div style="font-size:0.65rem;font-weight:600;color:#94a3b8;">${t.l}</div>
        </button>`
    ).join('');
};
    const grid = document.getElementById('ghost-tools-inject');
    if (!grid) return;
    
    const tools = [
        { l: '4S', i: '🕌', a: () => { if(typeof ShadowSoulSpirit!=='undefined')ShadowSoulSpirit.open4SMode();else{const s=document.createElement('script');s.src='js/modules/4s-developer.js';s.onload=()=>ShadowSoulSpirit.open4SMode();document.head.appendChild(s);} } },
        { l: 'Eruda', i: '💻', a: () => { if(typeof eruda=='undefined'){const s=document.createElement('script');s.src='//cdn.jsdelivr.net/npm/eruda';document.body.appendChild(s);s.onload=()=>eruda.init();}else eruda.show(); } },
        { l: 'Cookie', i: '🍪', a: () => log('🍪 Cookies: '+document.cookie.split(';').length) },
        { l: 'Session', i: '🔑', a: () => log('🔑 Session: '+sessionStorage.length+' keys') },
        { l: 'LocalDB', i: '🗄️', a: () => log('🗄️ Local: '+localStorage.length+' keys') },
        { l: 'Network', i: '📡', a: () => log('📡 '+(navigator.onLine?'Online':'Offline')) },
        { l: 'GPS', i: '🛰️', a: () => { navigator.geolocation.getCurrentPosition(p=>log('🛰️ '+p.coords.latitude.toFixed(4)+','+p.coords.longitude.toFixed(4)),e=>log('🛰️ '+e.message)); } },
        { l: 'Shalawat', i: '💖', a: () => { let c=parseInt(localStorage.getItem('shalawat_count')||'0')+1; localStorage.setItem('shalawat_count',c); log('💖 '+c); } },
        { l: 'Threat', i: '🔥', a: () => log('🔥 Armed') },
        { l: 'Health', i: '📊', a: () => log('📊 OK') },
        { l: 'Backup', i: '💾', a: () => log('💾 Ready') },
        { l: 'Quantum', i: '⚡', a: () => log('⚡ Active') },
        { l: 'NMAP', i: '🕸️', a: () => log('🕸️ Ready') },
        { l: 'Shark', i: '🦈', a: () => log('🦈 Ready') },
        { l: 'OSINT', i: '🕷️', a: () => log('🕷️ Ready') },
        { l: 'Bridge', i: '🔌', a: () => log('🔌 Connected') }
    ];
    
    grid.innerHTML = tools.map(t => 
        `<button onclick="(${t.a.toString()})()" style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 8px;text-align:center;cursor:pointer;color:white;min-height:65px;" onmouseenter="this.style.background='#2d3a4a'" onmouseleave="this.style.background='#1e293b'">
            <div style="font-size:1.5rem;">${t.i}</div>
            <div style="font-size:0.6rem;color:#94a3b8;margin-top:4px;">${t.l}</div>
        </button>`
    ).join('');
};

// === DASHBOARD ===
window.renderDashboard = () => {
    const grid = document.getElementById('module-grid');
    if (!grid) return;
    
    const modules = [
        { i: '📊', n: 'CMD Center', id: 'cmd', g: 'linear-gradient(135deg,#1e293b,#0f172a)', b: '#3b82f6', s: '0 0 20px rgba(59,130,246,0.3)' },
        { i: '📅', n: 'Booking', id: 'book', g: 'linear-gradient(135deg,#1e293b,#0f172a)', b: '#f59e0b', s: '0 0 20px rgba(245,158,11,0.3)' },
        { i: '⚠️', n: 'K3 Safety', id: 'k3', g: 'linear-gradient(135deg,#1e293b,#0f172a)', b: '#ef4444', s: '0 0 20px rgba(239,68,68,0.3)' },
        { i: '🛡️', n: 'Security', id: 'sec', g: 'linear-gradient(135deg,#1e293b,#0f172a)', b: '#8b5cf6', s: '0 0 20px rgba(139,92,246,0.3)' },
        { i: '🧹', n: 'Jan In', id: 'in', g: 'linear-gradient(135deg,#1e293b,#0f172a)', b: '#10b981', s: '0 0 20px rgba(16,185,129,0.3)' },
        { i: '🌿', n: 'Jan Out', id: 'out', g: 'linear-gradient(135deg,#1e293b,#0f172a)', b: '#22c55e', s: '0 0 20px rgba(34,197,94,0.3)' },
        { i: '📦', n: 'Stok', id: 'stok', g: 'linear-gradient(135deg,#1e293b,#0f172a)', b: '#eab308', s: '0 0 20px rgba(234,179,8,0.3)' },
        { i: '🔧', n: 'Maint', id: 'maint', g: 'linear-gradient(135deg,#1e293b,#0f172a)', b: '#f97316', s: '0 0 20px rgba(249,115,22,0.3)' },
        { i: '🏢', n: 'Asset', id: 'asset', g: 'linear-gradient(135deg,#1e293b,#0f172a)', b: '#06b6d4', s: '0 0 20px rgba(6,182,212,0.3)' }
    ];
    
    grid.innerHTML = modules.map(m => 
        `<div onclick="openMod('${m.id}')" style="background:${m.g};border:2px solid ${m.b}40;border-radius:1rem;padding:1.25rem 0.75rem;text-align:center;cursor:pointer;transition:all 0.3s;box-shadow:${m.s};" onmouseenter="this.style.transform='translateY(-4px)';this.style.borderColor='${m.b}';this.style.boxShadow='${m.s}, 0 8px 30px ${m.b}40';" onmouseleave="this.style.transform='translateY(0)';this.style.borderColor='${m.b}40';this.style.boxShadow='${m.s}';">
            <div style="font-size:2rem;margin-bottom:0.5rem;">${m.i}</div>
            <p style="color:#e2e8f0;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${m.n}</p>
        </div>`
    ).join('');
};
    const grid = document.getElementById('module-grid');
    if (!grid) return;
    const modules = [
        { i: '📊', n: 'CMD', id: 'cmd' },
        { i: '📅', n: 'Booking', id: 'book' },
        { i: '⚠️', n: 'K3', id: 'k3' },
        { i: '🛡️', n: 'Security', id: 'sec' },
        { i: '🧹', n: 'Jan In', id: 'in' },
        { i: '🌿', n: 'Jan Out', id: 'out' },
        { i: '📦', n: 'Stok', id: 'stok' },
        { i: '🔧', n: 'Maint', id: 'maint' },
        { i: '🏢', n: 'Asset', id: 'asset' }
    ];
    grid.innerHTML = modules.map(m => 
        `<div onclick="openMod('${m.id}')" class="glass-light p-4 rounded-2xl text-center cursor-pointer">
            <span class="text-2xl block mb-1">${m.i}</span>
            <p class="text-xs font-bold text-gray-700">${m.n}</p>
        </div>`
    ).join('');
};

window.openMod = (id) => alert('Module: ' + id.toUpperCase());
window.nav = (name) => { if (name !== 'HOME') alert('Navigasi: ' + name); };

// === LOG ===
window.log = (msg) => {
    const el = document.getElementById('ghost-log');
    if (el) { el.innerHTML += '> ' + msg + '\n'; el.scrollTop = el.scrollHeight; }
};

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    // Load modules
    loadModule('login-container', 'js/modules/login.html');
    loadModule('dashboard-container', 'js/modules/dashboard.html');
    loadModule('ghost-container', 'js/modules/ghost-hub.html');
});
