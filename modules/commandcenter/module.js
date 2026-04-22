/**
 * Dream OS v2.1 — Command Center ACTIVE ENGINE
 * Fix: Clickable Buttons & Real-time Routing
 */

export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader) {
    
    // 1. Definisikan UI dengan Tombol yang punya ID/Class Klik
    const shell = `
    <div id="cc-main" class="p-4 bg-slate-950 min-h-screen font-['Urbanist']">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-white tracking-widest">COMMAND <span class="text-emerald-500">CENTER</span></h1>
            <div class="cc3-badge bg-emerald-500/20 text-emerald-500 text-[10px] px-2 py-1 rounded">SYSTEM LIVE</div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button id="btn-booking" class="cc-btn p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-emerald-500 transition-all group">
                <i class="fa-solid fa-calendar-check text-2xl text-emerald-500 group-hover:scale-110 transition"></i>
                <p class="text-xs text-slate-400 mt-2 font-bold">BOOKING</p>
            </button>
            <button id="btn-k3" class="cc-btn p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-orange-500 transition-all group">
                <i class="fa-solid fa-triangle-exclamation text-2xl text-orange-500 group-hover:scale-110 transition"></i>
                <p class="text-xs text-slate-400 mt-2 font-bold">K3 REPORT</p>
            </button>
            <button id="btn-maintenance" class="cc-btn p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all group">
                <i class="fa-solid fa-tools text-2xl text-blue-500 group-hover:scale-110 transition"></i>
                <p class="text-xs text-slate-400 mt-2 font-bold">MAINTENANCE</p>
            </button>
            <button id="btn-security" class="cc-btn p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-purple-500 transition-all group">
                <i class="fa-solid fa-shield-halved text-2xl text-purple-500 group-hover:scale-110 transition"></i>
                <p class="text-xs text-slate-400 mt-2 font-bold">SECURITY</p>
            </button>
        </div>

        <div id="cc-display" class="cc3-panel bg-slate-900/50 p-6 rounded-3xl border border-slate-800 min-h-[300px] flex items-center justify-center text-center">
            <div id="welcome-msg">
                <h2 class="text-3xl font-bold text-white mb-2">Assalamualaikum, Jenderal</h2>
                <p class="text-slate-500">Pilih modul di atas untuk mulai memantau kedaulatan.</p>
            </div>
        </div>
    </div>`;

    // 2. Logika "Menghidupkan" Tombol (Event Listeners)
    setTimeout(() => {
        const display = document.getElementById('cc-display');

        // Fungsi Ganti Konten Display
        const updateDisplay = (title, icon, color) => {
            display.innerHTML = `
                <div class="animate-fadeIn w-full">
                    <i class="fa-solid ${icon} text-5xl mb-4" style="color: ${color}"></i>
                    <h3 class="text-xl font-bold text-white mb-4">${title}</h3>
                    <div class="p-4 bg-slate-800 rounded-xl border border-slate-700">
                        <p class="text-sm text-slate-300">Menghubungkan ke database Sovereign ${title}...</p>
                        <div class="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full animate-progress" style="background-color: ${color}; width: 100%"></div>
                        </div>
                    </div>
                    <button id="btn-back" class="mt-6 text-xs text-slate-500 underline">Kembali ke Greeting</button>
                </div>
            `;
            
            // Tombol Balik
            document.getElementById('btn-back').onclick = () => {
                location.reload(); // Simple way to reset
            };
        };

        // Pasang Klik ke masing-masing ID
        document.getElementById('btn-booking').onclick = () => updateDisplay('BOOKING SYSTEM', 'fa-calendar-check', '#10b981');
        document.getElementById('btn-k3').onclick = () => updateDisplay('K3 REAL-TIME', 'fa-triangle-exclamation', '#f97316');
        document.getElementById('btn-maintenance').onclick = () => updateDisplay('MAINTENANCE HUB', 'fa-tools', '#3b82f6');
        document.getElementById('btn-security').onclick = () => updateDisplay('SECURITY LOGS', 'fa-shield-halved', '#a855f7');

        showToast('Command Center v2.1: Semua tombol diaktifkan!', 'success');

    }, 100);

    return shell;
}
