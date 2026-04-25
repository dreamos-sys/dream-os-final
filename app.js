import { getPath } from './scripts/helpers/router.js';
import { renderGrid } from './scripts/helpers/ui.js';
import * as Agent from './scripts/helpers/ui-agent.js'; // Import semua biar aman

const d=document, g=i=>d.getElementById(i);
let ct = 0;

// Fungsi buat ngetes apakah logo denger
const lapor = (msg) => {
    const t = g('debug-toast');
    if(t) {
        t.innerText = msg;
        t.style.display = 'block';
        setTimeout(() => { t.style.display = 'none'; }, 1000);
    }
    console.log("DREAM-OS-LOG:", msg);
};

// GLOBAL LISTENER (Tangkap semua sentuhan)
d.addEventListener('touchstart', (e) => {
    const logo = e.target.closest('.logo-glow') || e.target.closest('#logo');
    if (logo) {
        ct++;
        lapor(`Ketukan ke-${ct} Terdeteksi!`);
        
        // Efek Visual Langsung
        logo.style.opacity = '0.5';
        setTimeout(() => logo.style.opacity = '1', 100);

        if(ct === 7) {
            lapor("MEMANGGIL MR. M...");
            try {
                // Cek apakah fungsi ada di Agent atau Global
                if (typeof Agent.panggilMrM === 'function') Agent.panggilMrM();
                else if (typeof window.panggilMrM === 'function') window.panggilMrM();
                else alert("Mr. M Gak Ada di Rumah! (Fungsi Not Found)");
            } catch(err) {
                alert("Error Panggil Mr. M: " + err.message);
            }
            ct = 0;
        }
    }
}, {passive: true});

d.addEventListener('DOMContentLoaded', () => {
    window.renderGrid = renderGrid;
    const f=g('login-form');
    if(f) f.onsubmit=e=>{
        e.preventDefault();
        g('login-screen').style.display='none';
        g('dashboard-screen').classList.add('active');
        renderGrid();
        lapor("Dashboard Aktif!");
    }
});
