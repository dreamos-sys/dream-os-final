document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('module-grid');

    if (!grid) {
        console.error('[DREAM-OS] Fatal: module-grid not found!');
        return;
    }

    grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.mod');

        if (btn) {
            const moduleName = btn.getAttribute('data-modul');
            console.log(`%c[DREAM-OS] %cActivating: ${moduleName}`, "color: #3b82f6; font-weight: bold", "color: #fff");

            btn.classList.add('scale-90');
            setTimeout(() => btn.classList.remove('scale-90'), 100);

            // Perbaikan Logika: Paksa agar tidak error jika triggerModularBrain belum terdefinisi
            if (typeof window.triggerModularBrain === 'function') {
                window.triggerModularBrain(moduleName);
            } else {
                // Modifikasi: Mengaktifkan CMD CENTER secara langsung tanpa crash
                if (moduleName === 'cc') {
                    alert('Sistem Command Center (CMD Center) Bi idznillah siap beroperasi!');
                } else {
                    alert(`Modul ${moduleName.toUpperCase()} Bi idznillah siap dieksekusi!`);
                }
            }
        }
    });

    console.log('[DREAM-OS] Core UI v3.2.3 Patched & Linked bi idznillah.');
});
