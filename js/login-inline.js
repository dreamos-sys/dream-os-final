/**
 * Dream OS Login — ULTRA SIMPLE v1.0
 * Karpathy-Style: No complexity, just works
 */
(function() {
    'use strict';
    
    // Wait for DOM
    function init() {
        const btn = document.getElementById('btn-login');
        const input = document.getElementById('access-key');
        
        if(!btn || !input) {
            console.error('❌ Login elements not found');
            setTimeout(init, 100); // Retry
            return;
        }
        
        console.log('✅ Login elements ready');
        
        // Single click handler
        btn.onclick = function() {
            console.log('🔐 Login clicked!');
            const key = input.value.trim();
            
            if(!key) {
                alert('Masukkan Access Key!');
                return;
            }
            
            // Set role
            window.DreamOS = window.DreamOS || {};
            window.DreamOS.role = key.includes('admin') ? 'ADMIN' : 'USER';
            
            // Switch view
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('dashboard').style.display = 'flex';
            document.getElementById('bottom-nav').style.display = 'flex';
            
            console.log('✅ Login success! Role:', window.DreamOS.role);            
            // Init home AFTER view switch
            setTimeout(function() {
                if(window.DreamOS && DreamOS.run) {
                    DreamOS.run('home', 'init');
                }
            }, 100);
        };
        
        // Enter key
        input.onkeypress = function(e) {
            if(e.key === 'Enter') btn.onclick();
        };
    }
    
    // Start
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
