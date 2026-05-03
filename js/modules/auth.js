window.DreamOSModules = window.DreamOSModules || {};

window.DreamOSModules.auth = {
    init() {
        console.log('🔐 Auth module initialized');
        setTimeout(() => this.bindEvents(), 100);
    },
    
    bindEvents() {
        console.log('🔧 Binding auth events...');
        
        // Init Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            console.log('✅ Lucide icons initialized');
        }
        
        // Password toggle
        const toggleBtn = document.getElementById('toggle-pw');
        const eyeIcon = document.getElementById('eye-icon');
        const input = document.getElementById('access-key');
                console.log('🔍 Elements:', { toggleBtn, eyeIcon, input });
        
        if (toggleBtn && input && eyeIcon) {
            console.log('✅ All password elements found');
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('👁️ Toggle clicked');
                
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                
                // Update icon
                eyeIcon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
                lucide.createIcons();
                
                console.log('✅ Password type changed to:', input.type);
            });
        } else {
            console.error('❌ Password elements NOT found!');
        }
        
        // Login button
        const loginBtn = document.getElementById('btn-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }
        
        // Logout buttons
        document.getElementById('btn-logout')?.addEventListener('click', () => this.doLogout());
        document.getElementById('btn-logout-profile')?.addEventListener('click', () => this.doLogout());
    },
    
    handleLogin() {
        const key = document.getElementById('access-key')?.value;
        if (!key) return alert('Masukkan Access Key!');
        
        console.log('🔑 Login:', key);
        DreamOS.role = (key.includes('admin') || key.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
        
        // Update UI
        document.getElementById('role-badge')?.textContent = DreamOS.role.replace('_', ' ');
        document.getElementById('profile-role')?.textContent = DreamOS.role.replace('_', ' ');
        
        // Switch views
        document.getElementById('auth-view')?.classList.remove('active');
        const appView = document.getElementById('app-view');
        if (appView) {
            appView.classList.add('active');
            appView.style.display = 'flex';        }
        document.getElementById('app-header')?.classList.remove('hidden');
        document.getElementById('bottom-nav')?.classList.remove('hidden');
        document.getElementById('carousel-container')?.classList.remove('hidden');
        document.getElementById('staff-grid')?.classList.remove('hidden');
        
        // Load modules
        if (DreamOS.modules.home) {
            DreamOS.modules.home.init();
        } else {
            DreamOS.loadModule('home').then(mod => mod?.init());
        }
        DreamOS.loadModule('command');
        DreamOS.loadModule('ai-service');
    },
    
    doLogout() {
        document.getElementById('app-view')?.classList.remove('active');
        document.getElementById('auth-view')?.classList.add('active');
        const accessKey = document.getElementById('access-key');
        if (accessKey) accessKey.value = '';
        DreamOS.role = 'STAFF';
    }
};
