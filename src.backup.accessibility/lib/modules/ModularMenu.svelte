<script>
  export let items = [];
</script>

<div class="menu-grid">
  {#each items as item}
    <div class="menu-card">
      <span class="icon">{item.icon}</span>
      <span class="label">{item.label}</span>
      <div class="glow"></div>
    </div>
  {/each}
</div>

<style>
  .menu-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .menu-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    padding: 20px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .menu-card:hover {
    border-color: var(--neon-cyan);
    transform: translateY(-5px);
  }
  .icon { font-size: 1.5rem; margin-bottom: 8px; }
  .label { font-size: 0.7rem; letter-spacing: 1px; color: var(--text-dim); }
  .glow {
    position: absolute;
    bottom: -20px;
    width: 40px;
    height: 40px;
    background: var(--neon-cyan);
    filter: blur(25px);
    opacity: 0.2;
  }
</style>
