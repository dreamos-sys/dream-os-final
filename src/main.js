console.log('🚀 Dream OS v21 Pro - main.js executing');

// Debug: Cek apakah DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOMContentLoaded fired');
  const appDiv = document.getElementById('app');
  console.log('🔍 #app element:', appDiv ? 'FOUND' : 'NOT FOUND');
});

// Debug: Try-catch Svelte mount
try {
  console.log('🔧 Importing App.svelte...');
  import('./App.svelte').then(({ default: App }) => {
    console.log('✅ App.svelte loaded');
    
    const target = document.getElementById('app');
    if (!target) {
      console.error('❌ #app element not found!');
      document.body.innerHTML = '<h1 style="color:red">ERROR: #app not found</h1>';
      return;
    }
    
    console.log('🎯 Mounting App to #app...');
    const app = new App({ target });
    console.log('✅ App mounted successfully!');
    
    // Expose app globally for debug
    window.__DREAM_OS_APP__ = app;
  }).catch(err => {
    console.error('❌ Failed to load App.svelte:', err);
    document.body.innerHTML = `<h1 style="color:red">ERROR: ${err.message}</h1><pre>${err.stack}</pre>`;
  });
} catch (e) {
  console.error('❌ Critical error in main.js:', e);
  document.body.innerHTML = `<h1 style="color:red">CRITICAL: ${e.message}</h1>`;
}

console.log('🏁 main.js execution complete');
