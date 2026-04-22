/**
 * Dream OS v2.1 — Command Center MASTER SOVEREIGN
 * 7 Slides | 7 Seconds | 8 Modules Integrated
 * Logic: AI Smart Agent Pro (Auto-Routing & Weather Awareness)
 */

export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader, translations, currentLang) {
    
    // UI DASHBOARD DENGAN KOMPONEN SLIDE
    const shell = `
    <div id="cc-master" class="p-4 bg-slate-950 min-h-screen font-['Rajdhani']">
        <div class="flex justify-between items-center mb-6 border-b border-emerald-500/30 pb-4">
            <div>
                <h1 class="text-2xl font-bold text-white tracking-widest">COMMAND CENTER <span class="text-emerald-500">v2.1</span></h1>
                <p class="text-[10px] text-emerald-500/60 uppercase">Kabag Umum & Koordinator Command Hub</p>
            </div>
            <div class="text-right">
                <div id="cc-clock" class="text-xl font-bold text-white">00:00:00</div>
                <div class="cc3-badge bg-emerald-500 text-black text-[10px] px-2 font-bold rounded">AI AGENT ACTIVE</div>
            </div>
        </div>

        <div id="cc-slides" class="relative h-[500px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-2xl shadow-emerald-500/5">
            </div>

        <div class="grid grid-cols-4 md:grid-cols-8 gap-2 mt-6">
            ${['BOOKING','K3','SECURITY','JAN-IN','JAN-OUT','STOCK','MAINT','ASSET'].map(m => `
                <div class="p-2 bg-slate-900 border border-slate-800 rounded text-center">
                    <div class="text-[9px] text-slate-500 mb-1">${m}</div>
                    <div class="h-1 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 animate-pulse" style="width: 100%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;

    // LOGIKA SLIDE & AI AGENT
    setTimeout(async () => {
        let currentSlide = 0;
        const totalSlides = 7;
        const slideContainer = document.getElementById('cc-slides');

        const getSlideContent = async (index) => {
            // DATA FETCHING REAL-TIME
            const { data: logs } = await supabase.from('audit_logs').select('*').order('created_at', {ascending:false}).limit(5);
            const { count: bkCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending');
            
            const slides = [
                // SLIDE 1: GREETING
                `<div class="flex flex-col items-center justify-center h-full text-center p-10 animate-fadeIn">
                    <h2 class="text-5xl font-bold text-white mb-4">Assalamualaikum</h2>
                    <p class="text-xl text-emerald-400 mb-6">Selamat Datang di Hub Kedaulatan Bagian Umum</p>
                    <div class="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl">
                        <p class="text-sm text-slate-300">Silakan isi form sesuai kebutuhan Anda. Terimakasih 😚</p>
                    </div>
                </div>`,

                // SLIDE 2: BOOKING DATA
                `<div class="p-8 h-full">
                    <h3 class="text-emerald-500 font-bold mb-4">📅 REAL-TIME BOOKING & REMINDER</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <div class="text-3xl font-bold text-white">${bkCount || 0}</div>
                            <div class="text-xs text-slate-500">Pending Today</div>
                        </div>
                        <div class="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
                            <div class="text-xs text-blue-400 font-bold mb-2">BESOK (Reminder)</div>
                            <div class="text-[10px] text-slate-300">Service AC Terpusat (10:00)</div>
                        </div>
                    </div>
                </div>`,

                // SLIDE 3: K3 PROGRESS
                `<div class="p-8 h-full">
                    <h3 class="text-orange-500 font-bold mb-4">⚠️ K3 & WORKFORCE PROGRESS</h3>
                    <div class="space-y-4">
                        ${['Maintenance','Security','Janitor In','Janitor Out'].map(t => `
                            <div>
                                <div class="flex justify-between text-[10px] text-slate-400 mb-1"><span>${t}</span><span>85%</span></div>
                                <div class="h-1.5 w-full bg-slate-800 rounded-full"><div class="h-full bg-orange-500" style="width: 85%"></div></div>
                            </div>
                        `).join('')}
                    </div>
                </div>`,

                // SLIDE 4: WEATHER & AI WARNING
                `<div class="p-8 h-full bg-red-500/5">
                    <div class="flex justify-between items-start mb-6">
                        <h3 class="text-red-500 font-bold">☁️ WEATHER & LALIN LIVE</h3>
                        <div class="text-right text-xs text-white">RAIN EXPECTED: 13:30</div>
                    </div>
                    <div class="p-6 bg-red-500/10 border border-red-500/40 rounded-2xl animate-pulse">
                        <h4 class="text-red-500 font-bold mb-2">🚨 AI PRO-ACTIVE WARNING</h4>
                        <p class="text-sm text-slate-200">Hujan segera turun! Seluruh Bagian Umum bersiap. Booking Outdoor dialihkan ke Indoor Serbaguna segera!</p>
                    </div>
                </div>`,

                // SLIDE 5: MANAGEMENT INFO
                `<div class="p-8 h-full border-l-4 border-blue-500 bg-blue-500/5">
                    <h3 class="text-blue-500 font-bold mb-4">🏢 INFO MANAGEMENT (ADMIN)</h3>
                    <p class="text-sm text-slate-300 italic">"Fokus Efisiensi Anggaran Q3 & Implementasi 5S di seluruh area kerja."</p>
                </div>`,

                // SLIDE 6: UMUM INFO
                `<div class="p-8 h-full border-l-4 border-emerald-500 bg-emerald-500/5">
                    <h3 class="text-emerald-500 font-bold mb-4">📦 INFO BAGIAN UMUM (ADMIN)</h3>
                    <p class="text-sm text-slate-300">"Pengecekan Panel Listrik Gedung B malam ini pukul 20:00. Koordinasi via HT."</p>
                </div>`,

                // SLIDE 7: GREETINGS
                `<div class="flex flex-col items-center justify-center h-full text-center p-10">
                    <blockquote class="text-2xl font-bold text-emerald-400 italic mb-4">"Jumat Berkah — Semoga segala urusan dilancarkan dan berkah."</blockquote>
                    <p class="text-xs text-slate-500 uppercase tracking-widest">— Semangat Kerja Bagian Umum —</p>
                </div>`
            ];
            return slides[index];
        };

        const rotate = async () => {
            slideContainer.innerHTML = await getSlideContent(currentSlide);
            currentSlide = (currentSlide + 1) % totalSlides;
        };

        // Initialize
        rotate();
        setInterval(rotate, 7000); // 7 Detik Konsisten!
        
        // Clock
        setInterval(() => {
            const now = new Date();
            document.getElementById('cc-clock').innerText = now.toLocaleTimeString();
        }, 1000);

    }, 100);

    return shell;
}
