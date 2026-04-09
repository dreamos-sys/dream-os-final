<script>
  export let avail = "9.60";
  export let total = "256";
  // Logic presentase buat bar
  $: percent = (parseFloat(avail) / parseFloat(total) * 100).toFixed(1);
</script>

<div class="module-card">
  <div class="module-header">
    <span class="icon">🛰️</span>
    <h4>SYSTEM_CAPACITY</h4>
  </div>
  
  <div class="gauge-area">
    <div class="bar-bg">
      <div class="bar-fill" style="width: {percent}%"></div>
    </div>
    <div class="stats">
      <span class="avail">{avail} GB FREE</span>
      <span class="percent">{percent}%</span>
    </div>
  </div>
</div>

<style>
  .module-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-left: 4px solid var(--neon-cyan);
    padding: 15px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }
  .module-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }
  .module-header h4 {
    margin: 0;
    font-size: 0.8rem;
    letter-spacing: 2px;
    color: var(--neon-cyan);
  }
  .bar-bg {
    background: rgba(255,255,255,0.05);
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
  }
  .bar-fill {
    background: linear-gradient(90deg, var(--neon-cyan), var(--neon-green));
    height: 100%;
    box-shadow: 0 0 10px var(--neon-cyan);
  }
  .stats {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 0.7rem;
  }
  .avail { color: var(--neon-green); }
</style>
