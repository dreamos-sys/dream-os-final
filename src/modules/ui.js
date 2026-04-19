export const UI = {
    // Organ: Transisi Layar
    showDashboard: () => {
        const login = document.getElementById('login-screen');
        const dash = document.getElementById('dashboard-screen');
        if(login) login.style.display = 'none';
        if(dash) {
            dash.style.display = 'block';
            dash.classList.add('active');
        }
    },

    // Organ: Render Interior (Header & 9 Modules)
    renderDashboard: (data) => {
        const container = document.getElementById('dashboard-screen');
        if(!container) return;

        // Bismillah Header
        const zikirText = data ? `${data.zikir.name} (${data.zikir.trans})` : "بِسْمِ اللَّهِ";
        const locationText = data ? `📍 ${data.loc.city} • Maghrib: ${data.pray.data.timings.Maghrib}` : "Syncing...";

        container.innerHTML = `
            <div class="dash-header" style="text-align:center; padding:20px 0;">
                <div class="bismillah-gold" style="font-family:'Amiri',serif; font-size:1.8rem; color:#d97706; margin-bottom:5px;">${zikirText}</div>
                <div class="loc-text" style="font-size:0.8rem; color:#10b981; font-weight:bold;">${locationText}</div>
            </div>

            <div class="module-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:15px; padding:10px;">
                ${UI.createModule('terminal', 'CMD')}
                ${UI.createModule('hard-hat', 'K3')}
                ${UI.createModule('shield-alt', 'SEC')}
                ${UI.createModule('broom', 'JAN')}
                ${UI.createModule('tools', 'ENG')}
                ${UI.createModule('bolt', 'POW')}
                ${UI.createModule('tint', 'WTR')}
                ${UI.createModule('wifi', 'NET')}
                ${UI.createModule('cog', 'SET')}
            </div>
            
            <footer style="text-align:center; margin-top:40px; font-size:0.6rem; color:#94a3b8;">
                The Power Soul of Shalawat © 2026
            </footer>
        `;
    },

    // Pembuluh Darah: Template Modul
    createModule: (icon, name) => `
        <div class="mod-card" style="background:white; padding:20px 10px; border-radius:20px; text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.03); border:1px solid #f1f5f9;">
            <i class="fas fa-${icon}" style="font-size:1.5rem; color:#10b981; margin-bottom:8px;"></i>
            <div style="font-size:0.7rem; font-weight:800; color:#1e293b;">${name}</div>
        </div>
    `
};
