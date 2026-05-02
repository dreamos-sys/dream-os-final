// Dream OS Command Center — AI Natural Language Search
// Ketik: "cari AC 2016" → AI parse → query database

const commandSearch = {
    init() {
        const input = document.querySelector('#view-command input[type="text"]');
        if (!input) return;
        
        input.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                await this.handleSearch(input.value.trim());
            }
        });
    },
    
    async handleSearch(query) {
        // Show loading
        const resultsDiv = document.getElementById('command-results') || this.createResultsContainer();
        resultsDiv.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">🤖 AI thinking...</p>`;
        
        // Query Nemo-120B
        const result = await aiService.query(`User search: "${query}". Return relevant data from: booking, k3, maintenance, vendor. Format: concise list with icons.`, {
            task: 'command_search',
            user_query: query
        });
        
        // Render results
        if (result.success) {
            resultsDiv.innerHTML = `
                <div class="space-y-2">
                    ${result.response.split('\n').map(line => 
                        `<div class="bg-slate-900/60 p-2 rounded border border-slate-800 text-xs">${line}</div>`
                    ).join('')}
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `<p class="text-xs text-amber-400 text-center">⚠️ AI offline. Coba keyword spesifik: "booking hari ini", "K3 pending", dll.</p>`;
        }
        
        setTimeout(() => lucide.createIcons(), 50);
    },
    
    createResultsContainer() {
        const container = document.createElement('div');
        container.id = 'command-results';
        container.className = 'mt-3';
        document.querySelector('#view-command').appendChild(container);
        return container;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.commandSearch) commandSearch.init();
});
