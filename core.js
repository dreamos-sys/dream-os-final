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
      // Copy attributes except src
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
            // if a script is added directly, re-execute it too
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

// ========== MODULE REGISTRY (Karpathy pattern) ==========
if (window.DreamOS) {
  window.DreamOS.mods = new Map();
  window.DreamOS.register = function(name, mod) {
    this.mods.set(name, mod);
    console.log('Modul ' + name + ' terdaftar');
    DreamEventBus.emit('module:registered', { name });
  };
}

// ========== DREAM IMMUNE SYSTEM (Auto-Imun Digital) ==========
window.DreamImmune = {
    ownerSession: false,
    threatLevel: 0,               // 0 = aman, 1 = waspada, 2 = bahaya
    failedAttempts: {},           // { 'ip'?: jumlah, pattern: jumlah }
    attackPatterns: JSON.parse(localStorage.getItem('immune_patterns') || '[]'),
    
    // Identifikasi sebagai pemilik sah
    identifyAsOwner() {
        this.ownerSession = true;
        this.threatLevel = 0;
        console.log('👑 Owner teridentifikasi. Immune system dalam mode ramah.');
        DreamEventBus.emit('immune:owner-identified');
    },
    
    // Catat percobaan mencurigakan
    logAttempt(type, details) {
        const key = type + '::' + JSON.stringify(details).slice(0,100);
        this.failedAttempts[key] = (this.failedAttempts[key] || 0) + 1;
        console.warn('⚠️ Immune: percobaan mencurigakan tercatat', type, details);
        DreamEventBus.emit('immune:threat-logged', { type, details, count: this.failedAttempts[key] });
        this.evaluate();
    },
    
    // Evaluasi ancaman
    evaluate() {
        let totalAttempts = Object.values(this.failedAttempts).reduce((a,b)=>a+b,0);
        if (totalAttempts >= 5 && !this.ownerSession) {
            this.threatLevel = 2;
            this.respond();
        } else if (totalAttempts >= 3 && !this.ownerSession) {
            this.threatLevel = 1;
            console.warn('⚠️ Immune: waspada, ancaman meningkat.');
        }
        // Simpan pola ke memory
        if (totalAttempts > 0) {
            DreamMemory.addMessage('system', 'Immune threat level: ' + this.threatLevel);
        }
    },
    
    // Respons otomatis
    respond() {
        console.error('🚨 IMMUNE RESPONSE AKTIF: Ancaman level 2!');
        // Isolasi: kunci vault jika ada
        if (window.DreamVault && !DreamVault.isLocked) {
            const emergencyPass = 'dreamos-self-lock-' + Date.now();
            DreamVault.lock(emergencyPass);
        }
        // Hapus session role (paksa jadi tamu)
        localStorage.setItem('dreamos_role', 'guest');
        // Catat pola serangan
        this.attackPatterns.push({
            time: Date.now(),
            attempts: {...this.failedAttempts},
            threatLevel: this.threatLevel
        });
        localStorage.setItem('immune_patterns', JSON.stringify(this.attackPatterns));
        // Reset counter setelah respons
        this.failedAttempts = {};
        alert('🚨 Keamanan sistem diaktifkan. Data telah diamankan. Silakan hubungi administrator.');
        // Reload untuk menerapkan kuncian
        location.reload();
    },
    
    // Vaksinasi: tolak pola yang sudah dikenal
    isKnownAttack(pattern) {
        return this.attackPatterns.some(p => 
            JSON.stringify(p.attempts) === JSON.stringify(pattern)
        );
    },
    
    // Mulai patroli rutin
    startPatrol(intervalMs = 60000) {
        setInterval(() => {
            if (this.threatLevel > 0 && !this.ownerSession) {
                console.log('🛡️ Immune patrol... threat level:', this.threatLevel);
            }
        }, intervalMs);
    }
};

