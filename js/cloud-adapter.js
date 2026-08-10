// ===== CLOUD ADAPTER — colokan universal Supabase/InsForge =====
window.CloudAdapter = (function(){
  function standbyReady(){
    var c=window.DreamCloud;
    return !!(c && c.insforge && c.insforge.enabled && c.insforge.baseUrl && c.insforge.publicKey);
  }
  return {
    standbyReady: standbyReady,
    active: function(){
      if (window.CircuitBreaker && CircuitBreaker.state==='OPEN' && standbyReady()) return 'insforge';
      return 'supabase';
    },
    status: function(){
      return {
        breaker: (window.CircuitBreaker?CircuitBreaker.state:'n/a'),
        active: this.active(),
        standbyReady: standbyReady()
      };
    }
  };
})();
