const ghostModule = {
    taps: 0,
    timer: null,
    init() {
        document.getElementById('dream-logo').addEventListener('pointerdown', (e) => {
            this.taps++;
            if (this.taps === 1) this.timer = setTimeout(() => this.taps = 0, 2000);
            if (this.taps >= 7) {
                clearTimeout(this.timer);
                this.taps = 0;
                this.open();
            }
        });
        document.getElementById('ghost-close').onclick = () => {
            document.getElementById('ghost-overlay').classList.remove('active');
        };
    },
    open() {
        document.getElementById('ghost-overlay').classList.add('active');
        const container = document.getElementById('ghost-tools');
        container.innerHTML = `
            <div class="glass-nano p-3 rounded-xl border border-ghost-500/20">
                <i data-lucide="radar" class="w-4 h-4 text-ghost-400 mb-2"></i>
                <p class="text-[10px] font-bold">Nmap Scanner</p>
                <p class="text-[8px] text-slate-500">Scan lokal port</p>
                <button class="copy-btn w-full mt-2" onclick="navigator.clipboard.writeText('nmap -sV 127.0.0.1'); alert('Copied')">Copy</button>
            </div>
            <div class="glass-nano p-3 rounded-xl border border-ghost-500/20">
                <i data-lucide="code" class="w-4 h-4 text-ghost-400 mb-2"></i>
                <p class="text-[10px] font-bold">Eruda Dev</p>
                <p class="text-[8px] text-slate-500">Inject Devtools</p>
                <button class="copy-btn w-full mt-2" onclick="navigator.clipboard.writeText('npm i -g eruda'); alert('Copied')">Copy</button>
            </div>
        `;
        lucide.createIcons();
    }
};
window.ghostModule = ghostModule;
