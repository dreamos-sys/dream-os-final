window.DreamOSModules = window.DreamOSModules || {};

window.DreamOSModules.auth = {
    init() {
        console.log('🔐 Auth module initialized');
        // Delay binding untuk memastikan DOM ready
        setTimeout(() => this.bindEvents(), 100);
    },
    
    bindEvents() {
        console.log('🔧 Binding auth events...');
        
        // Password toggle
        const toggleBtn = document.getElementById('toggle-pw');
        const eyeOff = document.getElementById('eye-off');
        const eyeOn = document.getElementById('eye-on');
        const input = document.getElementById('access-key');
        
        if (toggleBtn && input && eyeOff && eyeOn) {
            console.log('✅ Password toggle elements found');
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('👁️ Toggling password visibility...');
                const isPass = input.type === 'password';
                input.type = isPass ? 'text' : 'password';
                eyeOff.classList.toggle('hidden', !isPass);
                eyeOn.classList.toggle('hidden', isPass);
                console.log('✅ Password type:', input.type);
            });
        } else {
            console.error('❌ Password toggle elements not found!');
            console.log('toggleBtn:', toggleBtn);
            console.log('input:', input);
        }
        
        // Login button
        const loginBtn = document.getElementById('btn-login');
        if (loginBtn) {
            console.log('✅ Login button found');
            loginBtn.addEventListener('click', () => {
                console.log('🔑 Login button clicked');
                this.handleLogin();            });
        } else {
            console.error('❌ Login button not found!');
        }
        
        // Logout buttons
        const logoutBtn = document.getElementById('btn-logout');
        const logoutProfileBtn = document.getElementById('btn-logout-profile');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.doLogout());
        }
        if (logoutProfileBtn) {
            logoutProfileBtn.addEventListener('click', () => this.doLogout());
        }
    },
    
    handleLogin() {
        console.log('🔐 Handling login...');
        const key = document.getElementById('access-key')?.value;
        
        if (!key) {
            alert('Masukkan Access Key!');
            return;
        }
        
        console.log('🔑 Login attempt with key:', key);
        
        // Determine role
        DreamOS.role = (key.includes('admin') || key.includes('kepala')) ? 'KEPALA_BAGIAN' : 'STAFF';
        console.log('✅ User role:', DreamOS.role);
        
        // Update UI
        const roleBadge = document.getElementById('role-badge');
        const profileRole = document.getElementById('profile-role');
        if (roleBadge) roleBadge.textContent = DreamOS.role.replace('_', ' ');
        if (profileRole) profileRole.textContent = DreamOS.role.replace('_', ' ');
        
        // Switch views
        const authView = document.getElementById('auth-view');
        const appView = document.getElementById('app-view');
        const appHeader = document.getElementById('app-header');
        const bottomNav = document.getElementById('bottom-nav');
        const carouselContainer = document.getElementById('carousel-container');
        const staffGrid = document.getElementById('staff-grid');
        
        if (authView) authView.classList.remove('active');
        if (appView) {
            appView.classList.add('active');
            appView.style.display = 'flex';        }
        if (appHeader) {
            appHeader.classList.remove('hidden');
            appHeader.style.display = 'flex';
        }
        if (bottomNav) bottomNav.classList.remove('hidden');
        if (carouselContainer) carouselContainer.classList.remove('hidden');
        if (staffGrid) staffGrid.classList.remove('hidden');
        
        console.log('✅ Login successful, loading home module...');
        
        // Load home module
        if (DreamOS.modules.home) {
            console.log('🏠 Home module already loaded, initializing...');
            DreamOS.modules.home.init();
        } else {
            console.log('🏠 Loading home module...');
            DreamOS.loadModule('home').then(mod => {
                if (mod && mod.init) {
                    console.log('✅ Home module loaded and initialized');
                    mod.init();
                }
            }).catch(err => console.error('❌ Failed to load home module:', err));
        }
        
        // Load other modules in background
        DreamOS.loadModule('command');
        DreamOS.loadModule('ai-service');
    },
    
    doLogout() {
        console.log('🚪 Logging out...');
        const appView = document.getElementById('app-view');
        const authView = document.getElementById('auth-view');
        const accessKey = document.getElementById('access-key');
        
        if (appView) appView.classList.remove('active');
        if (authView) authView.classList.add('active');
        if (accessKey) accessKey.value = '';
        
        DreamOS.role = 'STAFF';
        console.log('✅ Logged out');
    }
};
