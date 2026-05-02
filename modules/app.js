const appModule = {
    state: { currentView: 'home', role: 'STAFF' },
    
    init() {
        // Navigation handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn')) {
                const btn = e.target.closest('.nav-btn');
                const target = btn.dataset.target;
                this.switchView(target);
            }
        });
        
        // Ghost Mode (7x tap logo)
        document.getElementById('dream-logo').addEventListener('pointerdown', () => {
            if (!this.state.ghostTaps) this.state.ghostTaps = 0;
            this.state.ghostTaps++;
            
            if (this.state.ghostTaps === 1) {
                this.state.ghostTimer = setTimeout(() => this.state.ghostTaps = 0, 2000);            }
            
            if (this.state.ghostTaps >= 7) {
                clearTimeout(this.state.ghostTimer);
                this.state.ghostTaps = 0;
                alert('👻 GHOST PROTOCOL ACTIVATED');
            }
        });
    },
    
    switchView(viewName) {
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        const target = document.getElementById(`view-${viewName}`);
        if (target) target.classList.remove('hidden');
        
        // Update nav active state
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.dataset.target === viewName) {
                btn.classList.add('active', 'text-amber-400');
                btn.classList.remove('text-slate-500');
            } else {
                btn.classList.remove('active', 'text-amber-400');
                btn.classList.add('text-slate-500');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => appModule.init());
