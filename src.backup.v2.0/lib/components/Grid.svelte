<script>
  const mods = [
    { icon: 'fa-chart-simple', color: '#a855f7', label: 'COMMAND', sub: 'Neural Hub', tag: 'PRO' },
    { icon: 'fa-calendar-day', color: '#10b981', label: 'BOOKING', sub: 'Registration' },
    { icon: 'fa-triangle-exclamation', color: '#f59e0b', label: 'K3 AGENT', sub: 'HSE Safety' },
    { icon: 'fa-shield-halved', color: '#3b82f6', label: 'SECURITY', sub: 'Access Ctrl' },
    { icon: 'fa-broom', color: '#f97316', label: 'JANITOR IN', sub: 'Housekeeping' },
    { icon: 'fa-leaf', color: '#10b981', label: 'JANITOR OUT', sub: 'Horticulture' },
    { icon: 'fa-box-open', color: '#f59e0b', label: 'LOGISTIK', sub: 'Inventory' },
    { icon: 'fa-wrench', color: '#3b82f6', label: 'MAINTENANCE', sub: 'Engineering' },
    { icon: 'fa-building-shield', color: '#94a3b8', label: 'ASSET MGMT', sub: 'Facility' }
  ];
</script>
<div class="grid">
  {#each mods as m}
    <div class="c">
      {#if m.tag}<span class="t">{m.tag}</span>{/if}
      <div class="f" style="--c: {m.color}"><i class="fas {m.icon}"></i></div>
      <span class="lm">{m.label}</span><span class="ls">{m.sub}</span>
    </div>
  {/each}
</div>
<style>
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .c { background: white; padding: 18px 5px; border-radius: 28px; text-align: center; position: relative; border: 1px solid #e2e8f0; }
  .t { position: absolute; top: 8px; right: 8px; background: #f59e0b; color: white; font-size: 0.45rem; padding: 2px 6px; border-radius: 6px; font-weight: 800; }
  .f { width: 48px; height: 48px; border: 2.5px solid var(--c); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 1.3rem; color: var(--c); }
  .lm { display: block; font-size: 0.6rem; font-weight: 800; color: #1e293b; }
  .ls { font-size: 0.45rem; color: #94a3b8; font-weight: bold; }
</style>
