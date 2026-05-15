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
                vault.push({ signature: sig, payload: payload, type: type, count: 1, lastSeen: new Date().toLocaleString() });
            }
            localStorage.setItem(KEY, JSON.stringify(vault));
            return sig;
        },
        get: function() { return JSON.parse(localStorage.getItem(KEY) || '[]'); },
        clear: function() { localStorage.setItem(KEY, '[]'); return true; }
    };
})();

// Bridge untuk Log Extractor (Mobile Friendly)
window.processLogNeural = function(rawText) {
    const ipPattern = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    
    return {
        ips: [...new Set(rawText.match(ipPattern) || [])],
        emails: [...new Set(rawText.match(emailPattern) || [])],
        urls: [...new Set(rawText.match(urlPattern) || [])]
    };
};
