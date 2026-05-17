console.log("Kernel Nano Quantum Running. Bi idznillah.");
const state = { role: 'STAFF', ghostTaps: 0, ghostTimer: null };

// ========== AUTO SCRIPT EXECUTOR ==========
(function() {
  function executeScripts(container) {
    container.querySelectorAll('script').forEach(oldScript => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      for (let attr of oldScript.attributes) {
        if (attr.name !== 'src') newScript.setAttribute(attr.name, attr.value);
      }
      oldScript.replaceWith(newScript);
    });
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          executeScripts(node);
          if (node.tagName === 'SCRIPT') {
            const newScript = document.createElement('script');
            if (node.src) newScript.src = node.src;
            else newScript.textContent = node.textContent;
            node.replaceWith(newScript);
          }
        }
      });
    });
  });

  function startObserving() {
    const container = document.getElementById('command-center') 
                   || document.getElementById('module-container');
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
      console.log('Script executor observing container');
    } else {
      setTimeout(startObserving, 300);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
  }
})();

// ========== QUANTUM CORE FOR SMART AI AGENT ==========
// Global Event Bus (Pub/Sub)
window.DreamEventBus = {
  subscribers: new Map(),
  subscribe(event, callback, moduleId = 'core') {
    if (!this.subscribers.has(event)) this.subscribers.set(event, new Map());
    this.subscribers.get(event).set(moduleId, callback);
    return () => this.unsubscribe(event, moduleId);
  },
  unsubscribe(event, moduleId) {
    const subs = this.subscribers.get(event);
    if (subs) subs.delete(moduleId);
  },
  emit(event, data) {
    const subs = this.subscribers.get(event);
    if (subs) subs.forEach(cb => cb(data));
  }
};

// Global Action Registry untuk AI
window.DreamOS = {
  actions: new Map(),
  registerAction(intent, handler) {
    this.actions.set(intent, handler);
    console.log('Action registered:', intent);
  },
  executeAction(intent, params) {
    const handler = this.actions.get(intent);
    if (handler) {
      console.log('Executing action:', intent, params);
      return handler(params);
    } else {
      console.error('Action not found:', intent);
      return { error: 'Action not found' };
    }
  }
};

// Reactive State Manager
window.DreamState = new Proxy({
  role: localStorage.getItem('dreamos_role') || 'STAFF',
  ghostMode: false,
  memories: {}
}, {
  set(target, prop, value) {
    target[prop] = value;
    DreamEventBus.emit('state:changed', { prop, value });
    return true;
  }
});

// Conversation Memory untuk AI
window.DreamMemory = {
  conversations: JSON.parse(localStorage.getItem('dream_memory') || '[]'),
  addMessage(role, content) {
    this.conversations.push({ role, content, timestamp: Date.now() });
    localStorage.setItem('dream_memory', JSON.stringify(this.conversations));
    DreamEventBus.emit('memory:updated', { role, content });
  },
  getContext(limit = 10) {
    return this.conversations.slice(-limit);
  }
};

// Auto-update global state role dari localStorage jika ada
document.addEventListener('DOMContentLoaded', () => {
  const savedRole = localStorage.getItem('dreamos_role');
  if (savedRole) DreamState.role = savedRole;
});

console.log("Quantum Core for Smart AI Agent ready.");

