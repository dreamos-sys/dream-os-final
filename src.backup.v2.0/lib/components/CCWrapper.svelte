<script>
  import { onMount, onDestroy } from 'svelte';
  import initModule, { cleanup } from '../modules/commandcenter/module.js';

  let container;
  let isActive = false;

  onMount(async () => {
    // Simulasi config dan user data
    const config = { WEATHER_API_KEY: 'YOUR_KEY_HERE', WEATHER_CITY: 'Depok' };
    const currentUser = { name: 'My Bro', color: '#10b981', perms: ['all'] };
    
    // Panggil Otak Master
    if (container) {
      container.innerHTML = await initModule(config, null, null, currentUser);
      isActive = true;
    }
  });

  onDestroy(() => {
    cleanup();
  });
</script>

<div class="cc-wrapper bg-[#020617] min-h-screen text-white">
  {#if !isActive}
    <div class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
    </div>
  {/if}
  <div bind:this={container}></div>
</div>
