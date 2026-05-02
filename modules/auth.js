const authModule = {
    init() {
        document.getElementById('btn-login').addEventListener('click', () => this.login());
        document.getElementById('toggle-pw').addEventListener('click', () => this.togglePassword());
    },
    
    togglePassword() {
        const input = document.getElementById('access-key');
        const eyeOff = document.getElementById('eye-off');
        const eyeOn = document.getElementById('eye-on');
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        eyeOff.classList.toggle('hidden', !isPass);
        eyeOn.classList.toggle('hidden', isPass);
    },    
    login() {
        const key = document.getElementById('access-key').value;
        if (!key) return alert('Masukkan Access Key!');
        
        const role = key.includes('admin') || key.includes('kepala') ? 'KEPALA_BAGIAN' : 'STAFF';
        document.getElementById('role-badge').textContent = role.replace('_', ' ');
        
        document.getElementById('auth-view').classList.remove('active');
        document.getElementById('app-view').classList.add('active');
        document.getElementById('app-header').classList.remove('hidden');
        document.getElementById('bottom-nav').classList.remove('hidden');
        document.getElementById('carousel-container').classList.remove('hidden');
        document.getElementById('staff-grid').classList.remove('hidden');
        
        // Init modules
        if (window.headerModule) headerModule.init();
        if (window.navModule) navModule.init();
        if (window.gridData) gridData.render('staff-grid', gridData.staff);
        if (window.carouselData) carouselData.init();
        
        setTimeout(() => lucide.createIcons(), 50);
    }
};

document.addEventListener('DOMContentLoaded', () => authModule.init());
