import { Auth } from './modules/auth.js';
import { State } from './modules/state.js';
import { UI } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('loginBtn');
    const input = document.getElementById('accessKey');

    btn.addEventListener('click', async () => {
        if (Auth.check(input.value)) {
            alert('🤲 Bismillah! Akses Diterima.');
            UI.showDashboard();
            const data = await State.sync();
            UI.renderData(data);
        } else {
            alert('❌ Gagal, Sultan! Cek Integritas.');
        }
    });
});
