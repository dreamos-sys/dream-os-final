<script>
  import { onMount } from 'svelte';
  import GhostAuth from '$lib/components/GhostAuth.svelte';
  
  let authenticated = false;
  
  onMount(() => {
    if (sessionStorage.getItem('dreamos_immunity') === 'true') {
      authenticated = true;
    }
  });
</script>

{#if authenticated}
  <main class="dashboard">
    <h1>🎉 Dream OS Dashboard</h1>
    <p>✅ Immunity Mode Active</p>
    <!-- Tambahkan modul lain di sini -->
  </main>
{:else}
  <GhostAuth on:authenticated={() => authenticated = true} />
{/if}

<style>
  .dashboard { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg,#f0f9ff,#f0fdf4); }
  h1 { background:linear-gradient(135deg,#10b981,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
</style>
