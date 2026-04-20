<script>
  const modules = [
    { n: "KARYAWAN", i: "fa-users" }, { n: "PENGGUNA", i: "fa-user-gear" }, { n: "SECURITY", i: "fa-shield-halved" },
    { n: "K3", i: "fa-helmet-safety" }, { n: "ASSET", i: "fa-cubes" }, { n: "BOOKING", i: "fa-calendar-check" },
    { n: "CMD_CENTER", i: "fa-chess-queen" }, { n: "MAINTENANCE", i: "fa-gears" }, { n: "SETTING", i: "fa-sliders" }
  ];
</script>

<div class="grid">
  {#each modules as m}
    <div class="card glass-morphism">
      <i class="fas {m.i}"></i>
      <span>{m.n}</span>
    </div>
  {/each}
</div>

<style>
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 0 15px; }
  .card { padding: 20px 5px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: 0.3s; }
  .card:hover { border-color: var(--primary); transform: translateY(-5px); background: rgba(16, 185, 129, 0.1); }
  i { font-size: 1.5rem; color: var(--primary); }
  span { font-size: 9px; font-weight: bold; letter-spacing: 1px; }
</style>
