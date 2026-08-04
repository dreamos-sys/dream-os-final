/**
 * Dream OS — Observer Manager
 * Track & cleanup semua MutationObserver untuk prevent memory leak
 */
(function(){
  'use strict';
  
  window.__dreamos_observers = window.__dreamos_observers || [];
  
  // Wrapper untuk MutationObserver yang auto-track
  var OriginalObserver = window.MutationObserver;
  window.MutationObserver = function(callback) {
    var observer = new OriginalObserver(callback);
    window.__dreamos_observers.push(observer);
    
    // Auto-remove dari list saat disconnect
    var originalDisconnect = observer.disconnect.bind(observer);
    observer.disconnect = function() {
      var idx = window.__dreamos_observers.indexOf(observer);
      if (idx > -1) window.__dreamos_observers.splice(idx, 1);
      return originalDisconnect();
    };
    
    return observer;
  };
  
  // Expose untuk debugging
  window.getObserverCount = function() {
    return window.__dreamos_observers ? window.__dreamos_observers.length : 0;
  };
  
  window.cleanupObservers = function() {
    if (!window.__dreamos_observers) return 0;
    var count = window.__dreamos_observers.length;
    window.__dreamos_observers.forEach(function(obs){
      try { obs.disconnect(); } catch(e){}
    });
    window.__dreamos_observers = [];
    console.log('🧹 Cleaned up ' + count + ' observers');
    return count;
  };
  
  console.log('👁️ Observer manager active');
})();
