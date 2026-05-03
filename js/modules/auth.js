window.DreamOSModules = window.DreamOSModules || {};

window.DreamOSModules.auth = {
    init() {
        console.log('🔐 Auth module initialized');
        setTimeout(() => this.bindEvents(), 100);
    },
    
    bindEvents() {
        console.log('🔧 Binding auth events...');
        
        // INIT LUCIDE ICONS untuk login page
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            console.log('✅ Lucide icons initialized');
        }
        
        // Password toggle
        const toggleBtn = document.getElementById('toggle-pw');
        const eyeOff = document.getElementById('eye-off');
        const eyeOn = document.getElementById('eye-on');
        const input = document.getElementById('access-key');
        
        console.log('🔍 Checking elements:');
        console.log('- toggleBtn:', toggleBtn);
        console.log('- input:', input);
        console.log('- eyeOff:', eyeOff);
        console.log('- eyeOn:', eyeOn);
        
        if (toggleBtn && input) {
            console.log('✅ Password toggle elements found');
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('👁️ Toggling password...');
                const isPass = input.type === 'password';
                input.type = isPass ? 'text' : 'password';
                if (eyeOff) eyeOff.classList.toggle('hidden', !isPass);
                if (eyeOn) eyeOn.classList.toggle('hidden', isPass);
                console.log('✅ Password type:', input.type);
            });
        } else {
            console.error('❌ Password toggle elements NOT found!');
        }
        
        // Login button        const loginBtn = document.getElementById('btn-login');
        if (loginBtn) {
            console.log('✅ Login button found');
            loginBtn.addEventListener('click', () => this.handleLogin());
        } else {
            console.error('❌ Login button NOT found!');
        }
        
        // Logout buttons
        const logoutBtn = document.getElementById('btn-logout');
        const logoutProfileBtn = document.getElementById('btn-logout-profile');
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.doLogout());
        if (logoutProfileBtn) logoutProfileBtn.addEventListener('click', () => this.doLogout());
    },
    
    handleLogin() {
        console.log('🔐 Handling login...');
        const key = document.getElementById('access-key')?.value;
        
        if (!key) {
            alert('Masukkan Access Key!');
            return;
        }
        
        console.log('🔑 Login with key:', key);
        DreamOS.role = (key.includes('admin') || key.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
        console.log('✅ Role:', DreamOS.role);
        
        // Update UI
        const roleBadge = document.getElementById('role-badge');
        const profileRole = document.getElementById('profile-role');
        if (roleBadge) roleBadge.textContent = DreamOS.role.replace('_', ' ');
        if (profileRole) profileRole.textContent = DreamOS.role.replace('_', ' ');
        
        // Switch views
        document.getElementById('auth-view')?.classList.remove('active');
        const appView = document.getElementById('app-view');
        if (appView) {
            appView.classList.add('active');
            appView.style.display = 'flex';
        }
        document.getElementById('app-header')?.classList.remove('hidden');
        document.getElementById('bottom-nav')?.classList.remove('hidden');
        document.getElementById('carousel-container')?.classList.remove('hidden');
        document.getElementById('staff-grid')?.classList.remove('hidden');
        
        console.log('✅ Loading home module...');
        if (DreamOS.modules.home) {
            DreamOS.modules.home.init();
        } else {            DreamOS.loadModule('home').then(mod => mod?.init());
        }
        
        // Load other modules
        DreamOS.loadModule('command');
        DreamOS.loadModule('ai-service');
    },
    
    doLogout() {
        console.log('🚪 Logging out...');
        document.getElementById('app-view')?.classList.remove('active');
        document.getElementById('auth-view')?.classList.add('active');
        const accessKey = document.getElementById('access-key');
        if (accessKey) accessKey.value = '';
        DreamOS.role = 'STAFF';
    }
};
