/**
 * 🛡️ SafeExec Engine v1.0
 * Dream OS v1.0 Beta - CSP Phase 2: Safe Execution Refactor
 * Mengganti eval/Function/document.write dengan alternatif aman
 */
const SafeExec = (function() {
    const registry = {};
    return {
        register: (id, fn) => { if(typeof fn==='function') registry[id] = fn; },
        call: (id, ...args) => {
            if(registry[id]) return registry[id](...args);
            console.warn(`⚠️ SafeExec: Handler '${id}' belum diregister`);
            return null;
        },
        parse: (str) => { try { return JSON.parse(str); } catch(e) { console.warn('⚠️ SafeExec: Invalid JSON', e); return null; } },
        inject: (html, target=document.body, pos='beforeend') => {
            if(typeof html!=='string') return;
            target.insertAdjacentHTML(pos, html);
        },
        bridge: (fnName, event, ...args) => {
            if(typeof window[fnName]==='function') return window[fnName](event, ...args);
            console.warn(`⚠️ SafeExec Bridge: ${fnName} tidak ditemukan`);
        }
    };
})();
