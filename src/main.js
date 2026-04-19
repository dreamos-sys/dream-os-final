import { Auth } from './modules/auth.js';
import { State } from './modules/state.js';
import { UI } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('loginBtn');
    const input = document.getElementById('accessKey');

    btn.addEventListener('click', async () => {
        if (Auth.check(input.value)) {
            alert('🤲 Bismillah! Akses Diterima. Thuma\'ninah Active.');
            
            // 1. Ganti Layar
            UI.showDashboard();
            
            // 2. Render Skeleton (Biar ga kosong pas loading)
            UI.renderDashboard(null); 
            
            // 3. Tarik Data & Update Interior
            const data = await State.sync();
            UI.renderDashboard(data);
            
        } else {
            alert('❌ Gagal, Sultan! Cek Integritas.');
        }
    });
});
