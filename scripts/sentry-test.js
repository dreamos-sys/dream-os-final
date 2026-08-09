
// 🛰️ SENTRY TEST SCRIPT — paste di Console browser production
// Buka: https://dreamos-sys.github.io/dream-os-final/
// Buka DevTools (F12) → Console → paste ini:

console.log('🧪 Testing Sentry...');
setTimeout(function(){
  try {
    throw new Error('🛰️ Sentry test dari Dream OS — ' + new Date().toISOString());
  } catch(e) {
    console.error('Error thrown:', e);
    if (window.Sentry) {
      window.Sentry.captureException(e);
      console.log('✅ Error dikirim ke Sentry!');
    } else {
      console.warn('⚠️ window.Sentry tidak ada — loader mungkin gagal');
    }
  }
}, 2000);

// Cek status Sentry
setTimeout(function(){
  console.log('--- SENTRY STATUS ---');
  console.log('window.Sentry:', window.Sentry ? '✅ Loaded' : '❌ Not loaded');
  console.log('Sentry DSN:', window.Sentry ? 'Configured' : 'N/A');
  console.log('Environment:', window.Sentry ? 'production' : 'N/A');
}, 3000);
