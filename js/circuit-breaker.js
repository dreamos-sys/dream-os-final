// ===== CIRCUIT BREAKER — MCB otomatis anti-mati-total =====
window.CircuitBreaker = (function(){
  var state='CLOSED', fail=0, ok=0;
  var THRESHOLD=3, RESET=30000;
  function log(m){ try{ console.log('[CB] '+m); }catch(e){} }
  function open(){
    state='OPEN'; log('OPEN → failover ke standby');
    setTimeout(function(){ state='HALF_OPEN'; ok=0; log('HALF_OPEN → testing primary'); }, RESET);
  }
  return {
    get state(){ return state; },
    onSuccess: function(){ fail=0; if(state==='HALF_OPEN'){ ok++; if(ok>=2){ state='CLOSED'; log('CLOSED → primary sehat'); } } },
    onFailure: function(){ fail++; if(state==='CLOSED' && fail>=THRESHOLD) open(); },
    usePrimary: function(){ return state!=='OPEN'; },
    execute: function(primary, fallback){
      var self=this;
      if(!this.usePrimary()) return fallback();
      return Promise.resolve().then(primary)
        .then(function(r){ self.onSuccess(); return r; })
        .catch(function(e){ self.onFailure(); if(self.state==='OPEN') return fallback(); throw e; });
    }
  };
})();