// Auto-start patrol saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    DreamImmune.startPatrol();
    // Owner check: jika vault terbuka baru-baru ini, anggap owner
    if (localStorage.getItem('dream_vault') === null && localStorage.getItem('dreamos_bookings')) {
        // Vault tidak terkunci, berarti sebelumnya owner sudah unlock, 
        // tapi tidak bisa kami pastikan. Kami serahkan ke event vault:unlock-success.
    }
});

// ========== DREAM WEB — SPIDER DETECTION DEVICE ==========
window.DreamWeb = {
    sensorTags: new Map(),           // { sensorId: { type, triggered, lastTriggered, count } }
    correlationWindow: 5000,        // 5 detik untuk menghubungkan event
    escalationLevel: 0,             // 0-3
    webMap: new Map(),              // "lokasi" rawan yang diingat
    
    // Mendaftarkan sensor baru ke jaring
    registerSensor(id, type, threshold = 3) {
        this.sensorTags.set(id, { type, threshold, triggered: false, lastTriggered: 0, count: 0 });
        console.log('🕷️ Sensor terpasang:', id, 'tipe:', type);
    },
    
    // Suatu sensor terpicu — getaran di jaring
    vibrate(sensorId, detail = {}) {
        const sensor = this.sensorTags.get(sensorId);
        if (!sensor) return;
        
        const now = Date.now();
        sensor.count++;
        sensor.lastTriggered = now;
        sensor.triggered = true;
        
        console.warn('🕸️ Getaran di jaring:', sensorId, '(hit ke-' + sensor.count + ')', detail);
        DreamEventBus.emit('web:vibration', { sensorId, detail, count: sensor.count });
        
        // Catat lokasi (sensorId) ke webMap untuk diingat
        this.webMap.set(sensorId, (this.webMap.get(sensorId) || 0) + 1);
        
        // Evaluasi korelasi: adakah sensor lain yang terpicu dalam waktu dekat?
        this.correlate(sensorId);
        
        // Evaluasi eskalasi
        this.evaluateEscalation();
    },
    
    // Korelasi: cari sensor lain yang juga terpicu dalam correlationWindow
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
            // Jika banyak sensor terpicu, naikkan eskalasi langsung
            if (activated.length >= 2) {
                this.escalationLevel = Math.min(3, this.escalationLevel + 1);
            }
        }
    },
    
    // Evaluasi apakah perlu meningkatkan eskalasi
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
    
    // Pertahanan otomatis
    autoDefend() {
        // Panggil prosedur keamanan yang ada
        if (window.DreamImmune) {
            DreamImmune.threatLevel = 2;
            DreamImmune.respond();
        }
        // Isolasi: sembunyikan modul sensitif
        const containers = ['#command-center', '#module-container'];
        containers.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.display = 'none';
        });
        alert('🕷️ Jaring mendeteksi ancaman besar. Sistem diamankan.');
    },
    
    // Patroli jaring: setiap interval, bersihkan sensor yang lama tidak terpicu
    startWebPatrol(intervalMs = 30000) {
        setInterval(() => {
            const now = Date.now();
            for (let [id, s] of this.sensorTags.entries()) {
                if (s.triggered && (now - s.lastTriggered) > 60000) {
                    s.triggered = false; // reset jika sudah tenang
                }
            }
            // Turunkan eskalasi jika sudah tenang 5 menit
            if (this.escalationLevel > 0 && 
                [...this.sensorTags.values()].every(s => (now - s.lastTriggered) > 300000)) {
                this.escalationLevel = 0;
                console.log('🕷️ Jaring tenang, eskalasi dinormalkan.');
            }
        }, intervalMs);
    },
    
    // Dapatkan peta kerawanan (untuk Ghost Mode)
    getHeatmap() {
        return Object.fromEntries(this.webMap);
    }
};

