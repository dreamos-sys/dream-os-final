// DREAM OS CONFIG - Ganti dengan nilai production yang aman!
// JANGAN commit file ini ke Git!
window.__DREAMOS_CONFIG = {
  aesSalt: 'GANTI_DENGAN_SALT_RANDOM_32_CHAR',
  bankSalt: 'GANTI_DENGAN_SALT_RANDOM_32_CHAR',
  secureStoreSalt: 'GANTI_DENGAN_SALT_RANDOM_32_CHAR'
};

// Generate random salt:
// crypto.getRandomValues(new Uint8Array(16)).map(b => b.toString(16).padStart(2, '0')).join('')