// ========== PERISAI 1: INTEGRITY WATCHER ==========
window.DreamIntegrity = {
    hashes: {},
    async generateHash(filePath) {
        try {
            const res = await fetch(filePath);
            const text = await res.text();
            const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (e) {
            console.error('Gagal hash:', filePath, e);
            return null;
        }
    },
    async checkAll() {
        console.log('🛡️ Integrity Watcher: Memindai...');
        const modules = [
            'js/modules/command.html',
            'js/modules/booking.html',
            'js/modules/k3.html',
            'js/modules/security.html',
            'js/modules/janitor-in.html',
            'js/modules/janitor-out.html',
            'js/modules/stok.html',
            'js/modules/maintenance.html',
            'js/modules/asset.html'
        ];
        let breaches = [];
        for (let file of modules) {
            const expectedHash = this.hashes[file];
            if (!expectedHash) continue;
            const actualHash = await this.generateHash(file);
            if (actualHash && actualHash !== expectedHash) {
                breaches.push({ file, expectedHash, actualHash });
            }
        }
        if (breaches.length > 0) {
            DreamEventBus.emit('integrity:breach', breaches);
            console.error('🚨 PELANGGARAN INTEGRITAS:', breaches);
            DreamVault.lock();
        } else {
            console.log('✅ Semua modul utuh.');
        }
        return breaches;
    }
};

// ========== PERISAI 2: ENCRYPTED VAULT ==========
window.DreamVault = {
    isLocked: false,
    async deriveKey(passphrase, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    },
    async encrypt(data, passphrase) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.deriveKey(passphrase, salt);
        const enc = new TextEncoder();
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            enc.encode(JSON.stringify(data))
        );
        return { salt: Array.from(salt), iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) };
    },
    async lock(passphrase) {
        if (!passphrase) {
            console.error('Vault: Passphrase diperlukan untuk mengunci.');
            return;
        }
        const allData = {};
        for (let key of Object.keys(localStorage)) {
            allData[key] = localStorage.getItem(key);
        }
        const vault = await this.encrypt(allData, passphrase);
        localStorage.setItem('dream_vault', JSON.stringify(vault));
        for (let key of Object.keys(localStorage)) {
            if (key !== 'dream_vault') localStorage.removeItem(key);
        }
        this.isLocked = true;
        DreamEventBus.emit('vault:locked');
        console.log('🔒 Vault terkunci. Data aman.');
        location.reload();
    },
    async unlock(passphrase) {
        const vaultData = localStorage.getItem('dream_vault');
        if (!vaultData) {
            console.error('Vault tidak ditemukan.');
            return false;
        }
        try {
            const vault = JSON.parse(vaultData);
            const salt = new Uint8Array(vault.salt);
            const iv = new Uint8Array(vault.iv);
            const data = new Uint8Array(vault.data);
            const key = await this.deriveKey(passphrase, salt);
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );
            const allData = JSON.parse(new TextDecoder().decode(decrypted));
            for (let [key, value] of Object.entries(allData)) {
                localStorage.setItem(key, value);
            }
            localStorage.removeItem('dream_vault');
            this.isLocked = false;
            DreamEventBus.emit('vault:unlocked');
            console.log('🔓 Vault terbuka. Data dipulihkan.');
            location.reload();
            return true;
        } catch (e) {
            console.error('Passphrase salah:', e);
            return false;
        }
    }
};

// ========== PERISAI 3: DEAD MAN'S SWITCH ==========
window.DreamDeadMan = {
    lastCheckIn: Date.now(),
    timeoutHours: 24,
    isArmed: false,
    checkIn() {
        this.lastCheckIn = Date.now();
        localStorage.setItem('deadman_last_check', this.lastCheckIn);
        console.log('🕒 Dead Man Switch: Check-in berhasil.');
    },
    evaluate() {
        const now = Date.now();
        const diffHours = (now - this.lastCheckIn) / (1000 * 60 * 60);
        if (this.isArmed && diffHours > this.timeoutHours) {
            console.warn('💀 Dead Man Switch: Waktu habis! Mengunci sistem...');
            DreamEventBus.emit('deadman:triggered');
            if (window.DreamVault) {
                const pass = prompt('Dead Man Switch: Masukkan passphrase darurat untuk mengunci vault:');
                if (pass) DreamVault.lock(pass);
            }
            const cmd = document.getElementById('command-center');
            if (cmd) cmd.style.display = 'none';
            alert('Sistem dikunci otomatis. Silakan check-in melalui Ghost Mode.');
        }
    },
    arm() {
        this.isArmed = true;
        this.lastCheckIn = parseInt(localStorage.getItem('deadman_last_check') || Date.now());
        setInterval(() => this.evaluate(), 60000);
        console.log('💀 Dead Man Switch diaktifkan. Interval:', this.timeoutHours + ' jam');
    }
};
document.addEventListener('DOMContentLoaded', () => {
    DreamDeadMan.arm();
});

