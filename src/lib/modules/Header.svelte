<script>
  let taps = 0;
  const triggerGhost = () => {
    taps++;
    if (taps >= 5) {
      const code = prompt("🔑 GHOST_ACCESS_CODE:");
      if (code === "dreamos2026") alert("GHOST_MODE_ACTIVE");
      taps = 0;
    }
    setTimeout(() => taps = 0, 3000);
  };
</script>

<header class="glass-morphism" on:click={triggerGhost}>
  <div class="meta">
    <span>📍 DEPOK_CORE | 2026</span>
    <span>ISO 27001 ✅</span>
  </div>
  <div class="religious">
    <h1 class="arabic">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
    <p class="shalawat">اَللهم صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ</p>
  </div>
</header>

<style>
  header { padding: 15px; border-bottom: 1px solid var(--primary-glow); position: sticky; top: 0; z-index: 100; }
  .meta { display: flex; justify-content: space-between; font-size: 8px; font-family: var(--font-mono); color: var(--primary); opacity: 0.6; }
  .religious { text-align: center; margin-top: 5px; }
  .arabic { font-family: var(--font-serif); font-size: 1.5rem; color: var(--primary); margin: 0; }
  .shalawat { font-family: var(--font-serif); font-size: 0.9rem; color: var(--text-dim); margin: 2px 0; }
</style>
