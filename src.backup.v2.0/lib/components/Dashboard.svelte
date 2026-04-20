<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const menus = [
    { id: 'cc', name: 'Command Center', icon: '📊' },
    { id: 'booking', name: 'Booking', icon: '📅' },
    { id: 'k3', name: 'K3', icon: '👷' },
    { id: 'sekuriti', name: 'Sekuriti', icon: '🛡️' },
    { id: 'janitor_in', name: 'Janitor IN', icon: '🧹' },
    { id: 'janitor_out', name: 'Janitor OUT', icon: '🍃' },
    { id: 'stok', name: 'Stok', icon: '📦' },
    { id: 'maintenance', name: 'Maintenance', icon: '🛠️' },
    { id: 'asset', name: 'Asset', icon: '💎' }
  ];

  function handleMenu(id) {
    dispatch('openModule', { id });
  }
</script>

<div class="grid grid-cols-3 gap-4 p-4 pb-20">
  {#each menus as menu}
    <button 
      on:click={() => handleMenu(menu.id)}
      class="flex flex-col items-center justify-center p-4 bg-slate-900/40 border border-slate-700 rounded-2xl hover:border-emerald-500 active:scale-95 transition-all shadow-lg"
    >
      <span class="text-3xl mb-2">{menu.icon}</span>
      <span class="text-[10px] uppercase font-bold text-slate-300 text-center leading-tight">{menu.name}</span>
    </button>
  {/each}
</div>
