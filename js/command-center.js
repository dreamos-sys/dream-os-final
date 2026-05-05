/** 👑 Dream OS Command Center v1.4 — Sultan No-Router Edition
 * Arsitektur: Direct AI Handshake (Gemini + Local Beast)
 * Karpathy: Surgical logic | Addy: <3KB | Dream OS: Depok-Safe
 */
(function() {
    'use strict';

    const CC = {
        // Obfuscated Gemini Key (Bawel mode: ON)
        _k: "QUl6YVN5QzI5N3p2TFZOdmxsS2c3Qm53NVlIeFFHRGxtSktuUDRr",
        
        init() {
            console.log('✅ Sultan No-Router Remix Loaded');
            this.bindEvents();
        },

        open() {
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
                        <h2 class="text-xl font-bold text-amber-500">🌍 Sultan Command</h2>
                        <p class="text-[10px] text-teal-400 font-mono tracking-tighter">GEMINI + NEMO 120B ENGINE</p>
                    </div>
                    <button onclick="showMain()" class="p-2 bg-white/5 rounded-xl text-amber-500">←</button>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-6">
                    <div class="glass p-4 rounded-2xl border border-white/5">
                        <div class="text-[10px] text-white/50">Core Status</div>
                        <div class="text-lg font-bold text-emerald-400">OPTIMIZED</div>
                    </div>
                    <div class="glass p-4 rounded-2xl border border-white/5">
                        <div class="text-[10px] text-white/50">Nemo 120B</div>
                        <div class="text-lg font-bold text-blue-400">READY</div>
                    </div>
                </div>

                <div class="grid grid-cols-4 gap-3 mb-6">
                    ${['Approval', 'Budget', 'SPJ', 'Reports'].map((label, i) => `
                        <div class="glass p-3 rounded-xl text-center active:scale-90 transition" onclick="alert('${label} Ready')">
                            <div class="text-2xl mb-1">${['✅','💰','📋','📊'][i]}</div>
                            <div class="text-[9px] font-bold">${label}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="glass p-4 rounded-2xl border border-teal-500/30 bg-black/20" id="ai-chat-ui">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-xs font-bold text-teal-400">🤖 Dream Agent Pro</h3>
                        <div class="flex gap-2">
                             <span id="ai-source" class="text-[8px] px-2 py-0.5 bg-white/5 rounded text-white/40">IDLE</span>
                             <button onclick="toggleAiChat()" class="text-white/20">✕</button>
                        </div>
                    </div>
                    <div id="ai-messages" class="h-32 overflow-y-auto mb-3 text-[11px] space-y-3 p-2 bg-black/40 rounded-xl">
                        <div class="text-left"><span class="text-white/50 italic">Bismillah, Sultan mau nanya apa hari ini? 😎</span></div>
                    </div>
                    <div class="flex gap-2">
                        <input type="text" id="ai-input" class="flex-1 p-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none" placeholder="Tanya koding atau strategi...">
                        <button id="ai-send" class="px-4 bg-teal-500 text-slate-950 font-black text-xs rounded-xl">SEND</button>
                    </div>
                </div>
            `;
        },

        async queryAI(prompt) {
            const sourceTag = document.getElementById('ai-source');
            try {
                sourceTag.textContent = 'GEMINI-PRO';
                sourceTag.classList.add('text-amber-500');

                // Direct Fetch ke Google Gemini API
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${atob(this._k)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });
                
                const data = await res.json();
                return data.candidates[0].content.parts[0].text;
            } catch (e) {
                sourceTag.textContent = 'NEMO-120B (LOCAL)';
                sourceTag.classList.replace('text-amber-500', 'text-blue-400');
                
                // Fallback ke RAG Lokal atau Local LLM Endpoint lo
                if(window.DreamOS?.modules?.ragCore) {
                    const local = DreamOS.modules.ragCore.search(prompt)?.[0];
                    return local?.a || "Waduh Bro, cloud macet & lokal nggak nemu. Cek koneksi lo!";
                }
                return "Sistem Offline.";
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
                msgDiv.innerHTML += `<div class="text-right"><span class="bg-teal-500/20 text-teal-200 p-2 rounded-lg inline-block">${q}</span></div>`;
                msgDiv.innerHTML += `<div id="ai-loading" class="text-left"><span class="animate-pulse text-white/30">Memikirkan...</span></div>`;
                msgDiv.scrollTop = msgDiv.scrollHeight;

                const answer = await this.queryAI(q);
                
                document.getElementById('ai-loading')?.remove();
                msgDiv.innerHTML += `<div class="text-left"><span class="bg-white/10 p-2 rounded-lg text-emerald-300 block border border-white/5">${answer}</span></div>`;
                msgDiv.scrollTop = msgDiv.scrollHeight;
            };
            input.onkeypress = (e) => { if(e.key === 'Enter') btn.click(); };
        },

        bindEvents() {
            document.addEventListener('click', (e) => {
                if(e.target.closest('#menu-grid .menu-card:nth-child(1)')) this.open();
            });
        }
    };

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
