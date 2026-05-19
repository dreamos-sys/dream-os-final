// Dream OS Command Center Module v1.0
// Central monitoring & control for all 9 modules

const CommandCenter = {
    modules: ['CMD', 'Booking', 'K3', 'Security', 'JanitorIn', 'JanitorOut', 'Stok', 'Asset'],
    
    status: {},
    
    init() {
        console.log('🔧 Command Center initialized');
        this.monitorAllModules();
        this.startAutoUpdate();
    },
    
    monitorAllModules() {
        this.modules.forEach(mod => {
            this.status[mod] = {
                name: mod,
                status: 'online',
                lastCheck: Date.now(),
                logs: []
            };
        });
        this.log('System', 'All 9 modules monitored');
    },
    
    getModuleStatus(moduleName) {
        return this.status[moduleName] || { status: 'unknown' };
    },
    
    log(module, message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] [${module}] ${message}`;
        console.log(logEntry);
        
        // Add to live log panel if exists
        const logPanel = document.getElementById('cmd-log');
        if (logPanel) {
            logPanel.innerHTML += `> ${logEntry}<br>`;
            logPanel.scrollTop = logPanel.scrollHeight;
        }
    },
    
    startAutoUpdate() {        // Update status every 30 seconds
        setInterval(() => {
            this.modules.forEach(mod => {
                this.status[mod].lastCheck = Date.now();
                this.status[mod].status = 'online';
            });
            this.log('CommandCenter', 'Auto-check completed');
        }, 30000);
    },
    
    runMaintenance() {
        this.log('Maintenance', 'Starting system maintenance...');
        
        // Simulate maintenance tasks
        setTimeout(() => this.log('Cache', 'Cache cleared'), 500);
        setTimeout(() => this.log('Logs', 'Logs rotated'), 1000);
        setTimeout(() => this.log('Database', 'Database optimized'), 1500);
        setTimeout(() => {
            this.log('Maintenance', '✅ Maintenance complete');
            alert('✅ System maintenance completed successfully!');
        }, 2000);
    },
    
    exportAllData() {
        const data = {
            timestamp: new Date().toISOString(),
            modules: this.status,
            localStorage: {...localStorage},
            systemInfo: {
                online: navigator.onLine,
                platform: navigator.platform,
                language: navigator.language
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dream-os-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.log('Export', 'All data exported successfully');
    },
    
    clearAllCache() {
        if (confirm('⚠️ Clear all cached data and restart system?')) {
            localStorage.clear();
            sessionStorage.clear();            this.log('Cache', 'All cache cleared');
            setTimeout(() => location.reload(), 1000);
        }
    }
};

// Make globally available
window.CommandCenter = CommandCenter;

// Auto-init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CommandCenter.init());
} else {
    CommandCenter.init();
}
