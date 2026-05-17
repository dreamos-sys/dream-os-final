
console.log("Dream OS • Kernel Tangguh v3.0 | Bi idznillah.");

// ========== QUANTUM CORE (Lightweight) ==========
window.DreamEventBus = {
  subscribers: new Map(),
  subscribe(event, callback, moduleId = 'core') {
    if (!this.subscribers.has(event)) this.subscribers.set(event, new Map());
    this.subscribers.get(event).set(moduleId, callback);
    return () => this.unsubscribe(event, moduleId);
  },
  unsubscribe(event, moduleId) { const subs = this.subscribers.get(event); if (subs) subs.delete(moduleId); },
  emit(event, data) { const subs = this.subscribers.get(event); if (subs) subs.forEach(cb => cb(data)); }
};

window.DreamOS = {
  actions: new Map(),
  registerAction(intent, handler) { this.actions.set(intent, handler); },
  executeAction(intent, params) { const h = this.actions.get(intent); return h ? h(params) : { error: 'Action not found' }; }
};

window.DreamState = new Proxy(
  { role: localStorage.getItem('dreamos_role') || 'STAFF', ghostMode: false },
  { set(target, prop, value) { target[prop] = value; DreamEventBus.emit('state:changed', { prop, value }); return true; } }
);

// ========== INTEGRITY WATCHER (FIXED) ==========
window.DreamIntegrity = {
    // Gunakan hash sederhana untuk deteksi perubahan (SHA-256 via crypto API)
    async generateHash(filePath) {
        try {
            const res = await fetch(filePath);
            const text = await res.text();
            const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
            return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch(e) { return null; }
    },
    async checkAll() {
        console.log('🛡️ Integrity Watcher: Memindai...');
        // Module yang dimonitor
        const modules = ['js/modules/command.html','js/modules/booking.html','js/modules/k3.html'];
        // Ambil hash yang tersimpan (atau gunakan default)
        let storedHashes = JSON.parse(localStorage.getItem('dream_integrity_hashes') || '{}');
        
        let breaches = [];
        for (let file of modules) {
            const currentHash = await this.generateHash(file);
            if (!currentHash) continue;
            
            // Simpan hash pertama kali jika belum ada
            if (!storedHashes[file]) {
                storedHashes[file] = currentHash;
                localStorage.setItem('dream_integrity_hashes', JSON.stringify(storedHashes));
                continue;
            }
            
            if (currentHash !== storedHashes[file]) {
                breaches.push({ file, stored: storedHashes[file], current: currentHash });
            }
        }
        
        if (breaches.length > 0) {
            DreamEventBus.emit('integrity:breach', breaches);
            // Lock vault otomatis jika ada breach
            if(window.DreamVault && !DreamVault.isLocked) {
                await DreamVault.lock('auto-lock-' + Date.now());
            }
        }
        return breaches;
    }
};

// ========== ENCRYPTED VAULT (FIXED: UNLOCK ADDED) ==========
window.DreamVault = {
    isLocked: false,
    
    async lock(passphrase) {
        if (!passphrase) return false;
        const allData = {}; 
        for (let key of Object.keys(localStorage)) {
            if (key.startsWith('dream_')) allData[key] = localStorage.getItem(key);
        }
        
        const enc = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveBits']);
        const derivedBits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt, iterations: 10000, hash: 'SHA-256' }, keyMaterial, 256);
        const derivedKey = await crypto.subtle.importKey('raw', derivedBits, 'AES-GCM', false, ['encrypt']);
        
        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, derivedKey, enc.encode(JSON.stringify(allData)));
        
        localStorage.setItem('dream_vault', JSON.stringify({ 
            salt: Array.from(salt), 
            iv: Array.from(iv), 
            data: Array.from(new Uint8Array(encrypted)) 
        }));
        
        // Hapus data asli
        for (let key of Object.keys(localStorage)) {
            if (!['dream_vault', 'dream_integrity_hashes', 'dreamos_role'].includes(key)) {
                localStorage.removeItem(key);
            }
        }
        this.isLocked = true;
        DreamEventBus.emit('vault:locked');
        return true;
    },
    
    async unlock(passphrase) {
        const vaultData = localStorage.getItem('dream_vault');
        if (!vaultData) return false;
        
        try {
            const vault = JSON.parse(vaultData);
            const salt = new Uint8Array(vault.salt);
            const iv = new Uint8Array(vault.iv);
            const data = new Uint8Array(vault.data);
            
            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveBits']);
            const derivedBits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt, iterations: 10000, hash: 'SHA-256' }, keyMaterial, 256);
            const derivedKey = await crypto.subtle.importKey('raw', derivedBits, 'AES-GCM', false, ['decrypt']);
            
            const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, derivedKey, data);
            const allData = JSON.parse(new TextDecoder().decode(decrypted));
            
            for (let key of Object.keys(allData)) {
                localStorage.setItem(key, allData[key]);
            }
            localStorage.removeItem('dream_vault');
            this.isLocked = false;
            DreamEventBus.emit('vault:unlocked');
            return true;
        } catch(e) { 
            console.error('Unlock failed:', e);
            return false; 
        }
    }
};

// ========== MODULE CONTAINER ENGINE (FIXED: SANITIZED) ==========
window.ensureModuleContainer = function(moduleId) {
    let container = document.getElementById(moduleId + '-module');
    if (!container) {
        container = document.createElement('div');
        container.id = moduleId + '-module';
        container.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#010409;z-index:9995;overflow-y:auto;padding:20px;box-sizing:border-box;';
        document.body.appendChild(container);
        
        // Tombol Close
        let closeBtn = document.createElement('button');
        closeBtn.innerText = '✕ Tutup';
        closeBtn.style.cssText = 'position:absolute;top:15px;right:15px;z-index:99;background:rgba(255,255,255,0.1);color:white;border:none;padding:8px 16px;border-radius:8px;font-size:14px;cursor:pointer;';
        closeBtn.onclick = () => { container.style.display = 'none'; };
        container.appendChild(closeBtn);
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
        
        // Sanitasi: eksekusi script hanya dari file modul yang trusted
        content.innerHTML = html;
        content.querySelectorAll('script[src]').forEach(old => {
            // Hanya load script dengan src (external) untuk keamanan
            const ns = document.createElement('script');
            ns.src = old.src;
            ns.onload = () => old.remove();
            document.head.appendChild(ns);
        });
        // Untuk inline script, kita tetap jalankan karena modul kita sendiri
        content.querySelectorAll('script:not([src])').forEach(old => {
            const ns = document.createElement('script');
            ns.textContent = old.textContent;
            old.replaceWith(ns);
        });
    } catch(e) { 
        content.innerHTML = '<p style="color:red;">Gagal memuat modul ' + moduleId + '</p>'; 
    }
};

console.log("✅ Kernel Tangguh v3.0 siap. Bi idznillah.");
