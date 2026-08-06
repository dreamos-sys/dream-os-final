// js/analytics-engine.js v4 — Privacy-First ISO-grade Data Viz
// PRIVACY-BY-DESIGN: dashboard publik HANYA Booking & K3 (data minimization UU PDP/GDPR)
// Sekuriti & Maintenance = privat: hanya di modul ber-RBAC + terkunci RLS Supabase
(function(){
  'use strict';
  var VISIBLE = ['booking','k3']; // SATU-SATUNYA data yang boleh tampil di dashboard

  if (!document.getElementById('ana-v4-css')) {
    var st = document.createElement('style'); st.id='ana-v4-css';
    st.textContent = [
      '.ana-kpi-delta{font-size:.65rem;color:var(--ana-sub,#94a3b8);margin-top:.15rem;}',
      '.ana-spark{width:100%;height:28px;margin-top:.45rem;display:block;}',
      '.ana-updated{font-size:.6rem;color:rgba(255,255,255,.85);margin-top:.25rem;}',
      '.ana-kpi-trend.neutral{color:#94a3b8;background:rgba(100,116,139,.15);}',
      '.ana-kpi-trend.good{color:#16a34a;background:rgba(22,163,74,.12);}',
      '.ana-kpi-trend.bad{color:#dc2626;background:rgba(220,38,38,.12);}',
      '.ana-chart-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem;}',
      '.ana-chart-tools{display:flex;gap:.25rem;}',
      '.ana-tool-btn{border:none;background:transparent;color:var(--ana-sub,#94a3b8);font-size:.8rem;padding:.25rem .55rem;border-radius:6px;cursor:pointer;}',
      '.ana-tool-btn.active{background:var(--ana-card,rgba(15,23,42,.75));color:var(--ana-text,#e2e8f0);box-shadow:0 1px 4px rgba(0,0,0,.25);}',
      '.ana-empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--ana-sub,#94a3b8);font-size:.75rem;gap:.35rem;text-align:center;}'
    ].join('\n');
    document.head.appendChild(st);
  }

  var MONTHS=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  var OKABE={ booking:'#0072B2', k3:'#D55E00' };          // palet aman buta warna
  var GOOD_UP={ booking:true, k3:false };                   // K3 naik = merah (insiden)
  var LABELS={ booking:'Booking', k3:'Laporan K3' };
  var state={ y:new Date().getFullYear(), m:new Date().getMonth(), tab:'overview', chartType:'bar' };

  function ls(k){ try{ return JSON.parse(localStorage.getItem(k)||'[]'); }catch(e){ return []; } }
  function monthKey(y,m){ return y+'-'+String(m+1).padStart(2,'0'); }
  function fmt(n){ return n.toLocaleString('id-ID'); }
  function dateMonthOf(it){ var s=String(it.created_at||it.tanggal||it.tgl||it.time||''); var mm=s.match(/(\d{4})-(\d{2})/); return mm?mm[1]+'-'+mm[2]:null; }
  function countFor(a,mk){ var c=0; for(var i=0;i<a.length;i++){ if(dateMonthOf(a[i])===mk) c++; } return c; }

  function getData(){
    var py=state.m===0?state.y-1:state.y, pm=state.m===0?11:state.m-1;
    var mk=monthKey(state.y,state.m), pk=monthKey(py,pm);
    var B=ls('dreamos_bookings'), K=ls('dreamos_k3_reports');
    return { prevLabel: MONTHS[pm]+' '+py,
      booking:{cur:countFor(B,mk),prev:countFor(B,pk)},
      k3:{cur:countFor(K,mk),prev:countFor(K,pk)} };
  }

  function trendInfo(k,cur,prev){
    var delta=cur-prev, pct=prev?Math.round((delta/prev)*100):(cur>0?100:0);
    var txt=(pct>=0?'+':'')+pct+'%';
    if(delta===0) return {txt:txt,cls:'neutral',arrow:'→',delta:delta};
    var good=GOOD_UP[k]?delta>0:delta<0;
    return {txt:txt,cls:good?'good':'bad',arrow:delta>0?'↗':'',delta:delta};
  }

  function dailySeries(arr){
    var days=new Date(state.y,state.m+1,0).getDate(), mk=monthKey(state.y,state.m), out=[];
    for(var i=0;i<days;i++) out.push(0);
    arr.forEach(function(it){ if(dateMonthOf(it)!==mk) return;
      var d=parseInt(String(it.created_at||it.tanggal||it.tgl||'').slice(8,10),10);
      if(d>=1&&d<=days) out[d-1]++; });
    return out;
  }

  function drawSpark(cv,series,color){
    requestAnimationFrame(function(){
      var dpr=window.devicePixelRatio||1, w=cv.clientWidth||100, h=cv.clientHeight||28;
      cv.width=w*dpr; cv.height=h*dpr;
      var ctx=cv.getContext('2d'); ctx.scale(dpr,dpr); ctx.clearRect(0,0,w,h);
      var max=Math.max.apply(null,series.concat([1]));
      ctx.beginPath();
      for(var i=0;i<series.length;i++){
        var x=(series.length>1?(i/(series.length-1))*(w-6)+3:w/2);
        var y=h-4-((series[i]/max)*(h-10));
        i?ctx.lineTo(x,i&&x,y):ctx.moveTo(x,y);
      }
      ctx.strokeStyle=color; ctx.lineWidth=1.6; ctx.lineJoin='round'; ctx.stroke();
      var ly=h-4-((series[series.length-1]/max)*(h-10));
      ctx.beginPath(); ctx.arc(w-3,ly,2.2,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
    });
  }

  function ensure(parent,tag,cls){
    var el=parent.querySelector('.'+cls);
    if(!el){ el=document.createElement(tag); el.className=cls; parent.appendChild(el); }
    return el;
  }

  // Klik chart → masuk modul (RBAC ditegakkan oleh openMod: role tak berhak = ditolak)
  function chartClick(e,els){
    if(!els||!els.length) return;
    var mod = state.tab==='overview' ? VISIBLE[els[0].index] : state.tab;
    if(mod && window.openMod) window.openMod(mod);
  }

  window.renderAnalytics = function(){
    var d=getData();
    var label=document.getElementById('ana-period-label');
    if(label) label.textContent=MONTHS[state.m]+' '+state.y;
    // NAV HARDENING v0508d: listener langsung + swipe (idempotent)
    var pbs=document.querySelectorAll('.ana-period-btn');
    if(pbs.length===2&&!pbs[0].hasAttribute('data-wired')){
      pbs[0].setAttribute('data-wired','1');pbs[1].setAttribute('data-wired','1');
      pbs[0].removeAttribute('onclick');pbs[1].removeAttribute('onclick');
      pbs[0].addEventListener('click',function(){window.shiftPeriod(-1);});
      pbs[1].addEventListener('click',function(){window.shiftPeriod(1);});
    }
    var ucard=document.querySelector('.ana-unified-card');
    if(ucard&&!ucard.hasAttribute('data-swipe')){
      ucard.setAttribute('data-swipe','1');var sx=0;
      ucard.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
      ucard.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(dx>60)window.shiftPeriod(-1);else if(dx<-60)window.shiftPeriod(1);},{passive:true});
    }

    var header=document.querySelector('.ana-header > div');
    if(header){
      var up=ensure(header,'div','ana-updated');
      up.textContent=(navigator.onLine?'☁️ Cloud Sync':'📴 Cache Lokal')+' • '+new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})+' WIB • 🔒 Data privat terlindungi';
    }

    VISIBLE.forEach(function(k){
      var val=document.getElementById('kpi-'+k), badge=document.getElementById('trend-'+k);
      if(!val) return;
      var tr=trendInfo(k,d[k].cur,d[k].prev);
      val.textContent=fmt(d[k].cur);
      if(badge){ badge.textContent=tr.arrow+' '+tr.txt; badge.className='kpu-trend '+(tr.cls==='bad'?'down':(tr.cls==='neutral'?'neutral':'')); }
      var host=val.closest('.kpu-row')||val.parentElement;
      if(host) host.setAttribute('aria-label', LABELS[k]+': '+fmt(d[k].cur));
    });

    var title=document.getElementById('ana-chart-title');
    if(title && !document.getElementById('ana-tools')){
      var head=document.createElement('div'); head.className='ana-chart-head';
      title.parentNode.insertBefore(head,title); head.appendChild(title);
      var tools=document.createElement('div'); tools.className='ana-chart-tools'; tools.id='ana-tools';
      tools.innerHTML='<button class="ana-tool-btn active" onclick="setChartType(\'bar\',this)">📊</button><button class="ana-tool-btn" onclick="setChartType(\'line\',this)">📈</button>';
      head.appendChild(tools);
    }

    var canvas=document.getElementById('unifiedMarketChart');
    if(!canvas||typeof Chart==='undefined') return;
    var isLight=document.documentElement.getAttribute('data-theme')==='light';
    var tick=isLight?'#64748b':'#94a3b8', grid=isLight?'rgba(15,23,42,0.15)':'rgba(255,255,255,0.15)';

    var wrap=canvas.parentElement, oldE=wrap.querySelector('.ana-empty'); if(oldE) oldE.remove();
    var allZero = d.booking.cur + d.k3.cur === 0;
    var cfg;

    if(state.tab==='overview'){
      if(title) title.textContent='Perbandingan Modul Publik';
      cfg={ type:state.chartType,
        data:{ labels:VISIBLE.map(function(k){return LABELS[k];}),
          datasets:[{ data:VISIBLE.map(function(k){return d[k].cur;}),
            backgroundColor:VISIBLE.map(function(k){return OKABE[k]+'B3';}),
            borderColor:VISIBLE.map(function(k){return OKABE[k];}),
            borderWidth:1.5, borderRadius:6, borderSkipped:false,
            tension:.35, pointRadius:3, fill:state.chartType==='line' }]},
        options:baseOpts(tick,grid,false) };
    } else {
      if(title) title.textContent='Trend Harian — '+LABELS[state.tab];
      var s=dailySeries(ls(state.tab==='booking'?'dreamos_bookings':'dreamos_k3_reports'));
      cfg={ type:state.chartType,
        data:{ labels:s.map(function(_,i){return i+1;}),
          datasets:[{ data:s, backgroundColor:OKABE[state.tab]+'99', borderColor:OKABE[state.tab],
            borderWidth:1.5, borderRadius:4, tension:.35, pointRadius:2, fill:state.chartType==='line' }]},
        options:baseOpts(tick,grid,true) };
    }
    cfg.options.onClick=chartClick;

    if(window._unifiedChartInstance) window._unifiedChartInstance.destroy();
    window._unifiedChartInstance=new Chart(canvas.getContext('2d'),cfg);
    canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label',(title?title.textContent:'Grafik')+' — '+MONTHS[state.m]+' '+state.y);

    if(allZero){
      var em=document.createElement('div'); em.className='ana-empty';
      em.innerHTML='<div style="font-size:1.6rem;">📭</div><div>Belum ada data publik periode ini.</div><div style="font-size:.65rem;">Geser ‹ › untuk riwayat • Data privat tetap terlindungi.</div>';
      wrap.appendChild(em);
    }
  };

  function baseOpts(tick,grid,daily){
    return { responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false},
        tooltip:{ backgroundColor:'rgba(15,23,42,0.95)', titleColor:'#00ff9d', bodyColor:'#e2e8f0',
          callbacks:{ label:function(c){ return ' '+fmt(c.parsed.y)+' entri'; } } } },
      scales:{
        x:{ ticks:{ color:tick, font:{size:9}, autoSkip:daily, maxTicksLimit:8, maxRotation:daily?0:35 }, grid:{display:false} },
        y:{ beginAtZero:true, ticks:{ color:tick, font:{size:9}, precision:0, stepSize:1 }, grid:{ color:grid, borderDash:[4,4] } } } };
  }

  window.shiftPeriod=function(dd){ state.m+=dd;
    if(state.m<0){state.m=11;state.y--;} if(state.m>11){state.m=0;state.y++;}
    window.renderAnalytics(); };
  window.setAnaTab=function(tab,btn){
    if(tab!=='overview' && VISIBLE.indexOf(tab)<0) return; // guard privasi
    state.tab=tab;
    document.querySelectorAll('.ana-tab').forEach(function(b){ b.classList.toggle('active',b===btn); });
    window.renderAnalytics(); };
  window.setChartType=function(tp,btn){ state.chartType=tp;
    document.querySelectorAll('.ana-tool-btn').forEach(function(b){ b.classList.toggle('active',b===btn); });
    window.renderAnalytics(); };

  // CSV hanya data publik (Excel-ready: BOM + ';')
  window.exportAnalyticsCSV=function(){
    var d=getData(), mk=monthKey(state.y,state.m);
    function esc(v){ return '"'+String(v).replace(/"/g,'""')+'"'; }
    var rows=[['Laporan Analitik Publik Dream OS'],['Periode',mk],['Diekspor',new Date().toISOString()],
      ['Catatan','Data sekuriti & maintenance dilindungi privasi (tidak diekspor)'],[],
      ['Modul','Jumlah','Bulan Lalu','Delta','Trend']];
    VISIBLE.forEach(function(k){ var tr=trendInfo(k,d[k].cur,d[k].prev);
      rows.push([LABELS[k],d[k].cur,d[k].prev,tr.delta,tr.txt]); });
    var blob=new Blob(['\uFEFF'+rows.map(function(r){return r.map(esc).join(';');}).join('\r\n')],{type:'text/csv;charset=utf-8'});
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download='dreamos_analytics_'+mk+'.csv'; a.click(); URL.revokeObjectURL(a.href);
    if(window.showToast) showToast('✅ CSV publik di-export (data privat tetap aman)!','success');
  };

  console.log('🔒 Analytics v4 privacy-first: hanya Booking & K3 yang publik');
})();

// ===== PERIOD NAV HARDENING v0508d =====
(function(){
  var orig = window.shiftPeriod;
  window.shiftPeriod = function(dd){
    try {
      orig(dd);
      var l = document.getElementById('ana-period-label');
      if (window.showToast && l) showToast('📅 ' + l.textContent, 'info');
    } catch(e) {
      try {
        var errs = JSON.parse(localStorage.getItem('dreamos_errors')||'[]');
        errs.unshift({time:new Date().toISOString(), msg:'shiftPeriod: '+e.message});
        window.safeStorageSet('dreamos_errors', JSON.stringify(errs.slice(0,20)));
      } catch(_){}
      if (window.showToast) showToast('❌ shiftPeriod: '+e.message, 'error');
    }
  };
})();
