/**
 * Dream OS v1.3.1 - Complete Fix (Hybrid + i18n + All Features)
 */
let carouselInterval = null, currentSlide = 0, tapCount = 0, tapTimer = null;

// 🌐 TRANSLATIONS
const translations = {
    id: { appName: 'Dream OS', home: 'BERANDA', user: 'PENGGUNA', menu: 'MENU', info: 'INFO', config: 'PENGATURAN', statsTitle: 'Statistik Hari Ini', users: 'Total Pengguna', uptime: 'Waktu Aktif', logout: 'Keluar' },
    en: { appName: 'Dream OS', home: 'HOME', user: 'USER', menu: 'MENU', info: 'INFO', config: 'CONFIG', statsTitle: 'Today\'s Statistics', users: 'Total Users', uptime: 'Uptime', logout: 'Logout' },
    ar: { appName: 'Dream OS', home: 'الرئيسية', user: 'المستخدم', menu: 'القائمة', info: 'معلومات', config: 'الإعدادات', statsTitle: 'إحصائيات اليوم', users: 'إجمالي المستخدمين', uptime: 'وقت التشغيل', logout: 'تسجيل الخروج' }
};

// 🎠 7-SLIDE CAROUSEL (RESTORED)
const carouselData = [
    { icon: 'hand', title: 'Selamat Datang', text: 'Selamat datang Bapak/Ibu. Silahkan dipilih formnya sesuai kebutuhan.' },
    { icon: 'calendar', title: 'Jadwal Booking', text: 'Hari Ini: Rapat Koordinasi 09:00\nBesok: Kunjungan Yayasan 13:00' },
    { icon: 'activity', title: 'Progress K3', text: 'AC Ruang Rapat: 60% (Proses)\nKebersihan Lobby: 100% (Selesai)' },
    { icon: 'cloud-rain', title: 'Cuaca & AI', text: 'Cerah Berawan - 32°C\nPrediksi hujan 15:00 WIB' },
    { icon: 'building-2', title: 'Info Management', text: 'Rapat CEO & Yayasan\nPukul 09:00 WIB di Ruang Rapat SMA' },
    { icon: 'users', title: 'Info Team Umum', text: 'Rapat Mingguan\nJam 09:00 WIB di R. Koord Bagian Umum' },
    { icon: 'gift', title: 'Ucapan', text: '🎂 Selamat Ulang Tahun Pak Budi (Komisi 3 Bulan)' }
];

const menuItems = [
    { icon: '🌍', label: 'Command' }, { icon: '📅', label: 'Booking' }, { icon: '⚠️', label: 'K3' },
    { icon: '🔒', label: 'Security' }, { icon: '🧹', label: 'Janitor In' }, { icon: '🍃', label: 'Janitor Out' },
    { icon: '📦', label: 'Stok' }, { icon: '🔧', label: 'Maintenance' }, { icon: '🏢', label: 'Asset' }
];

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS Complete Fix Loaded');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    const savedLang = localStorage.getItem('dream-lang') || 'id';
    setLanguage(savedLang);
    
    initPasswordToggle(); initLogin(); initLogout(); initNav(); initGhostMode();    window.doLogin = doLogin; window.doLogout = doLogout; window.setLanguage = setLanguage;
});

// 🔐 PASSWORD TOGGLE
function initPasswordToggle() {
    const btn = document.getElementById('toggle-pw'), input = document.getElementById('access-key');
    if (btn && input) btn.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.textContent = isPass ? '🙈' : '👁️';
    });
}

// 🔑 LOGIN / LOGOUT
function initLogin() { const b = document.getElementById('btn-login'); if(b) b.addEventListener('click', doLogin); }
function doLogin() {
    const k = document.getElementById('access-key')?.value;
    if(!k) return alert('Masukkan Access Key!');
    document.getElementById('login-page').classList.remove('active'); document.getElementById('login-page').style.display='none';
    document.getElementById('dashboard').classList.add('active'); document.getElementById('dashboard').style.display='flex';
    const nav = document.getElementById('bottom-nav'); if(nav) nav.style.display='flex';
    renderCarousel(); renderMenuGrid(); renderGhostTools();
    if(typeof lucide!=='undefined') lucide.createIcons();
}
function initLogout() { const b = document.getElementById('btn-logout'); if(b) b.addEventListener('click', doLogout); }
function doLogout() {
    document.getElementById('dashboard').classList.remove('active'); document.getElementById('dashboard').style.display='none';
    document.getElementById('login-page').classList.add('active'); document.getElementById('login-page').style.display='flex';
    const nav = document.getElementById('bottom-nav'); if(nav) nav.style.display='none';
    document.getElementById('access-key').value=''; if(carouselInterval) clearInterval(carouselInterval);
}

