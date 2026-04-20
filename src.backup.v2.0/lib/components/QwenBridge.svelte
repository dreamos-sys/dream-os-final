<script>
  import { chatHistory, isProcessing } from '../stores/aiStore';
  import { sendToLocalAI } from '../api/aiCore';
  
  let query = "";

  async function handleAction() {
    if (!query || $isProcessing) return;
    
    let userQuery = query;
    chatHistory.update(h => [...h, { type: 'user', text: userQuery }]);
    isProcessing.set(true);
    query = "";

    try {
      const reply = await sendToLocalAI(userQuery);
      chatHistory.update(h => [...h, { type: 'ai', text: reply }]);
    } catch (err) {
      chatHistory.update(h => [...h, { type: 'err', text: "CORE DISCONNECTED" }]);
    } finally {
      isProcessing.set(false);
    }
  }
</script>

<div class="modular-agent card-glass">
  <div class="agent-status">
    <div class="dot {$isProcessing ? 'thinking' : ''}"></div>
    <span>DREAM-OS SMART AGENT</span>
  </div>

  <div class="viewport">
    {#each $chatHistory as msg}
      <div class="bubble {msg.type}">
        {msg.text}
      </div>
    {/each}
  </div>

  <div class="input-group">
    <input bind:value={query} placeholder="Enter command..." on:keydown={(e) => e.key === 'Enter' && handleAction()} />
    <button on:click={handleAction}>{$isProcessing ? "..." : "RUN"}</button>
  </div>
</div>

<style>
  .modular-agent { background: rgba(0,0,0,0.4); border-radius: 20px; border: 1px solid #10b98155; padding: 15px; backdrop-filter: blur(15px); }
  .agent-status { display: flex; align-items: center; gap: 8px; font-size: 0.6rem; color: #10b981; font-weight: bold; margin-bottom: 10px; }
  .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
  .thinking { animation: pulse 0.8s infinite; box-shadow: 0 0 15px #10b981; }
  .viewport { height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
  .bubble { padding: 8px 12px; border-radius: 12px; font-size: 0.8rem; max-width: 90%; }
  .user { background: #10b98122; color: #fff; align-self: flex-end; border: 1px solid #10b98144; }
  .ai { background: #3b82f622; color: #fff; align-self: flex-start; border: 1px solid #3b82f644; }
  .err { color: #ff4444; font-size: 0.7rem; text-align: center; }
  .input-group { display: flex; gap: 8px; margin-top: 10px; }
  input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid #10b98133; color: #fff; padding: 8px; border-radius: 10px; outline: none; }
  button { background: #10b981; border: none; padding: 8px 15px; border-radius: 10px; font-weight: bold; cursor: pointer; }
  @keyframes pulse { 0% { opacity: 0.4; } 100% { opacity: 1; } }
</style>
