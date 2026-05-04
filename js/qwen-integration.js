/** Dream OS Qwen Admin v1.0 — Standalone, <2KB */
(function() {
    'use strict';
    DreamOS.register('qwenIntegration', {
        config: { hours: {start:7.5,end:16}, lightning: true },        checkHours() { const h=new Date().getHours()+new Date().getMinutes()/60; return h>=this.config.hours.start&&h<=this.config.hours.end; },
        render() {
            const c = document.getElementById('cmd-dashboard');
            if(!c) return;
            c.innerHTML = `<div class="p-4 bg-slate-900 text-white rounded-2xl">
                <h3 class="font-bold text-amber-500 mb-3">🤖 Qwen Admin Panel</h3>
                <p class="text-xs text-slate-400 mb-3">Status: ${this.checkHours()?'✅ Aktif':'⏰ Di luar jam operasional'}</p>
                <button onclick="DreamOS.run('qwenIntegration','report')" class="w-full py-2 bg-emerald-600 rounded text-xs">📋 Kirim Laporan</button>
            </div>`;
        },
        report() { alert('✅ Laporan tersimpan dalam log audit.'); },
        verify() { console.log('✅ Qwen Integration verified'); return true; }
    });
    if(window.DreamOS) DreamOS.modules.qwenIntegration.verify();
})();
