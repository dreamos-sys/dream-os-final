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
