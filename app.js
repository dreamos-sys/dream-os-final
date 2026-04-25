// TEST PERTAMA: APAKAH FILE INI DIBACA?
alert("🚨 SIAGA 1: SCRIPT DREAM-OS AKTIF!");

import { getPath } from './scripts/helpers/router.js';
import { renderGrid } from './scripts/helpers/ui.js';
import * as Agent from './scripts/helpers/ui-agent.js';

const d=document, g=i=>d.getElementById(i);
let ct = 0;

console.log("Sovereign Engine Started...");

// FORCE CLICK PADA WINDOW (Gak peduli logo-nya di mana)
window.addEventListener('touchstart', (e) => {
    const target = e.target;
    // Log di konsol buat kita intip
    console.log("Sentuhan pada:", target.tagName, "Class:", target.className);
    
    if (target.closest('.logo-glow') || target.closest('#logo') || target.tagName === 'IMG') {
        ct++;
        // Ganti lapor pake alert biar gak bisa bohong
        if(ct < 7) {
            alert("Ketukan ke-" + ct + " Masuk, Jenderal!");
        }

        if(ct === 7) {
            alert("MISI BERHASIL: MEMANGGIL MR. M!");
            try {
                if (typeof Agent.panggilMrM === 'function') Agent.panggilMrM();
                else Agent.default(); // Coba panggil default export
            } catch(err) {
                alert("Mr. M Mogok: " + err.message);
            }
            ct = 0;
        }
    }
}, {passive: false}); // Kita set false biar bisa stop propagation kalau perlu

d.addEventListener('DOMContentLoaded', () => {
    window.renderGrid = renderGrid;
    const f=g('login-form');
    if(f) f.onsubmit=e=>{
        e.preventDefault();
        g('login-screen').style.display='none';
        g('dashboard-screen').classList.add('active');
        renderGrid();
    }
});
