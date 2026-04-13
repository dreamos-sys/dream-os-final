<script>
  console.log('✅ App.svelte executing');
  let message = '🎉 Dream OS LIVE!';
</script>

<!-- Minimal visible content: NO CSS CONFLICT -->
<div style="
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: system-ui, sans-serif;
  text-align: center;
  padding: 2rem;
">
  <h1 style="font-size: 2rem; margin-bottom: 1rem;">{message}</h1>
  <p style="font-size: 1.1rem; opacity: 0.9;">
    If you see this, Svelte rendering is WORKING! ✨
  </p>
  <div style="margin-top: 2rem; padding: 1rem; background: rgba(255,255,255,0.2); border-radius: 12px;">
    <strong>Debug Info:</strong><br>
    Time: <span id="time"></span><br>
    URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}
  </div>
</div>

<script>
  // Update time client-side
  if (typeof window !== 'undefined') {
    const updateTime = () => {
      document.getElementById('time').textContent = new Date().toLocaleTimeString();
    };
    updateTime();
    setInterval(updateTime, 1000);
    console.log('✅ App.svelte mounted with visible content');
  }
</script>