// Inisialisasi: pasang sensor-sensor default
document.addEventListener('DOMContentLoaded', () => {
    // Sensor 1: Error di console
    const originalError = console.error;
    console.error = function(...args) {
        DreamWeb.vibrate('console-error', { message: args[0] });
        originalError.apply(console, args);
    };
    
    // Sensor 2: Percobaan akses file yang tidak ada (404)
    // Kita intercept fetch hanya untuk module loader? Tidak bisa langsung,
    // tapi kita bisa deteksi dari ModuleLoader jika ada.
    
    // Sensor 3: localStorage diubah langsung (proxy)
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        // Jika bukan dari fungsi internal, anggap mencurigakan
        if (key !== 'deadman_last_check' && key !== 'immune_patterns' && 
            key !== 'web_memory' && key !== 'dreamos_role') {
            // Bisa dari user biasa, tapi kita catat jika banyak perubahan aneh
            // Untuk deteksi perubahan massal, kita bisa lihat pola
        }
        originalSetItem.apply(this, arguments);
    };
    
    // Sensor 4: Klik di luar jam kerja? (opsional)
    
    // Mulai patroli
    DreamWeb.startWebPatrol();
    
    console.log('🕸️ Dream Web Spider Detection aktif.');
});

// ========== DREAMSENTINEL — OTAK KEAMANAN TANPA AI ==========
window.DreamSentinel = {
    // 1. SESSION FINGERPRINT (membedakan tab/session)
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

    sessionLog: [],               // log aktivitas per session

    // 2. BEHAVIORAL BASELINE
    baseline: {
        clicksPerMinute: 0,
        errorsPerSession: 0,
        tabSwitchesPerMinute: 0,
        lastMinuteTimestamp: Date.now(),
        clickCount: 0,
        errorCount: 0,
        tabSwitchCount: 0
    },

    // 3. REPUTATION (dari webMap DreamWeb)
    reputationThreshold: 5,       // di atas ini area dianggap "panas"

    // 4. STATUS
    isDeceptionActive: false,

    // Inisialisasi: mendengarkan semua sensor
    init() {
        console.log('🛡️ DreamSentinel aktif. Session:', this.sessionId);

        // Dengarkan semua event keamanan
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
            // Owner terdeteksi
            this.baseline.errorCount = 0; // reset
            if (window.DreamImmune) DreamImmune.identifyAsOwner();
        }, 'sentinel');

        // Hitung baseline tiap menit
        setInterval(() => this.calculateBaseline(), 60000);

        // Monitor klik untuk baseline
        document.addEventListener('click', (e) => {
            this.baseline.clickCount++;
        });

        // Monitor pergantian tab di Command Center
        const tabObserver = new MutationObserver(() => {
            this.baseline.tabSwitchCount++;
        });
        const tabContainer = document.getElementById('tab-container');
        if (tabContainer) tabObserver.observe(tabContainer, { childList: true, subtree: true });
    },

    // Tangani getaran dari DreamWeb
    handleVibration(data) {
        this.sessionLog.push({ time: Date.now(), event: 'vibration', data });
        this.evaluateSessionRisk();
    },

    // Tangani ancaman dari DreamImmune
    handleThreat(data) {
        this.sessionLog.push({ time: Date.now(), event: 'threat', data });
        // Jika jenis ancaman adalah 'role-violation', periksa reputasi area
        if (data.type === 'role-violation' && data.details && data.details.tab) {
            const tab = data.details.tab;
            const heat = (window.DreamWeb && DreamWeb.webMap) ? 
                (DreamWeb.webMap.get('tab-' + tab) || 0) : 0;
            if (heat > this.reputationThreshold) {
                console.warn('🔥 Area panas terdeteksi:', tab, 'dengan skor', heat);
                // Langsung eskalasi jika area sudah sangat panas
                if (window.DreamImmune) DreamImmune.threatLevel = 2;
            }
        }
        this.evaluateSessionRisk();
    },

    // Evaluasi risiko session ini
    evaluateSessionRisk() {
        const totalErrors = this.baseline.errorCount;
        const totalClicks = this.baseline.clickCount;

        // Jika error tinggi + vault failed, kemungkinan besar penyusup
        if (totalErrors >= 3 && window.DreamImmune && !DreamImmune.ownerSession) {
            console.error('🚨 DreamSentinel: Session ini berisiko tinggi.');
            if (window.DreamWeb) DreamWeb.escalationLevel = Math.max(DreamWeb.escalationLevel, 2);
            // Jika sudah sangat tinggi, aktifkan deception
            if (totalErrors >= 5) {
                this.activateDeception();
            }
        }
    },

    // Hitung baseline per menit
    calculateBaseline() {
        const now = Date.now();
        const elapsed = (now - this.baseline.lastMinuteTimestamp) / 60000;
        this.baseline.clicksPerMinute = this.baseline.clickCount / Math.max(1, elapsed);
        this.baseline.errorsPerSession = this.baseline.errorCount;
        this.baseline.tabSwitchesPerMinute = this.baseline.tabSwitchCount / Math.max(1, elapsed);
        // Reset counter
        this.baseline.clickCount = 0;
        this.baseline.tabSwitchCount = 0;
        this.baseline.lastMinuteTimestamp = now;

        // Deteksi lonjakan >300%
        if (this.baseline.clicksPerMinute > 30) { // 30 klik/menit sebagai threshold awal
            console.warn('📈 Lonjakan aktivitas terdeteksi:', this.baseline.clicksPerMinute, 'klik/menit');
            if (window.DreamWeb) DreamWeb.vibrate('behavior-anomaly', { cpm: this.baseline.clicksPerMinute });
        }
    },

    // AKTIFKAN DECEPTION (mengelabui penyusup)
    activateDeception() {
        if (this.isDeceptionActive) return;
        this.isDeceptionActive = true;
        console.warn('🪤 Deception aktif: Menyajikan data palsu.');

        // Simpan data asli di memory (tersembunyi)
        const realData = {};
        for (let key of Object.keys(localStorage)) {
            realData[key] = localStorage.getItem(key);
        }
        window._dreamRealData = realData;

        // Ganti localStorage dengan data palsu
        localStorage.setItem('dreamos_bookings', JSON.stringify([
            { id: 999, title: 'DATA PALSU', date: '2000-01-01', status: 'fake' }
        ]));
        localStorage.setItem('dreamos_rabs', JSON.stringify([]));
        localStorage.setItem('dreamos_aset', JSON.stringify([{ nama: 'DUMMY', jumlah: 0 }]));
        localStorage.setItem('dreamos_audit', JSON.stringify([]));

        // Kunci vault dengan passphrase acak agar penyusup sulit
        if (window.DreamVault) {
            DreamVault.lock('deception-lock-' + Date.now());
        }

        // Reload untuk menampilkan data palsu
        setTimeout(() => location.reload(), 1000);
    },

    // Pulihkan data asli (hanya bisa dipanggil owner)
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

