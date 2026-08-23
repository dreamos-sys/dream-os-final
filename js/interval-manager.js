// ===== INTERVAL MANAGER v1.0 (Battery Saver) =====
(function(){
  const registry = new Map();
  
  window.registerInterval = function(name, fn, ms) {
    if (registry.has(name)) {
      clearInterval(registry.get(name));
    }
    const id = setInterval(fn, ms);
    registry.set(name, id);
    return id;
  };
  
  window.clearManagedInterval = function(name) {
    if (registry.has(name)) {
      clearInterval(registry.get(name));
      registry.delete(name);
    }
  };
  
  window.clearAllManagedIntervals = function() {
    registry.forEach(id => clearInterval(id));
    registry.clear();
  };
  
  // Auto-cleanup on page hide
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      // Pause non-critical intervals
      registry.forEach((id, name) => {
        if (name.startsWith('non-critical-')) {
          clearInterval(id);
        }
      });
    }
  });
  
  console.log('⚡ Interval Manager active (battery saver mode)');
})();
