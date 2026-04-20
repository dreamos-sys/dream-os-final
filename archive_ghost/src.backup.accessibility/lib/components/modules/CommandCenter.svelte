<script>
  import { aiAgent } from '../../aiCore';
  let query = '';
  let response = 'Ready for command, Master...';
  let processing = false;
  async function askAI() {
    if(!query) return;
    processing = true;
    response = await aiAgent.ask(query);
    query = '';
    processing = false;
  }
</script>
<div class="p-6 h-full flex flex-col">
  <h2 class="text-emerald-500 font-bold mb-4">NEURAL COMMAND CENTER</h2>
  <div class="flex-1 bg-black/40 border border-emerald-500/20 rounded-2xl p-4 font-mono text-[10px] mb-4 overflow-y-auto">
    <p class="text-emerald-400">>> AI Status: Gemini 3 Flash Online</p>
    <p class="text-slate-300 mt-2">{response}</p>
    {#if processing} <p class="animate-pulse text-amber-500 mt-2">Processing Neural Patterns...</p> {/if}
  </div>
  <div class="relative">
    <input bind:value={query} on:keydown={(e) => e.key === 'Enter' && askAI()} placeholder="Input Neural Command..." class="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs text-white outline-none focus:border-emerald-500" />
    <button on:click={askAI} class="absolute right-3 top-3 bg-emerald-600 text-[10px] px-3 py-1 rounded-lg">SEND</button>
  </div>
</div>
