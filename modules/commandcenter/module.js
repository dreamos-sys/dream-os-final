/**
 * Dream OS v2.1 — Command Center (Stable Edition)
 * Basis v2.0 + Real-time Audit Integration
 */

export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader, translations, currentLang) {
    
    // UI DASHBOARD v2.1
    const shell = `
    <div id="cc-v21" class="p-4">
        <div class="cc3-panel cc3-sweep mb-4">
            <h2 class="text-xl font-bold text-emerald-500">🛡️ Command Center v2.1</h2>
            <p class="text-xs text-slate-400">Sovereign System Monitoring</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="cc3-stat"><div class="cc3-sv" id="cc-score">98</div><div class="cc3-sl">Efficiency Score</div></div>
            <div class="cc3-stat"><div class="cc3-sv" id="cc-bk">...</div><div class="cc3-sl">Bookings</div></div>
            <div class="cc3-stat"><div class="cc3-sv" id="cc-k3">...</div><div class="cc3-sl">K3 Reports</div></div>
            <div class="cc3-stat"><div class="cc3-sv" id="cc-db">ON</div><div class="cc3-sl">DB Status</div></div>
        </div>

        <div class="cc3-panel">
            <h3 class="text-sm font-bold mb-3">📜 Activity Feed (Real-time)</h3>
            <div id="cc-feed" class="space-y-2 max-h-60 overflow-y-auto"></div>
        </div>
    </div>`;

    setTimeout(async () => {
        const loadData = async () => {
            if (!supabase) return;
            const { data: logs } = await supabase.from('audit_logs').select('*').order('created_at', {ascending:false}).limit(10);
            const feed = document.getElementById('cc-feed');
            if(feed && logs) {
                feed.innerHTML = logs.map(l => `<div class="text-xs p-2 bg-slate-800 rounded border-l-2 border-emerald-500">
                    <span class="text-emerald-400">[${l.action}]</span> ${l.detail}
                </div>`).join('');
            }
        };
        loadData();
        // Subscribe biar v2.1 beneran real-time
        supabase.channel('public:audit_logs').on('postgres_changes', {event:'INSERT', schema:'public', table:'audit_logs'}, loadData).subscribe();
    }, 100);

    return shell;
}
