/** * 👑 Dream OS Command Center v1.4 — Sultan Remix
 * Arsitektur: Hybrid Bridge + AI Sultan Integration
 * Karpathy: Surgical logic | Addy: <3KB | Dream OS: Depok-Safe
 */
(function() {
    'use strict';

    const CC = {
        // Obfuscated Key (Base64) - Biar gak telanjang banget
        _k: "QUl6YVN5QzI5N3p2TFZOdmxsS2c3Qm53NVlIeFFHRGxtSktuUDRr",
        _endpoint: "http://localhost:20128/v1/chat/completions", // 9Router Default

        init() {
            console.log('✅ Command Center v1.4 Sultan Remix Initialized');
            this.bindEvents();
        },

        open() {
            console.log('🌍 [CC] Sultan Mode Activated');
            const main = document.getElementById('main-content-wrapper');
            const cc = document.getElementById('command-center');
            const cd = document.getElementById('cmd-dashboard');

            if(main) main.style.display = 'none';
            if(cc) { cc.style.display = 'block'; cc.classList.add('active'); }
            
            if(cd) {
                cd.style.display = 'block';
                cd.innerHTML = this.template();
                this.initAiChat();
            }
        },

        template() {
            return `
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-xl font-bold text-teal-400">🌍 Command Center</h2>
                        <p class="text-[10px] text-white/40 uppercase tracking-widest">Master Control v1.4</p>
                    </div>
                    <button onclick="showMain()" class="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition">
                        <i data-lucide="home" class="w-5 h-5 text-amber-500"></i>
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-6">
                    <div class="glass p-4 rounded-2xl border border-white/5">
                        <div class="text-[10px] text-white/50 mb-1">Budget Terpakai</div>
                        <div class="text-lg font-bold text-emerald-400">Rp 50,2 Jt</div>
                        <div class="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                            <div class="bg-emerald-500 h-full" style="width: 65%"></div>
                        </div>
                    </div>
                    <div class="glass p-4 rounded-2xl border border-white/5">
                        <div class="text-[10px] text-white/50 mb-1">User Active</div>
                        <div class="text-lg font-bold text-blue-400">1,450</div>
                        <p class="text-[9px] text-blue-300/50 mt-1">↑ 12% dari kemarin</p>
                    </div>
                </div>

                <div class="grid grid-cols-4 gap-3 mb-6">
                    ${['Approval', 'Budget', 'SPJ', 'Reports'].map((label, i) => `
                        <div class="glass p-3 rounded-xl text-center cursor-pointer active:scale-95 transition" onclick="alert('${label} Clicked')">
                            <div class="text-2xl mb-1">${['✅','💰','📋','📊'][i]}</div>
                            <div class="text-[9px] font-bold uppercase">${label}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="glass p-4 rounded-2xl border border-teal-500/30 bg-teal-500/5" id="ai-chat-ui">
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                            <h3 class="text-xs font-bold text-teal-400 uppercase tracking-wider">Dream OS Smart Agent</h3>
                        </div>
                        <button onclick="toggleAiChat()" class="text-white/30 hover:text-white">✕</button>
                    </div>
                    <div id="ai-messages" class="h-32 overflow-y-auto mb-3 text-[11px] space-y-3 p-2 bg-black/20 rounded-xl border border-white/5">
                        <div class="text-left"><span class="bg-white/5 p-2 rounded-lg text-white/70 italic">Bismillah, ada yang bisa saya bantu, My Bro?</span></div>
                    </div>
                    <div class="flex gap-2">
                        <input type="text" id="ai-input" class="flex-1 p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-teal-500 transition outline-none" placeholder="Tanya koding, SOP, atau info...">
                        <button id="ai-send" class="px-4 py-2 bg-teal-500 text-slate-950 font-black text-xs rounded-xl hover:bg-teal-400 active:scale-90 transition">SEND</button>
                    </div>
                </div>
            `;
        },

        async queryAI(prompt) {
            // Priority 1: 9Router (Local) | Priority 2: Direct Gemini (Fallback)
            try {
                const response = await fetch(this._endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + atob(this._k) },
                    body: JSON.stringify({
                        model: "kr/claude-sonnet-4.5", // Sultan model via 9Router
                        messages: [{role: "user", content: prompt}]
                    })
                });
                const data = await response.json();
                return data.choices[0].message.content;
            } catch (e) {
                console.warn('⚠️ 9Router offline, using RAG fallback');
                if(window.DreamOS?.modules?.ragCore) {
                    const localRes = DreamOS.modules.ragCore.search(prompt)?.[0];
                    return localRes?.a || "Waduh, koneksi ke Sultan lagi macet, Bro. Coba cek 9Router lo.";
                }
                return "Sistem offline. Periksa koneksi Termux lo.";
            }
        },

        initAiChat() {
            const btn = document.getElementById('ai-send');
            const input = document.getElementById('ai-input');
            const msgDiv = document.getElementById('ai-messages');

            if(!btn || !input) return;

            btn.onclick = async () => {
                const q = input.value.trim();
                if(!q) return;

                input.value = '';
                msgDiv.innerHTML += `<div class="text-right"><span class="bg-teal-500/20 text-teal-200 p-2 rounded-lg inline-block shadow-sm">${q}</span></div>`;
                msgDiv.innerHTML += `<div id="ai-loading" class="text-left"><span class="bg-white/5 p-2 rounded-lg animate-pulse text-white/50">Memikirkan...</span></div>`;
                msgDiv.scrollTop = msgDiv.scrollHeight;

                const answer = await this.queryAI(q);
                
                document.getElementById('ai-loading')?.remove();
                msgDiv.innerHTML += `<div class="text-left"><span class="bg-white/10 p-2 rounded-lg text-emerald-300 leading-relaxed block border border-white/5">${answer}</span></div>`;
                msgDiv.scrollTop = msgDiv.scrollHeight;
            };

            input.onkeypress = (e) => { if(e.key === 'Enter') btn.click(); };
            if(window.lucide) lucide.createIcons();
        },

        bindEvents() {
            document.addEventListener('click', (e) => {
                if(e.target.closest('#menu-grid .menu-card:nth-child(1)')) this.open();
            });
        }
    };

    // 🌉 GLOBAL BRIDGE (Expose to window)
    window.openCommandCenter = () => CC.open();
    window.showMain = () => {
        document.getElementById('command-center').style.display = 'none';
        document.getElementById('cmd-dashboard').style.display = 'none';
        document.getElementById('main-content-wrapper').style.display = 'block';
    };
    window.toggleAiChat = () => {
        const ui = document.getElementById('ai-chat-ui');
        if(ui) ui.style.display = ui.style.display === 'none' ? 'block' : 'none';
    };

    CC.init();
})();
