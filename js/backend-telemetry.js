// ===== BACKEND TELEMETRY — ukur latency & error rate per backend =====
window.BackendTelemetry = (function(){
  var m = { supabase:{req:0,err:0,ms:0}, insforge:{req:0,err:0,ms:0} };
  function send(){
    if(!window.Sentry) return;
    try{
      var r={};
      ['supabase','insforge'].forEach(function(k){
        r[k]={ req:m[k].req, err:m[k].err,
          avgMs: m[k].req? Math.round(m[k].ms/m[k].req):0,
          errRate: m[k].req? +(m[k].err/m[k].req).toFixed(3):0 };
      });
      Sentry.captureMessage('Backend Telemetry', { level:'info', extra:r });
    }catch(e){}
  }
  return {
    record: function(backend, ms, isErr){
      var b=m[backend]; if(!b) return;
      b.req++; b.ms+=ms; if(isErr) b.err++;
      if(b.req % 10 === 0) send();
    },
    tracked: function(backend, fn){
      var t=Date.now(), self=this;
      return Promise.resolve().then(fn)
        .then(function(r){ self.record(backend, Date.now()-t, false); return r; })
        .catch(function(e){ self.record(backend, Date.now()-t, true); throw e; });
    },
    get: function(){ return m; }
  };
})();

// Self-test saat load (aman, hanya log)
setTimeout(function(){
  try{ console.log('[CloudAdapter] status:', JSON.stringify(window.CloudAdapter.status())); }catch(e){}
}, 1500);
