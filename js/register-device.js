// ========== REGISTER MULTIPLE DEVICE DNA ==========
(function() {
  'use strict';
  
  // Generate DNA dari browser ini
  async function getCurrentDNA() {
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#f60';
    ctx.fillRect(125,1,62,20);
    var metrics = [navigator.hardwareConcurrency||0, screen.colorDepth, c.toDataURL()].join('|');
    var hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metrics));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('').substring(0,32);
  }
  
  getCurrentDNA().then(function(currentDNA) {
    var users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]');
    var admin = users.find(function(u) { return u.role === 'dev'; });
    
    if (admin) {
      // Support multiple DNA (array)
      if (!admin.device_dna_list) {
        admin.device_dna_list = [];
        // Migrasi DNA lama
        if (admin.device_dna) {
          admin.device_dna_list.push(admin.device_dna);
        }
      }
      
      // Tambah DNA baru kalau belum ada
      if (!admin.device_dna_list.includes(currentDNA)) {
        admin.device_dna_list.push(currentDNA);
        console.log('✅ New browser registered: ' + currentDNA.substring(0,16) + '...');
      } else {
        console.log('ℹ️  Browser already registered');
      }
      
      // Update DNA utama (untuk kompatibilitas)
      admin.device_dna = currentDNA;
      
      localStorage.setItem('dreamos_users_db', JSON.stringify(users));
      console.log('📱 Total registered browsers: ' + admin.device_dna_list.length);
    }
    
    // Set session
    var devUser = {
      nama: 'Developer',
      email: 'dreamos.sch.id@gmail.com',
      role: 'dev',
      device_dna: currentDNA
    };
    localStorage.setItem('dreamos_bound_user', JSON.stringify(devUser));
    localStorage.setItem('dreamos_session_active', 'true');
    
    console.log('✅ Session active for: ' + currentDNA.substring(0,16) + '...');
  });
})();
