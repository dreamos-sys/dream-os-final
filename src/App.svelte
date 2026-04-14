<script>
  // Import logo dari public folder
  const logoUrl = '/logo-sultan.png';
  
  // Atau jika di src/assets:
  // import logoUrl from '../assets/logo-sultan.png';
  
  let message = '🎉 Dream OS LIVE!';
</script>

<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;text-align:center;padding:2rem">
  <img src={logoUrl} alt="Dream OS" style="width:120px;margin-bottom:2rem;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.3)" />
  <h1 style="font-size:2rem;margin-bottom:1rem">{message}</h1>
  <p style="font-size:1.1rem;opacity:0.9">If you see this, Svelte rendering is WORKING! ✨</p>
</div>