// Jalankan setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    DreamSentinel.init();
});

// ========== DREAM FINGERPRINT — DEVICE SENSOR HASH ==========
window.DreamFingerprint = {
    ownerHash: localStorage.getItem('owner_device_hash') || null,
    currentHash: null,
    isOwnerDevice: false,

    // Kumpulkan data sensor (tanpa permission)
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

    // GPU fingerprint via WebGL
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

    // Battery info
    async getBatteryInfo() {
        try {
            if (navigator.getBattery) {
                const battery = await navigator.getBattery();
                return [battery.charging, battery.level, battery.chargingTime, battery.dischargingTime].join('|');
            }
        } catch (e) {}
        return 'no-battery-api';
    },

    // Gyroscope / Accelerometer (sekali baca)
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

    // Buat hash SHA-256 dari data
    async computeHash(data) {
        const str = JSON.stringify(data);
        const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Inisialisasi
    async init() {
        console.log('🔍 DreamFingerprint: Mengumpulkan data sensor...');
        const data = await this.collectData();
        this.currentHash = await this.computeHash(data);
        sessionStorage.setItem('device_hash', this.currentHash);

        // Bandingkan dengan owner hash
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

    // Simpan device ini sebagai owner (dipanggil manual oleh owner dari Ghost Mode)
    setAsOwner() {
        this.ownerHash = this.currentHash;
        localStorage.setItem('owner_device_hash', this.currentHash);
        this.isOwnerDevice = true;
        console.log('✅ Device ini disimpan sebagai Owner.');
        DreamEventBus.emit('device:owner-set');
    },

    // Hapus owner (reset)
    removeOwner() {
        localStorage.removeItem('owner_device_hash');
        this.ownerHash = null;
        this.isOwnerDevice = false;
        console.log('🗑️ Owner device dihapus.');
    }
};

// Jalankan inisialisasi setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => DreamFingerprint.init(), 1000); // delay 1 detik untuk sensor
});

