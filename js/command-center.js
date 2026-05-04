/**
 * Dream OS Command Center — TIMING-FIX v3
 * Karpathy-Style: Simple, verifiable, surgical
 * Fix: Wait for menu-grid to be populated BEFORE binding
 */
(function() {
    'use strict';
    
    // Global functions
    window.openCommandCenter = function() {
        console.log('🌍 [CC] openCommandCenter() called');
        
        // Hide main dashboard
        ['stats-card','carousel-container','menu-grid'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; }
        });
        
        // Show command center - REMOVE module-container class to avoid CSS conflict
        const cc = document.getElementById('command-center');
        const cd = document.getElementById('cmd-dashboard');
        
        if (cc) {
            cc.classList.remove('module-container');  // ← FIX: Remove class with display:none
            cc.classList.add('active');
            cc.style.display = 'block';  // ← Fallback inline style
            console.log('[CC] Showed #command-center');
        }
        
        if (cd && !cd.innerHTML.trim()) {  // Only render if empty
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
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('Approval')"><div class="text-3xl mb-2">✅</div><div class="text-xs font-bold">Approval</div></div>
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('Budget')"><div class="text-3xl mb-2">💰</div><div class="text-xs font-bold">Dana Umum</div></div>
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('SPJ')"><div class="text-3xl mb-2">📋</div><div class="text-xs font-bold">SPJ</div></div>
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('Reports')"><div class="text-3xl mb-2">📊</div><div class="text-xs font-bold">Laporan</div></div>
                </div>
            `;
            console.log('[CC] Rendered dashboard');
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
            cc.classList.add('module-container');  // ← Re-add class for hiding
            cc.classList.remove('active');
            cc.style.display = 'none';
        }
    };
    
    // 🔥 FIX: Binding with retry + check for DreamOS.home ready
    function bindCommandCard() {
        const grid = document.getElementById('menu-grid');
        const cards = grid?.querySelectorAll('.menu-card');
        
        // Wait for: 1) grid exists, 2) has cards, 3) DreamOS.home is initialized
        if (!grid || !cards || cards.length === 0 || !window.DreamOS?.modules?.home) {
            console.log('[CC] Waiting for menu-grid to be ready...');
            setTimeout(bindCommandCard, 500);  // Retry in 500ms
            return;
        }
        
        // Find and bind Command card
        let bound = false;
        cards.forEach(card => {
            const label = card.querySelector('.text-center');
            if (label && label.textContent.trim() === 'Command') {
                // Remove any existing handler first (prevent duplicates)
                card.onclick = null;
                // Bind new handler
                card.onclick = function(e) {
                    e.preventDefault();
                    console.log('[CC] ✅ Command card clicked!');
                    window.openCommandCenter();
                };
                card.style.cursor = 'pointer';                bound = true;
                console.log('✅ [CC] Command card bound successfully');
            }
        });
        
        if (!bound) {
            console.warn('⚠️ [CC] Command card not found, retrying...');
            setTimeout(bindCommandCard, 500);
        }
    }
    
    // Start binding: Wait for DOM + DreamOS init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait extra 1s for DreamOS.home.renderMenuGrid() to run after login
            setTimeout(bindCommandCard, 1000);
        });
    } else {
        setTimeout(bindCommandCard, 1000);
    }
    
    console.log('✅ [CC] Command Center v3 loaded (timing-fix)');
})();
