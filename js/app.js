// Fresh minimal working app.js
window.DreamOS = {
    version: '1.3.1',
    modules: {},
    register(name, mod) { this.modules[name] = mod; },
    run(mod, fn, ...args) { 
        try { 
            if (this.modules[mod]?.[fn]) return this.modules[mod][fn](...args); 
        } catch (e) { console.error(e); } 
    }
};

// Simple auth
DreamOS.register('auth', {
    init() {
        const toggle = document.getElementById('toggle-pw');
        const input = document.getElementById('access-key');
        const btn = document.getElementById('btn-login');
        
        console.log('🔐 Auth init - Toggle:', toggle, 'Input:', input, 'Btn:', btn);
        
        if (toggle && input) {
            toggle.addEventListener('click', () => {
                console.log('👁️ Toggle clicked!');
                input.type = input.type === 'password' ? 'text' : 'password';
                toggle.textContent = input.type === 'password' ? '👁️' : '🙈';
            });
        }
        
        if (btn) {
            btn.addEventListener('click', () => {
                const key = input?.value;
                console.log('🔑 Login clicked - Key:', key);
                if (!key) return alert('Masukkan password!');
                alert('Login success! Key: ' + key);
                // Redirect logic here
            });
        }
    }
});

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM Loaded - DreamOS:', DreamOS);
    DreamOS.run('auth', 'init');
});
