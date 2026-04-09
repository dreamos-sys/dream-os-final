<script>
import QwenBridge from './QwenBridge.svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let passRakaat = "";
  let showGhostPass = false;

  function checkGhostKey() {
    const d = new Date();
    const hh = d.getHours().toString().padStart(2, '0');
    const t = d.getHours() * 60 + d.getMinutes();
    
    let r = (t >= 1080 && t < 1170) ? "03" : 
            ((t >= 270 && t < 720) ? "02" : "04"); // Simplified rakaat mapping
    
    if (passRakaat === `dreamos2026${hh}${r}`) {
       alert("✓ ARCHITECT MODE: NO LOGS ACTIVE");
       window.location.hash = "/ghost-stealth";
       dispatch('close');
    } else {
       alert("✗ INVALID ARCHITECT KEY");
    }
  }
</script>

<div class="ghost-box">
  <h3 style="color:#0f0; text-shadow: 0 0 10px #0f0;">GHOST STEALTH</h3>
  <p style="font-size: 0.6rem; color: #555;">[ ARCHITECT MODE - NO LOGS ]</p>
  <div class="ghost-input-wrapper">
    <input type={showGhostPass ? "text" : "password"} bind:value={passRakaat} placeholder="dreamos2026{HH}{Rakaat}" />
    <button class="ghost-eye" on:click={() => showGhostPass = !showGhostPass}>{showGhostPass ? "🔓" : "🔐"}</button>
  </div>
  <button class="ghost-unlock" on:click={checkGhostKey}>INFILTRATE</button>
  <button class="ghost-close" on:click={() => dispatch('close')}>ABORT</button>
</div>

<style>
  .ghost-box { background: #000; color: #0f0; border: 1px solid #0f0; padding: 30px; border-radius: 10px; text-align: center; font-family: monospace; }
  input { background: #000; color: #0f0; border: 1px solid #0f0; padding: 10px; width: 100%; text-align: center; margin: 15px 0; outline: none; }
  .ghost-unlock { background: #0f0; color: #000; border: none; padding: 10px; width: 100%; font-weight: bold; cursor: pointer; }
  .ghost-close { background: none; border: none; color: #f00; margin-top: 10px; cursor: pointer; font-size: 0.8rem; }
  .ghost-input-wrapper { position: relative; display: flex; align-items: center; }
  .ghost-eye { position: absolute; right: 10px; background: none; border: none; color: #0f0; cursor: pointer; }
</style>
