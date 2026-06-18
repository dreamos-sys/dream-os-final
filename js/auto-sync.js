// Dream OS Auto-Sync Engine v1.0 (Sultan Edition)
(function() {
    const SUPABASE_URL = 'https://gbigjdhifispatrrskgh.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdqZGhpZmlzcGF0cnJza2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzY1OTIsImV4cCI6MjA5Njc1MjU5Mn0.eqAFloptEHV3oIUjortuTsWvkhJgjb3xsXHM9nXfF8k';
    const SYNC_TABLE = 'kv_store';

    // ========== UPLOAD (Diam-diam kirim ke Cloud) ==========
    async function uploadKey(key, value) {
        if (!key.startsWith('dreamos_')) return;
        // Debounce sederhana biar nggak spam server kalau ngetik cepat
        if (window.syncTimeout) clearTimeout(window.syncTimeout);
        window.syncTimeout = setTimeout(async () => {
            try {
                const now = new Date().toISOString();
                await fetch(`${SUPABASE_URL}/rest/v1/${SYNC_TABLE}`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': 'Bearer ' + SUPABASE_KEY,
                        'Content-Type': 'application/json',
                        'Prefer': 'resolution=merge-duplicates'
                    },
                    body: JSON.stringify({ key: key, value: value, updated_at: now })
                });
                console.log('☁️ Auto-sync uploaded:', key);
            } catch(e) { console.warn('Sync upload failed (offline?):', e.message); }
        }, 2000); // Tunggu 2 detik setelah user berhenti ngetik/klik baru upload
    }

    // ========== DOWNLOAD (Tarik data terbaru pas buka app) ==========
    async function pullAll() {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${SYNC_TABLE}?select=*`, {
                headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
            });
            const rows = await res.json();
            if (!rows || rows.length === 0) return;
            let count = 0;
            for (const row of rows) {
                if (!row.key.startsWith('dreamos_')) continue;
                const localTs = localStorage.getItem(row.key + '_ts') || '1970-01-01';
                // Kalau data di cloud lebih baru, timpa data lokal
                if (row.updated_at > localTs) {
                    localStorage.setItem(row.key, row.value);
                    localStorage.setItem(row.key + '_ts', row.updated_at);
                    count++;
                }
            }
            if(count > 0) {
                console.log('🔄 Auto-sync pulled', count, 'updated keys. Refreshing UI...');
                if(window.renderDashboard) window.renderDashboard(); // Refresh tampilan kalau ada data baru
            }
        } catch(e) { console.warn('Sync pull failed:', e.message); }
    }

    // ========== OVERRIDE localStorage.setItem ==========
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.call(localStorage, key, value);
        localStorage.setItem(key + '_ts', new Date().toISOString()); // Catat waktu update lokal
        if (key.startsWith('dreamos_')) {
            uploadKey(key, value);
        }
    };

    // ========== INIT ==========
    if (navigator.onLine) { pullAll(); }
    window.addEventListener('online', pullAll);
    console.log('🛡️ Auto-Sync Engine Mounted. Real-time sync active!');
})();
