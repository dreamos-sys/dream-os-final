import { getPath } from './scripts/helpers/router.js';
import { renderGrid } from './scripts/helpers/ui.js';
import { panggilMrM } from './scripts/helpers/ui-agent.js';

const d=document, g=i=>d.getElementById(i);
let count = 0;

window.bukaModul = async i => {
    const c = g('module-container');
    c.innerHTML = '<div id="module-viewport" class="p-4"></div>';
    try {
        const m = await import(getPath(i));
        await m.default();
    } catch(e) {
        c.innerHTML = '<p class="text-red-500">Kabel Putus!</p>';
    }
};

d.addEventListener('DOMContentLoaded', () => {
    window.renderGrid = renderGrid;
    
    // CARI LOGO DENGAN BERBAGAI CARA
    const logo = d.querySelector('.logo-glow') || d.querySelector('img[alt*="Logo"]');
    
    if(logo) {
        logo.style.cursor = 'pointer'; // Biar gak kaku!
        logo.style.pointerEvents = 'auto';
        logo.style.transition = 'transform 0.1s';

        logo.onclick = () => {
            count++;
            // Efek visual pas diklik (biar kerasa "hidup")
            logo.style.transform = 'scale(0.9)';
            setTimeout(() => logo.style.transform = 'scale(1)', 100);
            
            console.log("Ketukan Logo:", count);
            if(count === 7) {
                panggilMrM();
                count = 0;
            }
        };
    }

    const f = g('login-form');
    if(f) f.onsubmit = e => {
        e.preventDefault();
        g('login-screen').style.display = 'none';
        g('dashboard-screen').classList.add('active');
        renderGrid();
    }
});
