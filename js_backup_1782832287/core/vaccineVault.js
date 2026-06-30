/**
 * 🛡️ VaccineVault v3.0 "Aegis Core"
 * Multi-Layer Client-Side Defense & Threat Intelligence Aggregator
 * Sources: NVD API v2.0, CIRCL CVE, URLhaus (Abuse.ch)
 * Architecture: Static + Heuristic + Entropy + Behavioral Guard + Quarantine
 * Compliance: NIST CVSS v3.1, OWASP Top 10, Client-Side Security Best Practices
 */
const VaccineVault = (function() {
    const CONFIG = {
        vaultKey: 'dreamos_quarantine_vault',
        intelKey: 'dreamos_threat_intel',
        maxVault: 50,
        intelTTL: 24 * 60 * 60 * 1000, // 24 jam
        entropyThreshold: 4.5,
        cvssHigh: 7.0,
        cvssCritical: 9.0,
        apis: {
            nvd: 'https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=',
            circl: 'https://cve.circl.lu/api/last/10',
            urlhaus: 'https://urlhaus-api.abuse.ch/v1/urls/recent/'
        }
    };

    // === UTILITIES ===
    function safeB64(str) { try { return btoa(unescape(encodeURIComponent(str))); } catch(e) { return 'encode_fail'; } }
    function shannonEntropy(str) {
        if (!str) return 0;
        const freq = {};
        for (let i = 0; i < str.length; i++) freq[str[i]] = (freq[str[i]] || 0) + 1;
        const len = str.length;
        return -Object.values(freq).reduce((sum, f) => { const p = f / len; return sum + (p * Math.log2(p)); }, 0);
    }
    function nowISO() { return new Date().toISOString(); }
    function isExpired(ts) { return (Date.now() - new Date(ts).getTime()) > CONFIG.intelTTL; }

    // === STATIC + HEURISTIC ANALYZER ===
    function analyzePayload(payload) {
        if (typeof payload !== 'string') payload = String(payload);
        const risks = [];
        let score = 0;

        // 1. Pattern Detection (OWASP-aligned)
        const patterns = [
            { rx: /(?:eval|Function|setTimeout|setInterval)\s*\(/i, tag: 'CODE_EXECUTION', sev: 9 },            { rx: /document\.(write|writeln|domain|cookie)|innerHTML\s*=/i, tag: 'DOM_MANIPULATION', sev: 7 },
            { rx: /(?:fetch|XMLHttpRequest|\.ajax|\.get|\.post)\s*\(/i, tag: 'NETWORK_EXFIL', sev: 6 },
            { rx: /(?:base64|btoa|atob|unescape|decodeURIComponent)\s*\(/i, tag: 'ENCODED_PAYLOAD', sev: 5 },
            { rx: /(?:<script|javascript:|data:text\/html|on\w+\s*=)/i, tag: 'XSS_VECTOR', sev: 8 },
            { rx: /(?:union\s+select|drop\s+table|;\s*--|'\s*or\s*'1'='1)/i, tag: 'SQL_INJECTION', sev: 9 }
        ];
        patterns.forEach(p => { if (p.rx.test(payload)) { risks.push(p.tag); score = Math.max(score, p.sev); } });

        // 2. Entropy Analysis (Obfuscation/Encryption detection)
        const entropy = shannonEntropy(payload);
        if (entropy > CONFIG.entropyThreshold) {
            risks.push('HIGH_ENTROPY_OBFUSCATION');
            score = Math.max(score, 7);
        }

        // 3. Length & Repetition Anomaly
        if (payload.length > 5000) { risks.push('OVERSIZED_PAYLOAD'); score = Math.max(score, 5); }
        if (/(.)\1{20,}/.test(payload)) { risks.push('REPETITION_FLOOD'); score = Math.max(score, 4); }

        const sig = safeB64(payload).substring(0, 16);
        const level = score >= CONFIG.cvssCritical ? 'CRITICAL' : score >= CONFIG.cvssHigh ? 'HIGH' : score >= 4 ? 'MEDIUM' : 'LOW';

        return { sig, score, level, risks, entropy, length: payload.length, analyzedAt: nowISO() };
    }

    // === QUARANTINE VAULT (FIFO + SAFE STORAGE) ===
    function quarantine(payload, analysis) {
        try {
            let vault = JSON.parse(localStorage.getItem(CONFIG.vaultKey) || '[]');
            vault.unshift({
                signature: analysis.sig,
                score: analysis.score,
                level: analysis.level,
                risks: analysis.risks,
                entropy: analysis.entropy,
                payloadSafe: safeB64(payload), // Base64 to prevent accidental execution
                quarantinedAt: nowISO()
            });
            if (vault.length > CONFIG.maxVault) vault.length = CONFIG.maxVault;
            localStorage.setItem(CONFIG.vaultKey, JSON.stringify(vault));
            return true;
        } catch (e) { return false; }
    }

    // === THREAT INTELLIGENCE AGGREGATOR (NVD + CIRCL + URLHAUS) ===
    async function fetchThreatIntel() {
        const cached = JSON.parse(localStorage.getItem(CONFIG.intelKey) || 'null');
        if (cached && !isExpired(cached.fetchedAt)) return cached;

        const results = { nvd: [], circl: [], urlhaus: [], fetchedAt: nowISO() };
        try {
            const [nvdRes, circlRes, urlhausRes] = await Promise.allSettled([
                fetch(CONFIG.apis.nvd + encodeURIComponent('web application')).then(r => r.json()).catch(() => null),
                fetch(CONFIG.apis.circl).then(r => r.json()).catch(() => null),
                fetch(CONFIG.apis.urlhaus).then(r => r.json()).catch(() => null)
            ]);

            if (nvdRes.status === 'fulfilled' && nvdRes.value?.vulnerabilities) {
                results.nvd = nvdRes.value.vulnerabilities.slice(0, 5).map(v => ({
                    id: v.cve.id,
                    desc: v.cve.descriptions?.[0]?.value?.substring(0, 120) || 'N/A',
                    cvss: v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0,
                    published: v.cve.published
                }));
            }
            if (circlRes.status === 'fulfilled' && Array.isArray(circlRes.value)) {
                results.circl = circlRes.value.slice(0, 5).map(c => ({
                    id: c.id,
                    desc: c.summary?.substring(0, 120) || 'N/A',
                    cvss: c.cvss || 0,
                    published: c.Published
                }));
            }
            if (urlhausRes.status === 'fulfilled' && urlhausRes.value?.urls) {
                results.urlhaus = urlhausRes.value.urls.slice(0, 5).map(u => ({
                    url: u.url,
                    status: u.url_status,
                    threat: u.threat,
                    date: u.dateadded
                }));
            }

            localStorage.setItem(CONFIG.intelKey, JSON.stringify(results));
            return results;
        } catch (e) {
            return cached || results;
        }
    }

    // === BEHAVIORAL GUARD (SAFE API WRAPPERS) ===
    let guardActive = false;
    const original = { eval: window.eval, Function: window.Function, write: document.write, fetch: window.fetch };

    function enableGuard() {
        if (guardActive) return;
        guardActive = true;

        window.eval = function(code) {
            const res = analyzePayload(code);            if (res.score >= CONFIG.cvssHigh) {
                quarantine(code, res);
                console.warn('🛡️ Aegis Guard: Blocked dangerous eval()', res);
                return undefined;
            }
            return original.eval.call(window, code);
        };

        window.Function = function(...args) {
            const body = args[args.length - 1] || '';
            const res = analyzePayload(body);
            if (res.score >= CONFIG.cvssHigh) {
                quarantine(body, res);
                console.warn('🛡️ Aegis Guard: Blocked dangerous Function()', res);
                return function() {};
            }
            return original.Function.apply(window, args);
        };

        document.write = function(html) {
            const res = analyzePayload(html);
            if (res.score >= CONFIG.cvssHigh) {
                quarantine(html, res);
                console.warn('🛡️ Aegis Guard: Blocked dangerous document.write()', res);
                return;
            }
            return original.write.call(document, html);
        };

        window.fetch = function(url, opts) {
            const target = typeof url === 'string' ? url : url?.url || '';
            if (/^(?:data:|javascript:|file:)/i.test(target)) {
                const res = analyzePayload(target);
                quarantine(target, res);
                console.warn('🛡️ Aegis Guard: Blocked dangerous fetch protocol', res);
                return Promise.reject(new Error('Aegis: Blocked dangerous protocol'));
            }
            return original.fetch.apply(window, arguments);
        };

        console.log('✅ Aegis Guard enabled: eval, Function, document.write, fetch monitored');
    }

    function disableGuard() {
        if (!guardActive) return;
        window.eval = original.eval;
        window.Function = original.Function;
        document.write = original.write;
        window.fetch = original.fetch;
        guardActive = false;        console.log('⏸️ Aegis Guard disabled');
    }

    // === PUBLIC API ===
    return {
        analyze: function(payload) {
            const res = analyzePayload(payload);
            if (res.score >= CONFIG.cvssHigh) quarantine(payload, res);
            return res;
        },
        fetchIntel: fetchThreatIntel,
        getVault: function() { return JSON.parse(localStorage.getItem(CONFIG.vaultKey) || '[]'); },
        clearVault: function() { localStorage.removeItem(CONFIG.vaultKey); return true; },
        guard: { enable: enableGuard, disable: disableGuard, isActive: () => guardActive },
        config: CONFIG
    };
})();
