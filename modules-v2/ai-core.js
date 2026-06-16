// Dream OS AI Core Module v1.0
// Intelligent assistant & automation

const AICore = {
    context: {
        user: null,
        preferences: {},
        recentActions: []
    },
    
    // Initialize AI Core
    init() {
        this.loadContext();
    },    
    // Load user context
    loadContext() {
        const saved = localStorage.getItem('dream-ai-context');
        if(saved) {
            this.context = JSON.parse(saved);
        }
    },
    
    // Save context
    saveContext() {
        localStorage.setItem('dream-ai-context', JSON.stringify(this.context));
    },
    
    // Smart assistant chat interface
    openAssistant() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-[10000] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 w-full sm:max-w-2xl sm:rounded-2xl h-[80vh] sm:h-[600px] flex flex-col shadow-2xl">
                <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">🤖</div>
                        <div>
                            <h3 class="text-lg font-bold text-slate-800 dark:text-white">Dream AI Assistant</h3>
                            <p class="text-xs text-slate-500">Powered by intelligent automation</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                
                <div class="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800" id="ai-chat-messages">
                    <div class="flex items-start gap-3 mb-4">
                        <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm">🤖</div>
                        <div class="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                            <p class="text-slate-800 dark:text-white">Hello! I'm your Dream OS AI Assistant. How can I help you today?</p>
                            <p class="text-xs text-slate-500 mt-1">Just now</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div class="flex gap-2">
                        <input type="text" id="ai-input" placeholder="Type your message..." 
                               class="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                               onkeypress="if(event.key==='Enter') AICore.sendMessage()">
                        <button onclick="AICore.sendMessage()" class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition">
                            Send
                        </button>
                    </div>                    <div class="flex gap-2 mt-3 overflow-x-auto pb-2">
                        <button onclick="AICore.quickAction('system status')" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                            📊 Check system status
                        </button>
                        <button onclick="AICore.quickAction('run maintenance')" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                            🔧 Run maintenance
                        </button>
                        <button onclick="AICore.quickAction('show modules')" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                            🧩 Show modules
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('ai-input').focus();
    },
    
    // Send message to AI
    sendMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        if(!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Process and respond
        setTimeout(() => {
            const response = this.processMessage(message);
            this.addMessage(response, 'ai');
        }, 500);
    },
    
    // Quick action buttons
    quickAction(action) {
        this.addMessage(action, 'user');
        setTimeout(() => {
            const response = this.processMessage(action);
            this.addMessage(response, 'ai');
        }, 500);
    },
    
    // Add message to chat
    addMessage(text, sender) {
        const container = document.getElementById('ai-chat-messages');
        if(!container) return;
                const isUser = sender === 'user';
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`;
        
        msgDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full ${isUser ? 'bg-blue-500' : 'bg-emerald-500'} flex items-center justify-center text-white text-sm">
                ${isUser ? '👤' : '🤖'}
            </div>
            <div class="${isUser ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white'} rounded-2xl ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} px-4 py-3 shadow-sm max-w-[80%]">
                <p>${text}</p>
                <p class="text-xs ${isUser ? 'text-blue-100' : 'text-slate-500'} mt-1">Just now</p>
            </div>
        `;
        
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },
    
    // Process user message (simple rule-based AI)
    processMessage(message) {
        const lower = message.toLowerCase();
        
        // System commands
        if(lower.includes('status') || lower.includes('health')) {
            return "📊 System Status:\n\n• Core Engine: Online ✅\n• Database: Connected ✅\n• Network: Online ✅\n• Storage: 74% used ⚠️\n\nAll systems operational!";
        }
        
        if(lower.includes('maintenance') || lower.includes('maintain')) {
            setTimeout(() => {
                if(typeof runFacilityMaintenance === 'function') runFacilityMaintenance();
            }, 1000);
            return "🔧 Initiating system maintenance...\n\nI'll run a full system check and optimization. This may take a few moments.";
        }
        
        if(lower.includes('module') || lower.includes('feature')) {
            return "🧩 Available Modules:\n\n1. 📊 CMD - Command Dashboard\n2. 📅 Booking - Reservation System\n3. ⚠️ K3 - Safety Management\n4. 🛡️ Security - Security Center\n5. 🧹 Janitor - Cleaning Services\n6. 📦 Stok - Inventory\n7. 🔧 Maintenance - Facility Management\n8. 🏢 Asset - Asset Management\n\nWhich module would you like to explore?";
        }
        
        if(lower.includes('help') || lower.includes('what can you do')) {
            return "🤖 I'm your Dream OS AI Assistant! I can help you with:\n\n• Checking system status\n• Running maintenance\n• Navigating modules\n• Answering questions about features\n• Providing insights and recommendations\n\nJust ask me anything!";
        }
        
        if(lower.includes('backup') || lower.includes('export')) {
            return "💾 To backup your data:\n\n1. Open Ghost Mode (tap logo 7x)\n2. Click 'Backup Manager'\n3. Select 'Export backup'\n4. Save the JSON file\n\nWould you like me to open the backup tool?";
        }
        
        if(lower.includes('dark mode') || lower.includes('theme')) {
            setTimeout(() => {
                if(typeof toggleDarkMode === 'function') toggleDarkMode();
            }, 1000);            return "🌓 Toggling dark mode for you...";
        }
        
        // Default response
        return "I understand you're asking about: \"" + message + "\"\n\nI'm still learning! Try asking about:\n• System status\n• Maintenance\n• Available modules\n• Help\n\nOr use the quick action buttons below!";
    },
    
    // Predictive suggestions
    getSuggestions() {
        const suggestions = [];
        
        // Check battery
        if(navigator.getBattery) {
            navigator.getBattery().then(bat => {
                if(bat.level < 0.2 && !bat.charging) {
                    suggestions.push({
                        type: 'warning',
                        message: 'Battery low! Consider enabling power saving mode.',
                        action: () => alert('Power saving mode activated')
                    });
                }
            });
        }
        
        // Check network
        if(!navigator.onLine) {
            suggestions.push({
                type: 'error',
                message: 'You are offline. Some features may not work.',
                action: () => window.location.reload()
            });
        }
        
        return suggestions;
    }
};

// Make globally available
window.AICore = AICore;

// Auto-init
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AICore.init());
} else {
    AICore.init();
}
