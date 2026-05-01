/**
 * Dream OS v3.2.3 - Global Module Handler
 * Principles: Addy Osmani (Fast UI) & Karpathy (Logic Flow)
 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('module-grid');
    
    if (!grid) {
        console.error('[DREAM-OS] Fatal: module-grid not found!');
        return;
    }

    grid.addEventListener('click', (e) => {
        // Cari element terdekat dengan class .mod (untuk menangani klik pada icon/span)
        const btn = e.target.closest('.mod');
        
        if (btn) {
            const moduleName = btn.getAttribute('data-modul');
            console.log(`%c[DREAM-OS] %cActivating: ${moduleName}`, "color: #3b82f6; font-weight: bold", "color: #fff");

            // Efek Visual Feedback (Active Scale)
            btn.classList.add('scale-90');
            setTimeout(() => btn.classList.remove('scale-90'), 100);

            // Logika Integrasi Modular Brain
            if (typeof window.triggerModularBrain === 'function') {
                window.triggerModularBrain(moduleName);
            } else {
                // Fallback jika global function belum load
                alert(`Modul ${moduleName.toUpperCase()} Bi idznillah siap dieksekusi!`);
            }
        }
    });

    console.log('[DREAM-OS] Core UI v3.2.3 Linked bi idznillah.');
});
