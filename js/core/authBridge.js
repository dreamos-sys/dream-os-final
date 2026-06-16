/**
 * 🔐 Auth Bridge v1.0
 * Dream OS v1.0 Beta - Phase 3 Login Fix
 * Bypass event delegator, bind langsung ke tombol/input login
 */
(function(){
    function tryBindAuth(){
        // Cari tombol/input login dengan berbagai pola selector
        const btn = document.querySelector('#login-btn, .login-btn, button[onclick*="auth"], button[onclick*="login"], button[onclick*="pin"], button[onclick*="verify"]');
        const input = document.querySelector('#pin-input, #password-input, input[type="password"], .dream-pin-input');
        
        // Cari fungsi auth di window atau scope global
        const authFn = window.authenticate || window.checkLogin || window.verifyPin || window.login || window.dreamAuth;
        
        if(!btn && !input) return setTimeout(tryBindAuth, 500); // Retry kalau DOM belum siap
        
        const handler = function(e){
            e.preventDefault();
            const val = input ? input.value : '';
            if(typeof authFn === 'function'){
                authFn(val);
            } else {
                console.warn('🔐 Auth Bridge: Fungsi login tidak ditemukan di window scope.');
                // Fallback: trigger form submit atau reload auth flow
                const form = btn?.closest('form') || input?.closest('form');
                if(form) form.submit();
            }
        };
        
        if(btn){
            btn.removeAttribute('data-action');
            btn.removeAttribute('data-params');
            btn.addEventListener('click', handler);
        }
        if(input){
            input.addEventListener('keydown', function(e){
                if(e.key === 'Enter') handler(e);
            });
        }
        console.log('🔐 Auth Bridge bound | Dream OS v1.0 Beta');
    }
    
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', tryBindAuth);
    } else {
        tryBindAuth();
    }
})();
