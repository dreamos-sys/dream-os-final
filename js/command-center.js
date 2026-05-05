/** Dream OS Command Center — Hybrid Pattern v1.0
 * Karpathy: Modular logic + Global Bridge fallback
 * Addy: <3KB, defer load, event delegation
 * Dream OS: Termux-native, zero deps
 */
(function() {
    'use strict';
    
    // 🔹 Modular logic (internal)
    function openCommandCenter() {
        console.log('🌍 Command Center opened');
        
        // Hide main content
        const main = document.getElementById('main-content-wrapper');
        if(main) main.style.display = 'none';
        
        // Show command center
        const cc = document.getElementById('command-center');
        const cd = document.getElementById('cmd-dashboard');
        if(cc) { cc.style.display = 'block'; cc.classList.add('active'); }
        if(cd) {
            cd.style.display = 'block';
            cd.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold">🌍 Command Center</h2>
                    <button onclick="showMain()" class="px-3 py-1 bg-white/10 rounded text-xs">← Home</button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60">Pending</div><div class="text-2xl font-bold text-amber-400">3</div></div>
                    <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60">Budget</div><div class="text-lg font-bold text-emerald-400">Rp 50Jt</div></div>
                    <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60">Indoor</div><div class="text-2xl font-bold text-blue-400">45</div></div>
                    <div class="glass p-3 rounded-xl"><div class="text-xs text-white/60">Outdoor</div><div class="text-2xl font-bold text-green-400">23</div></div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('Approval')"><div class="text-3xl mb-2">✅</div><div class="text-xs font-bold">Approval</div></div>
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('Budget')"><div class="text-3xl mb-2">💰</div><div class="text-xs font-bold">Dana Umum</div></div>
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('SPJ')"><div class="text-3xl mb-2">📋</div><div class="text-xs font-bold">SPJ</div></div>
                    <div class="glass p-4 rounded-xl cursor-pointer" onclick="alert('Reports')"><div class="text-3xl mb-2">📊</div><div class="text-xs font-bold">Laporan</div></div>
                </div>
                <!-- AI Chat UI -->
                <div class="glass p-4 rounded-xl mt-6 border border-teal-500/30" id="ai-chat-ui">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-sm font-bold text-teal-400">🤖 Tanya Dream OS</h3>
                        <button onclick="toggleAiChat()" class="text-xs text-white/60">✕</button>
                    </div>
                    <div id="ai-messages" class="h-28 overflow-y-auto mb-3 text-xs space-y-2 p-2 bg-black/40 rounded-lg"></div>
                    <div class="flex gap-2">                        <input type="text" id="ai-input" class="flex-1 p-2 rounded bg-white/10 border border-white/10 text-white text-xs" placeholder="Tanya SOP, jadwal, dll...">
                        <button id="ai-send" class="px-3 py-1 bg-teal-500 text-slate-950 font-semibold text-xs rounded">Kirim</button>
                    </div>
                </div>
            `;
            
            // Attach AI chat handler after render
            setTimeout(() => {
                const sendBtn = document.getElementById('ai-send');
                const input = document.getElementById('ai-input');
                const msgDiv = document.getElementById('ai-messages');
                if(sendBtn && input && msgDiv) {
                    sendBtn.onclick = async function() {
                        const q = input.value.trim();
                        if(!q) return;
                        msgDiv.innerHTML += `<div class="text-right"><span class="bg-teal-500/20 px-2 py-1 rounded">${q}</span></div>`;
                        input.value = '';
                        msgDiv.innerHTML += `<div class="text-left"><span class="bg-white/10 px-2 py-1 rounded">🤔...</span></div>`;
                        msgDiv.scrollTop = msgDiv.scrollHeight;
                        
                        // Use aiRouter if available, fallback to ragCore
                        let response = 'Maaf, belum ada jawaban.';
                        if(DreamOS.modules.aiRouter) {
                            const res = await DreamOS.modules.aiRouter.query(q);
                            response = res.response;
                        } else if(DreamOS.modules.ragCore) {
                            const res = DreamOS.modules.ragCore.search(q)?.[0];
                            response = res?.a || response;
                        }
                        msgDiv.lastElementChild.remove(); // Remove "..."
                        msgDiv.innerHTML += `<div class="text-left"><span class="bg-teal-500/10 text-emerald-300 px-2 py-1 rounded">${response}</span></div>`;
                        msgDiv.scrollTop = msgDiv.scrollHeight;
                    };
                }
            }, 100);
        }
    }
    
    function showMain() {
        console.log('🏠 showMain() called');
        document.getElementById('command-center')?.classList.remove('active');
        document.getElementById('command-center') && (document.getElementById('command-center').style.display = 'none');
        document.getElementById('cmd-dashboard') && (document.getElementById('cmd-dashboard').style.display = 'none');
        document.getElementById('main-content-wrapper') && (document.getElementById('main-content-wrapper').style.display = 'block');
    }
    
    function toggleAiChat() {
        const ui = document.getElementById('ai-chat-ui');
        if(ui) ui.style.display = ui.style.display === 'none' ? 'block' : 'none';
    }    
    // 🌉 GLOBAL BRIDGE (inline fallback — WAJIB!)
    window.openCommandCenter = openCommandCenter;
    window.showMain = showMain;
    window.toggleAiChat = toggleAiChat;
    
    // Event delegation for dynamic menu clicks
    document.addEventListener('click', function(e) {
        if(e.target.closest('[data-action="open-command"]') || e.target.closest('#menu-grid .menu-card:nth-child(1)')) {
            openCommandCenter();
        }
    });
    
    // DOM ready init
    function init() {
        console.log('✅ Command Center hybrid initialized');
    }
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
