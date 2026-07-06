// ========== REGISTER DEVICE DNA ==========
(function() {
  var DNA = '53b353bafb06f099c7862c8b35ae595e';
  
  // Update admin user
  var users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]');
  var admin = users.find(function(u) { return u.role === 'dev'; });
  
  if (admin) {
    admin.device_dna = DNA;
    localStorage.setItem('dreamos_users_db', JSON.stringify(users));
    console.log('✅ Admin device registered!');
  }
  
  // Set session
  var devUser = {
    nama: 'Developer',
    email: 'dreamos.sch.id@gmail.com',
    role: 'dev',
    device_dna: DNA
  };
  localStorage.setItem('dreamos_bound_user', JSON.stringify(devUser));
  localStorage.setItem('dreamos_session_active', 'true');
  
  console.log('✅ Session restored for device: ' + DNA.substring(0,16) + '...');
})();