// ========== DREAM IMMUNE SYSTEM ==========
window.DreamImmune = {
    ownerSession: false,
    threatLevel: 0,
    failedAttempts: {},
    attackPatterns: JSON.parse(localStorage.getItem('immune_patterns') || '[]'),
    
    identifyAsOwner() {
        this.ownerSession = true;
        this.threatLevel = 0;
        console.log('👑 Owner teridentifikasi. Immune system dalam mode ramah.');
        DreamEventBus.emit('immune:owner-identified');
    },
    
    logAttempt(type, details) {
        const key = type + '::' + JSON.stringify(details).slice(0,100);
        this.failedAttempts[key] = (this.failedAttempts[key] || 0) + 1;
        console.warn('⚠️ Immune: percobaan mencurigakan tercatat', type, details);
        DreamEventBus.emit('immune:threat-logged', { type, details, count: this.failedAttempts[key] });
        this.evaluate();
    },
    
    evaluate() {
        let totalAttempts = Object.values(this.failedAttempts).reduce((a,b)=>a+b,0);
        if (totalAttempts >= 5 && !this.ownerSession) {
            this.threatLevel = 2;
            this.respond();
        } else if (totalAttempts >= 3 && !this.ownerSession) {
            this.threatLevel = 1;
            console.warn('⚠️ Immune: waspada, ancaman meningkat.');
        }
        if (totalAttempts > 0) {
            DreamMemory.addMessage('system', 'Immune threat level: ' + this.threatLevel);
        }
    },
    
    respond() {
        console.error('🚨 IMMUNE RESPONSE AKTIF: Ancaman level 2!');
        if (window.DreamVault && !DreamVault.isLocked) {
            const emergencyPass = 'dreamos-self-lock-' + Date.now();
            DreamVault.lock(emergencyPass);
        }
        localStorage.setItem('dreamos_role', 'guest');
        this.attackPatterns.push({
            time: Date.now(),
            attempts: {...this.failedAttempts},
            threatLevel: this.threatLevel
        });
        localStorage.setItem('immune_patterns', JSON.stringify(this.attackPatterns));
        this.failedAttempts = {};
        alert('🚨 Keamanan sistem diaktifkan. Data telah diamankan. Silakan hubungi administrator.');
        location.reload();
    },
    
    isKnownAttack(pattern) {
        return this.attackPatterns.some(p => 
            JSON.stringify(p.attempts) === JSON.stringify(pattern)
        );
    },
    
    startPatrol(intervalMs = 60000) {
        setInterval(() => {
            if (this.threatLevel > 0 && !this.ownerSession) {
                console.log('🛡️ Immune patrol... threat level:', this.threatLevel);
            }
        }, intervalMs);
    }
};
document.addEventListener('DOMContentLoaded', () => {
    DreamImmune.startPatrol();
});

