/**
 * Dream OS v1.3.1 - Hybrid Structure (FINAL FIX)
 */
let userRole = 'STAFF', tapCount = 0, tapTimer = null, erudaActive = false, carouselInterval = null, currentSlide = 0;

const carouselSlides = [
    { icon: '👋', title: 'Selamat Datang', content: 'Selamat datang Bapak/Ibu. Silahkan dipilih formnya sesuai kebutuhan.' },
    { icon: '📅', title: 'Jadwal Booking', content: 'Hari Ini: Rapat Koordinasi - 09:00 WIB\nBesok: Kunjungan Yayasan - 13:00 WIB' },
    { icon: '📊', title: 'Progress K3', content: 'AC Ruang Rapat: 60% (Proses)\nKebersihan Lobby: 100% (Selesai)' },
    { icon: '🌤️', title: 'Cuaca', content: 'Cerah Berawan - 32°C\nPrediksi hujan 15:00' },
    { icon: '🏢', title: 'Info Management', content: 'Rapat CEO & Yayasan\nPukul 09:00 WIB di Ruang Rapat SMA' },
    { icon: '👥', title: 'Info Team Umum', content: 'Rapat Mingguan\nJam 09:00 WIB di R. Koord Bagian Umum' },
    { icon: '🎁', title: 'Ucapan', content: '🎂 Selamat Ulang Tahun Pak Budi (Komisi 3 Bulan)' }
];

const menuGrid = [
    { icon: '🌍', label: 'Command', desc: 'Operations' }, { icon: '📅', label: 'Booking', desc: 'Reserve' },
    { icon: '⚠️', label: 'K3', desc: 'Safety' }, { icon: '🔒', label: 'Security', desc: 'Manage' },
    { icon: '🧹', label: 'Janitor In', desc: 'Indoor' }, { icon: '🍃', label: 'Janitor Out', desc: 'Outdoor' },
    { icon: '📦', label: 'Stok', desc: 'Warehouse' }, { icon: '🔧', label: 'Maintenance', desc: 'Repair' },
    { icon: '🏢', label: 'Asset', desc: 'Building' }
];

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS v1.3.1 Loaded');
    initPasswordToggle();
    initLogin();
    initLogout();
    initNav();
    initGhostMode();
    initGhostTools();
    
    window.togglePassword = togglePassword;
    window.doLogin = doLogin;
    window.doLogout = doLogout;
    window.goToSlide = goToSlide;
    window.toggleEruda = toggleEruda;
    window.runOSINT = runOSINT;
    window.copyNmap = copyNmap;
    window.copySpider = copySpider;
    window.copyText = copyText;
    window.closeGhostMode = closeGhostMode;
});

function initPasswordToggle() {
    const btn = document.getElementById('toggle-pw');    const input = document.getElementById('access-key');
    if (btn && input) btn.addEventListener('click', togglePassword);
}

function togglePassword() {
    const input = document.getElementById('access-key');
    const btn = document.getElementById('toggle-pw');
    if (input && btn) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? '👁️' : '🙈';
    }
}

function initLogin() {
    const btn = document.getElementById('btn-login');
    if (btn) btn.addEventListener('click', doLogin);
}

function doLogin() {
    const input = document.getElementById('access-key');
    if (!input || !input.value) return alert('Masukkan Access Key!');
    
    userRole = (input.value.includes('admin') || input.value.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
    
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('bottom-nav').style.display = 'flex'; // SHOW BOTTOM NAV!
    
    initCarousel();
    renderMenuGrid();
}

function initLogout() {
    const btn = document.getElementById('btn-logout');
    if (btn) btn.addEventListener('click', doLogout);
}

function doLogout() {
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-page').classList.add('active');
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('bottom-nav').style.display = 'none'; // HIDE BOTTOM NAV!
    document.getElementById('access-key').value = '';
    if (carouselInterval) clearInterval(carouselInterval);
}

function initNav() {    const navBtns = document.querySelectorAll('#bottom-nav .nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            navBtns.forEach(b => { b.classList.remove('text-teal-400'); b.classList.add('text-white/60'); });
            this.classList.add('text-teal-400');
            this.classList.remove('text-white/60');
            const target = this.dataset.target;
            if (target !== 'home') alert(target.toUpperCase() + ' module - Coming soon!');
        });
    });
}

function initCarousel() {
    const container = document.getElementById('carousel-slides');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!container || !dotsContainer) return;
    
    container.innerHTML = carouselSlides.map((slide, i) => 
        `<div class="carousel-slide ${i === 0 ? 'active' : ''}">
            <div class="flex items-center gap-2 mb-2"><span class="text-3xl">${slide.icon}</span><h3 class="text-base font-bold">${slide.title}</h3></div>
            <p class="text-sm text-white/80 whitespace-pre-line">${slide.content}</p>
        </div>`
    ).join('');
    
    dotsContainer.innerHTML = carouselSlides.map((_, i) => 
        `<div class="dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`
    ).join('');
    
    dotsContainer.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', function() { goToSlide(parseInt(this.dataset.slide)); });
    });
    
    startCarousel();
}

function startCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % carouselSlides.length;
        showSlide(currentSlide);
    }, 7000);
}

function showSlide(index) {
    document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    if (document.querySelectorAll('.carousel-slide')[index]) document.querySelectorAll('.carousel-slide')[index].classList.add('active');
    if (document.querySelectorAll('.dot')[index]) document.querySelectorAll('.dot')[index].classList.add('active');
}
function goToSlide(index) { currentSlide = index; showSlide(currentSlide); startCarousel(); }

