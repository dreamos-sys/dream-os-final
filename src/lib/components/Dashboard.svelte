<script>
  const menus = [
    { name: 'CC', icon: '📊' }, { name: 'Booking', icon: '📅' }, { name: 'K3', icon: '👷' },
    { name: 'Sekuriti', icon: '🛡️' }, { name: 'Janitor IN', icon: '🧹' }, { name: 'Janitor OUT', icon: '🍃' },
    { name: 'Stok', icon: '📦' }, { name: 'Maintenance', icon: '🛠️' }, { name: 'Asset', icon: '💎' }
  ];
</script>

<div class="grid grid-cols-3 gap-4 p-4">
  {#each menus as menu}
    <button class="flex flex-col items-center justify-center p-4 bg-slate-900/40 border border-slate-700 rounded-2xl hover:border-emerald-500 transition-all">
      <span class="text-2xl mb-2">{menu.icon}</span>
      <span class="text-[10px] uppercase font-bold text-slate-300">{menu.name}</span>
    </button>
  {/each}
</div>

<div class="fixed bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-800 p-2 flex justify-around items-center">
  <button class="text-xs text-emerald-500 flex flex-col items-center">🏠<span>Home</span></button>
  <button class="text-xs text-slate-500 flex flex-col items-center">👤<span>Profile</span></button>
  <button class="bg-emerald-500 p-3 rounded-full -mt-8 shadow-lg shadow-emerald-500/50">💠</button>
  <button class="text-xs text-slate-500 flex flex-col items-center">ℹ️<span>About</span></button>
  <button class="text-xs text-slate-500 flex flex-col items-center">⚙️<span>Setting</span></button>
</div>
