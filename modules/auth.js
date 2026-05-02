const authModule = {
    init() {
        const l = document.getElementById('btn-login');
        const t = document.getElementById('toggle-pw');
        const i = document.getElementById('access-key');
        
        t.onclick = (e) => {
            e.preventDefault();
            const p = i.type === 'password';
            i.type = p ? 'text' : 'password';
            document.getElementById('eye-off').classList.toggle('hidden', !p);
            document.getElementById('eye-on').classList.toggle('hidden', p);
        };

        l.onclick = () => {
            if(!i.value) return alert('Masukkan Access Key!');
            const r = i.value.includes('admin') ? 'KEPALA_BAGIAN' : 'STAFF';
            document.getElementById('role-badge').textContent = r.replace('_', ' ');
            document.getElementById('profile-role').textContent = r.replace('_', ' ');
            document.getElementById('auth-view').classList.remove('active');
            document.getElementById('app-view').classList.add('active');
            
            headerModule.init();
            navModule.init();
            carouselModule.init();
            gridModule.init();
            ghostModule.init();
            document.getElementById('app-header').classList.remove('hidden');
            document.getElementById('bottom-nav').classList.remove('hidden');
            lucide.createIcons();
        };
    },
    logout() {
        document.getElementById('app-view').classList.remove('active');
        document.getElementById('auth-view').classList.add('active');
        document.getElementById('access-key').value = '';
    }
};
document.addEventListener('DOMContentLoaded', () => authModule.init());
