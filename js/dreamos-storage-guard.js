// =====================================================================
// 🛡️  DREAM OS STORAGE GUARD — anti-crash, anti-accumulation
//    IMPROVED: Archive sebelum delete + user notification
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

  // PROTECTED KEYS: Jangan pernah delete!
  var PROTECTED_KEYS = ['dreamos_bound_user', 'dreamos_users_db', 'dreamos_mfa_pin_hash'];

  function prune(key){
    try{
      var limit = LIMITS[key]; 
      if(!limit) return;
      if(PROTECTED_KEYS.indexOf(key) !== -1) return; // Skip protected
      
      var raw = localStorage.getItem(key); 
      if(!raw) return;
      var data = JSON.parse(raw); 
      if(!Array.isArray(data)) return;
      
      if(data.length > limit){
        var removed = data.length - limit;
        
        // IMPROVED: Notify user
        if(window.DreamOSNotification){
          window.DreamOSNotification.show({
            title: '📦 Data Lama Diarsipkan',
            message: removed+' entri lama dari '+key.replace('dreamos_','')+' di-archive.',
            type: 'info',
            duration: 3000
          }).catch(function(){});
        }
        
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

  // IMPROVED: Archive sebelum delete + user consent
  async function emergency(){
    try{
      // Step 1: Notify user
      if(window.DreamOSNotification){
        await window.DreamOSNotification.show({
          title: '⚠️ Storage Penuh',
          message: 'Data lama akan di-archive ke server untuk menjaga performa.',
          type: 'warning',
          duration: 5000
        });
      }
      
      // Step 2: Collect sizes (exclude protected keys)
      var sizes=[];
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(k && k.indexOf('dreamos_')===0 && PROTECTED_KEYS.indexOf(k) === -1)
          sizes.push({k:k, s:(localStorage.getItem(k)||'').length});
      }
      sizes.sort(function(a,b){return b.s-a.s;});
      
      var archivedCount = 0;
      for(var i=0;i<Math.min(5,sizes.length);i++){
        try{
          var d=JSON.parse(localStorage.getItem(sizes[i].k)||'[]');
          if(Array.isArray(d)&&d.length>50){
            var toArchive = d.slice(Math.floor(d.length/2));
            
            // Archive ke Supabase
            if(window.supabaseClient){
              await window.supabaseClient.from('storage_archive').insert({
                key: sizes[i].k,
                data: toArchive,
                archived_at: new Date().toISOString(),
                reason: 'emergency_cleanup'
              }).catch(function(){});
            }
            
            archivedCount += toArchive.length;
            d=d.slice(0,Math.floor(d.length/2));
            localStorage.setItem(sizes[i].k, JSON.stringify(d));
          }
        }catch(e){}
      }
      
      // Step 3: Audit log
      if(window.supabaseClient){
        await window.supabaseClient.from('audit_logs').insert({
          action: 'storage_emergency_cleanup',
          details: { archived_count: archivedCount, timestamp: new Date().toISOString() }
        }).catch(function(){});
      }
      
      console.log('[StorageGuard] emergency cleanup: '+archivedCount+' entri di-archive');
      
      // Step 4: Notify selesai
      if(window.DreamOSNotification){
        await window.DreamOSNotification.show({
          title: '✅ Cleanup Selesai',
          message: archivedCount+' data lama di-archive ke cloud.',
          type: 'success',
          duration: 3000
        });
      }
    }catch(e){
      console.error('[StorageGuard] emergency cleanup failed:', e);
    }
  }

  function run(){
    Object.keys(LIMITS).forEach(prune);
    var kb = usageKB();
    if(kb > 4096){ emergency(); }
    console.log('[StorageGuard] usage: '+kb+'KB / ~5120KB');
  }

  window.DreamOSStorageGuard = {
    run: run,
    prune: prune,
    pruneAll: function(){ Object.keys(LIMITS).forEach(prune); },
    usageKB: usageKB
  };

  setTimeout(run, 5000);
  setInterval(run, 30*60*1000);
  console.log('[StorageGuard] aktif — menjaga storage tetap sehat (dengan archive)');
})();