// 🧭 NAVIGATION
function initNav() {
    document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => { b.classList.remove('text-teal-400'); b.classList.add('text-white/60'); });
            this.classList.add('text-teal-400'); this.classList.remove('text-white/60');
            const t = this.dataset.target;
            if(t==='menu') alert('📋 Quick Menu: Search, QR, Settings, Activity');
            else if(t==='config') showLangPicker();
            else alert(t.toUpperCase() + ' - Coming soon!');
        });
    });
}
function showLangPicker() {
    const c = localStorage.getItem('dream-lang')||'id';
    const opts = Object.keys(translations).map(l=>`${l===c?'🔘':'⚪'} ${l.toUpperCase()}`).join('\n');
    const pick = prompt(`Select Language:\n${opts}\n\nType code (id/en/ar):`, c);
    if(pick && translations[pick]) setLanguage(pick);}

// 🌐 I18N
function setLanguage(lang) {
    if(!translations[lang]) return;
    localStorage.setItem('dream-lang', lang);
    document.documentElement.lang = lang; document.documentElement.dir = lang==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if(translations[lang][k]) el.textContent = translations[lang][k];
    });
    document.body.style.fontFamily = lang==='ar' ? "'Amiri', serif" : "'Inter', sans-serif";
}

// 🎠 CAROUSEL (7 SLIDES)
function renderCarousel() {
    const c = document.getElementById('carousel-slides'), d = document.getElementById('carousel-dots');
    if(!c||!d) return;
    c.innerHTML = carouselData.map((s,i)=>`<div class="carousel-slide ${i===0?'active':''}"><div class="flex items-center gap-2 mb-1 text-teal-400"><i data-lucide="${s.icon}" class="w-4 h-4"></i><span class="font-bold text-xs">${s.title}</span></div><p class="text-xs text-white/60 whitespace-pre-line">${s.text}</p></div>`).join('');
    d.innerHTML = carouselData.map((_,i)=>`<div class="dot ${i===0?'active':''}" data-slide="${i}"></div>`).join('');
    d.querySelectorAll('.dot').forEach(dot => dot.addEventListener('click', function(){ goToSlide(parseInt(this.dataset.slide)); }));
    startCarousel(); if(typeof lucide!=='undefined') lucide.createIcons();
}
function startCarousel() { if(carouselInterval) clearInterval(carouselInterval); carouselInterval=setInterval(()=>{ currentSlide=(currentSlide+1)%carouselData.length; showSlide(currentSlide); }, 7000); }
function showSlide(i) { document.querySelectorAll('.carousel-slide').forEach(s=>s.classList.remove('active')); document.querySelectorAll('.dot').forEach(d=>d.classList.remove('active')); if(document.querySelectorAll('.carousel-slide')[i]) document.querySelectorAll('.carousel-slide')[i].classList.add('active'); if(document.querySelectorAll('.dot')[i]) document.querySelectorAll('.dot')[i].classList.add('active'); }
function goToSlide(i) { currentSlide=i; showSlide(i); startCarousel(); }

// 🔢 MENU GRID
function renderMenuGrid() {
    const c = document.getElementById('menu-grid'); if(!c) return;
    c.innerHTML = menuItems.map(m=>`<div class="menu-card p-3 rounded-xl flex flex-col items-center justify-center glass cursor-pointer min-h-[90px]"><div class="text-2xl mb-1">${m.icon}</div><div class="text-[10px] font-bold text-white text-center">${m.label}</div></div>`).join('');
    c.querySelectorAll('.menu-card').forEach((el,i)=> el.addEventListener('click',()=>alert(menuItems[i].label+' - Ready!')));
}

