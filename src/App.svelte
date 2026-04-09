<script>
  let storage = { avail: "9.60", total: "128" };
  const modules = [
    { n: "KARYAWAN", i: "👥" }, { n: "PENGGUNA", i: "👤" }, { n: "SECURITY", i: "🛡️" },
    { n: "K3", i: "👷" }, { n: "ASSET", i: "📦" }, { n: "BOOKING", i: "🗓️" },
    { n: "COMMAND CENTER", i: "🕹️" }, { n: "MAINTENANCE", i: "🔧" }, { n: "SETTING", i: "⚙️" }
  ];
</script>

<main class="sovereign-ui">
  <header>
    <div class="stealth-meta">📍 DEPOK_CORE | ISO-27001</div>
    <div class="spiritual">
      <h1>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
      <p>اَللهم صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ</p>
    </div>
  </header>

  <section class="hero-slider">
    <div class="slide-content">
      <span class="tag">NEURAL_SLIDE_01</span>
      <h2>SOVEREIGN ENTERPRISE v3.5</h2>
      <div class="progress-bar"><div class="fill"></div></div>
    </div>
  </section>

  <section class="stats-grid">
    <div class="stat-card">
      <span class="label">STORAGE_FREE</span>
      <span class="value">{storage.avail} GB</span>
    </div>
    <div class="stat-card">
      <span class="label">CORE_STATUS</span>
      <span class="value active">ACTIVE</span>
    </div>
  </section>

  <section class="bento-grid">
    {#each modules as mod}
      <div class="bento-item">
        <span class="icon">{mod.i}</span>
        <span class="name">{mod.n}</span>
      </div>
    {/each}
  </section>

  <nav class="bottom-nav">
    <button class="active">🏠</button>
    <button>🧠</button>
    <div class="shalawat-center">صلوات</div>
    <button>🎬</button>
    <button>⚙️</button>
  </nav>
</main>

<style>
  :global(body) { background: #020617; color: #e2e8f0; font-family: sans-serif; margin: 0; }
  .sovereign-ui { max-width: 450px; margin: 0 auto; padding: 20px; padding-bottom: 100px; }
  header { text-align: center; margin-bottom: 25px; }
  .stealth-meta { font-family: monospace; font-size: 8px; color: #10b981; opacity: 0.6; margin-bottom: 10px; }
  h1 { font-size: 1.5rem; color: #10b981; margin: 0; }
  .spiritual p { font-size: 0.9rem; opacity: 0.7; margin: 5px 0; }
  
  .hero-slider { background: rgba(15,23,42,0.8); border: 1px solid rgba(16,185,129,0.2); border-radius: 20px; padding: 25px; text-align: center; margin-bottom: 20px; }
  h2 { font-size: 0.9rem; letter-spacing: 3px; color: #10b981; }
  .progress-bar { height: 2px; background: rgba(255,255,255,0.1); margin-top: 15px; }
  .fill { height: 100%; background: #10b981; width: 40%; box-shadow: 0 0 10px #10b981; }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .stat-card { background: rgba(15,23,42,0.8); border: 1px solid rgba(16,185,129,0.1); padding: 15px; border-radius: 15px; text-align: center; }
  .stat-card .label { display: block; font-size: 7px; opacity: 0.5; margin-bottom: 5px; }
  .stat-card .value { font-weight: bold; color: #10b981; }

  .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .bento-item { background: rgba(15,23,42,0.8); border: 1px solid rgba(16,185,129,0.2); padding: 20px 5px; border-radius: 18px; text-align: center; transition: 0.3s; }
  .bento-item .icon { font-size: 1.5rem; display: block; margin-bottom: 5px; }
  .bento-item .name { font-size: 8px; font-weight: bold; opacity: 0.8; }

  .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(2,6,23,0.9); backdrop-filter: blur(10px); height: 70px; display: flex; justify-content: space-around; align-items: center; border-top: 1px solid rgba(16,185,129,0.2); }
  .shalawat-center { width: 60px; height: 60px; background: #10b981; border-radius: 18px; transform: rotate(45deg); display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; margin-top: -40px; border: 4px solid #020617; box-shadow: 0 0 20px rgba(16,185,129,0.4); }
  button { background: none; border: none; font-size: 1.2rem; opacity: 0.4; }
  button.active { opacity: 1; filter: drop-shadow(0 0 5px #10b981); }
</style>
