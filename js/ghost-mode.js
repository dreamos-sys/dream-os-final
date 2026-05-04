/**
 * Dream OS Ghost Mode v1.0 — 7-TAP ACTIVATION
 * Karpathy-Style: Simple, surgical, no bloat
 */
(function() {
    'use strict';
    
    const Ghost = {
        tapCount: 0,
        tapTimer: null,
        
        init() {
            const logo = document.getElementById('dream-logo');
            const counter = document.getElementById('tap-counter');
            
            if(!logo) {
                console.warn('⚠️ #dream-logo not found');
                return;
            }
            
            // Click handler
            logo.addEventListener('click', () => {
                this.tapCount++;
                console.log('👻 Tap:', this.tapCount);
                
                // Show counter
                if(counter) {
                    counter.textContent = `Tap ${this.tapCount}/7`;
                    counter.style.opacity = '1';
                    setTimeout(() => { counter.style.opacity = '0'; }, 1500);
                }
                
                // Reset timer
                if(this.tapTimer) clearTimeout(this.tapTimer);
                this.tapTimer = setTimeout(() => { 
                    this.tapCount = 0; 
                    console.log('👻 Tap counter reset');
                }, 2000);
                
                // Activate on 7th tap
                if(this.tapCount >= 7) {
                    console.log('👻 GHOST MODE ACTIVATED!');
                    this.activate();                }
            });
            
            // Close button
            const closeBtn = document.getElementById('close-ghost');
            if(closeBtn) {
                closeBtn.addEventListener('click', () => {
                    const ghost = document.getElementById('ghost-dashboard');
                    if(ghost) ghost.classList.remove('active');
                    this.tapCount = 0;
                });
            }
        },
        
        activate() {
            this.tapCount = 0;
            const ghost = document.getElementById('ghost-dashboard');
            if(!ghost) {
                alert('❌ Ghost dashboard not found!');
                return;
            }
            
            ghost.classList.add('active');
            this.renderTools();
        },
        
        renderTools() {
            const container = document.getElementById('ghost-tools');
            if(!container) {
                console.error('❌ #ghost-tools not found');
                return;
            }
            
            container.innerHTML = `
                <div class="ghost-card">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold text-teal-400">🔍 Eruda Console</div>
                            <div class="text-xs text-slate-400 mt-1">Toggle mobile dev console</div>
                        </div>
                        <button onclick="DreamOS.modules.ghost.toggleEruda()" class="ghost-btn">TOGGLE</button>
                    </div>
                </div>
                <div class="ghost-card">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold text-teal-400">🌐 Network Info</div>
                            <div class="text-xs text-slate-400 mt-1" id="net-info">Loading...</div>
                        </div>
                        <button onclick="DreamOS.modules.ghost.showNetInfo()" class="ghost-btn">REFRESH</button>                    </div>
                </div>
                <div class="ghost-card">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold text-teal-400">🗑️ Clear Storage</div>
                            <div class="text-xs text-slate-400 mt-1">Reset localStorage</div>
                        </div>
                        <button onclick="DreamOS.modules.ghost.clearStorage()" class="ghost-btn bg-red-500/20 text-red-400">CLEAR</button>
                    </div>
                </div>
                <div class="ghost-card">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold text-teal-400">📋 Copy Commands</div>
                            <div class="text-xs text-slate-400 mt-1">Termux dev tools</div>
                        </div>
                        <button onclick="DreamOS.modules.ghost.copyCommands()" class="ghost-btn">COPY</button>
                    </div>
                </div>
            `;
            
            // Auto-load network info
            this.showNetInfo();
            console.log('✅ Ghost tools rendered');
        },
        
        toggleEruda() {
            if(!window.eruda) {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/eruda';
                s.onload = () => { eruda.init(); eruda.show(); };
                document.body.appendChild(s);
                alert('🔍 Eruda loading...');
            } else {
                eruda[eruda._isShow ? 'hide' : 'show']();
            }
        },
        
        showNetInfo() {
            const el = document.getElementById('net-info');
            if(!el) return;
            if(navigator.connection) {
                el.textContent = `${navigator.connection.effectiveType} · ${navigator.connection.downlink}Mbps`;
            } else {
                el.textContent = 'N/A';
            }
        },
        
        clearStorage() {            if(confirm('⚠️ Clear ALL localStorage?')) {
                localStorage.clear();
                alert('✅ Cleared. Reloading...');
                location.reload();
            }
        },
        
        copyCommands() {
            const cmds = `# Dream OS Dev Tools
pkg install nmap git python -y
pip install requests
# Ready! 🚀`;
            navigator.clipboard.writeText(cmds).then(() => {
                alert('📋 Copied!');
            }).catch(() => alert('❌ Copy failed'));
        }
    };
    
    // Register to DreamOS
    if(window.DreamOS) {
        DreamOS.register('ghost', Ghost);
        console.log('✅ Ghost Mode v1.0 registered');
        
        // Auto-init when DOM ready
        if(document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => Ghost.init());
        } else {
            Ghost.init();
        }
    }
})();
