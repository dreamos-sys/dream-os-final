<script>
  import { onMount } from 'svelte';
  let current = 0;
  const slides = [
    { title: "Today's Booking", msg: "12 Verified Sessions. No Conflicts.", icon: "fa-calendar-check" },
    { title: "K3 Security", msg: "NVIDIA Neural Scan Active.", icon: "fa-robot" },
    { title: "System Status", msg: "All Systems Operational. Bismillah.", icon: "fa-microchip" }
  ];
  onMount(() => {
    const s = setInterval(() => { current = (current + 1) % slides.length; }, 7000);
    return () => clearInterval(s);
  });
</script>
<div class="s-panel">
  <div class="s-head"><i class="fas {slides[current].icon}"></i> <span>{slides[current].title}</span></div>
  <div class="s-body">
    <i class="fas fa-chevron-left ar"></i>
    <p>{slides[current].msg}</p>
    <i class="fas fa-chevron-right ar"></i>
  </div>
  <div class="s-dots">
    {#each slides as _, i}<div class="dot {i === current ? 'active' : ''}"></div>{/each}
  </div>
</div>
<style>
  .s-panel { background: white; padding: 20px; border-radius: 28px; margin-bottom: 15px; text-align: center; border: 1px solid #e2e8f0; }
  .s-head { color: #10b981; font-size: 0.9rem; font-weight: bold; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .s-body { display: flex; align-items: center; justify-content: space-between; }
  .s-body p { font-size: 0.85rem; color: #64748b; flex: 1; margin: 0 10px; }
  .ar { color: #cbd5e1; font-size: 0.8rem; }
  .s-dots { display: flex; justify-content: center; gap: 6px; margin-top: 15px; }
  .dot { width: 6px; height: 6px; background: #e2e8f0; border-radius: 50%; transition: 0.3s; }
  .dot.active { background: #10b981; width: 20px; border-radius: 10px; }
</style>
