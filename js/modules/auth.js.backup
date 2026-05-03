window.DreamOSModules = window.DreamOSModules || {};

window.DreamOSModules.auth = {
    init() {
        console.log('🔐 Auth module initialized');
        this.bindEvents();
    },
    
    bindEvents() {
        document.getElementById('btn-login')?.addEventListener('click', () => this.handleLogin());
        document.getElementById('toggle-pw')?.addEventListener('click', () => this.togglePassword());
        document.getElementById('btn-logout')?.addEventListener('click', () => this.doLogout());        document.getElementById('btn-logout-profile')?.addEventListener('click', () => this.doLogout());
    },
    
    togglePassword() {
        const input = document.getElementById('access-key');
        const eyeOff = document.getElementById('eye-off');
        const eyeOn = document.getElementById('eye-on');
        
        if (input) {
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            eyeOff?.classList.toggle('hidden', !isPass);
            eyeOn?.classList.toggle('hidden', isPass);
        }
    },
    
    handleLogin() {
        const key = document.getElementById('access-key').value;
        if (!key) return alert('Masukkan Access Key!');

        DreamOS.role = (key.includes('admin') || key.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
        
        document.getElementById('role-badge').textContent = DreamOS.role.replace('_', ' ');
        document.getElementById('profile-role').textContent = DreamOS.role.replace('_', ' ');

        document.getElementById('auth-view').classList.remove('active');
        document.getElementById('app-view').classList.add('active');
        document.getElementById('app-header').classList.remove('hidden');
        document.getElementById('app-header').style.display = 'flex';
        document.getElementById('bottom-nav').classList.remove('hidden');
        document.getElementById('carousel-container').classList.remove('hidden');
        document.getElementById('staff-grid').classList.remove('hidden');

        // Load home module first (it contains navigation logic)
        DreamOS.loadModule('home').then(mod => {
            if (mod && mod.init) mod.init();
        });
        
        // Load other modules in background
        DreamOS.loadModule('command');
        DreamOS.loadModule('ai-service');
    },
    
    doLogout() {
        document.getElementById('app-view').classList.remove('active');
        document.getElementById('auth-view').classList.add('active');
        document.getElementById('access-key').value = '';
        DreamOS.role = 'STAFF';
    }
};EOF

# 6. Buat module utils.js
cat > js/modules/utils.js << 'EOF'
window.DreamOSModules = window.DreamOSModules || {};

window.DreamOSModules.utils = {
    copyText(text) {
        navigator.clipboard.writeText(text).then(() => alert('✅ Copied to clipboard!')).catch(() => alert('📋 Copy failed. Please copy manually:\n\n' + text));
    }
};
