<script>
  import { onMount } from 'svelte';
  import CommandCenter from './lib/modules/commandcenter/CommandCenter.svelte';
  
  let currentUser = { 
    name: 'My Bro', 
    role: 'admin',
    avatar: '/dream/logo-sultan.png'
  };

  function handleLogoError(e) {
    console.warn('⚠️ Logo failed to load');
    e.target.style.display = 'none';
    if(e.target.parentElement) {
        e.target.parentElement.innerHTML = '🖼️'; 
    }
  }

  onMount(() => {
    console.log('✅✅✅ DREAM OS MOUNTED SUCCESSFULLY! ✅✅✅');
    console.log('User:', currentUser.name);
    console.log('Eruda should be active (check top-right corner)');
  });
</script>

<main style="min-height:100vh; background: linear-gradient(135deg, #f0f9ff, #f0fdf4); font-family: sans-serif;">
  <header style="text-align:center; padding: 1rem;">
    <div style="width:80px; height:80px; margin:0 auto; background:rgba(255,255,255,0.7); backdrop-filter:blur(12px); border-radius:24px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      <img 
        src="/dream/logo-sultan.png" 
        alt="Dream OS Logo" 
        style="width:60px; height:60px; object-fit:contain;" 
        onerror={handleLogoError} 
      />
    </div>
    
    <h1 style="background:linear-gradient(135deg,#10b981,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:1.5rem; font-weight:700; margin:0.5rem 0;">
      Dream OS Neural Link
    </h1>
    <p style="color:#64748b; font-size:0.875rem;">Crystal Glassmorphism UI + Eruda Debugging</p>
  </header>

  <CommandCenter {currentUser} />
</main>
