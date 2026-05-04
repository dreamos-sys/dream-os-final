/** Dream OS Command Center v3.1 — TIMING FIX & STABLE BINDING */
(function(){
    'use strict';
    
    window.openCommandCenter = function() {
        console.log('🌍 [CC] openCommandCenter() executed.');
        
        // Sembunyikan elemen utama dengan aman menggunakan gaya
        ['stats-card', 'carousel-container', 'menu-grid'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        
        const cc = document.getElementById('command-center');
        const cd = document.getElementById('cmd-dashboard');
        
        if (cc) {
            cc.classList.remove('module-container');
            cc.classList.add('active');
            cc.style.display = 'block';
        }
        
        if (cd) {
            cd.style.display = 'block';
            cd.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold">🌍 Command Center</h2>
                    <button onclick="showMain()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div class="glass p-3 rounded-xl border border-white/5">
                        <div class="text-[10px] text-white/60 mb-1">Pending</div>
                        <div class="text-2xl font-bold text-amber-400">3</div>
                    </div>
                    <div class="glass p-3 rounded-xl border border-white/5">
                        <div class="text-[10px] text-white/60 mb-1">Budget</div>
                        <div class="text-lg font-bold text-emerald-400">Rp 50Jt</div>
                    </div>
                    <div class="glass p-3 rounded-xl border border-white/5">
                        <div class="text-[10px] text-white/60 mb-1">Indoor</div>
                        <div class="text-2xl font-bold text-blue-400">45</div>
                    </div>
                    <div class="glass p-3 rounded-xl border border-white/5">
                        <div class="text-[10px] text-white/60 mb-1">Outdoor</div>
                        <div class="text-2xl font-bold text-green-400">23</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition text-center" onclick="alert('Approval')">
                        <div class="text-3xl mb-2">✅</div>
                        <div class="text-xs font-bold">Approval</div>
                    </div>
                    <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition text-center" onclick="alert('Budget')">
                        <div class="text-3xl mb-2">💰</div>
                        <div class="text-xs font-bold">Dana Umum</div>
                    </div>
                    <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition text-center" onclick="alert('SPJ')">
                        <div class="text-3xl mb-2">📋</div>
                        <div class="text-xs font-bold">SPJ</div>
                    </div>
                    <div class="glass p-4 rounded-xl cursor-pointer hover:bg-white/10 transition text-center" onclick="alert('Reports')">
                        <div class="text-3xl mb-2">📊</div>
                        <div class="text-xs font-bold">Laporan</div>
                    </div>
                </div>
                <div class="glass p-4 rounded-xl mt-6 border border-teal-500/20" id="rag-chat-ui">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-sm font-bold text-teal-400">🤖 Tanya Dream OS</h3>
                        <button onclick="toggleRagChat()" class="text-xs text-white/60">✕</button>
                    </div>
                    <div id="rag-messages" class="h-28 overflow-y-auto mb-3 text-xs space-y-2 p-2 bg-black/20 rounded-lg"></div>
                    <div class="flex gap-2">
                        <input type="text" id="rag-input" class="form-control flex-1 text-xs p-2 rounded bg-white/10 border border-white/10 text-white" placeholder="Tanya jadwal shalat, SOP, dll...">
                        <button onclick="askRag()" class="px-3 py-1 bg-teal-500 text-slate-950 font-semibold text-xs rounded transition hover:bg-teal-400">Kirim</button>
                    </div>
                </div>
            `;
        }
    };
    
    window.showMain = function() {
        console.log('🏠 [CC] showMain()');
        ['stats-card', 'carousel-container', 'menu-grid'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block';
        });
        const cc = document.getElementById('command-center');
        if (cc) {
            cc.classList.add('module-container');
            cc.classList.remove('active');
            cc.style.display = 'none';
        }
    };
    
    // Pastikan DOM sudah siap sebelum mengaitkan event
    function bindCommand() {
        const grid = document.getElementById('menu-grid');
        if (!grid) {
            setTimeout(bindCommand, 500);
            return;
        }
        
        const cards = grid.querySelectorAll('.menu-card');
        let bound = false;
        
        cards.forEach(c => {
            const label = c.querySelector('.text-center');
            if (label && label.textContent.trim() === 'Command') {
                c.onclick = function(e) {
                    e.preventDefault();
                    window.openCommandCenter();
                };
                c.style.cursor = 'pointer';
                bound = true;
                console.log('✅ [CC] Command Card Bound Successfully.');
            }
        });
        
        if (!bound) {
            setTimeout(bindCommand, 1000);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindCommand);
    } else {
        setTimeout(bindCommand, 1000);
    }
    
    console.log('✅ [CC] v3.1 Loaded');
})();