// ========== DREAM WEB — SPIDER DETECTION DEVICE ==========
window.DreamWeb = {
    sensorTags: new Map(),
    correlationWindow: 5000,
    escalationLevel: 0,
    webMap: new Map(),
    
    registerSensor(id, type, threshold = 3) {
        this.sensorTags.set(id, { type, threshold, triggered: false, lastTriggered: 0, count: 0 });
        console.log('🕷️ Sensor terpasang:', id, 'tipe:', type);
    },
    
    vibrate(sensorId, detail = {}) {
        const sensor = this.sensorTags.get(sensorId);
        if (!sensor) return;
        const now = Date.now();
        sensor.count++;
        sensor.lastTriggered = now;
        sensor.triggered = true;
        console.warn('🕸️ Getaran di jaring:', sensorId, '(hit ke-' + sensor.count + ')', detail);
        DreamEventBus.emit('web:vibration', { sensorId, detail, count: sensor.count });
        this.webMap.set(sensorId, (this.webMap.get(sensorId) || 0) + 1);
        this.correlate(sensorId);
        this.evaluateEscalation();
    },
    
    correlate(sourceId) {
        const now = Date.now();
        let activated = [];
        for (let [id, s] of this.sensorTags.entries()) {
            if (id !== sourceId && (now - s.lastTriggered) < this.correlationWindow) {
                activated.push(id);
            }
        }
        if (activated.length > 0) {
            console.warn('🕷️🐞 Korelasi ancaman:', activated.length, 'sensor lain terpicu:', activated);
            DreamEventBus.emit('web:correlation', { source: sourceId, activated });
            if (activated.length >= 2) {
                this.escalationLevel = Math.min(3, this.escalationLevel + 1);
            }
        }
    },
    
    evaluateEscalation() {
        let totalTriggers = 0;
        for (let s of this.sensorTags.values()) totalTriggers += s.count;
        if (totalTriggers >= 10 && this.escalationLevel < 3) {
            this.escalationLevel = 3;
            console.error('🕷️🛡️ ESKALASI LEVEL 3: Ancaman serius terdeteksi!');
            DreamEventBus.emit('web:escalation-3');
            this.autoDefend();
        } else if (totalTriggers >= 6 && this.escalationLevel < 2) {
            this.escalationLevel = 2;
            console.warn('🕷️⚠️ Eskalasi level 2');
            DreamEventBus.emit('web:escalation-2');
        } else if (totalTriggers >= 3 && this.escalationLevel === 0) {
            this.escalationLevel = 1;
            console.info('🕷️🔍 Eskalasi level 1');
        }
    },
    
    autoDefend() {
        if (window.DreamImmune) {
            DreamImmune.threatLevel = 2;
            DreamImmune.respond();
        }
        const containers = ['#command-center', '#module-container'];
        containers.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.display = 'none';
        });
        alert('🕷️ Jaring mendeteksi ancaman besar. Sistem diamankan.');
    },
    
    startWebPatrol(intervalMs = 30000) {
        setInterval(() => {
            const now = Date.now();
            for (let [id, s] of this.sensorTags.entries()) {
                if (s.triggered && (now - s.lastTriggered) > 60000) {
                    s.triggered = false;
                }
            }
            if (this.escalationLevel > 0 && 
                [...this.sensorTags.values()].every(s => (now - s.lastTriggered) > 300000)) {
                this.escalationLevel = 0;
                console.log('🕷️ Jaring tenang, eskalasi dinormalkan.');
            }
        }, intervalMs);
    },
    
    getHeatmap() {
        return Object.fromEntries(this.webMap);
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const originalError = console.error;
    console.error = function(...args) {
        DreamWeb.vibrate('console-error', { message: args[0] });
        originalError.apply(console, args);
    };
    DreamWeb.startWebPatrol();
    console.log('🕸️ Dream Web Spider Detection aktif.');
});

