import { getPath } from './scripts/helpers/router.js';
import { renderGrid } from './scripts/helpers/ui.js';
import { panggilMrM } from './scripts/helpers/ui-agent.js';

const d=document, g=i=>d.getElementById(i);
let count = 0;

// FUNGSI GLOBAL BIAR BISA DIPANGGIL DI MANA AJA
window.bukaModul = async i => {
    const c = g('module-container');
    c.innerHTML = '<div id="module-viewport" class="p-4"></div>';
    try {
        const m = await import(getPath(i));
        await m.default();
    } catch(e) { console.error(e); }
};

d.addEventListener('DOMContentLoaded', () => {
    window.renderGrid = renderGrid;

    // 🕵️‍♂️ UNIVERSAL CLICK TRACKER (Buat nyari siapa yang menghalangi)
    d.addEventListener('touchstart', (e) => {
        const el = e.target;
        console.log("👉 ANDA MENYENTUH:", el.tagName, "Class:", el.className);
        
        // Cek apakah elemen yang disentuh adalah LOGO atau didalam LOGO
        if (el.closest('.logo-glow') || el.closest('.logo-container') || el.tagName === 'IMG') {
            count++;
            
            // EFEK VISUAL RADIKAL: Bikin logo kedip merah pas diklik
            el.style.filter = 'brightness(2) sepia(1) saturate(10) hue-rotate(0deg)';
            setTimeout(() => el.style.filter = '', 150);
            
            if(count === 7) {
                panggilMrM();
                count = 0;
                alert("🕶️ MR. M: 'SIAP JENDERAL, SAYA MASUK!'");
            }
        }
    }, {passive: true});

    const f = g('login-form');
    if(f) f.onsubmit = e => {
        e.preventDefault();
        g('login-screen').style.display = 'none';
        g('dashboard-screen').classList.add('active');
        renderGrid();
    }
});
