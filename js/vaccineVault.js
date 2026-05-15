const VaccineVault = (function() {
    const KEY = 'dreamos_virus_vault';
    
    return {
        add: function(payload, type = 'malware') {
            let vault = JSON.parse(localStorage.getItem(KEY) || '[]');
            const sig = btoa(unescape(encodeURIComponent(payload))).substring(0, 16);
            
            const existing = vault.find(v => v.signature === sig);
            if(existing) {
                existing.count++;
                existing.lastSeen = new Date().toLocaleString();
            } else {
                vault.push({
                    signature: sig,
                    payload: payload,
                    type: type,
                    count: 1,
                    lastSeen: new Date().toLocaleString()
                });
            }
            localStorage.setItem(KEY, JSON.stringify(vault));
            console.warn(`💉 Neutralized: ${sig}`);
            return sig;
        },
        get: function() { return JSON.parse(localStorage.getItem(KEY) || '[]'); },
        clear: function() { localStorage.setItem(KEY, '[]'); return true; }
    };
})();
