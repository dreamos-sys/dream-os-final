/* DREAM OS — Realtime Sync + Stock Movement Sync (pompa air ekosistem)
   - Realtime Supabase: inventory, stock_movements, maintenance_tasks, k3_followups, users
   - Sync log mutasi stok: push yang tertahan + pull yang baru (dedup by id)
   - ensureClient(): menyalakan supabaseClient sendiri bila auto-login belum membuatnya
   - Fallback: polling 60s + visibility + storage event tetap menjaga bila realtime mati */
(function(){
  'use strict';
  if (window.__realtimeSync) return; window.__realtimeSync = true;
  var LOG = 'dreamos_stock_log';
  function client(){ return window.supabaseClient || (window.parent && window.parent.supabaseClient) || null; }
  function ensureClient(){ try{ if(typeof window.initSupabase==='function' && !client()) window.initSupabase(); }catch(e){} return client(); }
  function getLog(){ try{ return JSON.parse(localStorage.getItem(LOG)||'[]'); }catch(e){ return []; } }
  function setLog(a){ try{ window.safeStorageSet(LOG, JSON.stringify(a)); }catch(e){} }
  function newId(){ return 'sm_'+Date.now()+'_'+Math.random().toString(36).slice(2,7); }

  window.pushStockMovement = function(entry){
    var c = ensureClient(); if(!c || !entry) return;
    if(!entry.id) entry.id = newId();
    var row = { id:entry.id, item:entry.item||'', qty:parseInt(entry.qty)||0, location:entry.location||'', type:entry.type||'', user_name:entry.user_name||'', role:entry.role||'', wo_id:entry.wo_id||null, created_at:entry.time||new Date().toISOString() };
    c.from('stock_movements').upsert(row, { onConflict:'id' }).then(function(r){
      if(r && !r.error){ var l=getLog(); var i=l.findIndex(function(x){return x.id===entry.id;}); if(i>-1){ l[i].synced=true; setLog(l); } }
      else if(r && r.error){ try{ console.warn('[stock-sync] push:', r.error.message); }catch(e){} }
    }).catch(function(e){ try{ console.warn('[stock-sync] push skip:', e&&e.message); }catch(_){} });
  };

  window.pullStockMovements = function(){
    var c = ensureClient(); if(!c) return Promise.resolve();
    return c.from('stock_movements').select('*').order('created_at',{ascending:false}).limit(2000).then(function(r){
      if(!r || r.error || !r.data){ if(r&&r.error) try{ console.warn('[stock-sync] pull:', r.error.message); }catch(e){} return; }
      var l = getLog(); var have = {}; l.forEach(function(x){ if(x.id) have[x.id]=1; });
      var added = 0;
      r.data.forEach(function(row){
        if(row.id && !have[row.id]){
          l.unshift({ id:row.id, type:row.type, item:row.item, qty:row.qty, location:row.location, user_name:row.user_name, role:row.role, user:row.role, time:row.created_at, wo_id:row.wo_id, synced:true });
          have[row.id]=1; added++;
        }
      });
      if(added>0) setLog(l.slice(0,800));
    }).catch(function(e){ try{ console.warn('[stock-sync] pull skip:', e&&e.message); }catch(_){} });
  };

  window.syncStockLog = function(){
    var c = ensureClient(); if(!c) return Promise.resolve();
    getLog().forEach(function(x){ if(x.id && x.synced!==true) window.pushStockMovement(x); });
    return window.pullStockMovements();
  };

  var TABLES = ['inventory','stock_movements','maintenance_tasks','k3_followups','users'];
  var KEYMAP = { inventory:'dreamos_inventory', maintenance_tasks:'dreamos_maintenance_tasks', k3_followups:'dreamos_k3_followups_cache', users:'dreamos_users_db' };
  var _rd = null;
  function refreshDash(){ clearTimeout(_rd); _rd = setTimeout(function(){ if(typeof window.updateDashboardSlides==='function') window.updateDashboardSlides(); }, 300); }

  function pullTable(tbl){
    var c = ensureClient(); if(!c) return;
    if(tbl === 'stock_movements'){ window.pullStockMovements().then(refreshDash); return; }
    c.from(tbl).select('*').limit(2000).then(function(r){
      if(!r || r.error || !r.data) return;
      var key = KEYMAP[tbl]; if(!key) return;
      try {
        if(tbl === 'k3_followups'){
          var cache = {}; try{ cache = JSON.parse(localStorage.getItem(key)||'{}'); }catch(e){}
          r.data.forEach(function(x){ if(x&&x.id) cache[x.id] = { by:x.by, at:x.at, scope:x.scope }; });
          window.safeStorageSet(key, JSON.stringify(cache));
        } else if(tbl === 'users'){
          var loc = []; try{ loc = JSON.parse(localStorage.getItem(key)||'[]'); }catch(e){}
          r.data.forEach(function(cu){ var i=loc.findIndex(function(lu){return (lu.email||'').toLowerCase()===(cu.email||'').toLowerCase();}); if(i===-1) loc.push({id:cu.id,email:cu.email,nama:cu.nama,role:cu.role,status:cu.status,source:'cloud'}); else { loc[i].nama=cu.nama||loc[i].nama; loc[i].role=cu.role||loc[i].role; loc[i].status=cu.status||loc[i].status; } });
          window.safeStorageSet(key, JSON.stringify(loc));
        } else {
          window.safeStorageSet(key, JSON.stringify(r.data));
        }
        refreshDash();
      } catch(e){ try{ console.warn('[realtime] apply '+tbl+':', e&&e.message); }catch(_){} }
    }).catch(function(e){ try{ console.warn('[realtime] pull '+tbl+' skip:', e&&e.message); }catch(_){} });
  }

  function startRealtime(){
    var c = ensureClient(); if(!c || !c.channel || window.__rtChannel) return;
    var ch = c.channel('dreamos-realtime-v2');
    TABLES.forEach(function(tbl){
      ch.on('postgres_changes', { event:'*', schema:'public', table:tbl }, function(payload){
        pullTable(tbl);
        try{ window.dispatchEvent(new CustomEvent('dreamos-realtime', { detail:{ table:tbl, eventType:payload.eventType } })); }catch(e){}
      });
    });
    ch.subscribe(function(status){ try{ console.log('[realtime] status:', status); }catch(e){} });
    window.__rtChannel = ch;
  }

  function boot(){
    if(localStorage.getItem('dreamos_session_active') !== 'true') return;
    ensureClient();
    startRealtime();
    window.syncStockLog();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot, 600); });
  else setTimeout(boot, 800);
  window.__dreamosRegisterInterval(setInterval(function(){ if(localStorage.getItem('dreamos_session_active')==='true'){ ensureClient(); if(!window.__rtChannel) startRealtime(); } }, 10000);
  window.__dreamosRegisterInterval(setInterval(function(){ if(localStorage.getItem('dreamos_session_active')==='true') window.syncStockLog(); }, 60000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden && localStorage.getItem('dreamos_session_active')==='true'){ ensureClient(); startRealtime(); window.syncStockLog(); } });
})();
