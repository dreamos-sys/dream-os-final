// =====================================================================
// 🛡️  DREAM OS STORAGE GUARD — anti-crash, anti-accumulation
//    Auto-prune data lama + emergency cleanup saat storage hampir penuh.
//    TIDAK mengubah modul apa pun — hanya menjaga storage tetap sehat.
// =====================================================================
(function(){
  'use strict';

  var LIMITS = {
    dreamos_bookings: 300,
    dreamos_k3_reports: 200,
    dreamos_maintenance_tasks: 200,
    dreamos_activity_feed: 200,
    dreamos_notifications: 80,
    dreamos_security_logs: 300,
    dreamos_janitor_indoor: 200,
    dreamos_janitor_outdoor: 200,
    dreamos_stok_audit: 500,
    dreamos_stok_log: 500,
    dreamos_file_archive: 100,
    dreamos_matrix_log: 100
  };

  function prune(key){
    try{
      var limit = LIMITS[key]; if(!limit) return;
      var raw = localStorage.getItem(key); if(!raw) return;
      var data = JSON.parse(raw); if(!Array.isArray(data)) return;
      if(data.length > limit){
        var removed = data.length - limit;
        data = data.slice(0, limit);
        if (window.safeStorageSet) window.safeStorageSet(key, JSON.stringify(data));
        else localStorage.setItem(key, JSON.stringify(data));
        console.log('[StorageGuard] pruned '+key+': -'+removed+' entri lama');
      }
    }catch(e){}
  }

  function usageKB(){
    try{
      var total=0;
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(k && k.indexOf('dreamos_')===0) total += (localStorage.getItem(k)||'').length*2;
      }
      return Math.round(total/1024);
    }catch(e){ return 0; }
  }

  function emergency(){
    // Buang setengah isi dari 5 key terbesar (KECUALI sesi login)
    try{
      var sizes=[];
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(k && k.indexOf('dreamos_')===0 && k!=='dreamos_bound_user')
          sizes.push({k:k, s:(localStorage.getItem(k)||'').length});
      }
      sizes.sort(function(a,b){return b.s-a.s;});
      for(var i=0;i<Math.min(5,sizes.length);i++){
        try{
          var d=JSON.parse(localStorage.getItem(sizes[i].k)||'[]');
          if(Array.isArray(d)&&d.length>50){
            d=d.slice(0,Math.floor(d.length/2));
            localStorage.setItem(sizes[i].k, JSON.stringify(d));
          }
        }catch(e){}
      }
      console.log('[StorageGuard] emergency cleanup selesai');
    }catch(e){}
  }

  function run(){
    Object.keys(LIMITS).forEach(prune);
    var kb = usageKB();
    if(kb > 4096){ emergency(); }   // >4MB = zona bahaya
    console.log('[StorageGuard] usage: '+kb+'KB / ~5120KB');
  }

  // Expose global (untuk debug / manual)
  window.DreamOSStorageGuard = {
    run: run,
    prune: prune,
    pruneAll: function(){ Object.keys(LIMITS).forEach(prune); },
    usageKB: usageKB
  };

  // Auto-start: sekali saat load + tiap 30 menit
  setTimeout(run, 5000);
  setInterval(run, 30*60*1000);
  console.log('[StorageGuard] aktif — menjaga storage tetap sehat');
})();
