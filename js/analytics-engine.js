// js/analytics-engine.js v3 — ISO-grade Data Visualization Engine
// Standar: Okabe-Ito palette (colorblind-safe) • ISO 8601 periods • id-ID locale
// WCAG 2.2 (aria + non-color-only) • Semantic trend inversion • Excel-ready CSV
(function(){
  'use strict';

  // ===== 1. INJECT CSS (self-contained, idempotent) =====
  if (!document.getElementById('ana-v3-css')) {
    var st = document.createElement('style');
    st.id = 'ana-v3-css';
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

  // ===== 2. KONSTANTA STANDAR =====
  var MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  // Okabe-Ito: palet aman buta warna (standar viz ilmiah global)
  var OKABE = { booking:'#0072B2', k3:'#D55E00', sekuriti:'#56B4E9', maintenance:'#E69F00' };
  // Arah "baik": booking naik = baik; insiden (K3/sekuriti/maintenance) naik = buruk
  var GOOD_UP = { booking:true, k3:false, sekuriti:false, maintenance:false };
  var state = { y:new Date().getFullYear(), m:new Date().getMonth(), tab:'overview', chartType:'bar' };

  function ls(k){ try { return JSON.parse(localStorage.getItem(k)||'[]'); } catch(e){ return []; } }
  function monthKey(y,m){ return y + '-' + String(m+1).padStart(2,'0'); } // ISO 8601
  function fmt(n){ return n.toLocaleString('id-ID'); }
  function dateMonthOf(it){
    var s = String(it.created_at||it.tanggal||it.tgl||it.time||it.updated_at||'');
    var mm = s.match(/(\d{4})-(\d{2})/); return mm ? mm[1]+'-'+mm[2] : null;
  }
  function countFor(arr,mk){ var c=0; for(var i=0;i<arr.length;i++){ if(dateMonthOf(arr[i])===mk) c++; } return c; }

  function getData(){
    var py = state.m===0?state.y-1:state.y, pm = state.m===0?11:state.m-1;
    var mk = monthKey(state.y,state.m), pk = monthKey(py,pm);
    var B=ls('dreamos_bookings'), K=ls('dreamos_k3_reports');
    var S=ls('dreamos_security_logs').concat(ls('dreamos_sec_today'));
    var M=ls('dreamos_maintenance').concat(ls('dreamos_maintenance_requests'));
    return {
      prevLabel: MONTHS[pm]+' '+py,
      booking:{cur:countFor(B,mk),prev:countFor(B,pk)},
      k3:{cur:countFor(K,mk),prev:countFor(K,pk)},
      sekuriti:{cur:countFor(S,mk),prev:countFor(S,pk)},
      maintenance:{cur:countFor(M,mk),prev:countFor(M,pk)}
    };
  }

  // Trend SEMANTIK: warna mengikuti "baik/buruk", bukan sekadar naik/turun (ISO 9241: kejelasan makna)
  function trendInfo(k, cur, prev){
    var delta = cur - prev;
    var pct = prev ? Math.round((delta/prev)*100) : (cur>0?100:0);
    var txt = (pct>=0?'+':'')+pct+'%';
    if (delta === 0) return { txt:txt, cls:'neutral', arrow:'→', delta:delta };
    var good = GOOD_UP[k] ? delta>0 : delta<0;
    return { txt:txt, cls: good?'good':'bad', arrow: delta>0?'↗':'⬇', delta:delta };
  }

  function dailySeries(arr){
    var days = new Date(state.y, state.m+1, 0).getDate();
    var mk = monthKey(state.y,state.m), out=[];
    for (var i=0;i<days;i++) out.push(0);
    arr.forEach(function(it){
      if (dateMonthOf(it)!==mk) return;
      var d = parseInt(String(it.created_at||it.tanggal||it.tgl||'').slice(8,10),10);
      if (d>=1&&d<=days) out[d-1]++;
    });
    return out;
  }

  // ===== 3. SPARKLINE (prinsip Tufte: data kecil di dalam kartu) =====
  function drawSpark(cv, series, color){
    requestAnimationFrame(function(){
      var dpr = window.devicePixelRatio||1;
      var w = cv.clientWidth||100, h = cv.clientHeight||28;
      cv.width = w*dpr; cv.height = h*dpr;
      var ctx = cv.getContext('2d'); ctx.scale(dpr,dpr); ctx.clearRect(0,0,w,h);
      var max = Math.max.apply(null, series.concat([1]));
      ctx.beginPath();
      for (var i=0;i<series.length;i++){
        var x = (series.length>1 ? (i/(series.length-1))*(w-6)+3 : w/2);
        var y = h-4-((series[i]/max)*(h-10));
        i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
      }
      ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.lineJoin='round'; ctx.stroke();
      var lx = w-3, ly = h-4-((series[series.length-1]/max)*(h-10));
      ctx.beginPath(); ctx.arc(lx,ly,2.2,0,Math.PI*2); ctx.fillStyle = color; ctx.fill();
    });
  }

  function ensure(parent, tag, cls, id){
    var el = id ? parent.querySelector('#'+id) : parent.querySelector('.'+cls);
    if (!el){ el = document.createElement(tag); if(cls) el.className=cls; if(id) el.id=id; parent.appendChild(el); }
    return el;
  }

  // ===== 4. RENDER UTAMA =====
  window.renderAnalytics = function(){
    var d = getData();
    var label = document.getElementById('ana-period-label');
    if (label) label.textContent = MONTHS[state.m]+' '+state.y;

    // Provenance: kapan & dari mana data (transparansi = prinsip ISO 25010)
    var header = document.querySelector('.ana-header > div');
    if (header){
      var up = ensure(header,'div','ana-updated','ana-updated');
      up.textContent = (navigator.onLine ? '☁️ Cloud Sync' : '📴 Cache Lokal') +
        ' • Diperbarui ' + new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}) + ' WIB';
    }

    // KPI cards + sparkline + delta semantik
    ['booking','k3','sekuriti','maintenance'].forEach(function(k){
      var val = document.getElementById('kpi-'+k);
      var badge = document.getElementById('trend-'+k);
      var card = val ? val.closest('.ana-kpi-card') : null;
      if (!card) return;
      var tr = trendInfo(k, d[k].cur, d[k].prev);
      if (val) val.textContent = fmt(d[k].cur);
      if (badge){ badge.textContent = tr.arrow+' '+tr.txt; badge.className = 'ana-kpi-trend '+tr.cls; }
      var delta = ensure(card,'div','ana-kpi-delta');
      delta.textContent = (tr.delta>=0?'+':'')+fmt(tr.delta)+' vs '+d.prevLabel;
      var spark = ensure(card,'canvas','ana-spark');
      var src = {booking:'dreamos_bookings',k3:'dreamos_k3_reports',sekuriti:'dreamos_security_logs',maintenance:'dreamos_maintenance'}[k];
      drawSpark(spark, dailySeries(ls(src)), OKABE[k]);
      card.setAttribute('aria-label', card.querySelector('.ana-kpi-label').textContent+': '+fmt(d[k].cur));
    });

    // Chart tools (Bar/Line toggle) — idempotent
    var title = document.getElementById('ana-chart-title');
    if (title && !document.getElementById('ana-tools')){
      var head = document.createElement('div'); head.className='ana-chart-head';
      title.parentNode.insertBefore(head, title);
      head.appendChild(title);
      var tools = document.createElement('div'); tools.className='ana-chart-tools'; tools.id='ana-tools';
      tools.innerHTML = '<button class="ana-tool-btn active" onclick="setChartType(\'bar\',this)">📊</button><button class="ana-tool-btn" onclick="setChartType(\'line\',this)">📈</button>';
      head.appendChild(tools);
    }

    var canvas = document.getElementById('unifiedMarketChart');
    if (!canvas || typeof Chart === 'undefined') return;
    var isLight = document.documentElement.getAttribute('data-theme')==='light';
    var tick = isLight ? '#64748b' : '#94a3b8';
    var grid = isLight ? 'rgba(15,23,42,0.15)' : 'rgba(255,255,255,0.15)';

    // Empty state: chart kosong harus "berbicara" (UX writing pro)
    var wrap = canvas.parentElement;
    var oldEmpty = wrap.querySelector('.ana-empty'); if (oldEmpty) oldEmpty.remove();
    var allZero = d.booking.cur+d.k3.cur+d.sekuriti.cur+d.maintenance.cur === 0;

    var cfg;
    if (state.tab === 'overview'){
      if (title) title.textContent = 'Perbandingan Modul';
      cfg = { type: state.chartType,
        data:{ labels:['Booking','K3','Sekuriti','Maintenance'],
          datasets:[{ data:[d.booking.cur,d.k3.cur,d.sekuriti.cur,d.maintenance.cur],
            backgroundColor:[OKABE.booking+'B3',OKABE.k3+'B3',OKABE.sekuriti+'B3',OKABE.maintenance+'B3'],
            borderColor:[OKABE.booking,OKABE.k3,OKABE.sekuriti,OKABE.maintenance],
            borderWidth:1.5, borderRadius:6, borderSkipped:false,
            tension:.35, pointRadius:3, fill: state.chartType==='line' } ] },
        options: baseOpts(tick,grid,false) };
    } else {
      var N = { booking:['dreamos_bookings','Booking'], k3:['dreamos_k3_reports','K3'],
                sekuriti:['dreamos_security_logs','Sekuriti'], maintenance:['dreamos_maintenance','Maintenance'] };
      var n = N[state.tab];
      if (title) title.textContent = 'Trend Harian — '+n[1];
      var s = dailySeries(ls(n[0]));
      cfg = { type: state.chartType,
        data:{ labels: s.map(function(_,i){return i+1;}),
          datasets:[{ data:s, backgroundColor:OKABE[state.tab]+'99', borderColor:OKABE[state.tab],
            borderWidth:1.5, borderRadius:4, tension:.35, pointRadius:2, fill: state.chartType==='line' }] },
        options: baseOpts(tick,grid,true) };
    }

    if (window._unifiedChartInstance) window._unifiedChartInstance.destroy();
    window._unifiedChartInstance = new Chart(canvas.getContext('2d'), cfg);
    canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label', (title?title.textContent:'Grafik')+' — '+MONTHS[state.m]+' '+state.y);

    if (allZero){
      var em = document.createElement('div'); em.className='ana-empty';
      em.innerHTML = '<div style="font-size:1.6rem;">📭</div><div>Belum ada data periode ini.</div><div style="font-size:.65rem;">Geser ‹ › untuk melihat riwayat bulan lain.</div>';
      wrap.appendChild(em);
    }
  };

  function baseOpts(tick, grid, daily){
    return {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false},
        tooltip:{ backgroundColor:'rgba(15,23,42,0.95)', titleColor:'#00ff9d', bodyColor:'#e2e8f0',
          callbacks:{ label:function(c){ return ' '+fmt(c.parsed.y)+' entri'; } } } },
      scales:{
        x:{ ticks:{ color:tick, font:{size:9}, autoSkip:daily, maxTicksLimit:8, maxRotation: daily?0:35 }, grid:{ display:false } },
        y:{ beginAtZero:true, ticks:{ color:tick, font:{size:9}, precision:0, stepSize:1 }, grid:{ color:grid, borderDash:[4,4] } }
      }
    };
  }

  // ===== 5. NAVIGASI & EXPORT =====
  window.shiftPeriod = function(dd){
    state.m += dd;
    if (state.m<0){ state.m=11; state.y--; }
    if (state.m>11){ state.m=0; state.y++; }
    window.renderAnalytics();
  };
  window.setAnaTab = function(tab, btn){
    state.tab = tab;
    document.querySelectorAll('.ana-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    window.renderAnalytics();
  };
  window.setChartType = function(tp, btn){
    state.chartType = tp;
    document.querySelectorAll('.ana-tool-btn').forEach(function(b){ b.classList.toggle('active', b===btn); });
    window.renderAnalytics();
  };

  // CSV Excel-ready: BOM UTF-8 + delimiter ';' (locale Excel Indonesia)
  window.exportAnalyticsCSV = function(){
    var d = getData(), mk = monthKey(state.y,state.m);
    function esc(v){ return '"'+String(v).replace(/"/g,'""')+'"'; }
    var rows = [
      ['Laporan Analitik Dream OS'],
      ['Periode', mk],
      ['Diekspor', new Date().toISOString()],
      [],
      ['Modul','Jumlah','Bulan Lalu','Delta','Trend']
    ];
    ['booking','k3','sekuriti','maintenance'].forEach(function(k){
      var tr = trendInfo(k, d[k].cur, d[k].prev);
      rows.push([k.toUpperCase(), d[k].cur, d[k].prev, tr.delta, tr.txt]);
    });
    var csv = '\uFEFF' + rows.map(function(r){ return r.map(esc).join(';'); }).join('\r\n');
    var blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dreamos_analytics_'+mk+'.csv'; // ISO 8601 filename
    a.click(); URL.revokeObjectURL(a.href);
    if (window.showToast) showToast('✅ Ringkasan CSV (Excel-ready) di-export!','success');
  };

  console.log('📊 Analytics engine v3 (ISO-grade data viz) active');
})();
