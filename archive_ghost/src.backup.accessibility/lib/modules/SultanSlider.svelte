<script>
  import { onMount } from 'svelte';
  let current = 0;
  const slides = ["COMMAND_CENTER", "NEURAL_CORE", "ASSET_MANAGEMENT", "SECURITY_PATROL", "UMROH_VAULT", "K3_PROTOCOL", "SYSTEM_DIAGNOSTIC"];
  
  onMount(() => {
    const itv = setInterval(() => current = (current + 1) % slides.length, 7000);
    return () => clearInterval(itv);
  });
</script>

<div class="slider glass-morphism">
  <div class="content">
    <span class="idx">SLIDE_0{current + 1}</span>
    <h2>{slides[current]}</h2>
    <div class="progress"><div class="fill" style="animation: load 7s linear infinite"></div></div>
  </div>
</div>

<style>
  .slider { height: 160px; margin: 15px; border-radius: 20px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .content { text-align: center; z-index: 2; }
  .idx { font-size: 10px; color: var(--primary); letter-spacing: 2px; }
  h2 { margin: 10px 0; font-size: 1.1rem; letter-spacing: 3px; }
  .progress { width: 100px; height: 2px; background: rgba(255,255,255,0.1); margin: 0 auto; }
  .fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary); }
  @keyframes load { from { width: 0; } to { width: 100%; } }
</style>
