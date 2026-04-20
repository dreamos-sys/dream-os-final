'use strict';
export default async function initModule(c, u, s, cu) {
    return `<div class="p-4 space-y-4">
        <div class="asset-stat-grid grid grid-cols-2 gap-3">
            <div class="bg-slate-900 p-3 rounded-2xl border border-purple-500/30">
                <div class="text-[10px] text-slate-500 uppercase">Total Aset</div>
                <div class="text-xl font-bold text-purple-400">1.240</div>
            </div>
            <div class="bg-slate-900 p-3 rounded-2xl border border-emerald-500/30">
                <div class="text-[10px] text-slate-500 uppercase">Kondisi Baik</div>
                <div class="text-xl font-bold text-emerald-400">98%</div>
            </div>
        </div>
        <div class="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <h4 class="text-sm font-bold text-slate-300 mb-3">🔍 Scan Asset QR</h4>
            <div class="aspect-square w-32 mx-auto bg-white p-2 rounded-xl mb-3">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DREAM-OS-ASSET-001" class="w-full">
            </div>
            <p class="text-[10px] text-center text-slate-500 tracking-widest uppercase">ISO 55001 Asset System</p>
        </div>
    </div>`;
}