// ========== DREAMSENTINEL ==========
window.DreamSentinel = {
    sessionId: (function() {
        const existing = sessionStorage.getItem('sentinel_sid');
        if (existing) return existing;
        const fp = [
            screen.width, screen.height,
            navigator.language,
            new Date().getTimezoneOffset(),
            Math.random().toString(36).slice(2, 10)
        ].join('|');
        sessionStorage.setItem('sentinel_sid', fp);
        return fp;
    })(),

    sessionLog: [],
    baseline: {
        clicksPerMinute: 0,
        errorsPerSession: 0,
        tabSwitchesPerMinute: 0,
        lastMinuteTimestamp: Date.now(),
        clickCount: 0,
        errorCount: 0,
        tabSwitchCount: 0
    },
    reputationThreshold: 5,
    isDeceptionActive: false,

    init() {
        console.log('🛡️ DreamSentinel aktif. Session:', this.sessionId);
        DreamEventBus.subscribe('web:vibration', (data) => {
            this.handleVibration(data);
        }, 'sentinel');

        DreamEventBus.subscribe('immune:threat-logged', (data) => {
            this.handleThreat(data);
        }, 'sentinel');

        DreamEventBus.subscribe('vault:unlock-failed', () => {
            this.baseline.errorCount++;
            this.evaluateSessionRisk();
        }, 'sentinel');

        DreamEventBus.subscribe('vault:unlock-success', () => {
            this.baseline.errorCount = 0;
            if (window.DreamImmune) DreamImmune.identifyAsOwner();
        }, 'sentinel');

        setInterval(() => this.calculateBaseline(), 60000);

        document.addEventListener('click', (e) => {
            this.baseline.clickCount++;
        });

        const tabObserver = new MutationObserver(() => {
            this.baseline.tabSwitchCount++;
        });
        const tabContainer = document.getElementById('tab-container');
        if (tabContainer) tabObserver.observe(tabContainer, { childList: true, subtree: true });
    },

    handleVibration(data) {
        this.sessionLog.push({ time: Date.now(), event: 'vibration', data });
        this.evaluateSessionRisk();
    },

    handleThreat(data) {
        this.sessionLog.push({ time: Date.now(), event: 'threat', data });
        if (data.type === 'role-violation' && data.details && data.details.tab) {
            const tab = data.details.tab;
            const heat = (window.DreamWeb && DreamWeb.webMap) ? 
                (DreamWeb.webMap.get('tab-' + tab) || 0) : 0;
            if (heat > this.reputationThreshold) {
                console.warn('🔥 Area panas terdeteksi:', tab, 'dengan skor', heat);
                if (window.DreamImmune) DreamImmune.threatLevel = 2;
            }
        }
        this.evaluateSessionRisk();
    },

    evaluateSessionRisk() {
        const totalErrors = this.baseline.errorCount;
        if (totalErrors >= 3 && window.DreamImmune && !DreamImmune.ownerSession) {
            console.error('🚨 DreamSentinel: Session ini berisiko tinggi.');
            if (window.DreamWeb) DreamWeb.escalationLevel = Math.max(DreamWeb.escalationLevel, 2);
            if (totalErrors >= 5) {
                this.activateDeception();
            }
        }
    },

    calculateBaseline() {
        const now = Date.now();
        const elapsed = (now - this.baseline.lastMinuteTimestamp) / 60000;
        this.baseline.clicksPerMinute = this.baseline.clickCount / Math.max(1, elapsed);
        this.baseline.errorsPerSession = this.baseline.errorCount;
        this.baseline.tabSwitchesPerMinute = this.baseline.tabSwitchCount / Math.max(1, elapsed);
        this.baseline.clickCount = 0;
        this.baseline.tabSwitchCount = 0;
        this.baseline.lastMinuteTimestamp = now;

        if (this.baseline.clicksPerMinute > 30) {
            console.warn('📈 Lonjakan aktivitas terdeteksi:', this.baseline.clicksPerMinute, 'klik/menit');
            if (window.DreamWeb) DreamWeb.vibrate('behavior-anomaly', { cpm: this.baseline.clicksPerMinute });
        }
    },

    activateDeception() {
        if (this.isDeceptionActive) return;
        this.isDeceptionActive = true;
        console.warn('🪤 Deception aktif: Menyajikan data palsu.');
        const realData = {};
        for (let key of Object.keys(localStorage)) {
            realData[key] = localStorage.getItem(key);
        }
        window._dreamRealData = realData;
        localStorage.setItem('dreamos_bookings', JSON.stringify([
            { id: 999, title: 'DATA PALSU', date: '2000-01-01', status: 'fake' }
        ]));
        localStorage.setItem('dreamos_rabs', JSON.stringify([]));
        localStorage.setItem('dreamos_aset', JSON.stringify([{ nama: 'DUMMY', jumlah: 0 }]));
        localStorage.setItem('dreamos_audit', JSON.stringify([]));
        if (window.DreamVault) {
            DreamVault.lock('deception-lock-' + Date.now());
        }
        setTimeout(() => location.reload(), 1000);
    },

    restoreRealData() {
        if (window._dreamRealData) {
            for (let [key, value] of Object.entries(window._dreamRealData)) {
                localStorage.setItem(key, value);
            }
            delete window._dreamRealData;
            this.isDeceptionActive = false;
            console.log('✅ Data asli dipulihkan.');
        }
    }
};
document.addEventListener('DOMContentLoaded', () => {
    DreamSentinel.init();
});

