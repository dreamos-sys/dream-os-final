/** Dream OS Command Center — Hybrid Pattern v1.0
 * Karpathy: Modular logic + Global Bridge fallback
 * Addy: Event delegation, <3KB, defer load
 */
(function() {
    'use strict';
    
    // Modular logic (internal)
    function openCommandCenter() {
        console.log('🌍 Command Center opened');
        
        // Hide main content
        const main = document.getElementById('main-content-wrapper');
        if(main) main.style.display = 'none';
        
        // Show command center
        const cc = document.getElementById('command-center');
        const cd = document.getElementById('cmd-dashboard');
        if(cc) { cc.style.display = 'block'; cc.classList.add('active'); }
        if(cd) {
            cd.style.display = 'block';
            cd.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold">🌍 Command Center</h2>
                    <button onclick="showMain()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60">Pending</div><div class="text-2xl font-bold text-amber-400">3</div></div>
                    <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60">Budget</div><div class="text-lg font-bold text-emerald-400">Rp 50Jt</div></div>
                </div>
            `;
        }
    }
    
    function showMain() {
        console.log('🏠 showMain() called');
        document.getElementById('command-center')?.classList.remove('active');
        document.getElementById('command-center') && (document.getElementById('command-center').style.display = 'none');
        document.getElementById('cmd-dashboard') && (document.getElementById('cmd-dashboard').style.display = 'none');
        document.getElementById('main-content-wrapper') && (document.getElementById('main-content-wrapper').style.display = 'block');
    }
    
    // 🌉 GLOBAL BRIDGE (inline fallback — WAJIB!)
    window.openCommandCenter = openCommandCenter;
    window.showMain = showMain;
    
    // Event delegation for dynamic elements (Aman untuk content yang di-render via innerHTML)
    document.addEventListener('click', function(e) {
        if(e.target.closest('[data-action="open-command"]') || e.target.closest('#menu-grid .menu-card:nth-child(1)')) {
            openCommandCenter();
        }
    });
    
    // DOM ready init
    function init() {
        console.log('✅ Command Center hybrid initialized');
    }
    
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
