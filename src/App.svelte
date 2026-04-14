<script>
  import { onMount } from 'svelte';
  
  // State
  let showGhostInput = false;
  let ghostPassword = '';
  let attempts = 0;
  let immunityUnlocked = false;
  let tapCount = 0;
  let currentTime = new Date().toLocaleTimeString();

  // Prayer Key Logic v4.0
  function getDynamicKey() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    const t = h * 60 + m;
    const base = 'dreamos2026';
    let j = h.toString().padStart(2, '0'), r = '02';
    
    if (t < 270) { r='02'; j='00'; }
    else if (t < 360) { r='02'; j='04'; }
    else if (t < 720) { r='02'; j='06'; }
    else if (t < 900) { r='04'; j='12'; }
    else if (t < 1080) { r='04'; j='15'; }
    else if (t < 1170) { r='03'; j='18'; }
    else { r='04'; j='19'; }
    
    return `${base}${j}${r}`;
  }

  // 7x Tap Trigger
  function handleLogoTap() {
    tapCount++;
    if (tapCount >= 7) {
      showGhostInput = true;
      tapCount = 0;
    }
  }

  // Verification
  function verifyGhost() {
    const correctKey = getDynamicKey();
    if (ghostPassword === correctKey) {
      immunityUnlocked = true;
      attempts = 0;
      sessionStorage.setItem('dreamos_immunity', 'true');
    } else {      attempts++;
      if (attempts >= 3) {
        alert('⚠️ FakeCrash Activated! 🕌 Sholawat 1001x loaded in session');
        sessionStorage.setItem('dreamos_hidayah', '🕌 Subhanallah, Alhamdulillah, Allahu Akbar — '.repeat(1001));
      }
    }
    ghostPassword = '';
  }

  // Update time
  onMount(() => {
    setInterval(() => currentTime = new Date().toLocaleTimeString(), 1000);
    if (sessionStorage.getItem('dreamos_immunity') === 'true') {
      immunityUnlocked = true;
    }
  });
</script>

<!-- Crystal Glassmorphism UI -->
<div style="min-height:100vh;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;color:white">
  
  <!-- Logo Sultan -->
  <img src="/logo-sultan.png" alt="Dream OS" 
       style="width:150px;margin-bottom:2rem;cursor:pointer;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.3);transition:transform 0.2s"
       on:click={handleLogoTap} on:touchstart={handleLogoTap} />
  
  {#if tapCount > 0 && tapCount < 7}
    <p style="margin-top:-1rem;margin-bottom:1rem;opacity:0.8">Tap {tapCount}/7 👻</p>
  {/if}

  <!-- Title -->
  <h1 style="font-size:2.5rem;margin-bottom:0.5rem;text-shadow:0 2px 8px rgba(0,0,0,0.3)">Dream OS v21 Pro</h1>
  <p style="font-size:1.1rem;opacity:0.9;margin-bottom:2rem">Sovereign AI Interface • {currentTime}</p>

  <!-- Ghost Input (Hidden by default) -->
  {#if showGhostInput && !immunityUnlocked}
    <div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:2rem;border-radius:16px;max-width:400px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.2)">
      <p style="color:#64748b;margin-bottom:1rem;text-align:center">👻 Enter Ghost Key</p>
      <input type="password" bind:value={ghostPassword} 
             placeholder="dreamos2026XXXX" 
             style="width:100%;padding:0.75rem;border:1px solid #cbd5e1;border-radius:8px;margin-bottom:1rem;font-size:1rem"
             on:keyup={(e) => e.key === 'Enter' && verifyGhost()} />
      <button on:click={verifyGhost} 
              style="width:100%;padding:0.75rem;background:linear-gradient(135deg,#10b981,#06b6d4);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:1rem">
        Verify 🤲
      </button>
      {#if attempts > 0}
        <p style="color:#ef4444;font-size:0.875rem;margin-top:0.5rem;text-align:center">Attempt {attempts}/3 ⚠️</p>
      {/if}
    </div>  {/if}

  <!-- Immunity Menu -->
  {#if immunityUnlocked}
    <div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:2rem;border-radius:16px;max-width:500px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.2);margin-top:1rem">
      <p style="color:#10b981;font-weight:600;margin-bottom:1rem;text-align:center">✅ Immunity Mode Unlocked</p>
      
      <button style="width:100%;padding:0.75rem;margin:0.5rem 0;background:#fff;color:#64748b;border:1px solid #cbd5e1;border-radius:8px;cursor:pointer">
        🔧 Eruda DevTools
      </button>
      <button style="width:100%;padding:0.75rem;margin:0.5rem 0;background:#fff;color:#64748b;border:1px solid #cbd5e1;border-radius:8px;cursor:pointer">
        🛡️ Immunity Scanner
      </button>
      <button style="width:100%;padding:0.75rem;margin:0.5rem 0;background:#fff;color:#64748b;border:1px solid #cbd5e1;border-radius:8px;cursor:pointer">
        🧠 AI Assistant
      </button>
      <button on:click={() => { sessionStorage.removeItem('dreamos_immunity'); immunityUnlocked = false; }} 
              style="width:100%;padding:0.75rem;margin:0.5rem 0;background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:8px;cursor:pointer">
        🔒 Lock Immunity
      </button>
    </div>
  {/if}

  <!-- Footer -->
  {!showGhostInput && !immunityUnlocked && (
    <p style="margin-top:2rem;font-size:0.875rem;opacity:0.7">💡 Tip: Tap logo 7x untuk Ghost Login</p>
  )}
</div>
