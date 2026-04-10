<script>
  // Minimal import - langsung render HTML kalau module error
  let loaded = false;
  let errorMsg = '';
  
  // Try dynamic import CommandCenter
  onMount(async () => {
    try {
      const mod = await import('$lib/modules/commandcenter/CommandCenter.svelte');
      // Jika sukses, kita bisa render (tapi untuk minimal, cukup show success)
      loaded = true;
    } catch (e) {
      errorMsg = e.message;
      console.error('Module load error:', e);
    }
  });
  
  import { onMount } from 'svelte';
</script>

<div style="min-height:100vh;padding:1rem;font-family:sans-serif;">
  {#if !loaded}
    <div style="text-align:center;padding:2rem;">
      <h2 style="color:#10b981;">🚀 Dream OS Loading...</h2>
      <p style="color:#64748b;margin:1rem 0;">
        {errorMsg ? `Error: ${errorMsg}` : 'Initializing Crystal UI...'}
      </p>
      <div style="width:40px;height:40px;border:3px solid #10b981;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto;"></div>
    </div>
  {:else}
    <!-- Jika module load sukses, tampilkan placeholder -->
    <div style="text-align:center;padding:2rem;">
      <h1 style="color:#10b981;">✨ Dream OS Neural Link</h1>
      <p style="color:#64748b;">Command Center loaded successfully!</p>
      <p style="font-size:0.8rem;color:#94a3b8;margin-top:1rem;">
        🤲 Bi idznillah - My Bro
      </p>
    </div>
  {/if}
</div>

<style>
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
