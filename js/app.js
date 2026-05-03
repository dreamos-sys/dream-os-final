/**
 * Dream OS v1.3.1 - User Environment (Hybrid)
 */
let carouselInterval = null, currentSlide = 0, tapCount = 0, tapTimer = null;

const carouselData = [
    { icon: 'calendar', title: 'Jadwal Agenda', text: '09:00 WIB - Rapat Koordinasi' },
    { icon: 'bell', title: 'Pengumuman', text: 'Maintenance server malam ini' },
    { icon: 'users', title: 'Team Update', text: 'Selamat datang member baru!' }
];

const menuItems = [
    { icon: '🌍', label: 'Command' }, { icon: '📅', label: 'Booking' }, { icon: '⚠️', label: 'K3' },
    { icon: '🔒', label: 'Security' }, { icon: '🧹', label: 'Janitor In' }, { icon: '🍃', label: 'Janitor Out' },
    { icon: '📦', label: 'Stok' }, { icon: '🔧', label: 'Maintenance' }, { icon: '🏢', label: 'Asset' }
];

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dream OS User Environment Loaded');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    initLogin(); initLogout(); initNav(); initGhostMode();
    window.doLogin = doLogin; window.doLogout = doLogout; window.openMenuModal = openMenuModal;
});

function initLogin() {
    const btn = document.getElementById('btn-login');
    if (btn) btn.addEventListener('click', doLogin);
}

function doLogin() {
    const key = document.getElementById('access-key')?.value;
    if (!key) return alert('Masukkan Access Key!');
    
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('dashboard').style.display = 'flex';
    
    const nav = document.getElementById('bottom-nav');
    if (nav) { nav.classList.remove('hidden'); nav.style.display = 'flex'; }
    
    renderCarousel(); renderMenuGrid();
    if (typeof lucide !== 'undefined') lucide.createIcons();}

function initLogout() {
    const btn = document.getElementById('btn-logout');
    if (btn) btn.addEventListener('click', doLogout);
}

function doLogout() {
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-page').classList.add('active');
    document.getElementById('login-page').style.display = 'flex';
    
    const nav = document.getElementById('bottom-nav');
    if (nav) { nav.classList.add('hidden'); nav.style.display = 'none'; }
    
    document.getElementById('access-key').value = '';
    if (carouselInterval) clearInterval(carouselInterval);
}

function initNav() {
    document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => {
                b.classList.remove('text-teal-400'); b.classList.add('text-white/60');
            });
            this.classList.add('text-teal-400'); this.classList.remove('text-white/60');
            if (this.dataset.target === 'menu') openMenuModal();
            else alert(this.dataset.target.toUpperCase() + ' - Coming soon!');
        });
    });
}

function renderCarousel() {
    const container = document.getElementById('carousel-slides');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!container || !dotsContainer) return;
    
    container.innerHTML = carouselData.map((s, i) => 
        `<div class="carousel-slide ${i===0?'active':''}">
            <div class="flex items-center gap-2 mb-1 text-teal-400">
                <i data-lucide="${s.icon}" class="w-4 h-4"></i>
                <span class="font-bold text-xs">${s.title}</span>
            </div>
            <p class="text-xs text-white/60">${s.text}</p>
        </div>`
    ).join('');
    
    dotsContainer.innerHTML = carouselData.map((_, i) => `<div class="dot ${i===0?'active':''}" data-slide="${i}"></div>`).join('');
        dotsContainer.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', function() { goToSlide(parseInt(this.dataset.slide)); });
    });
    
    startCarousel();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function startCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % carouselData.length;
        showSlide(currentSlide);
    }, 7000);
}

function showSlide(index) {
    document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    if (document.querySelectorAll('.carousel-slide')[index]) document.querySelectorAll('.carousel-slide')[index].classList.add('active');
    if (document.querySelectorAll('.dot')[index]) document.querySelectorAll('.dot')[index].classList.add('active');
}

function goToSlide(index) { currentSlide = index; showSlide(index); startCarousel(); }

function renderMenuGrid() {
    const container = document.getElementById('menu-grid');
    if (!container) return;
    
    container.innerHTML = menuItems.map(m => 
        `<div class="menu-card p-3 rounded-xl flex flex-col items-center justify-center glass cursor-pointer min-h-[90px]">
            <div class="text-2xl mb-1">${m.icon}</div>
            <div class="text-[10px] font-bold text-white text-center">${m.label}</div>
        </div>`
    ).join('');
    
    container.querySelectorAll('.menu-card').forEach((el, i) => {
        el.addEventListener('click', () => alert(menuItems[i].label + ' module - Ready!'));
    });
}

function openMenuModal() {
    alert('📋 Quick Menu:\n• Search\n• QR Scan\n• Settings\n• Activity\n\nComing soon!');
}

function initGhostMode() {
    const logo = document.getElementById('dream-logo');
    if (logo) {
        logo.addEventListener('pointerdown', function() {
            tapCount++;            if (tapCount === 1) tapTimer = setTimeout(() => { tapCount = 0; }, 2000);
            if (tapCount >= 7) {
                clearTimeout(tapTimer); tapCount = 0;
                const ghost = document.getElementById('ghost-dashboard');
                if (ghost) { ghost.classList.add('active'); alert('👻 Ghost Mode Activated!'); }
            }
        });
    }
}

console.log('✅ User Environment Ready!');
