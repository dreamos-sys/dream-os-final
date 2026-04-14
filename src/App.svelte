<script>
  import { onMount } from 'svelte';
  let showGhostInput=false, ghostPassword='', attempts=0, immunityUnlocked=false, tapCount=0, currentTime='';

  function getDynamicKey(){
    const n = new Date();
    const h = n.getHours();
    const m = n.getMinutes();
    const t = h * 60 + m;
    const base = 'dreamos2026';
    let j = h.toString().padStart(2, '0');
    let r = '02';
    if(t < 270){ r='02'; j='00'; }
    else if(t < 360){ r='02'; j='04'; }
    else if(t < 720){ r='02'; j='06'; }
    else if(t < 900){ r='04'; j='12'; }
    else if(t < 1080){ r='04'; j='15'; }
    else if(t < 1170){ r='03'; j='18'; }
    else{ r='04'; j='19'; }
    return `${base}${j}${r}`;
  }

  function handleLogoTap(){ tapCount++; if(tapCount >= 7){ showGhostInput = true; tapCount = 0; } }

  function verifyGhost(){
    const k = getDynamicKey();
    if(ghostPassword === k){
      immunityUnlocked = true;
      attempts = 0;
      sessionStorage.setItem('dreamos_immunity', 'true');
    } else {
      attempts++;
      if(attempts >= 3){
        alert('⚠️ FakeCrash!');
        sessionStorage.setItem('dreamos_hidayah', '🕌 '.repeat(1001));
      }
    }
    ghostPassword = '';
  }

  onMount(() => {
    setInterval(() => currentTime = new Date().toLocaleTimeString(), 1000);
    if(sessionStorage.getItem('dreamos_immunity') === 'true') immunityUnlocked = true;
  });
</script>

<div style="min-height:100vh;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;color:white">
  <img src="/logo-sultan.png" alt="Dream OS" style="width:150px;margin-bottom:2rem;cursor:pointer;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.3)" on:click={handleLogoTap}/>
  {#if tapCount > 0 && tapCount < 7}<p style="margin-top:-1rem;opacity:0.8">Tap {tapCount}/7 👻</p>{/if}
  <h1 style="font-size:2.5rem;margin-bottom:0.5rem;text-shadow:0 2px 8px rgba(0,0,0,0.3)">Dream OS v21 Pro</h1>
  <p style="font-size:1.1rem;opacity:0.9;margin-bottom:2rem">Sovereign AI • {currentTime}</p>
  
  {#if showGhostInput && !immunityUnlocked}
    <div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:2rem;border-radius:16px;max-width:400px;width:100%">
      <p style="color:#64748b;margin-bottom:1rem;text-align:center">👻 Enter Ghost Key</p>
      <input type="password" bind:value={ghostPassword} placeholder="dreamos2026XXXX" style="width:100%;padding:0.75rem;border:1px solid #cbd5e1;border-radius:8px;margin-bottom:1rem"/>
      <button on:click={verifyGhost} style="width:100%;padding:0.75rem;background:linear-gradient(135deg,#10b981,#06b6d4);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600">Verify 🤲</button>
      {#if attempts > 0}<p style="color:#ef4444;font-size:0.875rem;margin-top:0.5rem;text-align:center">Attempt {attempts}/3 ⚠️</p>{/if}
    </div>
  {/if}
  
  {#if immunityUnlocked}
    <div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:2rem;border-radius:16px;max-width:500px;width:100%;margin-top:1rem">
      <p style="color:#10b981;font-weight:600;margin-bottom:1rem;text-align:center">✅ Immunity Unlocked</p>
      <button style="width:100%;padding:0.75rem;margin:0.5rem 0;background:#fff;border:1px solid #cbd5e1;border-radius:8px;cursor:pointer">🔧 Eruda</button>
      <button on:click={()=>{sessionStorage.removeItem('dreamos_immunity');immunityUnlocked=false}} style="width:100%;padding:0.75rem;margin:0.5rem 0;background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;border-radius:8px;cursor:pointer">🔒 Lock</button>
    </div>
  {/if}
  
  {#if !showGhostInput && !immunityUnlocked}
    <p style="margin-top:2rem;font-size:0.875rem;opacity:0.7">💡 Tap logo 7x for Ghost Login</p>
  {/if}
</div>
