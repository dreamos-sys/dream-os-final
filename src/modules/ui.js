// Bismillah - UI Injector (ISO Standard)
export const UI = {
  showDashboard: () => {
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');
  },
  updateData: (data) => {
    if (!data) return;
    document.getElementById('zikir-ui').innerText = `${data.zikir.name} (${data.zikir.trans})`;
    document.getElementById('loc-ui').innerText = `📍 ${data.loc.city} • Maghrib: ${data.pray.data.timings.Maghrib}`;
  }
};
