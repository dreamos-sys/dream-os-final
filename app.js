import { getPath } from './scripts/helpers/router.js';
import { renderGrid } from './scripts/helpers/ui.js';
import { panggilMrM } from './scripts/helpers/ui-agent.js';

const d=document, g=i=>d.getElementById(i);
let clickCount = 0;

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
    const f = g('login-form');
    const logo = d.querySelector('.logo-glow img');

    // EASTER EGG: 7x Klik Logo buat panggil Mr. M
    if(logo) {
        logo.addEventListener('click', () => {
            clickCount++;
            if(clickCount === 7) {
                panggilMrM();
                clickCount = 0;
            }
        });
    }

    if(f) f.onsubmit = e => {
        e.preventDefault();
        g('login-screen').style.display = 'none';
        g('dashboard-screen').classList.add('active');
        renderGrid();
    }
});