// 👻 GHOST MODE
function initGhostMode() {
    const logo = document.getElementById('dream-logo');
    if(logo) logo.addEventListener('pointerdown', function() {
        tapCount++;
        if(tapCount===1) tapTimer=setTimeout(()=>{tapCount=0;}, 2000);
        if(tapCount>=7) { clearTimeout(tapTimer); tapCount=0; document.getElementById('ghost-dashboard').classList.add('active'); }
    });
    const close = document.getElementById('close-ghost');
    if(close) close.addEventListener('click', ()=> document.getElementById('ghost-dashboard').classList.remove('active'));
}

function renderGhostTools() {
    const c = document.getElementById('ghost-tools'); if(!c) return;
    c.innerHTML = `
        <div class="ghost-card"><div class="flex justify-between items-center mb-3"><h3 class="text-base font-bold text-teal-400">💻 Eruda</h3><button id="eruda-btn" class="ghost-btn">INJECT</button></div></div>        <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🔍 OSINT</h3><div class="flex gap-2 mb-2"><input type="text" id="osint-user" placeholder="Username" class="term-input"><button id="osint-btn" class="ghost-btn">SCAN</button></div><div id="osint-res" class="hidden bg-black/50 p-3 rounded text-xs font-mono text-emerald-400"></div></div>
        <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🌐 Nmap</h3><div class="flex gap-2 mb-2"><input type="text" id="nmap-ip" placeholder="192.168.1.1" class="term-input"><button id="nmap-btn" class="ghost-btn">COPY</button></div></div>
        <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🕷️ Spider</h3><div class="flex gap-2 mb-2"><input type="text" id="spider-url" placeholder="https://target.com" class="term-input"><button id="spider-btn" class="ghost-btn">COPY</button></div></div>
        <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">🐉 Kali</h3><button id="kali-btn" class="ghost-btn w-full">INSTALL</button></div>
        <div class="ghost-card"><h3 class="text-base font-bold text-teal-400 mb-3">📡 TShark</h3><button id="tshark-btn" class="ghost-btn w-full bg-purple-500/20 text-purple-300">INSTALL</button></div>
    `;
    setTimeout(()=>{
        document.getElementById('eruda-btn')?.addEventListener('click', toggleEruda);
        document.getElementById('osint-btn')?.addEventListener('click', runOSINT);
        document.getElementById('nmap-btn')?.addEventListener('click', ()=>copyText(`nmap -sV -sC ${document.getElementById('nmap-ip')?.value||'127.0.0.1'}`));
        document.getElementById('spider-btn')?.addEventListener('click', ()=>copyText(`scrapy startproject target && cd target && scrapy genspider target ${document.getElementById('spider-url')?.value||'https://target.com'}`));
        document.getElementById('kali-btn')?.addEventListener('click', ()=>copyText('pkg install proot-distro && proot-distro install kali-linux'));
        document.getElementById('tshark-btn')?.addEventListener('click', ()=>copyText('pkg install tshark'));
    }, 100);
}

let erudaOn = false;
function toggleEruda() {
    const b=document.getElementById('eruda-btn'); if(!b) return;
    if(erudaOn) { if(typeof eruda!=='undefined') eruda.destroy(); erudaOn=false; b.textContent='INJECT'; }
    else { const s=document.createElement('script'); s.src="https://cdn.jsdelivr.net/npm/eruda"; s.onload=()=>{ if(typeof eruda!=='undefined'){eruda.init(); erudaOn=true; b.textContent='REMOVE';} }; document.body.appendChild(s); }
}
async function runOSINT() {
    const u=document.getElementById('osint-user')?.value, r=document.getElementById('osint-res'); if(!u||!r) return;
    r.classList.remove('hidden'); r.innerHTML='🔍 Scanning...';
    try { const d=await (await fetch(`https://api.github.com/users/${u}`)).json(); r.innerHTML = d.login?`✅ ${d.login}\n📍 ${d.location||'N/A'}\n🏢 ${d.bio||'N/A'}`:'❌ Not found'; } catch(e){ r.innerHTML='❌ Error'; }
}
function copyText(t) { navigator.clipboard.writeText(t).then(()=>alert('✅ Copied:\n'+t)).catch(()=>alert('📋 Copy:\n'+t)); }

console.log('✅ All systems restored!');
