// SovereignCore.js — Event Bus + State Hub for Dream OS
// Bi idznillah — Modular, Lightweight, Scalable

(() => {
  const BUS_NAME = 'dreamos-synapse';

  class SovereignCore {
    constructor() {
      this.modules = new Map();
      this.state = {};
      this.localBus = new EventTarget();
      this.channel = typeof BroadcastChannel !== 'undefined' 
        ? new BroadcastChannel(BUS_NAME) 
        : null;

      if (this.channel) {
        this.channel.onmessage = (e) => this._onChannelMessage(e.data);
      }

      // Bind methods
      ['registerModule','emit','on','setState','getState'].forEach(m => {
        this[m] = this[m].bind(this);
      });
    }

    registerModule(name, initFn) {
      if (this.modules.has(name)) {
        console.warn(`[Core] Modul "${name}" sudah terdaftar`);
      }
      this.modules.set(name, initFn);
      try { initFn(this); } 
      catch (e) { console.error(`[Core] Init "${name}" error:`, e); }
    }

    emit(event, payload = {}) {
      this.localBus.dispatchEvent(new CustomEvent(event, { detail: payload }));
      if (this.channel) this.channel.postMessage({ event, payload });
    }

    on(event, handler) {
      this.localBus.addEventListener(event, (e) => handler(e.detail));
    }

    _onChannelMessage({ event, payload }) {
      this.localBus.dispatchEvent(new CustomEvent(event, { detail: payload }));
    }

    setState(partial) {
      this.state = { ...this.state, ...partial };
      this.emit('state:update', this.state);
    }

    getState() {
      return { ...this.state };
    }
  }

  // Expose singleton
  window.DreamCore = new SovereignCore();
})();
// SovereignCore.js — Event Bus + State Hub for Dream OS
// Bi idznillah — Modular, Lightweight, Scalable

(() => {
  const BUS_NAME = 'dreamos-synapse';

  class SovereignCore {
    constructor() {
      this.modules = new Map();
      this.state = {};
      this.localBus = new EventTarget();
      this.channel = typeof BroadcastChannel !== 'undefined' 
        ? new BroadcastChannel(BUS_NAME) 
        : null;

      if (this.channel) {
        this.channel.onmessage = (e) => this._onChannelMessage(e.data);
      }

      // Bind methods
      ['registerModule','emit','on','setState','getState'].forEach(m => {
        this[m] = this[m].bind(this);
      });
    }

    registerModule(name, initFn) {
      if (this.modules.has(name)) {
        console.warn(`[Core] Modul "${name}" sudah terdaftar`);
      }
      this.modules.set(name, initFn);
      try { initFn(this); } 
      catch (e) { console.error(`[Core] Init "${name}" error:`, e); }
    }

    emit(event, payload = {}) {
      this.localBus.dispatchEvent(new CustomEvent(event, { detail: payload }));
      if (this.channel) this.channel.postMessage({ event, payload });
    }

    on(event, handler) {
      this.localBus.addEventListener(event, (e) => handler(e.detail));
    }

    _onChannelMessage({ event, payload }) {
      this.localBus.dispatchEvent(new CustomEvent(event, { detail: payload }));
    }

    setState(partial) {
      this.state = { ...this.state, ...partial };
      this.emit('state:update', this.state);
    }

    getState() {
      return { ...this.state };
    }
  }

  // Expose singleton
  window.DreamCore = new SovereignCore();
})();
// main.js — Module Loader
(async () => {
  const modules = [
    '/src/modules/booking.js',
    '/src/modules/k3.js',
    '/src/modules/ultraAgent.js'
  ];

  for (const url of modules) {
    try {
      await import(url);
      console.log(`✅ Loaded: ${url}`);
    } catch (e) {
      console.warn(`⚠️ Failed: ${url}`, e);
    }
  }

  // Notify core ready
  if (window.DreamCore) {
    window.DreamCore.emit('app:ready', { 
      ts: Date.now(), 
      count: modules.length 
    });
  }
})();
