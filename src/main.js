import { Auth } from './modules/auth.js';
import { UI } from './modules/ui.js';
import { State } from './modules/state.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const togglePass = document.getElementById('togglePass');
    const input = document.getElementById('accessKey');

    togglePass.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        togglePass.classList.toggle('fa-eye-slash');
    });

    loginBtn.addEventListener('click', async () => {
        const data = await State.sync();
        const maghrib = data ? data.pray.data.timings.Maghrib.replace(':','') : "0000";
        const ghostKey = parseInt(maghrib) + 3;

        const authResult = Auth.check(input.value, ghostKey);
        
        if (authResult) {
            UI.showDashboard();
            // Injeksi Zikir ke tempat yang BENAR, bukan nindih Bismillah
            if(data) {
                document.getElementById('zikir-dynamic').innerText = `ZIKIR: ${data.zikir.name} (${data.zikir.trans})`;
            }
        } else {
            alert('❌ Kunci Salah, Sultan!');
        }
    });
});
