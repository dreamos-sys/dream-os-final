export const UI = {
    showDashboard: () => {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'block';
    },
    renderData: (data) => {
        if(!data) return;
        document.getElementById('zikir-display').innerText = `${data.zikir.name} (${data.zikir.trans})`;
    }
};