// ========== INJEKSI TOMBOL SWITCH ROLE HIDUP ==========
function injectSwitchRoleButton() {
    // Cari teks "Role:" di header, lalu ganti dengan versi yang bisa diklik
    const bodyText = document.body.innerText;
    if (bodyText.includes('Role:')) {
        // Cari semua span yang mungkin berisi teks "Role:"
        const allSpans = document.querySelectorAll('span, div, p');
        for (let el of allSpans) {
            if (el.innerText.includes('Role:')) {
                // Ganti konten dengan span id='role-badge' dan tombol Switch Role
                const currentRole = localStorage.getItem('dreamos_role') || 'kabag';
                el.innerHTML = `<span id="role-badge" class="text-xs bg-teal-600/30 px-2 py-1 rounded-full">Role: ${currentRole}</span> <button class="text-xs underline text-teal-300 ml-2" onclick="(function(){var r=['koordinator','kabag','direktur'];var c=localStorage.getItem('dreamos_role')||'kabag';var i=r.indexOf(c);var n=r[(i+1)%r.length];localStorage.setItem('dreamos_role',n);document.getElementById('role-badge').innerText='Role: '+n;location.reload();})()">Switch Role</button>`;
                console.log('✅ Switch Role button injected');
                return;
            }
        }
    }
    // Jika tidak ditemukan, coba lagi nanti
    setTimeout(injectSwitchRoleButton, 1000);
}

// Mulai injeksi setelah DOM siap
if (document.readyState === 'complete') {
    injectSwitchRoleButton();
} else {
    window.addEventListener('load', injectSwitchRoleButton);
}



// ========== DOUBLE INJECTOR: PAKSA SWITCH ROLE & CHART SETELAH MODULE LOAD ==========
function forceActivateSwitchRole() {
    const badge = document.getElementById('role-badge');
    const switchBtn = document.getElementById('switch-role') || document.querySelector('.switch-role, [id*="switch"]');
    if (badge && switchBtn) {
        // Timpa onclick langsung
        switchBtn.onclick = function() {
            var r = ['koordinator','kabag','direktur'];
            var c = localStorage.getItem('dreamos_role') || 'kabag';
            var i = r.indexOf(c);
            var n = r[(i+1)%r.length];
            localStorage.setItem('dreamos_role', n);
            badge.innerText = 'Role: ' + n;
            location.reload();
        };
        console.log('✅ Switch Role PAKSA diaktifkan');
    } else {
        setTimeout(forceActivateSwitchRole, 800);
    }
}

function forceChartInit() {
    if (typeof Chart !== 'undefined' && document.getElementById('budgetChart') && typeof updateDashboardExtended === 'function') {
        updateDashboardExtended();
        console.log('✅ Chart PAKSA diinisialisasi');
    } else {
        setTimeout(forceChartInit, 700);
    }
}

