/* Dream Lib v1.0 - Shared utilities for all modules */
window.DreamLib = {
    esc: (s) => { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; },
    fmtDate: (d) => { if (!d) return '—'; return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); },
    fmtRp: (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID'),
    getData: (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { return []; } },
    setData: (key, data) => { localStorage.setItem(key, JSON.stringify(data)); },
    toast: (msg, type = 'success') => {
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        const el = document.createElement('div');
        el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(16,185,129,0.9);color:white;padding:9px 18px;border-radius:10px;z-index:99999;font-weight:700;font-size:0.85rem;';
        el.textContent = (icons[type] || '') + ' ' + msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    },
    getShift: () => { const h = new Date().getHours(); return (h >= 7 && h < 19) ? 'Pagi' : 'Malam'; },
    getToday: () => new Date().toISOString().split('T')[0],
    uid: () => Date.now().toString(36) + Math.random().toString(36).substr(2)
};
