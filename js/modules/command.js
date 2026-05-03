window.DreamOSModules = window.DreamOSModules || {};

window.DreamOSModules.command = {
    init() {
        console.log('💻 Command Center initialized');
        const input = document.getElementById('command-search');
        if (input) {
            input.onkeypress = async (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    await this.runSearch(input.value.trim());
                }
            };
        }
    },
    
    async runSearch(query) {
        const resultsDiv = document.getElementById('command-results');
        if (!resultsDiv) return;
        
        resultsDiv.classList.remove('hidden');
        resultsDiv.innerHTML = '<p class="text-sm text-white/60 text-center py-3">🤖 AI searching...</p>';
        
        if (DreamOS.modules['ai-service']) {
            const result = await DreamOS.modules['ai-service'].query(`User search: "${query}". Return relevant data.`, { task: 'command_search' });
            if (result.success) {
                const isFallback = result.source === 'fallback';
                resultsDiv.innerHTML = `<div class="space-y-2">${result.response.split('\n').map(line => `<div class="glass p-2.5 rounded-xl border border-white/10 text-sm text-white/80">${line}</div>`).join('')}</div>${isFallback ? '<p class="text-[9px] text-orange-400/80 text-center mt-2">⚠️ AI offline</p>' : ''}`;
            }
        } else {
            resultsDiv.innerHTML = '<p class="text-sm text-orange-400">⚠️ AI Service not loaded</p>';
        }
    }
};
