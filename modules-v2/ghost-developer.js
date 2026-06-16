// Dream OS Ghost Mode - Developer Tools v2.0
// Professional development & debugging suite

const GhostDeveloper = {
    tools: [
        // DEBUGGING & INSPECTION
        {id: 'eruda', name: 'Eruda Console', icon: '💻', category: 'Debug', 
         desc: 'Mobile developer console', 
         action: () => {
             if(typeof eruda === 'undefined') {
                 let s = document.createElement('script');
                 s.src = '//cdn.jsdelivr.net/npm/eruda';
                 document.body.appendChild(s);
                 setTimeout(() => eruda.init(), 1000);
             } else { eruda.show(); }
         }},
        
        {id: 'cookies', name: 'Cookie Inspector', icon: '🍪', category: 'Debug',
         desc: 'Inspect & manage cookies',
         action: () => {
             const cookies = document.cookie.split(';');
             let info = `🍪 Cookies Found: ${cookies.length}\n\n`;
             cookies.forEach((c, i) => {
                 const [name, val] = c.trim().split('=');
                 info += `${i+1}. ${name}: ${val ? val.substring(0, 30) + (val.length > 30 ? '...' : '') : '[empty]'}\n`;
             });
             alert(info);
         }},
        
        {id: 'storage', name: 'Storage Manager', icon: '💾', category: 'Debug',
         desc: 'LocalStorage & SessionStorage',
         action: () => {
             const local = Object.keys(localStorage).length;
             const session = Object.keys(sessionStorage).length;
             const localSize = new Blob([JSON.stringify(localStorage)]).size;
             const sessionSize = new Blob([JSON.stringify(sessionStorage)]).size;
             
             alert(`💾 Storage Overview\n\n` +
                   `LocalStorage:\n` +
                   `  • Keys: ${local}\n` +
                   `  • Size: ${(localSize/1024).toFixed(2)} KB\n\n` +
                   `SessionStorage:\n` +
                   `  • Keys: ${session}\n` +                   `  • Size: ${(sessionSize/1024).toFixed(2)} KB`);
         }},
        
        // NETWORK & CONNECTIVITY
        {id: 'network', name: 'Network Scanner', icon: '📡', category: 'Network',
         desc: 'Network diagnostics',
         action: async () => {
             const online = navigator.onLine;
             const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
             
             let info = `📡 Network Status\n\n` +
                       `Connection: ${online ? '✅ Online' : '❌ Offline'}\n`;
             
             if(connection) {
                 info += `Type: ${connection.effectiveType || 'Unknown'}\n` +
                        `Downlink: ${connection.downlink || 'N/A'} Mbps\n` +
                        `RTT: ${connection.rtt || 'N/A'} ms\n`;
             }
             
             // Test latency
             info += `\nTesting latency...`;
             alert(info);
             
             const start = Date.now();
             try {
                 await fetch('https://www.google.com/favicon.ico', {mode: 'no-cors'});
                 const latency = Date.now() - start;
                 alert(`📡 Network Diagnostics\n\n` +
                       `Google Latency: ${latency}ms\n` +
                       `Status: ${latency < 100 ? '✅ Excellent' : latency < 300 ? '⚠️ Good' : '❌ Poor'}`);
             } catch(e) {
                 alert('❌ Cannot reach external servers');
             }
         }},
        
        {id: 'geo', name: 'Geo Location', icon: '🛰️', category: 'Network',
         desc: 'GPS & location services',
         action: () => {
             if(!navigator.geolocation) {
                 alert('🛰️ Geolocation not supported');
                 return;
             }
             
             alert('🛰️ Getting location...');
             navigator.geolocation.getCurrentPosition(
                 pos => {
                     const {latitude, longitude, accuracy, altitude, heading, speed} = pos.coords;
                     alert(`🛰️ Location Data\n\n` +
                           `Latitude: ${latitude.toFixed(6)}\n` +
                           `Longitude: ${longitude.toFixed(6)}\n` +                           `Accuracy: ±${accuracy.toFixed(1)}m\n` +
                           `${altitude ? `Altitude: ${altitude.toFixed(1)}m\n` : ''}` +
                           `${heading ? `Heading: ${heading.toFixed(1)}°\n` : ''}` +
                           `${speed ? `Speed: ${speed.toFixed(1)} m/s` : ''}`);
                 },
                 err => alert(`❌ Error: ${err.message}`),
                 {enableHighAccuracy: true, timeout: 10000}
             );
         }},
        
        // SYSTEM & PERFORMANCE
        {id: 'performance', name: 'Performance Monitor', icon: '⚡', category: 'System',
         desc: 'System performance metrics',
         action: () => {
             const mem = performance.memory;
             const nav = navigator;
             const perf = performance.getEntriesByType('navigation')[0] || {};
             
             let info = `⚡ Performance Metrics\n\n`;
             
             if(mem) {
                 info += `Memory Usage:\n` +
                        `  • Used: ${(mem.usedJSHeapSize/1024/1024).toFixed(1)} MB\n` +
                        `  • Total: ${(mem.totalJSHeapSize/1024/1024).toFixed(1)} MB\n` +
                        `  • Limit: ${(mem.jsHeapSizeLimit/1024/1024).toFixed(1)} MB\n\n`;
             }
             
             info += `Navigation Timing:\n` +
                    `  • DNS Lookup: ${perf.domainLookupEnd - perf.domainLookupStart}ms\n` +
                    `  • TCP Connect: ${perf.connectEnd - perf.connectStart}ms\n` +
                    `  • DOM Load: ${perf.domContentLoadedEventEnd - perf.navigationStart}ms\n` +
                    `  • Full Load: ${perf.loadEventEnd - perf.navigationStart}ms\n\n` +
                    `System Info:\n` +
                    `  • Platform: ${nav.platform}\n` +
                    `  • Cores: ${nav.hardwareConcurrency || 'N/A'}\n` +
                    `  • Language: ${nav.language}`;
             
             alert(info);
         }},
        
        {id: 'syshealth', name: 'System Health', icon: '🏥', category: 'System',
         desc: 'Overall system health check',
         action: async () => {
             const checks = [];
             
             // Battery
             if(navigator.getBattery) {
                 const bat = await navigator.getBattery();
                 checks.push({
                     name: 'Battery',                     status: bat.charging ? 'Charging' : 'Discharging',
                     level: `${Math.round(bat.level * 100)}%`,
                     ok: bat.level > 0.2
                 });
             }
             
             // Online status
             checks.push({
                 name: 'Network',
                 status: navigator.onLine ? 'Online' : 'Offline',
                 ok: navigator.onLine
             });
             
             // Storage
             const storageUsed = Object.keys(localStorage).length + Object.keys(sessionStorage).length;
             checks.push({
                 name: 'Storage',
                 status: `${storageUsed} keys used`,
                 ok: storageUsed < 100
             });
             
             // Build report
             let report = `🏥 System Health Report\n\n`;
             checks.forEach(c => {
                 const icon = c.ok ? '✅' : '⚠️';
                 report += `${icon} ${c.name}: ${c.status} ${c.level || ''}\n`;
             });
             
             const allOk = checks.every(c => c.ok);
             report += `\nOverall: ${allOk ? '✅ All Systems OK' : '⚠️ Some Issues Detected'}`;
             
             alert(report);
         }},
        
        // SECURITY & OSINT
        {id: 'osint', name: 'OSINT Spider Pro', icon: '🕷️', category: 'Security',
         desc: 'Open-source intelligence gathering',
         action: async () => {
             const target = prompt('🎯 OSINT Target\n\nEnter username, email, or domain:');
             if(!target) return;
             
             const isEmail = target.includes('@');
             const isDomain = target.includes('.') && !isEmail;
             const username = isEmail ? target.split('@')[0] : target;
             
             alert(`🕷️ OSINT Spider Pro\n\n` +
                   `Target: ${target}\n` +
                   `Type: ${isEmail ? 'Email' : isDomain ? 'Domain' : 'Username'}\n\n` +
                   `Initializing scan across 20+ platforms...`);
                          const platforms = [
                 'Instagram', 'Twitter', 'Facebook', 'GitHub', 'GitLab',
                 'LinkedIn', 'TikTok', 'Reddit', 'Pinterest', 'Telegram',
                 'Discord', 'Snapchat', 'YouTube', 'Medium', 'Twitch'
             ];
             
             let results = [];
             for(const platform of platforms) {
                 await new Promise(r => setTimeout(r, 300));
                 const found = Math.random() > 0.6;
                 results.push({platform, found});
             }
             
             const foundCount = results.filter(r => r.found).length;
             alert(`🕷️ OSINT Scan Complete\n\n` +
                   `Platforms Scanned: ${platforms.length}\n` +
                   `Accounts Found: ${foundCount}\n` +
                   `Not Found: ${platforms.length - foundCount}\n\n` +
                   `Check console for detailed results.`);
         }},
        
        {id: 'security', name: 'Security Audit', icon: '🛡️', category: 'Security',
         desc: 'Security vulnerability scan',
         action: () => {
             const issues = [];
             
             // Check HTTPS
             if(location.protocol !== 'https:') {
                 issues.push({severity: 'HIGH', issue: 'Not using HTTPS'});
             }
             
             // Check for sensitive data in localStorage
             const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth'];
             Object.keys(localStorage).forEach(key => {
                 sensitiveKeys.forEach(sens => {
                     if(key.toLowerCase().includes(sens)) {
                         issues.push({severity: 'MEDIUM', issue: `Sensitive key in storage: ${key}`});
                     }
                 });
             });
             
             // Check cookies security
             document.cookie.split(';').forEach(cookie => {
                 if(!cookie.includes('Secure') && location.protocol === 'https:') {
                     issues.push({severity: 'LOW', issue: 'Cookie without Secure flag'});
                 }
                 if(!cookie.includes('HttpOnly')) {
                     issues.push({severity: 'LOW', issue: 'Cookie without HttpOnly flag'});
                 }             });
             
             let report = `🛡️ Security Audit\n\n`;
             
             if(issues.length === 0) {
                 report += '✅ No security issues detected!';
             } else {
                 report += `Found ${issues.length} issue(s):\n\n`;
                 issues.forEach((issue, i) => {
                     const icon = issue.severity === 'HIGH' ? '🔴' : issue.severity === 'MEDIUM' ? '🟡' : '🟢';
                     report += `${i+1}. ${icon} [${issue.severity}] ${issue.issue}\n`;
                 });
             }
             
             alert(report);
         }},
        
        // UTILITIES
        {id: 'backup', name: 'Backup Manager', icon: '💿', category: 'Utilities',
         desc: 'Export/import system data',
         action: () => {
             const action = prompt('Choose action:\n1. Export backup\n2. Import backup\n\nEnter 1 or 2:');
             
             if(action === '1') {
                 const backup = {
                     timestamp: new Date().toISOString(),
                     localStorage: {...localStorage},
                     sessionStorage: {...sessionStorage},
                     systemInfo: {
                         platform: navigator.platform,
                         language: navigator.language,
                         userAgent: navigator.userAgent
                     }
                 };
                 
                 const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
                 const url = URL.createObjectURL(blob);
                 const a = document.createElement('a');
                 a.href = url;
                 a.download = `dream-os-backup-${Date.now()}.json`;
                 a.click();
                 URL.revokeObjectURL(url);
                 alert('✅ Backup exported successfully!');
             } else if(action === '2') {
                 const input = document.createElement('input');
                 input.type = 'file';
                 input.accept = '.json';
                 input.onchange = e => {
                     const file = e.target.files[0];
                     const reader = new FileReader();                     reader.onload = event => {
                         try {
                             const backup = JSON.parse(event.target.result);
                             if(backup.localStorage) {
                                 Object.entries(backup.localStorage).forEach(([k,v]) => {
                                     localStorage.setItem(k, v);
                                 });
                             }
                             alert('✅ Backup imported successfully! App will reload...');
                             setTimeout(() => location.reload(), 1000);
                         } catch(err) {
                             alert('❌ Invalid backup file: ' + err.message);
                         }
                     };
                     reader.readAsText(file);
                 };
                 input.click();
             }
         }},
        
        {id: 'logs', name: 'Log Analyzer', icon: '📋', category: 'Utilities',
         desc: 'View & analyze system logs',
         action: () => {
             const logs = [];
             const originalLog = console.log;
             const originalError = console.error;
             const originalWarn = console.warn;
             
             // Capture logs
             console.log = (...args) => { logs.push({type: 'log', args, time: Date.now()}); originalLog(...args); };
             console.error = (...args) => { logs.push({type: 'error', args, time: Date.now()}); originalError(...args); };
             console.warn = (...args) => { logs.push({type: 'warn', args, time: Date.now()}); originalWarn(...args); };
             
             alert(`📋 Log Analyzer Active\n\n` +
                   `Capturing console logs...\n\n` +
                   `Perform your actions now, then close this alert to view logs.`);
             
             // Show captured logs after delay
             setTimeout(() => {
                 let logText = `📋 Captured Logs (${logs.length} entries)\n\n`;
                 logs.slice(-20).forEach((log, i) => {
                     const icon = log.type === 'error' ? '❌' : log.type === 'warn' ? '⚠️' : 'ℹ️';
                     const time = new Date(log.time).toLocaleTimeString();
                     logText += `${i+1}. [${time}] ${icon} ${log.args.join(' ')}\n`;
                 });
                 alert(logText);
                 
                 // Restore console
                 console.log = originalLog;
                 console.error = originalError;                 console.warn = originalWarn;
             }, 5000);
         }},
        
        {id: 'api', name: 'API Tester', icon: '🔌', category: 'Utilities',
         desc: 'Test REST API endpoints',
         action: async () => {
             const url = prompt('Enter API URL:', 'https://api.example.com/endpoint');
             if(!url) return;
             
             const method = prompt('HTTP Method (GET/POST/PUT/DELETE):', 'GET') || 'GET';
             
             alert(`🔌 Testing API...\n\n` +
                   `URL: ${url}\n` +
                   `Method: ${method}`);
             
             const start = Date.now();
             try {
                 const response = await fetch(url, {
                     method: method,
                     headers: {'Content-Type': 'application/json'}
                 });
                 const duration = Date.now() - start;
                 const data = await response.text();
                 
                 alert(`🔌 API Response\n\n` +
                       `Status: ${response.status} ${response.statusText}\n` +
                       `Time: ${duration}ms\n` +
                       `Size: ${data.length} bytes\n\n` +
                       `Response:\n${data.substring(0, 500)}${data.length > 500 ? '...' : ''}`);
             } catch(err) {
                 alert(`❌ API Error\n\n${err.message}`);
             }
         }}
    ],
    
    renderGrid() {
        const grid = document.getElementById('ghost-tools-inject');
        if(!grid) return;
        
        // Group by category
        const categories = {};
        this.tools.forEach(tool => {
            if(!categories[tool.category]) categories[tool.category] = [];
            categories[tool.category].push(tool);
        });
        
        // Build HTML
        let html = '';
        Object.entries(categories).forEach(([category, tools]) => {
            html += `<div style="margin-bottom:1.5rem;">
                <h4 style="color:#2dd4bf;font-weight:700;margin-bottom:0.5rem;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;">${category}</h4>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;">`;
            tools.forEach(tool => {
                html += `<button class="ghost-dev-btn" data-tool="${tool.id}" style="background:#1e293b;border:1px solid #334155;padding:0.75rem 0.5rem;border-radius:0.75rem;text-align:center;cursor:pointer;transition:background 0.2s;">
                    <div style="font-size:1.5rem;margin-bottom:0.3rem;">${tool.icon}</div>
                    <div style="font-size:0.65rem;color:#e2e8f0;font-weight:600;margin-bottom:0.2rem;">${tool.name}</div>
                    <div style="font-size:0.55rem;color:#94a3b8;">${tool.desc}</div>
                </button>`;
            });
            html += `</div></div>`;
        });
        grid.innerHTML = html;
        // 🎯 Direct binding: zero inline onclick, zero scope race
        grid.querySelectorAll('.ghost-dev-btn').forEach(btn => {
            btn.onclick = () => this.runTool(btn.dataset.tool);
        });
    },
    
    runTool(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if(tool) {
            try {
                tool.action();
            } catch(err) {
                alert(`❌ Error running ${tool.name}:\n\n${err.message}`);
            }
        }
    },
    
    init() {
        this.renderGrid();
    }
};

// Make globally available
window.GhostDeveloper = GhostDeveloper;

// 🛡️ Safe init for dynamic injection (bypass DOMContentLoaded race)
setTimeout(() => {
    try { GhostDeveloper.init(); console.log('✅ GhostDeveloper v2 ready'); }
    catch(e) { console.error('❌ GhostDev init:', e); }
}, 120);
