const VaccineVault = (function() {
    const KEY = 'dreamos_virus_vault';
    return {
        // Deep Analysis: Bukan cuma simpen, tapi bedah resiko
        analyze: function(payload) {
            const risks = [];
            if(/eval\(|setTimeout\(|setInterval\(/.test(payload)) risks.push("🔴 EXECUTION INJECTION");
            if(/base64|btoa\(|atob\(/.test(payload)) risks.push("🟠 ENCODED PAYLOAD");
            if(/document\.write|<script/.test(payload)) risks.push("🔴 DOM MANIPULATION");
            if(/fetch\(|XMLHttpRequest|\.ajax/.test(payload)) risks.push("🟡 NETWORK EXFILTRATION");
            
            const sig = btoa(unescape(encodeURIComponent(payload))).substring(0, 12);
            const score = risks.length * 25;
            
            let vault = JSON.parse(localStorage.getItem(KEY) || '[]');
            vault.push({ signature: sig, score: score, risks: risks, date: new Date().toLocaleString() });
            localStorage.setItem(KEY, JSON.stringify(vault));
            
            return { sig, score, risks };
        },
        // Fetch Real CVE Data (LIVE!)
        fetchCVE: async function() {
            try {
                const response = await fetch('https://cve.circl.lu/api/last/5');
                return await response.json();
            } catch (e) { return null; }
        },
        get: function() { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    };
})();
