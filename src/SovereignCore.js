/**
 * DREAM OS - SOVEREIGN CORE v2.0
 * The Heart of 1001 Modules
 */
class SovereignCore {
    constructor() {
        this.modules = new Map();
        this.bus = new EventTarget();
        this.state = new Proxy({}, {
            set: (target, key, value) => {
                target[key] = value;
                this.emit('STATE_CHANGED', { [key]: value });
                return true;
            }
        });
        // Sync antar Tab (Teknologi Ghaib)
        this.channel = new BroadcastChannel('dream_os_synapse');
        this.channel.onmessage = (e) => this.localEmit(e.data.event, e.data.data);
    }

    // Daftar Modul (Sultan bisa panggil ini 1001 kali)
    register(name, callback) {
        this.modules.set(name, callback);
        callback(this); // Langitkan modulnya
        console.log(`✅ Modul [${name}] Aktif & Terintegrasi!`);
    }

    // Kirim Perintah ke Seluruh Galaxy
    emit(event, data) {
        this.localEmit(event, data);
        this.channel.postMessage({ event, data }); // Kirim ke tab lain
    }

    localEmit(event, data) {
        this.bus.dispatchEvent(new CustomEvent(event, { detail: data }));
    }

    // Dengerin Bisikan Modul Lain
    on(event, callback) {
        this.bus.addEventListener(event, (e) => callback(e.detail));
    }
}

window.DreamCore = new SovereignCore();
