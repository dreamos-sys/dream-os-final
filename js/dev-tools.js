// ========== DEV TOOLS PANEL ==========
(function() {
    const user = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}');
    if (user.role !== 'dev') return;
    
    const panel = document.createElement('div');
    panel.id = 'dev-tools-panel';
    panel.style.cssText = 'position:fixed;bottom:6rem;right:1rem;z-index:99999;background:rgba(15,23,42,0.95);backdrop-filter:blur(20px);border:2px solid #f59e0b;border-radius:16px;padding:1rem;max-width:250px;font-size:0.7rem;color:#f59e0b;box-shadow:0 0 30px rgba(245,158,11,0.4);';
    panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;"><strong>🛠️ DEV TOOLS</strong><button onclick="document.getElementById(\'dev-tools-panel\').remove()" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:1rem;">✕</button></div><button class="dev-btn" onclick="devInspectStorage()">🔍 Inspect Storage</button><button class="dev-btn" onclick="devClearAll()">🧹 Clear All Data</button><button class="dev-btn" onclick="devExportFull()">📥 Export Full Backup</button><button class="dev-btn" onclick="devForceRefresh()">🔄 Force Refresh</button><div id="dev-output" style="margin-top:0.5rem;font-size:0.65rem;color:#94a3b8;"></div>';
    
    const style = document.createElement('style');
    style.textContent = '.dev-btn{width:100%;padding:0.5rem;margin-bottom:0.4rem;background:rgba(245,158,11,0.2);border:1px solid rgba(245,158,11,0.3);border-radius:8px;color:#f59e0b;font-size:0.65rem;cursor:pointer;font-weight:600;}';
    document.head.appendChild(style);
    document.body.appendChild(panel);
    
    window.devInspectStorage = function() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i) + ': ' + localStorage.getItem(localStorage.key(i)).substring(0, 50));
        }
        document.getElementById('dev-output').innerHTML = '<pre style="max-height:300px;overflow-y:auto;">' + keys.join('\n') + '</pre>';
    };
    window.devClearAll = function() { if(confirm('Hapus SEMUA?')) { localStorage.clear(); location.reload(); } };
    window.devExportFull = function() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) { data[localStorage.key(i)] = localStorage.getItem(localStorage.key(i)); }
        const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'dreamos_dev_backup.json'; a.click();
    };
    window.devForceRefresh = function() { location.reload(true); };
})();
