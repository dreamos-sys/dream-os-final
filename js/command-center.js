// Dream OS Command Center - FINAL FIX (Class-based toggle)

function openCommandCenter() {
    console.log('🌍 Opening Command Center...');
    
    // Hide main content using class
    const stats = document.getElementById('stats-card');
    const carousel = document.getElementById('carousel-container');
    const menuGrid = document.getElementById('menu-grid');
    
    if (stats) stats.style.display = 'none';
    if (carousel) carousel.style.display = 'none';
    if (menuGrid) menuGrid.style.display = 'none';
    
    // Show command center: REMOVE module-container class, ADD active
    const cmdCenter = document.getElementById('command-center');
    const cmdDashboard = document.getElementById('cmd-dashboard');
    
    if (cmdCenter) {
        cmdCenter.classList.remove('module-container');  // ← FIX: Remove class that has display:none
        cmdCenter.classList.add('active');                // ← Add active for display:block
        cmdCenter.style.display = 'block';                // ← Fallback inline style
    }
    
    if (cmdDashboard) {
        cmdDashboard.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-bold">🌍 Command Center</h2>
                <button onclick="showMain()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60 mb-1">Pending</div><div class="text-2xl font-bold text-amber-400">3</div></div>
                <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60 mb-1">Budget</div><div class="text-lg font-bold text-emerald-400">Rp 50Jt</div></div>
                <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60 mb-1">Indoor</div><div class="text-2xl font-bold text-blue-400">45</div></div>
                <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60 mb-1">Outdoor</div><div class="text-2xl font-bold text-green-400">23</div></div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10" onclick="alert('Approval Module')"><div class="text-3xl mb-2">✅</div><div class="text-xs font-bold">Approval</div></div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10" onclick="alert('Budget Module')"><div class="text-3xl mb-2">💰</div><div class="text-xs font-bold">Dana Umum</div></div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10" onclick="alert('SPJ Module')"><div class="text-3xl mb-2">📋</div><div class="text-xs font-bold">SPJ</div></div>
                <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10" onclick="alert('Reports Module')"><div class="text-3xl mb-2">📊</div><div class="text-xs font-bold">Laporan</div></div>
            </div>
        `;
    }
}
function showMain() {
    console.log('🏠 Showing Main Dashboard...');
    
    // Show main content
    const stats = document.getElementById('stats-card');
    const carousel = document.getElementById('carousel-container');
    const menuGrid = document.getElementById('menu-grid');
    
    if (stats) stats.style.display = 'block';
    if (carousel) carousel.style.display = 'block';
    if (menuGrid) menuGrid.style.display = 'block';
    
    // Hide command center: ADD module-container class back
    const cmdCenter = document.getElementById('command-center');
    if (cmdCenter) {
        cmdCenter.classList.add('module-container');  // ← FIX: Re-add class with display:none
        cmdCenter.classList.remove('active');
        cmdCenter.style.display = 'none';
    }
}

// Auto-bind to menu grid on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Binding Command card...');
    const menuGrid = document.getElementById('menu-grid');
    if (menuGrid) {
        const cards = menuGrid.querySelectorAll('.menu-card');
        cards.forEach(function(card) {
            const label = card.querySelector('.text-center');
            if (label && label.textContent.trim() === 'Command') {
                card.style.cursor = 'pointer';
                card.onclick = function() { 
                    console.log('🖱️ Command card clicked!');
                    openCommandCenter(); 
                };
                console.log('✅ Command card bound!');
            }
        });
    }
    
    // Also expose functions globally for console testing
    window.openCommandCenter = openCommandCenter;
    window.showMain = showMain;
    console.log('✅ Functions exposed to window');
});
