<nav class="glass-morphism">
  <button><i class="fas fa-grid-2"></i><span>HOME</span></button>
  <button><i class="fas fa-brain"></i><span>AI</span></button>
  
  <div class="shalawat-btn">
    <div class="diamond"><span>صلوات</span></div>
  </div>

  <button><i class="fas fa-video"></i><span>EDIT</span></button>
  <button><i class="fas fa-user"></i><span>USER</span></button>
</nav>

<style>
  nav { position: fixed; bottom: 0; width: 100%; height: 80px; display: flex; justify-content: space-around; align-items: center; border-radius: 25px 25px 0 0; border-top: 1px solid var(--primary-glow); z-index: 200; }
  button { background: none; border: none; color: var(--text-dim); display: flex; flex-direction: column; align-items: center; gap: 4px; }
  button span { font-size: 8px; font-weight: bold; }
  .shalawat-btn { margin-top: -50px; }
  .diamond { width: 55px; height: 55px; background: linear-gradient(135deg, var(--primary), #059669); border-radius: 15px; transform: rotate(45deg); display: flex; align-items: center; justify-content: center; border: 3px solid var(--bg-core); box-shadow: 0 0 20px var(--primary-glow); }
  .diamond span { transform: rotate(-45deg); color: white; font-size: 10px; font-family: var(--font-serif); font-weight: bold; }
</style>
