/**
 * Dream OS Login — ULTRA SIMPLE v1.1
 * + Password toggle + Better error handling
 */
(function() {
    'use strict';
    
    function init() {
        const btn = document.getElementById('btn-login');
        const input = document.getElementById('access-key');
        const toggle = document.getElementById('toggle-pw');
        
        if(!btn || !input) {
            setTimeout(init, 100);
            return;
        }
        
        console.log('✅ Login ready');
        
        // Password toggle
        if(toggle) {
            toggle.onclick = function() {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                toggle.textContent = type === 'password' ? '👁️' : '🙈';
            };
            console.log('✅ Password toggle enabled');
        }
        
        // Login handler
        btn.onclick = function() {
            console.log('🔐 Login clicked');
            const key = input.value.trim();
            
            if(!key) {
                alert('Masukkan Access Key!');
                return;
            }
            
            window.DreamOS = window.DreamOS || {};
            window.DreamOS.role = key.includes('admin') ? 'ADMIN' : 'USER';
            
            // Switch views
            document.getElementById('login-page').style.display = 'none';
            const dashboard = document.getElementById('dashboard');
            dashboard.style.display = 'flex';            dashboard.classList.add('active');
            
            const nav = document.getElementById('bottom-nav');
            if(nav) nav.style.display = 'flex';
            
            console.log('✅ Logged in as', window.DreamOS.role);
            
            // Debug: Check if home module exists
            setTimeout(function() {
                console.log('DreamOS.modules:', Object.keys(window.DreamOS?.modules || {}));
                console.log('home module:', typeof DreamOS.modules?.home);
                
                if(window.DreamOS && DreamOS.run && DreamOS.modules.home) {
                    console.log('🚀 Initializing home module...');
                    DreamOS.run('home', 'init');
                } else {
                    console.warn('⚠️ Home module not found, trying manual init...');
                    // Fallback: Try to init manually
                    if(window.DreamOS && DreamOS.modules) {
                        // Trigger carousel and menu manually
                        setTimeout(function() {
                            if(DreamOS.modules.home) {
                                DreamOS.modules.home.renderCarousel && DreamOS.modules.home.renderCarousel();
                                DreamOS.modules.home.renderMenuGrid && DreamOS.modules.home.renderMenuGrid();
                            }
                        }, 500);
                    }
                }
            }, 200);
        };
        
        input.onkeypress = function(e) {
            if(e.key === 'Enter') btn.onclick();
        };
    }
    
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
