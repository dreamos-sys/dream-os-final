/* DREAM OS — K3 → Janitor Bridge (indoor & outdoor)
   Menempel otomatis ke modul Janitor Indoor/Outdoor tanpa menyentuh kode modul.
   Menarik laporan K3 kategori "Kebersihan" → tampil sebagai tugas → bisa diklaim.
   Idempotent · anti-XSS · transparan lintas modul · graceful (try/catch total). */
(function(){
  'use strict';
  if (window.__k3jBridge) return;
  window.__k3jBridge = true;

  var DONE_KEY = 'dreamos_k3_janitor_done', K3_KEY = 'dreamos_k3_reports';
  var COLOR = { indoor:'#00ff9d', outdoor:'#22c55e' }, LABEL = { indoor:'Indoor', outdoor:'Outdoor' };

  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function escA(s){ return esc(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function iso(){ return new Date().toISOString(); }
  function user(){ try { return JSON.parse(localStorage.getItem('dreamos_bound_user')||'{}'); } catch(e){ return {}; } }
  function getK3(){ try { return JSON.parse(localStorage.getItem(K3_KEY)||'[]'); } catch(e){ return []; } }
  function getDone(){ try { return JSON.parse(localStorage.getItem(DONE_KEY)||'{}'); } catch(e){ return {}; } }
  function setDone(d){ try { localStorage.setItem(DONE_KEY, JSON.stringify(d)); } catch(e){} }
  function dkey(id,sc){ return id+'::'+sc; }
  function isClean(r){ return /kebersihan/i.test((r&&r.kategori)||''); }

  function scope(){
    if (document.getElementById('ji-checklist')) return 'indoor';
    if (document.getElementById('jo-daily-list')) return 'outdoor';
    return null;
  }
  function anchor(sc){
    if (sc==='indoor') return document.getElementById('ji-checklist');
    if (sc==='outdoor') return document.getElementById('panel-daily');
    return null;
  }

  var _fp = null, _lastScope = null;
  function removeContainer(){ var c=document.getElementById('k3j-bridge'); if(c&&c.parentNode) c.parentNode.removeChild(c); }

  function card(r, sc, done){
    var other = (sc==='indoor')?'outdoor':'indoor';
    var doneHere = !!done[dkey(r.id,sc)], doneOther = !!done[dkey(r.id,other)];
    var pri = (r.priority||'').toLowerCase();
    var priCol = pri==='critical'?'#ef4444':pri==='high'?'#f59e0b':'#94a3b8';
    var col = COLOR[sc];
    var h = '<div style="background:rgba(0,0,0,0.3);border:1px solid '+col+'33;border-left:4px solid '+(doneHere?'#10b981':col)+';border-radius:12px;padding:0.7rem 0.8rem;margin-bottom:0.5rem;">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;"><div style="flex:1;min-width:0;">';
    h += '<div style="font-weight:700;color:#e2e8f0;font-size:0.85rem;">📍 '+esc(r.lokasi||'-')+'</div>';
    h += '<div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">'+esc(r.deskripsi||'-')+'</div>';
    h += '<div style="font-size:0.68rem;color:#64748b;margin-top:4px;">👤 '+esc(r.nama_pelapor||r.pelapor_nama||'-')+' · '+esc(r.kategori||'')+' · <span style="color:'+priCol+';font-weight:700;">'+esc((r.priority||'normal').toUpperCase())+'</span></div>';
    if (doneOther) h += '<div style="font-size:0.68rem;color:#0ea5e9;margin-top:3px;">🔁 '+LABEL[other]+' sudah menandai: '+esc(done[dkey(r.id,other)].by||'-')+'</div>';
    h += '</div>';
    if (r.foto) h += '<img src="'+escA(r.foto)+'" loading="lazy" style="width:46px;height:46px;object-fit:cover;border-radius:8px;border:1px solid #334155;flex-shrink:0;cursor:pointer;" onclick="window.open(this.src)">';
    h += '</div><div style="display:flex;gap:0.4rem;margin-top:0.5rem;">';
    if (!doneHere) h += '<button onclick="__k3jMarkDone(\''+escA(r.id)+'\',\''+sc+'\')" style="flex:1;min-height:40px;border:none;border-radius:8px;background:#10b981;color:#fff;font-weight:700;font-size:0.75rem;cursor:pointer;">✅ Tandai Bersih</button>';
    else h += '<button onclick="__k3jUndo(\''+escA(r.id)+'\',\''+sc+'\')" style="flex:1;min-height:40px;border:1px solid #10b981;border-radius:8px;background:rgba(16,185,129,0.12);color:#10b981;font-weight:700;font-size:0.75rem;cursor:pointer;">✅ Selesai · ↺ Buka Lagi</button>';
    h += '</div></div>';
    return h;
  }

  function render(){
    try {
      var sc = scope();
      if (!sc) { if (_lastScope) { removeContainer(); _lastScope=null; _fp=null; } return; }
      _lastScope = sc;
      var a = anchor(sc); if (!a) return;
      var col = COLOR[sc], k3 = getK3().filter(isClean), done = getDone();
      var active = k3.filter(function(r){ return !done[dkey(r.id,sc)]; });
      var doneHere = k3.filter(function(r){ return !!done[dkey(r.id,sc)]; });
      var fp = sc+'|'+active.map(function(r){return r.id;}).join(',')+'|'+doneHere.map(function(r){return r.id;}).join(',');
      if (fp === _fp) return;
      _fp = fp;
      var cont = document.getElementById('k3j-bridge');
      if (!cont) { cont = document.createElement('div'); cont.id='k3j-bridge'; a.parentNode.insertBefore(cont, a); }
      var h = '<div style="background:rgba(15,23,42,0.8);border:1px solid '+col+'33;border-radius:16px;padding:0.9rem 1rem;margin-bottom:0.8rem;">';
      h += '<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;"><span style="font-size:1rem;">🔗</span><strong style="color:'+col+';font-size:0.9rem;">Tugas Kebersihan dari K3</strong><span style="margin-left:auto;font-size:0.7rem;color:#94a3b8;">'+active.length+' aktif · '+doneHere.length+' selesai</span></div>';
      if (active.length) active.forEach(function(r){ h += card(r, sc, done); });
      else if (!doneHere.length) h += '<div style="font-size:0.78rem;color:#64748b;text-align:center;padding:0.6rem;">Tidak ada tugas kebersihan dari K3 saat ini. ✨</div>';
      if (doneHere.length) {
        h += '<details style="margin-top:0.4rem;"><summary style="cursor:pointer;font-size:0.72rem;color:#94a3b8;">Lihat yang sudah ditandai bersih ('+doneHere.length+')</summary><div style="margin-top:0.4rem;opacity:0.7;">';
        doneHere.forEach(function(r){ h += card(r, sc, done); });
        h += '</div></details>';
      }
      h += '</div>';
      cont.innerHTML = h;
    } catch(e){ console.warn('[k3j-bridge] render:', e); }
  }

  window.__k3jMarkDone = function(id, sc){
    try {
      var d = getDone(); d[dkey(id,sc)] = { by:(user().nama||user().email||'petugas'), at:iso() }; setDone(d);
      if (window.BankAudit) try { window.BankAudit.log('K3_JANITOR_DONE', { k3_id:id, scope:sc }); } catch(e){}
      _fp = null; render();
    } catch(e){ console.warn('[k3j-bridge] markDone:', e); }
  };
  window.__k3jUndo = function(id, sc){
    try { var d = getDone(); delete d[dkey(id,sc)]; setDone(d); _fp=null; render(); } catch(e){ console.warn('[k3j-bridge] undo:', e); }
  };

  setInterval(render, 2000);
  window.addEventListener('storage', function(e){ if (e.key===K3_KEY || e.key===DONE_KEY) { _fp=null; render(); } });
  document.addEventListener('visibilitychange', function(){ if (!document.hidden) { _fp=null; render(); } });
})();
