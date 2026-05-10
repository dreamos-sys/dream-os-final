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
