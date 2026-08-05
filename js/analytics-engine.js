// js/analytics-engine.js — Analytics "Laporan Bulanan" style untuk Dashboard
(function(){
  'use strict';
  var MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  var state = { y: new Date().getFullYear(), m: new Date().getMonth(), tab: 'overview' };

  function ls(k){ try { return JSON.parse(localStorage.getItem(k)||'[]'); } catch(e){ return []; } }
  function monthKey(y,m){ return y + '-' + String(m+1).padStart(2,'0'); }
  function dateMonthOf(it){
    var s = String(it.created_at || it.tanggal || it.tgl || it.time || it.updated_at || '');
    var mm = s.match(/(\d{4})-(\d{2})/);
    return mm ? (mm[1]+'-'+mm[2]) : null;
  }
  function countFor(arr, mk){ var c=0; for(var i=0;i<arr.length;i++){ if(dateMonthOf(arr[i])===mk) c++; } return c; }

  function getData(){
    var py = state.m===0 ? state.y-1 : state.y, pm = state.m===0 ? 11 : state.m-1;
    var mk = monthKey(state.y, state.m), pk = monthKey(py, pm);
    var B = ls('dreamos_bookings'), K = ls('dreamos_k3_reports');
    var S = ls('dreamos_security_logs').concat(ls('dreamos_sec_today'));
    var M = ls('dreamos_maintenance').concat(ls('dreamos_maintenance_requests'));
    return {
      booking:      { cur: countFor(B,mk), prev: countFor(B,pk) },
      k3:           { cur: countFor(K,mk), prev: countFor(K,pk) },
      sekuriti:     { cur: countFor(S,mk), prev: countFor(S,pk) },
      maintenance:  { cur: countFor(M,mk), prev: countFor(M,pk) }
    };
  }

  function trend(cur, prev){
    if (!prev) return { txt: (cur>0?'+100%':'+0%'), down:false };
    var p = Math.round(((cur-prev)/prev)*100);
    return { txt: (p>=0?'+':'')+p+'%', down: p<0 };
  }

  function dailySeries(arr){
    var days = new Date(state.y, state.m+1, 0).getDate();
    var mk = monthKey(state.y, state.m);
    var out = []; for (var i=0;i<days;i++) out.push(0);
    arr.forEach(function(it){
      if (dateMonthOf(it)!==mk) return;
      var d = parseInt(String(it.created_at||it.tanggal||it.tgl||'').slice(8,10),10);
      if (d>=1 && d<=days) out[d-1]++;
    });
    return out;
  }

  window.shiftPeriod = function(d){
    state.m += d;
    if (state.m<0){ state.m=11; state.y--; }
    if (state.m>11){ state.m=0; state.y++; }
    window.renderAnalytics();
  };

  window.setAnaTab = function(tab, btn){
    state.tab = tab;
    document.querySelectorAll('.ana-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    window.renderAnalytics();
  };

  window.exportAnalyticsCSV = function(){
    var d = getData(), mk = monthKey(state.y, state.m);
    var rows = [['Periode',mk],['Modul','Jumlah','Bulan Lalu','Trend']];
    ['booking','k3','sekuriti','maintenance'].forEach(function(k){
      rows.push([k.toUpperCase(), d[k].cur, d[k].prev, trend(d[k].cur,d[k].prev).txt]);
    });
    var blob = new Blob([rows.map(function(r){return r.join(',');}).join('\n')], {type:'text/csv'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dreamos_ringkasan_'+mk+'.csv';
    a.click(); URL.revokeObjectURL(a.href);
    if (window.showToast) showToast('✅ Ringkasan CSV di-export!','success');
  };

  function baseOpts(tick, grid, daily){
    return {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'rgba(15,23,42,0.95)', titleColor:'#00ff9d', bodyColor:'#e2e8f0' } },
      scales:{
        x:{ ticks:{ color:tick, font:{size:9}, autoSkip:daily, maxTicksLimit:8, maxRotation: daily?0:35 }, grid:{ display:false } },
        y:{ beginAtZero:true, ticks:{ color:tick, font:{size:9}, precision:0, stepSize:1 }, grid:{ color:grid, borderDash:[4,4] } }
      }
    };
  }

  window.renderAnalytics = function(){
    var label = document.getElementById('ana-period-label');
    if (label) label.textContent = MONTHS[state.m] + ' ' + state.y;

    var d = getData();
    ['booking','k3','sekuriti','maintenance'].forEach(function(k){
      var v = document.getElementById('kpi-'+k);
      var t = document.getElementById('trend-'+k);
      if (v) v.textContent = d[k].cur;
      if (t){ var tr = trend(d[k].cur, d[k].prev); t.textContent = (tr.down?'⬇ ':'↗ ')+tr.txt; t.classList.toggle('down', tr.down); }
    });

    var canvas = document.getElementById('unifiedMarketChart');
    if (!canvas || typeof Chart === 'undefined') return;
    var isLight = document.documentElement.getAttribute('data-theme')==='light';
    var tick = isLight ? '#64748b' : '#94a3b8';
    var grid = isLight ? 'rgba(15,23,42,0.15)' : 'rgba(255,255,255,0.15)';
    var title = document.getElementById('ana-chart-title');
    var cfg;

    if (state.tab === 'overview'){
      if (title) title.textContent = 'Perbandingan Modul';
      cfg = { type:'bar',
        data:{ labels:['Booking','K3','Sekuriti','Maintenance'],
          datasets:[{ data:[d.booking.cur,d.k3.cur,d.sekuriti.cur,d.maintenance.cur],
            backgroundColor:['rgba(59,130,246,0.65)','rgba(239,68,68,0.65)','rgba(100,116,139,0.65)','rgba(245,158,11,0.65)'],
            borderRadius:6, borderSkipped:false }] },
        options: baseOpts(tick, grid, false) };
    } else {
      var N = { booking:['dreamos_bookings','#3b82f6','Booking'], k3:['dreamos_k3_reports','#ef4444','K3'],
                sekuriti:['dreamos_security_logs','#64748b','Sekuriti'], maintenance:['dreamos_maintenance','#f59e0b','Maintenance'] };
      var n = N[state.tab];
      if (title) title.textContent = 'Trend Harian — ' + n[2];
      var s = dailySeries(ls(n[0]));
      cfg = { type:'bar',
        data:{ labels: s.map(function(_,i){return i+1;}),
          datasets:[{ data:s, backgroundColor:n[1]+'99', borderColor:n[1], borderWidth:1, borderRadius:4 }] },
        options: baseOpts(tick, grid, true) };
    }

    if (window._unifiedChartInstance) window._unifiedChartInstance.destroy();
    window._unifiedChartInstance = new Chart(canvas.getContext('2d'), cfg);
  };

  console.log('📊 Analytics engine (Laporan Bulanan style) active');
})();
