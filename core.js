console.log("Kernel Nano Quantum Running. Bi idznillah.");

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
        // Tombol close
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
            if (old.src) { ns.src = old.src; }
            else { ns.textContent = old.textContent; }
            document.body.appendChild(ns);
            old.remove();
        });
    } catch(e) {
        content.innerHTML = '<p style="color:red;">Gagal memuat modul ' + moduleId + '</p>';
    }
};
