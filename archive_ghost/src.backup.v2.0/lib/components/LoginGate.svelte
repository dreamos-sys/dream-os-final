<script>
  let password = '';
  let showModal = false;
  let showPassword = false;
  let tapCount = 0;

  const keyDatabase = {
    "b15m1ll4h_012443410": "Developer",
    "Mr.M_Architect_2025": "Master",
    "4dm1n_AF6969@00": "CommandCenter"
  };

  function handleLogoTap() {
    tapCount++;
    if (tapCount >= 7) { showModal = true; tapCount = 0; }
    setTimeout(() => tapCount = 0, 3000);
  }

  function login() {
    if (keyDatabase[password] || password.startsWith('dreamos2026')) {
      localStorage.setItem('userRole', keyDatabase[password] || 'Ghost');
      window.location.hash = '#/dashboard';
      window.location.reload();
    } else {
      alert("KEY INVALID");
    }
  }
</script>

<div class="fixed inset-0 flex flex-col items-center justify-center dashboard-screen p-6">
  <div class="text-center mb-10">
    <div class="text-emerald-400 text-2xl font-bold mb-1">بِسْمِ اللَّهِ</div>
    <div class="text-[8px] tracking-[0.4em] text-slate-500">THE POWER SOUL OF SHALAWAT</div>
  </div>

  <div on:click={handleLogoTap} class="cursor-pointer active:scale-90 transition-all mb-12 relative">
    <div class="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></div>
    <img src="logo-sultan.png" class="w-32 h-32 relative" alt="Sultan" />
  </div>

  <div class="w-full max-w-[320px] space-y-4">
    <div class="relative">
      <input type={showPassword ? "text" : "password"} bind:value={password} placeholder="ENTER ACCESS KEY" class="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white text-center outline-none focus:border-amber-500" />
      <button class="absolute right-4 top-4" on:click={() => showPassword = !showPassword}>{showPassword ? "👁️" : "🙈"}</button>
    </div>
    <button on:click={login} class="w-full bg-emerald-500 py-4 rounded-2xl text-slate-950 font-black tracking-widest uppercase active:scale-95 transition-all">Initialize System</button>
  </div>
</div>
