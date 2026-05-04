// Emergency Login Fix - Direct attachment
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Login Fix: DOM Ready');
    
    const loginBtn = document.getElementById('btn-login');
    const accessKey = document.getElementById('access-key');
    
    if(!loginBtn) {
        console.error('❌ #btn-login not found!');
        return;
    }
    
    if(!accessKey) {
        console.error('❌ #access-key not found!');
        return;
    }
    
    console.log('✅ Login elements found');
    
    // Direct click handler
    loginBtn.addEventListener('click', function() {
        console.log('🔐 Login button clicked!');
        const key = accessKey.value.trim();
        
        if(!key) {
            alert('Masukkan Access Key!');
            accessKey.focus();
            return;
        }
        
        console.log('Access Key:', key);
        
        // Set role based on key
        window.DreamOS.role = (key.includes('admin') || key.includes('kepala')) 
            ? 'KEPALA_BAGIAN' : 'STAFF';
        
        // Switch to dashboard
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('login-page').classList.remove('active');
        
        const dashboard = document.getElementById('dashboard');
        dashboard.classList.add('active');
        dashboard.style.display = 'flex';
        
        const nav = document.getElementById('bottom-nav');
        if(nav) nav.style.display = 'flex';
        
        console.log('✅ Login successful! Role:', window.DreamOS.role);
        
        // Initialize home modules
        setTimeout(function() {
            if(window.DreamOS && DreamOS.run) {
                DreamOS.run('home', 'init');
                console.log('✅ Home module initialized');
            }
        }, 300);
    });
    
    // Enter key support
    accessKey.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') loginBtn.click();
    });
    
    console.log('✅ Login Fix: Event listeners attached');
});