// Jalankan setelah DOM siap
if (document.readyState === 'complete') {
    forceActivateSwitchRole();
    forceChartInit();
} else {
    window.addEventListener('load', function() {
        forceActivateSwitchRole();
        forceChartInit();
    });
}

// ========== PAKSA OTAK COMMAND CENTER ==========
    if (document.getElementById('command-center') && !document.querySelector('script[src="js/command.js"]')) {
        const script = document.createElement('script');
        script.src = 'js/command.js';
        script.onload = () => console.log('🧠 Otak Command Center terpasang');
        document.body.appendChild(script);
    } else {
    }
}



// ========== SWITCH ROLE GLOBAL ==========
window.switchRole = function() {
    var roles = ['koordinator', 'kabag', 'direktur'];
    var current = localStorage.getItem('dreamos_role') || 'kabag';
    var idx = roles.indexOf(current);
    var newRole = roles[(idx + 1) % roles.length];
    localStorage.setItem('dreamos_role', newRole);
    var badge = document.getElementById('role-badge');
    if (badge) badge.innerText = 'Role: ' + newRole;
    // Jangan reload
};

// ========== SWITCH TAB GLOBAL ==========
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(function(b) {
        b.classList.remove('active', 'bg-teal-600/30');
    });
    document.querySelectorAll('.tab-content').forEach(function(c) {
        c.classList.add('hidden');
    });
    var target = document.getElementById('tab-' + tabId);
    if (target) target.classList.remove('hidden');
    var activeBtn = document.querySelector('.tab-btn[onclick*="switchTab(\'' + tabId + '\' )"]');
    if (activeBtn) activeBtn.classList.add('active', 'bg-teal-600/30');
    if (tabId === 'dashboard' && typeof window.updateDashboard === 'function') {
        window.updateDashboard();
    }
};

// ========== UPDATE DASHBOARD ==========
window.updateDashboard = function() {
    var bookings = JSON.parse(localStorage.getItem('dreamos_bookings') || '[{"id":1,"title":"Rapat Koordinasi","date":"2026-05-15","status":"pending"}]');
    var rabs = JSON.parse(localStorage.getItem('dreamos_rabs') || '[{"id":1,"nama":"Seminar AI","nominal":5000000,"status":"pending"}]');
    var realisasi = JSON.parse(localStorage.getItem('dreamos_realisasi') || '[]');
    var tips = JSON.parse(localStorage.getItem('dreamos_tips') || '[]');
    
    var pendingCount = bookings.filter(function(b) { return b.status === 'pending'; }).length;
    var totalRab = rabs.reduce(function(s, r) { return s + r.nominal; }, 0);
    var realisasiBulan = realisasi.reduce(function(s, r) { return s + (r.nominal || 0); }, 0);
    var totalTips = tips.reduce(function(s, t) { return s + t.nominal; }, 0);

    var el = document.getElementById('pending-count');
    if (el) el.innerText = pendingCount;
    el = document.getElementById('rab-total');
    if (el) el.innerText = 'Rp ' + totalRab.toLocaleString();
    el = document.getElementById('realisasi-bulan');
    if (el) el.innerText = 'Rp ' + realisasiBulan.toLocaleString();
    el = document.getElementById('tips-total');
    if (el) el.innerText = 'Rp ' + totalTips.toLocaleString();

    if (typeof Chart !== 'undefined') {
        var ctx = document.getElementById('budgetChart');
        if (ctx) {
            ctx = ctx.getContext('2d');
            if (window.chartInstance) window.chartInstance.destroy();
            window.chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Anggaran', 'Realisasi'],
                    datasets: [{
                        label: 'Rp',
                        data: [totalRab, realisasiBulan],
                        backgroundColor: ['#2dd4bf', '#f59e0b']
                    }]
                },
                options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } } }
            });
        }
    }
};

// Jalankan setelah DOM selesai
if (document.readyState === 'complete') {
    window.updateDashboard();
} else {
    window.addEventListener('load', window.updateDashboard);
}
