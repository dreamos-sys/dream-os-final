console.log('🚀 main.js: Starting Dream OS v21 Pro');

import App from './App.svelte';

const target = document.getElementById('app');

if (!target) {
  console.error('❌ #app element not found!');
  document.body.innerHTML = '<h1 style="color:red;padding:2rem">ERROR: #app not found</h1>';
} else {
  console.log('✅ #app found, mounting Svelte app...');
  try {
    const app = new App({ target });
    console.log('✅ Svelte app mounted successfully!');
    window.__DREAM_OS__ = app; // Expose for debug
  } catch (e) {
    console.error('❌ Mount error:', e);
    target.innerHTML = `<pre style="color:red">${e.message}\n${e.stack}</pre>`;
  }
}

console.log('🏁 main.js: Execution complete');
