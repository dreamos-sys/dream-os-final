<script>
  import { onMount } from 'svelte';
  import CommandCenter from './lib/modules/commandcenter/CommandCenter.svelte';
  
  // Mock user - langsung login
  let currentUser = { 
    name: 'My Bro', 
    role: 'admin',
    avatar: '/logo-sultan.png',
    authenticated: true 
  };
  
  let loaded = false;
  
  onMount(() => {
    console.log('✅ Dream OS loaded - Auth bypassed');
    loaded = true;
  });
</script>

{#if loaded}
  <CommandCenter {currentUser} />
{:else}
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f0f9ff,#f0fdf4);">
    <p style="color:#64748b;">🚀 Loading Dream OS...</p>
  </div>
{/if}
