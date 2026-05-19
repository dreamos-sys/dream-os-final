// Dream OS Notification System v1.0
// Centralized notification management

const NotificationSystem = {
    notifications: [],
    listeners: [],
    
    // Show toast notification
    toast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-[9999] px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full`;
        
        const colors = {
            success: 'bg-emerald-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-amber-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.className += ` ${colors[type] || colors.info}`;
        toast.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-xl">${icons[type]}</span>
                <span class="font-medium">${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.remove('translate-x-full'), 100);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, duration);        
        // Add to notification history
        this.add({message, type, time: new Date().toISOString()});
    },
    
    // Add to notification history
    add(notification) {
        this.notifications.unshift(notification);
        if(this.notifications.length > 50) this.notifications.pop();
        this.notifyListeners();
    },
    
    // Get all notifications
    getAll() {
        return this.notifications;
    },
    
    // Clear all notifications
    clear() {
        this.notifications = [];
        this.notifyListeners();
    },
    
    // Subscribe to notification events
    subscribe(callback) {
        this.listeners.push(callback);
    },
    
    // Notify all subscribers
    notifyListeners() {
        this.listeners.forEach(cb => cb(this.notifications));
    },
    
    // Show notification center UI
    showCenter() {
        const modal = document.createElement('div');
        modal.id = 'notification-center';
        modal.className = 'fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white">🔔 Notifications</h3>
                    <button onclick="NotificationSystem.closeCenter()" class="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                <div class="overflow-y-auto max-h-[60vh] p-4" id="notif-list">
                    ${this.notifications.length === 0 ? 
                        '<p class="text-center text-slate-500 py-8">No notifications</p>' : 
                        this.notifications.map(n => `
                            <div class="p-4 mb-2 rounded-lg ${this.getTypeBg(n.type)} flex items-start gap-3">
                                <span class="text-xl">${this.getTypeIcon(n.type)}</span>                                <div class="flex-1">
                                    <p class="text-slate-800 dark:text-white">${n.message}</p>
                                    <p class="text-xs text-slate-500 mt-1">${new Date(n.time).toLocaleString()}</p>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
                ${this.notifications.length > 0 ? `
                    <div class="p-4 border-t border-slate-200 dark:border-slate-700">
                        <button onclick="NotificationSystem.clear()" class="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition">
                            Clear All
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    closeCenter() {
        const modal = document.getElementById('notification-center');
        if(modal) modal.remove();
    },
    
    getTypeBg(type) {
        const bgs = {
            success: 'bg-emerald-50 dark:bg-emerald-900/20',
            error: 'bg-red-50 dark:bg-red-900/20',
            warning: 'bg-amber-50 dark:bg-amber-900/20',
            info: 'bg-blue-50 dark:bg-blue-900/20'
        };
        return bgs[type] || bgs.info;
    },
    
    getTypeIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    },
    
    // Initialize
    init() {
        console.log('🔔 Notification System initialized');
                // Add keyboard shortcut (Ctrl/Cmd + N)
        document.addEventListener('keydown', (e) => {
            if((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.showCenter();
            }
        });
    }
};

// Make globally available
window.NotificationSystem = NotificationSystem;

// Auto-init
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NotificationSystem.init());
} else {
    NotificationSystem.init();
}

// Helper functions for easy use
window.notify = (msg, type, duration) => NotificationSystem.toast(msg, type, duration);
window.notifySuccess = (msg) => NotificationSystem.toast(msg, 'success');
window.notifyError = (msg) => NotificationSystem.toast(msg, 'error');
window.notifyWarning = (msg) => NotificationSystem.toast(msg, 'warning');
window.notifyInfo = (msg) => NotificationSystem.toast(msg, 'info');
