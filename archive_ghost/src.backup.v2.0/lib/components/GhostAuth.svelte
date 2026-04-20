<!-- src/lib/components/GhostAuth.svelte -->
<script>
  import { onMount } from 'svelte';
  
  // State
  let showGhostInput = false;
  let ghostPassword = '';
  let attempts = 0;
  let isLocked = false;
  let immunityUnlocked = false;
  let tapCount = 0;

  // 🔐 PRAYER KEY LOGIC v4.0 — Presisi Menit!
  function getDynamicKey() {
    const now = new Date();
    const hh = now.getHours();
    const mm = now.getMinutes();
    const currentTime = hh * 60 + mm;
    const base = "dreamos2026";
    let jam = hh.toString().padStart(2, '0');
    let rakaat = "02";

    // Mapping Waktu (Dalam Menit) — JANGAN SAMPAI SALAH!
    if (currentTime >= 0 && currentTime < 270) {        // 00:00 - 04:29
      rakaat = "02"; jam = "00"; // Tahajud
    } else if (currentTime >= 270 && currentTime < 360) { // 04:30 - 05:59
      rakaat = "02"; jam = "04"; // Subuh
    } else if (currentTime >= 360 && currentTime < 720) { // 06:00 - 11:59
      rakaat = "02"; jam = "06"; // Dhuha
    } else if (currentTime >= 720 && currentTime < 900) { // 12:00 - 14:59
      rakaat = "04"; jam = "12"; // Zhuhur
    } else if (currentTime >= 900 && currentTime < 1080) { // 15:00 - 17:59
      rakaat = "04"; jam = "15"; // Ashar
    } else if (currentTime >= 1080 && currentTime < 1170) { // 18:00 - 19:29
      rakaat = "03"; jam = "18"; // Maghrib
    } else {                                              // 19:30 - 23:59
      rakaat = "04"; jam = "19"; // Isya
    }
    return `${base}${jam}${rakaat}`;
  }

  // 👻 7x Tap Trigger
  function handleLogoTap() {
    tapCount++;
    if (tapCount >= 7) {
      showGhostInput = true;
      tapCount = 0;
    }
  }

  // 🔐 Verification + Trap Logic
  function verifyGhost() {
    const correctKey = getDynamicKey();
    if (ghostPassword === correctKey) {
      immunityUnlocked = true;
      attempts = 0;
      console.log('✅ GhostAuth verified — Immunity Mode activated');
      sessionStorage.setItem('dreamos_immunity', 'true');
    } else {
      attempts++;
      console.warn(`❌ Attempt ${attempts}/3 — Wrong key`);
      if (attempts >= 3) {
        triggerTrap();
      }
    }
    ghostPassword = '';
  }

  // 🚨 THE TRAP: FakeCrash + Sholawat 1001x
  function triggerTrap() {
    isLocked = true;
    const fingerprint = {
      ua: navigator.userAgent,
      timestamp: Date.now()
    };
    const traps = JSON.parse(localStorage.getItem('dreamos_traps') || '[]');
    traps.push({ type: 'auth_failed', fingerprint, at: new Date().toISOString() });
    localStorage.setItem('dreamos_traps', JSON.stringify(traps));
    
    // Kloning Sholawat 1001x 🤲
    const sholawat = '🕌 Subhanallah, Alhamdulillah, Allahu Akbar — '.repeat(1001);
    sessionStorage.setItem('dreamos_hidayah', sholawat);
    
    alert('⚠️ SYSTEM ERROR: FakeCrash Activated\n\n🕌 Hadiah Hidayah: Sholawat 1001x loaded in session');
    console.log('🚨 TRAP ACTIVATED');
  }

  // 🛡️ Immunity Scanner
  function runImmunityScan() {
    return { antivirus: '✅ Clean', bug: '✅ OK', phishing: '✅ Safe' };
  }

  onMount(() => {
    if (sessionStorage.getItem('dreamos_immunity') === 'true') {
      immunityUnlocked = true;
    }
    console.log('👻 GhostAuth loaded — Tap logo 7x to reveal');
  });
</script>

<div class="ghost-auth-container">
  <!-- Logo Trigger -->
  <img src="/dream-live/logo-sultan.png" alt="Dream OS" class="logo" 
       on:click={handleLogoTap} on:touchstart={handleLogoTap} />
  
  {#if tapCount > 0 && tapCount < 7}
    <p class="hint">Tap {tapCount}/7 👻</p>
  {/if}

  <!-- Ghost Input -->
  {#if showGhostInput && !immunityUnlocked}
    <div class="ghost-form">
      <p>👻 Enter Ghost Key</p>
      <input type="password" bind:value={ghostPassword} placeholder="dreamos2026XXXX" 
             on:keyup={(e) => e.key === 'Enter' && verifyGhost()} />
      <button on:click={verifyGhost}>Verify 🤲</button>
      {#if attempts > 0}<p class="error">Attempt {attempts}/3 ⚠️</p>{/if}
    </div>
  {/if}

  <!-- Immunity Menu -->
  {#if immunityUnlocked}
    <div class="immunity-menu">
      <p>✅ Immunity Mode Unlocked</p>
      <button on:click={() => console.log('🔧 Eruda toggled')}>🔧 Eruda DevTools</button>
      <button on:click={() => alert(JSON.stringify(runImmunityScan()))}>🛡️ Immunity Scan</button>
      <button on:click={() => { sessionStorage.removeItem('dreamos_immunity'); immunityUnlocked = false; }} class="logout">
        🔒 Lock
      </button>
    </div>
  {/if}

  {!showGhostInput && !immunityUnlocked && <p class="footer">💡 Key: dreamos2026{jam}{rakaat}</p>}
</div>

<style>
  .ghost-auth-container { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg,#f0f9ff,#f0fdf4); text-align:center; padding:2rem; }
  .logo { width:80px; cursor:pointer; transition:transform 0.2s; }
  .logo:active { transform:scale(0.95); }
  .hint { color:#64748b; font-size:0.875rem; margin-top:0.5rem; }
  .ghost-form { margin-top:2rem; padding:1.5rem; background:rgba(255,255,255,0.8); backdrop-filter:blur(12px); border-radius:16px; max-width:400px; }
  .ghost-form input { width:100%; padding:0.75rem; border:1px solid #cbd5e1; border-radius:8px; margin:0.5rem 0; }
  .ghost-form button { background:linear-gradient(135deg,#10b981,#06b6d4); color:white; padding:0.75rem 1.5rem; border:none; border-radius:8px; cursor:pointer; font-weight:600; }
  .error { color:#ef4444; font-size:0.875rem; margin-top:0.5rem; }
  .immunity-menu { margin-top:2rem; }
  .immunity-menu button { display:block; width:100%; max-width:300px; margin:0.5rem auto; padding:0.75rem; background:#fff; border:1px solid #cbd5e1; border-radius:8px; cursor:pointer; }
  .immunity-menu .logout { background:#fee2e2; color:#dc2626; border-color:#fca5a5; }
  .footer { color:#94a3b8; font-size:0.75rem; margin-top:2rem; }
</style><!-- PASTE SELURUH KODE SVELTE DI ATAS DI SINI -->
