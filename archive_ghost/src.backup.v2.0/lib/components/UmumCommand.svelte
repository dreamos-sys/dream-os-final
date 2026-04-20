<script>
  let activeTab = 'kabag'; // Default: Kepala Bagian
  
  const dataUmum = {
    kabag: {
      title: "STRATEGIC DASHBOARD (KABAG UMUM)",
      metrics: [
        { label: "EFISIENSI ASET", val: "94%", color: "#10b981" },
        { label: "ANGGARAN OPS", val: "AMAN", color: "#3b82f6" },
        { label: "AUDIT ISO", val: "READY", color: "#f59e0b" }
      ],
      logs: ["Persetujuan Maintenance Sektor B", "Review Vendor AC Berhasil", "Audit Energi Mingguan: Hijau"]
    },
    koordinator: {
      title: "OPERATIONAL HUB (KOORD. UMUM)",
      metrics: [
        { label: "STATUS JANITOR", val: "ON-DUTY", color: "#ec4899" },
        { label: "STOK LOGISTIK", val: "85%", color: "#8b5cf6" },
        { label: "TUGAS K3", val: "4 PENDING", color: "#ef4444" }
      ],
      logs: ["Lantai 2: Sedang di-Pel", "Refill Kertas Printer Sektor C", "Update Stok ATK Masuk"]
    }
  };
</script>

<div class="umum-shell">
  <div class="tab-switcher">
    <button class={activeTab === 'kabag' ? 'active' : ''} on:click={() => activeTab = 'kabag'}>🏢 KABAG</button>
    <button class={activeTab === 'koordinator' ? 'active' : ''} on:click={() => activeTab = 'koordinator'}>🛠️ KOORDINATOR</button>
  </div>

  <div class="content-box animate-fade">
    <h3 class="title">{dataUmum[activeTab].title}</h3>
    
    <div class="metrics-grid">
      {#each dataUmum[activeTab].metrics as m}
        <div class="metric-card" style="--c: {m.color}">
          <span class="m-label">{m.label}</span>
          <span class="m-val">{m.val}</span>
        </div>
      {/each}
    </div>

    <div class="log-section">
      <span class="log-title">LIVE UPDATES:</span>
      {#each dataUmum[activeTab].logs as log}
        <div class="log-item">> {log}</div>
      {/each}
    </div>
  </div>
</div>

<style>
  .umum-shell { background: rgba(15, 23, 42, 0.8); margin: 15px; border-radius: 20px; border: 1px solid #10b98133; overflow: hidden; font-family: 'Rajdhani', sans-serif; }
  .tab-switcher { display: flex; background: #1e293b; padding: 5px; gap: 5px; }
  .tab-switcher button { flex: 1; border: none; padding: 10px; border-radius: 12px; background: transparent; color: #64748b; font-weight: bold; font-size: 0.7rem; transition: 0.3s; }
  .tab-switcher button.active { background: #10b981; color: white; box-shadow: 0 0 15px rgba(16, 185, 129, 0.3); }

  .content-box { padding: 20px; }
  .title { font-size: 0.75rem; color: #94a3b8; letter-spacing: 2px; margin-bottom: 20px; text-align: center; }
  
  .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
  .metric-card { background: rgba(2, 6, 23, 0.5); padding: 10px 5px; border-radius: 15px; border-bottom: 3px solid var(--c); text-align: center; }
  .m-label { display: block; font-size: 0.5rem; color: #64748b; margin-bottom: 5px; }
  .m-val { font-size: 0.8rem; font-weight: bold; color: white; }

  .log-section { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; border: 1px solid #334155; }
  .log-title { font-size: 0.6rem; color: #10b981; font-weight: bold; display: block; margin-bottom: 10px; }
  .log-item { font-size: 0.65rem; color: #cbd5e1; margin-bottom: 5px; font-family: monospace; }
  
  .animate-fade { animation: fadeIn 0.5s ease-in-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
