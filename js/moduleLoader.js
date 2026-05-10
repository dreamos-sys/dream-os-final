class ModuleLoader {
  constructor() {
    this.loadedModules = new Map();
    this.moduleCache = new Map();
  }
  async load(moduleName, moduleUrl, containerId) {
    // Cek apakah sudah pernah di-load
    if (this.loadedModules.has(moduleName)) return;
    try {
      const response = await fetch(moduleUrl);
      const html = await response.text();
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
        this.loadedModules.set(moduleName, true);
        // Eksekusi script yang ada di dalam modul (jika ada)
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
          oldScript.remove();
        });
      }
    } catch (err) {
      console.error(`Gagal load module ${moduleName}:`, err);
    }
  }
}
window.ModuleLoader = new ModuleLoader();
