// Dream OS Auto-Sync Engine v1.0 (Supabase Edition)
(function() {
    let SYNC_TABLE = 'kv_store';
    let loginChecked = false;

    function getConfig() {
        if (window.DREAMOS_CONFIG && window.DREAMOS_CONFIG.supabaseUrl && window.DREAMOS_CONFIG.supabaseKey) {
            return window.DREAMOS_CONFIG;
        }
        return {
            supabaseUrl: 'https://gbigjdhifispatrrskgh.supabase.co',
            supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdqZGhpZmlzcGF0cnJza2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzY1OTIsImV4cCI6MjA5Njc1MjU5Mn0.eqAFloptEHV3oIUjortuTsWvkhJgjb3xsXHM9nXfF8k'
        };
    }

    function isLoggedIn() {
        return !!localStorage.getItem('dreamos_session_active');
    }

    async function uploadKey(key, value) {
        if (!key.startsWith('dreamos_')) return;
        const config = getConfig();
        if (!config.supabaseUrl) return;
        
        if (window.syncTimeout) clearTimeout(window.syncTimeout);
        window.syncTimeout = setTimeout(async () => {
            try {
                const now = new Date().toISOString();
                await fetch(`${config.supabaseUrl}/rest/v1/${SYNC_TABLE}`, {
                    method: 'POST',
                    headers: {
                        'apikey': config.supabaseKey,
                        'Authorization': 'Bearer ' + config.supabaseKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates'
                    },
                    body: JSON.stringify({ key: key, value: value, updated_at: now })
                });
                console.log('☁️ Auto-sync uploaded:', key);
            } catch(e) { console.warn('Sync upload failed:', e.message); }
        }, 2000);
    }

    async function pullAll() {
        if (!isLoggedIn()) return; // Jangan tarik data sebelum login
        const config = getConfig();
        if (!config.supabaseUrl) return;
        
        try {
            const res = await fetch(`${config.supabaseUrl}/rest/v1/${SYNC_TABLE}?select=*`, {
                headers: { 'apikey': config.supabaseKey, 'Authorization': 'Bearer ' + config.supabaseKey }
            });
            const rows = await res.json();
            if (!rows || rows.length === 0) return;
            let count = 0;
            for (const row of rows) {
                if (!row.key.startsWith('dreamos_')) continue;
                const localTs = localStorage.getItem(row.key + '_ts') || '1970-01-01';
                if (row.updated_at > localTs) {
                    localStorage.setItem(row.key, row.value);
                    localStorage.setItem(row.key + '_ts', row.updated_at);
                    count++;
                }
            }
            if(count > 0) {
                console.log('🔄 Auto-sync pulled', count, 'keys. Refreshing UI...');
                if(window.renderDashboard) window.renderDashboard();
            }
        } catch(e) { console.warn('Sync pull failed:', e.message); }
    }

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.call(localStorage, key, value);
        // Jangan catat timestamp untuk key sistem, hanya untuk data dreamos_
        if (key.startsWith('dreamos_')) {
            localStorage.setItem(key + '_ts', new Date().toISOString());
            if (isLoggedIn()) uploadKey(key, value);
        }
    };

    // Hanya jalankan pullAll jika sudah login
    function checkAndPull() {
        if (navigator.onLine && isLoggedIn()) {
            pullAll();
            loginChecked = true;
        } else if (!isLoggedIn()) {
            // Coba lagi nanti
            setTimeout(checkAndPull, 3000);
        }
    }

    if (navigator.onLine) {
        checkAndPull();
    }
    window.addEventListener('online', () => {
        if (isLoggedIn()) pullAll();
    });
    console.log('🛡️ Auto-Sync Engine Mounted (wait for login).');
})();
