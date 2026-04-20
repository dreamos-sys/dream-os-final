'use strict';
export default async function initModule(c, u, s, cu) {
    return `<div class="p-6 text-center">
        <div class="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-full mx-auto mb-4 border-4 border-slate-900 shadow-xl flex items-center justify-center text-3xl">👤</div>
        <h2 class="text-xl font-bold text-white">${cu.name}</h2>
        <p class="text-xs text-emerald-500 font-mono tracking-widest uppercase mt-1">${cu.role}</p>
        <div class="grid grid-cols-3 gap-2 mt-8">
            <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div class="text-lg font-bold">12</div>
                <div class="text-[8px] text-slate-500 uppercase">Booking</div>
            </div>
            <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div class="text-lg font-bold">5</div>
                <div class="text-[8px] text-slate-500 uppercase">Tasks</div>
            </div>
            <div class="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div class="text-lg font-bold">98%</div>
                <div class="text-[8px] text-slate-500 uppercase">Audit</div>
            </div>
        </div>
    </div>`;
}
