<script>
  import { theme, language, batterySaver } from '../../stores/systemStore';
  let langs = [
    {id: 'id', n: 'Indonesia'}, {id: 'en', n: 'English'},
    {id: 'ar', n: 'Arabic'}, {id: 'jp', n: 'Japanese'},
    {id: 'cn', n: 'Mandarin'}, {id: 'es', n: 'Spanish'}
  ];
</script>
<div class="p-6 text-slate-200">
  <h2 class="kufi-title text-xl mb-6">SYSTEM CONTROL</h2>
  <div class="setting-row">
    <span>Theme Mode</span>
    <button on:click={() => theme.update(t => t === 'dark' ? 'light' : 'dark')} class="toggle-btn">
      {$theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  </div>
  <div class="mt-6">
    <span class="text-[10px] text-slate-500 uppercase">International Language (ISO)</span>
    <div class="grid grid-cols-2 gap-2 mt-2">
      {#each langs as l}
        <button on:click={() => language.set(l.id)} class="p-2 text-[10px] rounded-lg border {$language === l.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700'}">
          {l.n}
        </button>
      {/each}
    </div>
  </div>
  <div class="setting-row mt-6">
    <span>Battery Saver</span>
    <input type="checkbox" bind:checked={$batterySaver} />
  </div>
</div>
<style>
  .setting-row { display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 15px; margin-bottom: 10px; }
  .toggle-btn { background: #1e293b; border: 1px solid #334155; color: white; padding: 8px 15px; border-radius: 10px; font-size: 10px; }
</style>
