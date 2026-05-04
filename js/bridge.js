(function() {
    'use strict';
    DreamOS.register('bridge', {
        _listeners: {},
        emit(event, data) {
            try {
                localStorage.setItem('dreamos_bridge', JSON.stringify({event, data, ts: Date.now()}));
                if(this._listeners[event]) {
                    this._listeners[event].forEach(fn => fn(data));
                }
            } catch(e){}
        },
        on(event, fn) {
            if(!this._listeners[event]) this._listeners[event] = [];
            this._listeners[event].push(fn);
        },
        init() {
            window.addEventListener('storage', (e) => {
                if(e.key === 'dreamos_bridge') {
                    try {
                        const {event, data} = JSON.parse(e.newValue);
                        if(this._listeners[event]) this._listeners[event].forEach(fn => fn(data));
                    } catch(e){}
                }
            });
        },
        verify() { return true; }
    });
    if(window.DreamOS) DreamOS.modules.bridge.init();
})();
