export function renderGrid() {
  const c = document.getElementById('module-container');
  if (!c) return;
  const mods = [
    {id:'cc', ic:'fa-desktop', lb:'CMD CENTER', cl:'#3b82f6'},
    {id:'booking', ic:'fa-calendar-check', lb:'BOOKING', cl:'#10b981'},
    {id:'k3', ic:'fa-biohazard', lb:'K3 FORM', cl:'#f59e0b'},
    {id:'sekuriti', ic:'fa-user-shield', lb:'SEKURITI', cl:'#ef4444'},
    {id:'jan-indoor', ic:'fa-pump-soap', lb:'JAN INDOOR', cl:'#06b6d4'},
    {id:'jan-outdoor', ic:'fa-leaf', lb:'JAN OUTDOOR', cl:'#84cc16'},
    {id:'stok', ic:'fa-box-open', lb:'STOK ALAT', cl:'#8b5cf6'},
    {id:'maint', ic:'fa-wrench', lb:'MAINTENANCE', cl:'#ec4899'},
    {id:'inventaris', ic:'fa-warehouse', lb:'INVENTARIS', cl:'#14b8a6'}
  ];
  c.innerHTML = `<div class="grid grid-cols-3 gap-4 p-4">${mods.map(m =>
    `<button data-modul="${m.id}" onclick="window.bukaModul('${m.id}')" class="mod p-6 rounded-2xl shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2" style="background:${m.cl}20;border:2px solid ${m.cl}40">
      <i class="fas ${m.ic} text-3xl" style="color:${m.cl}"></i>
      <span class="text-xs font-bold text-center" style="color:${m.cl}">${m.lb}</span>
    </button>`
  ).join('')}</div>`;
}