function renderMenuGrid() {
    const container = document.getElementById('menu-grid');
    if (!container) return;
    
    container.innerHTML = menuGrid.map(item => 
        `<div class="menu-card glass p-4 rounded-xl text-center cursor-pointer">
            <div class="text-4xl mb-2">${item.icon}</div>
            <div class="text-xs font-bold mb-1">${item.label}</div>
            <div class="text-[10px] text-white/60">${item.desc}</div>
        </div>`
    ).join('');
    
    container.querySelectorAll('.menu-card').forEach((card, index) => {
        card.addEventListener('click', () => alert(menuGrid[index].label + ' - Coming soon!'));
    });
}

function initGhostMode() {
    const logo = document.getElementById('dream-logo');
    if (logo) {
        logo.addEventListener('pointerdown', function() {
            tapCount++;
            if (tapCount === 1) tapTimer = setTimeout(() => { tapCount = 0; }, 2000);
            if (tapCount >= 7) { clearTimeout(tapTimer); tapCount = 0; openGhostMode(); }
        });
    }
    const closeBtn = document.getElementById('close-ghost');
    if (closeBtn) closeBtn.addEventListener('click', closeGhostMode);
}

function openGhostMode() { const d = document.getElementById('ghost-dashboard'); if (d) d.classList.add('active'); }
function closeGhostMode() { const d = document.getElementById('ghost-dashboard'); if (d) d.classList.remove('active'); }

function initGhostTools() {
    const container = document.getElementById('ghost-tools');
    if (!container) return;
    
    container.innerHTML = `
        <div class="ghost-card"><div class="flex justify-between items-center mb-4"><h3 class="text-xl font-bold text-teal-400">💻 Eruda</h3><button id="eruda-btn" class="ghost-btn">INJECT</button></div><div id="eruda-status" class="hidden text-xs text-emerald-400 font-mono bg-emerald-500/10 p-2 rounded">✅ ACTIVE</div></div>
        <div class="ghost-card"><h3 class="text-xl font-bold text-teal-400 mb-4">🔍 OSINT</h3><div class="flex gap-2 mb-3"><input type="text" id="osint-username" placeholder="Username" class="term-input"><button id="osint-btn" class="ghost-btn">SCAN</button></div><div id="osint-result" class="hidden bg-black/50 p-4 rounded text-sm font-mono text-emerald-400"></div></div>
        <div class="ghost-card"><h3 class="text-xl font-bold text-teal-400 mb-4">🌐 Nmap</h3><div class="flex gap-2 mb-2"><input type="text" id="nmap-target" placeholder="192.168.1.1" class="term-input"><button id="nmap-btn" class="ghost-btn">COPY</button></div></div>
        <div class="ghost-card"><h3 class="text-xl font-bold text-teal-400 mb-4">🕷️ Spider</h3><div class="flex gap-2 mb-2"><input type="text" id="spider-url" placeholder="https://target.com" class="term-input"><button id="spider-btn" class="ghost-btn">COPY</button></div></div>
        <div class="ghost-card"><h3 class="text-xl font-bold text-teal-400 mb-4">🐉 Kali</h3><button id="kali-btn" class="ghost-btn w-full">INSTALL</button></div>
        <div class="ghost-card"><h3 class="text-xl font-bold text-teal-400 mb-4">📡 TShark</h3><button id="tshark-btn" class="ghost-btn w-full bg-purple-500/20 text-purple-300">INSTALL</button></div>
    `;
    
    setTimeout(() => {
        document.getElementById('eruda-btn')?.addEventListener('click', toggleEruda);        document.getElementById('osint-btn')?.addEventListener('click', runOSINT);
        document.getElementById('nmap-btn')?.addEventListener('click', copyNmap);
        document.getElementById('spider-btn')?.addEventListener('click', copySpider);
        document.getElementById('kali-btn')?.addEventListener('click', () => copyText('pkg install proot-distro && proot-distro install kali-linux'));
        document.getElementById('tshark-btn')?.addEventListener('click', () => copyText('pkg install tshark'));
    }, 100);
}

function toggleEruda() {
    const btn = document.getElementById('eruda-btn'), status = document.getElementById('eruda-status');
    if (!btn) return;
    if (erudaActive) { if (typeof eruda !== 'undefined') eruda.destroy(); erudaActive = false; btn.textContent = 'INJECT'; if (status) status.classList.add('hidden'); }
    else { const script = document.createElement('script'); script.src = "https://cdn.jsdelivr.net/npm/eruda"; script.onload = () => { if (typeof eruda !== 'undefined') { eruda.init(); erudaActive = true; btn.textContent = 'REMOVE'; if (status) status.classList.remove('hidden'); } }; document.body.appendChild(script); }
}

async function runOSINT() {
    const input = document.getElementById('osint-username'), resultDiv = document.getElementById('osint-result');
    if (!input || !input.value) return alert('Enter username!'); if (!resultDiv) return;
    resultDiv.classList.remove('hidden'); resultDiv.innerHTML = '🔍 Scanning...';
    try { const res = await fetch(`https://api.github.com/users/${input.value}`), data = await res.json(); resultDiv.innerHTML = data.login ? `✅ User: ${data.login}\n📍 Loc: ${data.location||'N/A'}\n🏢 Bio: ${data.bio||'N/A'}` : '❌ Not found'; }
    catch (e) { resultDiv.innerHTML = '❌ Error'; }
}

function copyNmap() { const t = document.getElementById('nmap-target')?.value || '127.0.0.1'; copyText(`nmap -sV -sC ${t}`); }
function copySpider() { const u = document.getElementById('spider-url')?.value || 'https://target.com'; copyText(`scrapy startproject target && cd target && scrapy genspider target ${u}`); }
function copyText(text) { navigator.clipboard.writeText(text).then(() => alert('✅ Copied:\n\n' + text)).catch(() => alert('📋 Copy:\n\n' + text)); }

console.log('✅ All systems ready!');
