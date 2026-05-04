/**
 * Dream OS Modular Bridge v1.0
 */
const Bridge = {
    _listeners: {},
    emit: function(event, data) {
        console.log(`🌉 Bridge emit: ${event}`, data);
        try {
            localStorage.setItem('dreamos_event', JSON.stringify({event, data, ts: Date.now()}));
        } catch(e) { console.warn('Bridge emit failed:', e); }
        if(this._listeners[event]) {
            this._listeners[event].forEach(fn => {
                try { fn(data); } catch(e) { console.warn('Listener error:', e); }
            });
        }
    },
    on: function(event, fn) {
        if(!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(fn);
        console.log(`🌉 Bridge subscribed: ${event}`);
    },
    init: function() {
        window.addEventListener('storage', (e) => {
            if(e.key === 'dreamos_event') {
                try {
                    const {event, data} = JSON.parse(e.newValue);
                    if(this._listeners[event]) {
                        this._listeners[event].forEach(fn => {
                            try { fn(data); } catch(e) { console.warn('Storage listener error:', e); }
                        });
                    }
                } catch(err) { console.warn('Bridge parse error:', err); }
            }
        });
        console.log('🌉 Bridge initialized');
    }
};
if(typeof window !== 'undefined') Bridge.init();
console.log('🌉 Modular Bridge v1.0 loaded ✅');
