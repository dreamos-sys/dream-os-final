console.log('🚀 Dream OS main.js executing');

const app = document.getElementById('app');
if (app) {
  app.innerHTML += '<p style="color:#10b981;margin-top:1rem;font-weight:bold">✅ JavaScript loaded successfully!</p>';
  console.log('✅ App element updated');
} else {
  console.error('❌ #app not found');
  document.body.innerHTML = '<h1 style="color:red">ERROR: #app not found</h1>';
}

console.log('🏁 main.js complete');
