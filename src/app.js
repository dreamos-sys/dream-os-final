// Dream OS v2.1 - Lightweight Controller
document.addEventListener('DOMContentLoaded', () => {
  // 1. Clock & Prayer Time Simulation
  const serverTimeEl = document.getElementById('server-time');
  const updateTime = () => {
    const now = new Date();
    serverTimeEl.textContent = `Server: ${now.toTimeString().split(' ')[0]} UTC`;
  };
  setInterval(updateTime, 1000);
  updateTime();

  // 2. Nav Switching
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // TODO: Route to pages later
    });
  });

  // 3. Module Click Handler (Placeholder for Backend)
  const modules = document.querySelectorAll('.module');
  modules.forEach(mod => {
    mod.addEventListener('click', () => {
      const name = mod.getAttribute('data-module');
      console.log(`[Module Opened]: ${name}`);
      // TODO: Open modal / navigate to module page
    });
  });

  // 4. Theme Toggle (Light/Dark preview)
  const themeBtn = document.querySelector('.theme-toggle');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    // TODO: Persist preference in localStorage
  });
});
