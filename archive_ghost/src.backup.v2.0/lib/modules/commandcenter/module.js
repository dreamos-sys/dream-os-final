'use strict';
export default async function initModule(config, utils, supabase, currentUser) {
    return `
    <div class="p-4 space-y-4">
        <div class="p-4 bg-slate-900/80 border border-emerald-500/30 rounded-2xl shadow-lg">
            <div class="flex items-center gap-3 mb-4">
                <span class="text-2xl">🚀</span>
                <div>
                    <h2 class="text-emerald-500 font-bold text-lg">Command Center v3.0</h2>
                    <p class="text-[10px] text-slate-400">Status: <span class="text-emerald-400">Online</span> | User: ${currentUser.name}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div class="text-[10px] text-slate-500 uppercase">📅 Bookings</div>
                    <div class="text-sm font-bold text-white">SISTEM OK</div>
                </div>
                <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div class="text-[10px] text-slate-500 uppercase">🛡️ Security</div>
                    <div class="text-sm font-bold text-white">AMAN</div>
                </div>
            </div>
            <button onclick="window.location.reload()" class="w-full mt-4 py-3 bg-emerald-500 text-slate-950 font-black rounded-xl active:scale-95 transition-all uppercase tracking-tighter">Refresh System</button>
        </div>
    </div>`;
}
