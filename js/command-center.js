/**
 * Dream OS Command Center — GUARANTEED WORKING v2
 * Karpathy-Style: Simple, verifiable, surgical
 */
(function() {
    'use strict';
    
    // Global functions (exposed to window for manual testing)
    window.openCommandCenter = function() {
        console.log('🌍 [CC] openCommandCenter() called');
        
        // Hide main dashboard elements
        ['stats-card','carousel-container','menu-grid'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; console.log(`[CC] Hidden #${id}`); }
        });
        
        // Show command center container
        const cc = document.getElementById('command-center');
        const cd = document.getElementById('cmd-dashboard');
        
        if (cc) {
            cc.style.display = 'block';
            cc.classList.remove('module-container');
            cc.classList.add('active');
            console.log('[CC] Showed #command-center');
        }
        
        if (cd) {
            cd.innerHTML = `
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
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('Approval')"><div class="text-3xl mb-2">✅</div><div class="text-xs font-bold">Approval</div></div>
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('Budget')"><div class="text-3xl mb-2">💰</div><div class="text-xs font-bold">Dana Umum</div></div>
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('SPJ')"><div class="text-3xl mb-2">📋</div><div class="text-xs font-bold">SPJ</div></div>                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('Reports')"><div class="text-3xl mb-2">📊</div><div class="text-xs font-bold">Laporan</div></div>
                </div>
            `;
            console.log('[CC] Rendered dashboard content');
        }
    };
    
    window.showMain = function() {
        console.log('🏠 [CC] showMain() called');
        ['stats-card','carousel-container','menu-grid'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block';
        });
        const cc = document.getElementById('command-center');
        if (cc) {
            cc.style.display = 'none';
            cc.classList.add('module-container');
            cc.classList.remove('active');
        }
    };
    
    // Auto-bind: Wait for menu-grid to exist, then bind Command card
    function bindCommandCard() {
        const grid = document.getElementById('menu-grid');
        if (!grid) {
            console.log('[CC] menu-grid not ready, retrying in 300ms...');
            setTimeout(bindCommandCard, 300);
            return;
        }
        
        const cards = grid.querySelectorAll('.menu-card');
        let bound = false;
        
        cards.forEach(card => {
            const label = card.querySelector('.text-center');
            if (label && label.textContent.trim() === 'Command') {
                card.onclick = function(e) {
                    e.preventDefault();
                    console.log('[CC] Command card clicked!');
                    window.openCommandCenter();
                };
                card.style.cursor = 'pointer';
                bound = true;
                console.log('✅ [CC] Command card bound successfully');
            }
        });
        
        if (!bound) {
            console.warn('⚠️ [CC] Command card not found in menu-grid');
        }    }
    
    // Start binding process
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindCommandCard);
    } else {
        setTimeout(bindCommandCard, 100);
    }
    
    console.log('✅ [CC] Command Center module loaded');
})();
