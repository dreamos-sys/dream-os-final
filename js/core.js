/**
 * Dream OS Core Engine v1.3.1
 * Dynamic Module Loader System (with retry & error handling)
 */

const DreamOS = {
    version: '1.3.1',
    modules: {},
    role: 'STAFF',
    state: { erudaActive: false, ghostTaps: 0, ghostTimer: null, carouselInterval: null },
    
    async init() {
        console.log('🚀 Dream OS v' + this.version + ' initializing...');
        
        try {
            await this.loadModule('config');
            await this.loadModule('auth');
            await this.loadModule('utils');
            
            console.log('✅ Core modules loaded');
            this.setupGlobalListeners();
            
            console.log('✅ Dream OS ready!');
        } catch (e) {
            console.error('❌ Failed to initialize DreamOS:', e);
            alert('Error loading Dream OS. Please refresh.');
        }
    },
    
    async loadModule(name, retry = 3) {
        if (this.modules[name]) {
            return this.modules[name];
        }
        
        return new Promise((resolve, reject) => {
            const attempt = (attemptsLeft) => {
                const script = document.createElement('script');
                script.src = `js/modules/${name}.js`;
                script.onload = () => {                    this.modules[name] = window.DreamOSModules[name];
                    console.log(`✅ Module loaded: ${name}`);
                    resolve(this.modules[name]);
                };
                script.onerror = () => {
                    if (attemptsLeft > 1) {
                        console.warn(`⚠️ Retrying ${name}... (${attemptsLeft-1} left)`);
                        setTimeout(() => attempt(attemptsLeft - 1), 500);
                    } else {
                        reject(new Error(`Failed to load module: ${name}`));
                    }
                };
                document.body.appendChild(script);
            };
            attempt(retry);
        });
    },
    
    setupGlobalListeners() {
        let tapCount = 0;
        let tapTimer = null;
        
        document.getElementById('dream-logo')?.addEventListener('pointerdown', () => {
            tapCount++;
            console.log('👻 Ghost tap:', tapCount);
            
            if (tapCount === 1) {
                tapTimer = setTimeout(() => tapCount = 0, 2000);
            }
            
            if (tapCount >= 7) {
                clearTimeout(tapTimer);
                tapCount = 0;
                this.activateGhostMode();
            }
        });
        
        // Ghost mode button handlers
        document.getElementById('eruda-btn')?.addEventListener('click', () => {
            if (this.modules.ghost) this.modules.ghost.toggleEruda();
        });
        document.getElementById('osint-btn')?.addEventListener('click', () => {
            if (this.modules.ghost) this.modules.ghost.checkOsint();
        });
        document.getElementById('nmap-btn')?.addEventListener('click', () => {
            if (this.modules.ghost) this.modules.ghost.copyNmap();
        });
        document.querySelectorAll('.copy-cmd').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cmd = e.target.dataset.cmd;                if (cmd && this.modules.utils) this.modules.utils.copyText(cmd);
            });
        });
        document.getElementById('close-ghost')?.addEventListener('click', () => {
            document.getElementById('ghost-dashboard').classList.remove('active');
        });
    },
    
    async activateGhostMode() {
        try {
            await this.loadModule('ghost');
            if (this.modules.ghost) {
                this.modules.ghost.init();
            }
        } catch (e) {
            console.error('❌ Failed to activate Ghost Mode:', e);
            alert('Failed to load Ghost Mode tools.');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => DreamOS.init());
