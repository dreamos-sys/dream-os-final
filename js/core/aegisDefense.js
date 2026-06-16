/**
 * 🛡️ AEGIS DEFENSE MATRIX v4.0
 * Unified Client-Side Security Orchestrator for Dream OS Family Develop
 * Layers: CryptoVault • Auth Hardening • Behavioral Sentinel • Integrity Guard • Incident Response
 * Compliance: NIST SP 800-63B, OWASP Client-Side Security, WebCrypto API Standard
 * Note: Defense-in-depth. Tidak menggantikan backend/WAF/EDR.
 */
const AegisDefense = (function() {
    const CFG = {
        cryptoKey: 'dreamos_master_key',
        authKey: 'dreamos_auth_state',
        incidentKey: 'dreamos_incident_log',
        maxAttempts: 5,
        cooldownMs: 30000,
        integrityThreshold: 5,
        autoLockOnCritical: true
    };

    // === UTILITIES ===
    function buf2hex(b) { return Array.prototype.map.call(new Uint8Array(b), x=>('00'+x.toString(16)).slice(-2)).join(''); }
    function str2buf(s) { return new TextEncoder().encode(s); }
    function buf2str(b) { return new TextDecoder().decode(b); }
    function nowISO() { return new Date().toISOString(); }
    function safeParse(j) { try { return JSON.parse(j); } catch(e) { return null; } }

    // === CRYPTO ENGINE (WebCrypto AES-GCM + PBKDF2) ===
    const Crypto = {
        available: !!window.crypto?.subtle,
        async deriveKey(pin, salt) {
            if (!this.available) return null;
            const keyMat = await crypto.subtle.importKey('raw', str2buf(pin), 'PBKDF2', false, ['deriveKey']);
            return crypto.subtle.deriveKey(
                { name: 'PBKDF2', salt: str2buf(salt), iterations: 100000, hash: 'SHA-256' },
                keyMat, { name: 'AES-GCM', length: 256 }, false, ['encrypt','decrypt']
            );
        },
        async encrypt(data, pin) {
            if (!this.available) return {
        autoHeal: AutoHeal, fallback: true, data: btoa(JSON.stringify(data)) };
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const key = await this.deriveKey(pin, buf2hex(salt));
            const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, str2buf(JSON.stringify(data)));
            return {
        autoHeal: AutoHeal, salt: buf2hex(salt), iv: buf2hex(iv), ct: buf2hex(enc), fallback: false };
        },        async decrypt(pkg, pin) {
            if (pkg.fallback) return safeParse(atob(pkg.data));
            if (!this.available) return null;
            const key = await this.deriveKey(pin, pkg.salt);
            const dec = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: str2buf(new Uint8Array(pkg.iv.match(/.{2}/g).map(b=>parseInt(b,16)))) },
                key,
                new Uint8Array(pkg.ct.match(/.{2}/g).map(b=>parseInt(b,16)))
            );
            return safeParse(buf2str(dec));
        }
    };

    // === AUTH & RATE LIMITER ===
    const Auth = {
        get state() { return safeParse(localStorage.getItem(CFG.authKey)) || { attempts: [], lockedUntil: 0, deviceHash: '' }; },
        set state(s) { localStorage.setItem(CFG.authKey, JSON.stringify(s)); },
        hashDevice() {
            return buf2hex(new Uint8Array([
                navigator.userAgent.length, screen.width, screen.height,
                new Date().getTimezoneOffset(), navigator.hardwareConcurrency || 4
            ]));
        },
        async verifyPIN(pin, masterPIN) {
            const s = this.state;
            if (Date.now() < s.lockedUntil) return {
        autoHeal: AutoHeal, ok: false, reason: 'COOLDOWN', remaining: Math.ceil((s.lockedUntil-Date.now())/1000) };
            if (pin !== masterPIN) {
                s.attempts.push(Date.now());
                s.attempts = s.attempts.filter(t => Date.now()-t < 300000); // 5 menit window
                if (s.attempts.length >= CFG.maxAttempts) {
                    s.lockedUntil = Date.now() + CFG.cooldownMs;
                    this.state = s;
                    Incident.trigger('AUTH_BRUTEFORCE', { attempts: s.attempts.length });
                    return {
        autoHeal: AutoHeal, ok: false, reason: 'LOCKED', cooldown: CFG.cooldownMs/1000 };
                }
                this.state = s;
                return {
        autoHeal: AutoHeal, ok: false, reason: 'INVALID', left: CFG.maxAttempts - s.attempts.length };
            }
            s.attempts = []; s.lockedUntil = 0; s.deviceHash = this.hashDevice();
            this.state = s;
            return {
        autoHeal: AutoHeal, ok: true };
        },
        isDeviceBound() {
            const s = this.state;
            return s.deviceHash && s.deviceHash === this.hashDevice();
        }
    };

    // === BEHAVIORAL SENTINEL ===
    const Sentinel = {        active: false,
        original: {},
        enable() {
            if (this.active) return;
            this.active = true;
            this.original = { eval: window.eval, Function: window.Function, write: document.write, fetch: window.fetch, setTimeout: window.setTimeout, setInterval: window.setInterval };

            // Prototype Pollution Guard
            try { Object.freeze(Object.prototype); Object.freeze(Array.prototype); } catch(e){}

            // DOM Clobbering Guard
            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(n => {
                        if (n.nodeType === 1 && /^(script|iframe|object|embed)$/i.test(n.tagName)) {
                            if (/^(data:|javascript:|vbscript:)/i.test(n.src || n.data || '')) {
                                n.remove();
                                Incident.trigger('DOM_CLOBBERING', { tag: n.tagName, src: n.src || n.data });
                            }
                        }
                    });
                });
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });

            // API Hooks
            window.eval = function(code) { console.warn("🛡️ Aegis v1.0 Beta: eval() deprecated. Gunakan SafeExec.parse() atau pre-compiled logic."); return undefined; // CSP_PHASE2
                const res = VaccineVault ? VaccineVault.analyze(code) : { score: 0 };
                if (res.score >= 7) { Incident.trigger('DANGEROUS_EVAL', res); console.warn('🛡️ Aegis Monitor: risky eval()', res); } // Beta: allow + log
                return Sentinel.original.eval.call(window, code);
            };
            window.Function = function(...args) { console.warn("🛡️ Aegis v1.0 Beta: new Function() deprecated. Gunakan SafeExec.register/call."); return function(){}; // CSP_PHASE2
                const body = args[args.length-1] || '';
                const res = VaccineVault ? VaccineVault.analyze(body) : { score: 0 };
                if (res.score >= 7) { Incident.trigger('DANGEROUS_FUNCTION', res); console.warn('🛡️ Aegis Monitor: risky Function()', res); } // Beta: allow + log
                return Sentinel.original.Function.apply(window, args);
            };
            document.write = function(html) {
                const res = VaccineVault ? VaccineVault.analyze(html) : { score: 0 };
                if (res.score >= 7) { Incident.trigger('DANGEROUS_DOM_WRITE', res); console.warn('🛡️ Aegis Monitor: risky document.write()', res); } // Beta: allow + log
                return Sentinel.original.write.call(document, html);
            };
            window.fetch = function(url, opts) {
                const target = typeof url === 'string' ? url : url?.url || '';
                if (/^(data:|javascript:|file:)/i.test(target)) {
                    Incident.trigger('DANGEROUS_FETCH_PROTOCOL', { target });
                    return Promise.reject(new Error('Aegis: Blocked dangerous protocol'));
                }
                return Sentinel.original.fetch.apply(window, arguments);
            };            console.log('✅ Aegis Sentinel enabled: API hooks + DOM guard + prototype freeze active');
        },
        disable() {
            if (!this.active) return;
            window.eval = this.original.eval; window.Function = this.original.Function;
            document.write = this.original.write; window.fetch = this.original.fetch;
            this.active = false;
            console.log('⏸️ Aegis Sentinel disabled');
        }
    };

    // === INTEGRITY GUARD ===
    const Integrity = {
        checkpoints: 0,
        verify() {
            let score = 0;
            if (typeof window.AegisDefense !== 'object') score++;
            if (typeof window.VaccineVault !== 'object') score++;
            if (typeof window.GhostStealth !== 'object') score++;
            if (document.querySelectorAll('script[src*="dream"]').length === 0) score++;
            if (window.localStorage.length > 500) score++; // anomaly indicator
            this.checkpoints = score;
            if (score >= CFG.integrityThreshold) {
                Incident.trigger('INTEGRITY_BREACH', { score, threshold: CFG.integrityThreshold });
                if (CFG.autoLockOnCritical) {
                    localStorage.removeItem('dreamos_session');
                    localStorage.removeItem('dreamos_pin_verified');
                }
            }
            return {
        autoHeal: AutoHeal, score, threshold: CFG.integrityThreshold, status: score < CFG.integrityThreshold ? 'SECURE' : 'COMPROMISED' };
        }
    };

    // === INCIDENT RESPONSE & FORENSICS ===
    const Incident = {
        log(type, detail) {
            const log = safeParse(localStorage.getItem(CFG.incidentKey)) || [];
            log.unshift({ type, detail, ts: nowISO(), id: 'inc_'+Date.now() });
            if (log.length > 100) log.length = 100;
            localStorage.setItem(CFG.incidentKey, JSON.stringify(log));
            if (typeof window.ghostLog === 'function') window.ghostLog(`🚨 INCIDENT: ${type}`, 'error');
        },
        trigger(type, detail) {
            this.log(type, detail);
            if (detail?.score >= 9 || type === 'INTEGRITY_BREACH') {
                if (CFG.autoLockOnCritical) {
                    localStorage.removeItem('dreamos_session');
                    console.warn('🔒 Aegis: Critical threat detected. Session locked.');
                }
            }        },
        getLog() { return safeParse(localStorage.getItem(CFG.incidentKey)) || []; },
        clear() { localStorage.removeItem(CFG.incidentKey); return true; },
        exportForensics() {
            const data = {
                incidents: this.getLog(),
                quarantine: typeof VaccineVault !== 'undefined' ? VaccineVault.getVault() : [],
                auth: Auth.state,
                integrity: Integrity.verify(),
                exportedAt: nowISO()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `dreamos_forensics_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
        }
    };

    
    // === AUTO-HEAL MODULE (STATE CHECKPOINT + SAFE RELOAD) ===
    const AutoHeal = {
        checkpointKey: 'dreamos_state_checkpoint',
        takeCheckpoint() {
            try {
                const state = {
                    settings: localStorage.getItem('dreamos_settings'),
                    session: localStorage.getItem('dreamos_session'),
                    pin: localStorage.getItem('dreamos_pin'),
                    ts: Date.now()                };
                sessionStorage.setItem(this.checkpointKey, JSON.stringify(state));
                console.log('🧬 Aegis Auto-Heal: State checkpoint saved.');
            } catch(e) { console.warn('🧬 Checkpoint failed:', e); }
        },
        triggerRecovery(reason) {
            console.warn('🛠️ Aegis Auto-Heal triggered:', reason);
            Incident.trigger('AUTO_HEAL_ACTIVATED', { reason });
            // Clear suspicious runtime data, keep core config
            ['dreamos_error_log', 'dreamos_incident_log', 'dreamos_quarantine_vault'].forEach(k => localStorage.removeItem(k));
            // Safe reload with recovery flag
            const url = new URL(window.location.href);
            url.searchParams.set('recovery', '1');
            window.location.href = url.toString();
        },
        restoreOnBoot() {
            const url = new URL(window.location.href);
            if (url.searchParams.get('recovery') === '1') {
                try {
                    const raw = sessionStorage.getItem(this.checkpointKey);
                    if (raw) {
                        const state = JSON.parse(raw);
                        if (state.settings) localStorage.setItem('dreamos_settings', state.settings);
                        if (state.pin) localStorage.setItem('dreamos_pin', state.pin);
                        console.log('✅ Aegis Auto-Heal: State restored from checkpoint.');
                        if (typeof window.ghostLog === 'function') window.ghostLog('🛠️ System recovered from checkpoint', 'success');
                    }
                } catch(e) { console.warn('🛠️ Restore failed:', e); }
                url.searchParams.delete('recovery');
                window.history.replaceState({}, '', url.toString());
                sessionStorage.removeItem(this.checkpointKey);
            }
        }
    };

    // === PUBLIC API ===
    return {
        autoHeal: AutoHeal,
        crypto: Crypto,
        auth: Auth,
        sentinel: Sentinel,
        integrity: Integrity,
        incident: Incident,
        init(masterPIN) {
            Sentinel.enable();

    // === CSP VIOLATION MONITOR ===
    document.addEventListener('securitypolicyviolation', (e) => {
        console.warn(`🛡️ CSP Blocked: ${e.violatedDirective} | ${e.blockedURI}`);
        if(typeof Incident !== 'undefined') Incident.trigger('CSP_VIOLATION', { directive: e.violatedDirective, uri: e.blockedURI });
    });
    // CSP_VIOLATION_LISTENER

            AutoHeal.restoreOnBoot();
            document.addEventListener("DOMContentLoaded", () => AutoHeal.takeCheckpoint());
            const status = Integrity.verify();
            console.log(`🛡️ Aegis Defense Matrix v4.0 initialized | Integrity: ${status.status} | Crypto: ${Crypto.available?'WebCrypto':'Fallback'}`);
            return status;
        }
    };
})();
