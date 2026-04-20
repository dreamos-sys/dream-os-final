<script>
  import { onMount } from 'svelte';
  let time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  onMount(() => {
    const t = setInterval(() => { time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }, 1000);
    return () => clearInterval(t);
  });
</script>
<div class="card">
  <div class="p-row">
    <img src="/dream-os-final/logo-sultan.png" alt="Sultan Logo" class="logo" />
    <div class="desc">
      <h2>Master Architect</h2>
      <span class="badge">SYSTEMS ADMINISTRATOR v2.1</span>
    </div>
    <button aria-label="Logout System" class="logout" on:click={() => { localStorage.clear(); location.reload(); }}>
      <i class="fas fa-power-off"></i>
    </button>
  </div>
  <div class="stat-grid">
    <div class="pill gold"><i class="fas fa-mosque"></i> DZUHUR</div>
    <div class="pill time">{time}</div>
    <div class="pill batt"><i class="fas fa-battery-three-quarters"></i> 90%</div>
    <div class="pill-btn" aria-label="Quick Settings"><i class="fas fa-sliders"></i></div>
  </div>
</div>
<style>
  .card { background: white; padding: 18px; border-radius: 28px; margin-bottom: 15px; border: 1px solid #e2e8f0; }
  .p-row { display: flex; align-items: center; gap: 15px; margin-bottom: 18px; }
  .logo { width: 50px; height: 50px; border-radius: 12px; border: 2px solid #f59e0b; }
  .desc h2 { margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 800; }
  .badge { font-size: 0.55rem; color: #10b981; font-weight: 800; }
  .logout { margin-left: auto; background: #fee2e2; border: none; color: #ef4444; width: 40px; height: 40px; border-radius: 12px; cursor: pointer; }
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .pill { background: #f1f5f9; padding: 8px 2px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; text-align: center; }
  .gold { background: #fff7ed; color: #f97316; }
  .pill-btn { background: #f1f5f9; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: #64748b; cursor: pointer; }
</style>
