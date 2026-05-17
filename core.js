console.log("Kernel Nano Quantum Running. Bi idznillah.");
const state = { role: 'STAFF', ghostTaps: 0, ghostTimer: null };

// ========== AUTO SCRIPT EXECUTOR ==========
(function() {
  function executeScripts(container) {
    container.querySelectorAll('script').forEach(oldScript => {
      const newScript = document.createElement('script');
      if (oldScript.src) { newScript.src = oldScript.src; } else { newScript.textContent = oldScript.textContent; }
      for (let attr of oldScript.attributes) { if (attr.name !== 'src') newScript.setAttribute(attr.name, attr.value); }
      oldScript.replaceWith(newScript);
    });
  }
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => { m.addedNodes.forEach(node => {
      if (node.nodeType === 1) { executeScripts(node); if (node.tagName === 'SCRIPT') { const ns = document.createElement('script'); if (node.src) ns.src = node.src; else ns.textContent = node.textContent; node.replaceWith(ns); } }
    }); });
  });
  function startObserving() {
    const container = document.getElementById('command-center') || document.getElementById('module-container');
    if (container) { observer.observe(container, { childList: true, subtree: true }); } else { setTimeout(startObserving, 300); }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', startObserving); } else { startObserving(); }
})();

// ========== QUANTUM CORE ==========
window.DreamEventBus = { subscribers: new Map(), subscribe(event,cb,mid='core'){ if(!this.subscribers.has(event)) this.subscribers.set(event,new Map()); this.subscribers.get(event).set(mid,cb); return ()=>this.unsubscribe(event,mid); }, unsubscribe(event,mid){ const s=this.subscribers.get(event); if(s) s.delete(mid); }, emit(event,data){ const s=this.subscribers.get(event); if(s) s.forEach(cb=>cb(data)); } };
window.DreamOS = { actions: new Map(), registerAction(intent,handler){ this.actions.set(intent,handler); }, executeAction(intent,params){ const h=this.actions.get(intent); if(h) return h(params); else return {error:'Action not found'}; } };
window.DreamState = new Proxy({ role: localStorage.getItem('dreamos_role') || 'STAFF', ghostMode: false, memories: {} }, { set(target,prop,value){ target[prop]=value; DreamEventBus.emit('state:changed',{prop,value}); return true; } });
window.DreamMemory = { conversations: JSON.parse(localStorage.getItem('dream_memory')||'[]'), addMessage(role,content){ this.conversations.push({role,content,timestamp:Date.now()}); localStorage.setItem('dream_memory',JSON.stringify(this.conversations)); DreamEventBus.emit('memory:updated',{role,content}); }, getContext(limit=10){ return this.conversations.slice(-limit); } };

// ========== MODULE CONTAINER ENGINE ==========
window.ensureModuleContainer = function(moduleId) {
    let container = document.getElementById(moduleId + '-module');
    if (!container) {
        container = document.createElement('div');
        container.id = moduleId + '-module';
        container.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#010409;z-index:9995;overflow-y:auto;padding:20px;box-sizing:border-box;';
        document.body.appendChild(container);
    }
    let content = document.getElementById(moduleId + '-content');
    if (!content) {
        let closeBtn = document.createElement('button');
        closeBtn.innerText = '✕ Tutup';
        closeBtn.style.cssText = 'position:absolute;top:15px;right:15px;z-index:99;background:rgba(255,255,255,0.1);color:white;border:none;padding:8px 16px;border-radius:8px;font-size:14px;cursor:pointer;';
        closeBtn.onclick = function() { container.style.display = 'none'; };
        container.appendChild(closeBtn);
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
            if (old.src) { ns.src = old.src; } else { ns.textContent = old.textContent; }
            document.body.appendChild(ns);
            old.remove();
        });
    } catch(e) { content.innerHTML = '<p style="color:red;">Gagal memuat modul ' + moduleId + '</p>'; }
};
