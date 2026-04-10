<script>
  import { onMount } from 'svelte';
  
  export let config = {};
  export let utils = {};
  export let supabase = null;
  export let currentUser = null;
  
  let systemStatus = {
    bookings: 'SISTEM OK',
    security: 'AMAN',
    lastUpdate: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };
  
  let isLoading = false;
  
  function announce(msg) {
    const el = document.getElementById('a11y-announcer');
    if (el) { el.textContent = msg; }
  }
  
  async function refreshSystem() {
    if (isLoading) return;
    isLoading = true;
    announce('Refreshing system...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    systemStatus.lastUpdate = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    announce('System refreshed');
    isLoading = false;
  }
  
  function navigateToModule(name) {
    announce(`Opening ${name}`);
  }
  
  const modules = [
    { key: 'commandcenter', icon: '📊', label: 'COMMAND CENTER', gradient: 'from-emerald-100 to-cyan-100' },
    { key: 'booking', icon: '📅', label: 'BOOKING', gradient: 'from-blue-100 to-indigo-100' },
    { key: 'k3', icon: '👷', label: 'K3', gradient: 'from-orange-100 to-yellow-100' },
    { key: 'sekuriti', icon: '🛡️', label: 'SEKURITI', gradient: 'from-slate-100 to-gray-200' },
    { key: 'janitor-indoor', icon: '🧹', label: 'JANITOR IN', gradient: 'from-amber-100 to-orange-100' },
    { key: 'janitor-outdoor', icon: '🌿', label: 'JANITOR OUT', gradient: 'from-green-100 to-emerald-100' },
    { key: 'stok', icon: '📦', label: 'STOK', gradient: 'from-amber-100 to-yellow-100' },
    { key: 'maintenance', icon: '🔧', label: 'MAINTENANCE', gradient: 'from-red-100 to-pink-100' },
    { key: 'asset', icon: '💎', label: 'ASSET', gradient: 'from-cyan-100 to-blue-100' }
  ];
</script>

<a href="#main-content" class="skip-link">Skip to content</a>
<div id="a11y-announcer" role="status" aria-live="polite" class="sr-only"></div>

<main id="main-content" role="main" class="container mx-auto px-4 py-6 max-w-md">
  <header role="banner" class="mb-6 text-center">
    <div class="mb-3 flex justify-center">
      <div class="crystal-icon p-4 bg-gradient-to-br from-emerald-100 to-cyan-100" style="width:80px;height:80px;border-radius:24px;">
        <img src="/logo-sultan.png" alt="Dream OS Logo" class="w-full h-full object-contain" />
      </div>
    </div>
    <p class="text-xs text-secondary mb-1" style="font-family:'Amiri',serif;">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
    <h1 class="text-2xl font-bold gradient-text">Dream OS Neural Link</h1>
    <p class="text-sm text-secondary mt-1">CC Management</p>
  </header>

  <section class="crystal-card p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="crystal-icon bg-gradient-to-br from-emerald-100 to-cyan-100">
          <span class="text-2xl">🚀</span>
        </div>
        <div>
          <h2 class="text-lg font-bold text-emerald">Command Center v3.0</h2>
          <p class="text-xs text-secondary">Status: <span class="text-emerald font-semibold">Online</span> | User: {currentUser?.name || 'My Bro'}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="crystal-card glass-white p-3">
        <div class="flex items-center gap-2 mb-2">
          <span>📅</span>
          <span class="text-[10px] font-semibold text-secondary uppercase">BOOKINGS</span>
        </div>
        <p class="text-sm font-bold text-primary">{systemStatus.bookings}</p>
      </div>
      <div class="crystal-card glass-white p-3">
        <div class="flex items-center gap-2 mb-2">
          <span>🛡️</span>
          <span class="text-[10px] font-semibold text-secondary uppercase">SECURITY</span>
        </div>
        <p class="text-sm font-bold text-primary">{systemStatus.security}</p>
      </div>
    </div>

    <button aria-label="Refresh system" class="crystal-button w-full flex items-center justify-center gap-2" on:click={refreshSystem} disabled={isLoading}>
      {#if isLoading}<span>⏳</span><span>REFRESHING...</span>{:else}<span>🔄</span><span>REFRESH SYSTEM</span>{/if}
    </button>
    <p class="text-[10px] text-tertiary text-center mt-3">Last update: {systemStatus.lastUpdate}</p>
  </section>

  <nav role="navigation" aria-label="Main modules" class="mb-6">
    <div class="grid grid-cols-3 gap-3">
      {#each modules as mod}
      <button aria-label={mod.label} class="crystal-card p-3 flex flex-col items-center gap-2" on:click={() => navigateToModule(mod.label)}>
        <div class="crystal-icon bg-gradient-to-br {mod.gradient}">
          <span class="text-xl">{mod.icon}</span>
        </div>
        <span class="text-[10px] font-semibold text-primary text-center leading-tight">{mod.label}</span>
      </button>
      {/each}
    </div>
  </nav>
</main>
