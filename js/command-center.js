// Dream OS Command Center - Simple Inline Functions
function openCommandCenter() {
    console.log('🌍 Opening Command Center...');
    
    // Hide main content
    const stats = document.getElementById('stats-card');
    const carousel = document.getElementById('carousel-container');
    const menuGrid = document.getElementById('menu-grid');
    
    if (stats) stats.style.display = 'none';
    if (carousel) carousel.style.display = 'none';
    if (menuGrid) menuGrid.style.display = 'none';
    
    // Show command center
    const cmdCenter = document.getElementById('command-center');
    const cmdDashboard = document.getElementById('cmd-dashboard');
    
    if (cmdCenter) cmdCenter.style.display = 'block';
    
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
    const stats = document.getElementById('stats-card');    const carousel = document.getElementById('carousel-container');
    const menuGrid = document.getElementById('menu-grid');
    
    if (stats) stats.style.display = 'block';
    if (carousel) carousel.style.display = 'block';
    if (menuGrid) menuGrid.style.display = 'block';
    
    // Hide command center
    const cmdCenter = document.getElementById('command-center');
    if (cmdCenter) cmdCenter.style.display = 'none';
}

// Auto-bind to menu grid on load
document.addEventListener('DOMContentLoaded', function() {
    const menuGrid = document.getElementById('menu-grid');
    if (menuGrid) {
        // Find the "Command" card and add click handler
        const cards = menuGrid.querySelectorAll('.menu-card');
        cards.forEach(function(card) {
            const label = card.querySelector('.text-center');
            if (label && label.textContent.trim() === 'Command') {
                card.style.cursor = 'pointer';
                card.onclick = function() { openCommandCenter(); };
                console.log('✅ Command card bound to openCommandCenter()');
            }
        });
    }
});
