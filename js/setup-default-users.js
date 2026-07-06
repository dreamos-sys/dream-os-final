// ========== SETUP DEFAULT USERS ==========
(function() {
  'use strict';
  
  // Cek apakah sudah ada user
  var users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]');
  
  if (users.length > 0) {
    console.log('👥 Users already exist:', users.length);
    return;
  }
  
  console.log('🆕 First run - creating default users...');
  
  // Default users dengan hash password yang benar
  var defaultUsers = [
    {
      nama: 'Administrator',
      email: 'admin@dreamos.local',
      role: 'dev',
      password_hash: 'ec363f85aa74ef12cb507cbaaf199eeb13723b121780f0cfc257d1abb1796ece',
      device_dna: '',
      phone: '',
      department: 'IT Development',
      created_at: new Date().toISOString()
    },
    {
      nama: 'Bpk. Hanung',
      email: 'vespaexcelhijaucedar@gmail.com',
      role: 'kabag',
      password_hash: '5801493feae83f710df042ff0df63758e03b27a4212725dbe07d0227b85d6de5',
      device_dna: '',
      phone: '',
      department: 'Kabag Umum',
      created_at: new Date().toISOString()
    },
    {
      nama: 'Bpk. Erwinsyah',
      email: 'erwinsyah1679@gmail.com',
      role: 'koord',
      password_hash: '9961bf59f61d19e50c2032a05de3a5db1a375494e4c098dbaf49a071bca0e288',
      device_dna: '',
      phone: '',
      department: 'Koordinator',
      created_at: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('dreamos_users_db', JSON.stringify(defaultUsers));
  console.log('✅ Default users created:', defaultUsers.length);
})();