// ========== DREAM FINGERPRINT ==========
window.DreamFingerprint = {
    ownerHash: localStorage.getItem('owner_device_hash') || null,
    currentHash: null,
    isOwnerDevice: false,

    async collectData() {
        const data = {
            screen: [screen.width, screen.height, screen.colorDepth, screen.pixelDepth],
            gpu: await this.getGPUHash(),
            battery: await this.getBatteryInfo(),
            orientation: await this.getOrientationInfo(),
            motion: await this.getMotionInfo(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform,
            touchPoints: navigator.maxTouchPoints,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory || 'unknown',
        };
        return data;
    },

    getGPUHash() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'no-webgl';
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
            const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
            return vendor + '|' + renderer;
        } catch (e) {
            return 'webgl-error';
        }
    },

    async getBatteryInfo() {
        try {
            if (navigator.getBattery) {
                const battery = await navigator.getBattery();
                return [battery.charging, battery.level, battery.chargingTime, battery.dischargingTime].join('|');
            }
        } catch (e) {}
        return 'no-battery-api';
    },

    getOrientationInfo() {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => resolve('no-orientation'), 2000);
            window.addEventListener('deviceorientation', (e) => {
                clearTimeout(timeout);
                resolve([e.alpha?.toFixed(4), e.beta?.toFixed(4), e.gamma?.toFixed(4)].join('|'));
            }, { once: true });
        });
    },

    getMotionInfo() {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => resolve('no-motion'), 2000);
            window.addEventListener('devicemotion', (e) => {
                clearTimeout(timeout);
                const acc = e.accelerationIncludingGravity;
                if (acc) {
                    resolve([acc.x?.toFixed(3), acc.y?.toFixed(3), acc.z?.toFixed(3)].join('|'));
                } else {
                    resolve('no-accel');
                }
            }, { once: true });
        });
    },

    async computeHash(data) {
        const str = JSON.stringify(data);
        const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async init() {
        console.log('🔍 DreamFingerprint: Mengumpulkan data sensor...');
        const data = await this.collectData();
        this.currentHash = await this.computeHash(data);
        sessionStorage.setItem('device_hash', this.currentHash);

        if (this.ownerHash && this.currentHash === this.ownerHash) {
            this.isOwnerDevice = true;
            console.log('👑 Device Owner terdeteksi!');
            DreamEventBus.emit('device:owner-detected', { hash: this.currentHash });
            if (window.DreamImmune) DreamImmune.identifyAsOwner();
        } else {
            console.log('🖥️ Device asing, hash:', this.currentHash);
            DreamEventBus.emit('device:unknown', { hash: this.currentHash });
        }
    },

    setAsOwner() {
        this.ownerHash = this.currentHash;
        localStorage.setItem('owner_device_hash', this.currentHash);
        this.isOwnerDevice = true;
        console.log('✅ Device ini disimpan sebagai Owner.');
        DreamEventBus.emit('device:owner-set');
    },

    removeOwner() {
        localStorage.removeItem('owner_device_hash');
        this.ownerHash = null;
        this.isOwnerDevice = false;
        console.log('🗑️ Owner device dihapus.');
    }
};
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => DreamFingerprint.init(), 1000);
});

// ========== MODULE CONTAINER ENGINE ==========
window.ensureModuleContainer = function(moduleId) {
    let container = document.getElementById(moduleId + '-module');
    if (!container) {
        container = document.createElement('div');
        container.id = moduleId + '-module';
        container.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#010409;z-index:10001;overflow-y:auto;padding:20px;box-sizing:border-box;';
        document.body.appendChild(container);
    }
    let content = document.getElementById(moduleId + '-content');
    if (!content) {
        content = document.createElement('div');
        content.id = moduleId + '-content';
        container.appendChild(content);
    }
    container.style.display = 'block';
    return content;
};

window.loadModuleGeneric = async function(moduleId, url) {
    const content = window.ensureModuleContainer(moduleId);
    try {
        const res = await fetch(url);
        const html = await res.text();
        content.innerHTML = html;
        content.querySelectorAll('script').forEach(old => {
            const ns = document.createElement('script');
            if (old.src) { ns.src = old.src; }
            else { ns.textContent = old.textContent; }
            document.body.appendChild(ns);
            old.remove();
        });
    } catch(e) {
        content.innerHTML = '<p style="color:red;">Gagal memuat modul ' + moduleId + '</p>';
    }
};
