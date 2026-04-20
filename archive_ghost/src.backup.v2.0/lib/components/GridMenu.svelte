<script>
  const tools = [
    { id: 'cc', label: 'CommandCenter', icon: '📊', role: 'admin' },
    { id: 'booking', label: 'Booking', icon: '📅' },
    { id: 'k3', label: 'Form K3', icon: '🛡️' },
    { id: 'security', label: 'Security', icon: '👮' },
    { id: 'janitor-in', label: 'Janitor IN', icon: '🧹' },
    { id: 'janitor-out', label: 'Janitor OUT', icon: '🌳' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'stock', label: 'Stok Barang', icon: '📦' },
    { id: 'asset', label: 'Asset/Gudang', icon: '🏛️' }
  ];
</script>

<div class="grid grid-cols-3 gap-4 p-4">
  {#each tools as tool}
    <button class="flex flex-col items-center p-4 bg-slate-800/40 rounded-2xl border border-slate-700 hover:bg-slate-700">
      <span class="text-2xl mb-2">{tool.icon}</span>
      <span class="text-[10px] uppercase tracking-tighter text-center">{tool.label}</span>
    </button>
  {/each}
</div>
