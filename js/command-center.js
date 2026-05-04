/** Dream OS Command Center v3.2 — Dengan AI Core dan RAG */
(function(){
    'use strict';

    window.openCommandCenter = function() {
        console.log('🌍 [CC] openCommandCenter() executed.');
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

                <div class="glass p-4 rounded-xl mt-6 border border-teal-500/30" id="rag-chat-ui">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-sm font-bold text-teal-400">🤖 Tanya Dream OS Agent</h3>
                        <button onclick="toggleRagChat()" class="text-xs text-white/60">✕</button>
                    </div>
                    <div id="rag-messages" class="h-28 overflow-y-auto mb-3 text-xs space-y-2 p-2 bg-black/40 rounded-lg"></div>
                    <div class="flex gap-2">
                        <input type="text" id="rag-input" class="form-control flex-1 text-xs p-2 rounded bg-white/10 border border-white/10 text-white" placeholder="Tanyakan tentang SOP, jadwal, atau perizinan...">
                        <button id="rag-send" class="px-3 py-1 bg-teal-500 text-slate-950 font-semibold text-xs rounded transition hover:bg-teal-400">Kirim</button>
                    </div>
                </div>
            `;
            
            // Pasang logic klik ke dalam Smart Agent
            setTimeout(() => {
                const sendBtn = document.getElementById('rag-send');
                const chatInput = document.getElementById('rag-input');
                const msgDiv = document.getElementById('rag-messages');

                if (sendBtn && chatInput && msgDiv) {
                    sendBtn.onclick = function() {
                        const q = chatInput.value.trim();
                        if (!q) return;

                        msgDiv.innerHTML += `<div class="text-right"><span class="bg-teal-500/20 px-2 py-1 rounded">${q}</span></div>`;
                        chatInput.value = '';

                        // Periksa apakah AI Core ada (Smart Agent Pro Mode)
                        if (window.DreamOS && DreamOS.modules.aiCore) {
                            msgDiv.innerHTML += `<div class="text-left"><span class="bg-white/10 px-2 py-1 rounded animate-pulse">🤔 Memikirkan jawaban...</span></div>`;
                            msgDiv.scrollTop = msgDiv.scrollHeight;

                            DreamOS.modules.aiCore.query(q).then(res => {
                                const last = msgDiv.lastElementChild;
                                if (last && last.textContent.includes('Memikirkan')) last.remove();
                                
                                const answer = res.response || res.error || 'Maaf, belum ada jawaban saat ini.';
                                msgDiv.innerHTML += `<div class="text-left"><span class="bg-teal-500/10 text-emerald-300 px-2 py-1 rounded block mt-1">${answer}</span></div>`;
                                msgDiv.scrollTop = msgDiv.scrollHeight;
                                if (typeof Bridge !== 'undefined') Bridge.emit('ai:query', {question: q, answer});
                            }).catch(err => {
                                console.warn('AI query error:', err);
                            });
                        } else if (window.DreamOS && DreamOS.modules.ragCore) {
                            // Fallback RAG
                            const res = DreamOS.modules.ragCore.search(q)?.[0];
                            const answer = res?.a || 'Maaf, tidak ditemukan di knowledge base lokal.';
                            msgDiv.innerHTML += `<div class="text-left"><span class="bg-white/10 px-2 py-1 rounded">${answer}</span></div>`;
                            msgDiv.scrollTop = msgDiv.scrollHeight;
                        }
                    };
                }
            }, 200);
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

    window.toggleRagChat = function() {
        const ui = document.getElementById('rag-chat-ui');
        if (ui) ui.style.display = ui.style.display === 'none' ? 'block' : 'none';
    };

    function bindCommand() {
        const grid = document.getElementById('menu-grid');
        if (!grid) { setTimeout(bindCommand, 500); return; }
        
        let bound = false;
        grid.querySelectorAll('.menu-card').forEach(c => {
            const label = c.querySelector('.text-center');
            if (label && label.textContent.trim() === 'Command') {
                c.onclick = function(e) {
                    e.preventDefault();
                    window.openCommandCenter();
                };
                c.style.cursor = 'pointer';
                bound = true;
            }
        });
        if (!bound) setTimeout(bindCommand, 1000);
    }
    
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindCommand);
    else setTimeout(bindCommand, 1000);
    
    console.log('✅ [CC] v3.2 Loaded');
})();
