import { getPath } from './scripts/helpers/router.js';
import { renderGrid } from './scripts/helpers/ui.js';
import { panggilMrM } from './scripts/helpers/ui-agent.js';

const d=document, g=i=>d.getElementById(i);
let ct = 0;

window.bukaModul=async i=>{
  const v=g('module-container');
  v.innerHTML='<div id="module-viewport"></div>';
  try{const m=await import(getPath(i));await m.default();}catch(e){console.error(e)}
};

d.addEventListener('touchstart', (e) => {
    // Cari apakah yang disentuh adalah logo
    const l = e.target.closest('.logo-glow');
    if (l) {
        ct++;
        l.style.filter = 'brightness(1.5)';
        setTimeout(() => l.style.filter = '', 100);
        if(ct === 7) { panggilMrM(); ct = 0; }
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
    }
});
