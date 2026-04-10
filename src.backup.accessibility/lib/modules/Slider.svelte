<script>
  import { onMount } from 'svelte';
  let current = 0;
  const slides = ["UMROH_MEMORIES", "NEURAL_CORE", "EDITOR_VAULT", "STORAGE_MONITOR", "COMMAND_PRO", "K3_SECURITY", "DREAM_OS_AI"];
  
  onMount(() => {
    const interval = setInterval(() => {
      current = (current + 1) % slides.length;
    }, 7000); // 7 Detik
    return () => clearInterval(interval);
  });
</script>

<div class="slider-box">
  {#each slides as slide, i}
    {#if current === i}
      <div class="slide">
        <div class="glass-overlay">
          <span>{i + 1} / 7</span>
          <h4>{slide}</h4>
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .slider-box { height: 180px; background: var(--glass-bg); border-radius: 20px; overflow: hidden; position: relative; border: 1px solid var(--glass-border); }
  .slide { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(45deg, #050505, #111); }
  .glass-overlay { text-align: center; }
  .glass-overlay span { font-size: 0.6rem; opacity: 0.5; }
  h4 { letter-spacing: 3px; color: var(--neon-cyan); }
</style>
