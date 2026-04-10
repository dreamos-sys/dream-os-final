<div class="pulse-container">
  <div class="wave"></div>
  <div class="wave"></div>
  <div class="wave"></div>
  <p>ULTRA_NANO_CORE: ACTIVE</p>
</div>

<style>
  .pulse-container {
    background: rgba(0, 242, 255, 0.05);
    border: 1px solid rgba(0, 242, 255, 0.2);
    padding: 20px;
    border-radius: 15px;
    text-align: center;
    position: relative;
  }
  .wave {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 100%; height: 100%;
    border: 1px solid var(--neon-cyan);
    border-radius: 15px;
    animation: pulse 3s infinite;
    opacity: 0;
  }
  .wave:nth-child(2) { animation-delay: 1s; }
  .wave:nth-child(3) { animation-delay: 2s; }

  @keyframes pulse {
    0% { width: 80%; height: 80%; opacity: 0.5; }
    100% { width: 120%; height: 120%; opacity: 0; }
  }
  p { font-size: 0.6rem; color: var(--neon-cyan); margin: 0; z-index: 2; position: relative;}
</style>
