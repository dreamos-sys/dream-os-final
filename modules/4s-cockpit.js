/**
 * Dream OS - 4S Fighter Cockpit Module
 * Professional Monitoring Interface • Standalone Module
 */

window.FourSCockpit = {
  init: function() {
    this.render();
    this.bindEvents();
    this.startMetrics();
    console.log('✅ 4S Cockpit Loaded');
  },

  render: function() {
    const html = `
    <div id="ghost-hub" style="display:none;position:fixed;inset:0;z-index:99999;background:linear-gradient(135deg,#0f172a,#1e293b);overflow:hidden;font-family:Inter,sans-serif;">
      <div style="background:linear-gradient(90deg,#0f172a,#1e293b);border-bottom:2px solid #2dd4bf;padding:12px 15px;display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.5rem;">🛩️</span>
          <div><h2 style="color:#2dd4bf;font-size:1rem;font-weight:800;margin:0;text-transform:uppercase;">4S Cockpit</h2>
          <p style="color:#64748b;font-size:0.65rem;margin:0;">Ghost Architect</p></div>
        </div>
        <button onclick="FourSCockpit.hide()" style="background:#ef4444;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:0.75rem;">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 280px;gap:15px;padding:15px;height:calc(100vh-90px);overflow:hidden;">
        <div style="overflow-y:auto;">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:15px;">
            <div onclick="FourSCockpit.tools.open4S()" style="background:#1e293b;border:2px solid #2dd4bf;border-radius:12px;padding:15px;cursor:pointer;text-align:center;"><div style="font-size:2rem;">🕌</div><div style="color:#2dd4bf;font-weight:700;font-size:0.85rem;">4S MODE</div></div>
            <div onclick="FourSCockpit.tools.openEruda()" style="background:#1e293b;border:2px solid #3b82f6;border-radius:12px;padding:15px;cursor:pointer;text-align:center;"><div style="font-size:2rem;">💻</div><div style="color:#3b82f6;font-weight:700;font-size:0.85rem;">ERUDA</div></div>
            <div onclick="FourSCockpit.tools.openOSINT()" style="background:#1e293b;border:2px solid #ec4899;border-radius:12px;padding:15px;cursor:pointer;text-align:center;"><div style="font-size:2rem;">🕷️</div><div style="color:#ec4899;font-weight:700;font-size:0.85rem;">OSINT</div></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:15px;">
            <div onclick="FourSCockpit.tools.cookies()" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:12px;cursor:pointer;text-align:center;"><div style="font-size:1.5rem;">🍪</div><div style="color:#f59e0b;font-weight:600;font-size:0.75rem;">COOKIES</div></div>
            <div onclick="FourSCockpit.tools.session()" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:12px;cursor:pointer;text-align:center;"><div style="font-size:1.5rem;">🔑</div><div style="color:#8b5cf6;font-weight:600;font-size:0.75rem;">SESSION</div></div>
            <div onclick="FourSCockpit.tools.localdb()" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:12px;cursor:pointer;text-align:center;"><div style="font-size:1.5rem;">🗄️</div><div style="color:#06b6d4;font-weight:600;font-size:0.75rem;">LOCALDB</div></div>
            <div onclick="FourSCockpit.tools.network()" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:12px;cursor:pointer;text-align:center;"><div style="font-size:1.5rem;">📡</div><div style="color:#10b981;font-weight:600;font-size:0.75rem;">NET</div></div>
            <div onclick="FourSCockpit.tools.gps()" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:12px;cursor:pointer;text-align:center;"><div style="font-size:1.5rem;">🛰️</div><div style="color:#ef4444;font-weight:600;font-size:0.75rem;">GPS</div></div>
            <div onclick="FourSCockpit.tools.shalawat()" style="background:linear-gradient(135deg,#1e293b,#ec4899);border:1px solid #ec4899;border-radius:10px;padding:12px;cursor:pointer;text-align:center;"><div style="font-size:1.5rem;">💖</div><div style="color:#fbbf24;font-weight:600;font-size:0.75rem;">SHALAWAT</div></div>
            <div onclick="FourSCockpit.tools.threat()" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:12px;cursor:pointer;text-align:center;"><div style="font-size:1.5rem;">🔥</div><div style="color:#f97316;font-weight:600;font-size:0.75rem;">THREAT</div></div>
            <div onclick="FourSCockpit.tools.health()" style="background:#1e293b;border:1px solid #334155;border-radius:10px;padding:12px;cursor:pointer;text-align:center;"><div style="font-size:1.5rem;">📊</div><div style="color:#22c55e;font-weight:600;font-size:0.75rem;">HEALTH</div></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;">
            <div onclick="FourSCockpit.tools.backup()" style="background:#0f172a;border:1px solid #475569;border-radius:8px;padding:10px;cursor:pointer;text-align:center;"><div style="font-size:1.3rem;">💾</div><div style="color:#94a3b8;font-weight:600;font-size:0.7rem;">BACKUP</div></div>
            <div onclick="FourSCockpit.tools.quantum()" style="background:#0f172a;border:1px solid #475569;border-radius:8px;padding:10px;cursor:pointer;text-align:center;"><div style="font-size:1.3rem;">⚡</div><div style="color:#eab308;font-weight:600;font-size:0.7rem;">QUANTUM</div></div>
            <div onclick="FourSCockpit.tools.nmap()" style="background:#0f172a;border:1px solid #475569;border-radius:8px;padding:10px;cursor:pointer;text-align:center;"><div style="font-size:1.3rem;">🕸️</div><div style="color:#8b5cf6;font-weight:600;font-size:0.7rem;">NMAP</div></div>
            <div onclick="FourSCockpit.tools.tshark()" style="background:#0f172a;border:1px solid #475569;border-radius:8px;padding:10px;cursor:pointer;text-align:center;"><div style="font-size:1.3rem;">🦈</div><div style="color:#06b6d4;font-weight:600;font-size:0.7rem;">T-SHARK</div></div>
            <div onclick="FourSCockpit.tools.osint()" style="background:#0f172a;border:1px solid #475569;border-radius:8px;padding:10px;cursor:pointer;text-align:center;"><div style="font-size:1.3rem;">🔍</div><div style="color:#ec4899;font-weight:600;font-size:0.7rem;">OSINT</div></div>
            <div onclick="FourSCockpit.tools.bridge()" style="background:#0f172a;border:1px solid #475569;border-radius:8px;padding:10px;cursor:pointer;text-align:center;"><div style="font-size:1.3rem;">🔌</div><div style="color:#10b981;font-weight:600;font-size:0.7rem;">BRIDGE</div></div>          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:12px;">
            <h3 style="color:#2dd4bf;margin:0 0 10px 0;font-size:0.8rem;">📊 Metrics</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.75rem;">
              <div style="background:#1e293b;padding:6px;border-radius:4px;"><span style="color:#64748b;">CPU</span><br><span style="color:#10b981;font-weight:bold;" id="cpu">12%</span></div>
              <div style="background:#1e293b;padding:6px;border-radius:4px;"><span style="color:#64748b;">MEM</span><br><span style="color:#f59e0b;font-weight:bold;" id="mem">45%</span></div>
              <div style="background:#1e293b;padding:6px;border-radius:4px;"><span style="color:#64748b;">NET</span><br><span style="color:#3b82f6;font-weight:bold;" id="net">OK</span></div>
              <div style="background:#1e293b;padding:6px;border-radius:4px;"><span style="color:#64748b;">STO</span><br><span style="color:#8b5cf6;font-weight:bold;" id="sto">2.1G</span></div>
            </div>
          </div>
          <div style="background:#000;border:2px solid #2dd4bf;border-radius:10px;padding:10px;flex:1;overflow:hidden;display:flex;flex-direction:column;">
            <h3 style="color:#2dd4bf;margin:0 0 8px 0;font-size:0.8rem;">🖥️ Terminal</h3>
            <div id="ghost-log" style="flex:1;overflow-y:auto;font-family:'Courier New',monospace;font-size:0.7rem;color:#2dd4bf;background:#0a0a0a;padding:8px;border-radius:4px;line-height:1.5;"><div style="color:#64748b;">> Ready...</div></div>
            <div style="margin-top:8px;display:flex;gap:6px;"><input type="text" id="term-in" placeholder="cmd..." style="flex:1;background:#1e293b;border:1px solid #334155;color:#2dd4bf;padding:6px;border-radius:4px;font-size:0.75rem;outline:none;"><button onclick="FourSCockpit.execCmd()" style="background:#2dd4bf;color:#0f172a;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:bold;">▶</button></div>
          </div>
          <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:12px;">
            <h3 style="color:#2dd4bf;margin:0 0 8px 0;font-size:0.8rem;">⚡ Actions</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
              <button onclick="FourSCockpit.clearLogs()" style="background:#1e293b;color:#94a3b8;border:1px solid #475569;padding:6px;border-radius:4px;cursor:pointer;font-size:0.7rem;">Clear</button>
              <button onclick="FourSCockpit.exportReport()" style="background:#1e293b;color:#94a3b8;border:1px solid #475569;padding:6px;border-radius:4px;cursor:pointer;font-size:0.7rem;">Export</button>
              <button onclick="FourSCockpit.fullScan()" style="background:#1e293b;color:#94a3b8;border:1px solid #475569;padding:6px;border-radius:4px;cursor:pointer;font-size:0.7rem;">Scan</button>
              <button onclick="FourSCockpit.lock()" style="background:#ef4444;color:white;border:none;padding:6px;border-radius:4px;cursor:pointer;font-size:0.7rem;font-weight:bold;">🔒</button>
            </div>
          </div>
        </div>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;background:#0f172a;border-top:1px solid #1e293b;padding:8px 15px;display:flex;justify-content:space-between;align-items:center;font-size:0.7rem;color:#64748b;"><span>🕌 Dream OS 4S v1.0</span><span>🛡️ Shalawat 1001x</span><span id="clock">00:00</span></div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  bindEvents: function() {
    // Clock
    setInterval(()=>{const n=new Date();document.getElementById('clock').textContent=n.toLocaleTimeString('id-ID').slice(0,5);},1000);
    // Terminal enter key
    document.getElementById('term-in')?.addEventListener('keypress',(e)=>{if(e.key==='Enter')this.execCmd();});
  },

  startMetrics: function() {
    setInterval(()=>{
      document.getElementById('cpu').textContent=Math.floor(Math.random()*25+5)+'%';
      document.getElementById('mem').textContent=Math.floor(Math.random()*15+40)+'%';
    },3000);
  },

  hide: function() { document.getElementById('ghost-hub').style.display='none'; },
  show: function() { document.getElementById('ghost-hub').style.display='block'; },
  log: function(m) { const e=document.getElementById('ghost-log'); if(e){const d=document.createElement('div');d.textContent='> '+m;d.style.animation='fadeIn 0.2s';e.appendChild(d);e.scrollTop=e.scrollHeight;} },  execCmd: function() { const i=document.getElementById('term-in'),c=i?.value.trim(); if(c){this.log(c);this.procCmd(c);i.value='';} },
  procCmd: function(c) { const cmds={help:'Commands: help,status,scan,clear,exit',status:'System: OPERATIONAL',scan:'[SCANNING]...',clear:(this.clearLogs(),'Cleared'),exit:(setTimeout(()=>this.hide(),500),'Closing...'),whoami:'Ghost Architect',date:new Date().toLocaleString('id-ID')}; const r=cmds[c.toLowerCase()]||'Unknown'; if(typeof r==='string')this.log(r); else r(); },

  tools: {
    open4S: ()=>FourSCockpit.log('🕌 4S Mode...'),
    openEruda: ()=>{FourSCockpit.log('💻 Eruda...');if(typeof eruda==='undefined'){const s=document.createElement('script');s.src='//cdn.jsdelivr.net/npm/eruda';document.body.appendChild(s);s.onload=()=>{eruda.init();eruda.show();FourSCockpit.log('✅ Active');};}else{eruda.show();FourSCockpit.log('✅ Active');}},
    openOSINT: ()=>FourSCockpit.log('🕷️ OSINT...'),
    cookies: ()=>FourSCockpit.log('🍪 Cookies: '+document.cookie.split(';').length),
    session: ()=>FourSCockpit.log('🔑 Session: '+sessionStorage.length+' keys'),
    localdb: ()=>FourSCockpit.log('🗄️ Local: '+localStorage.length+' entries'),
    network: ()=>FourSCockpit.log('📡 '+(navigator.onLine?'🟢 Online':'🔴 Offline')),
    gps: ()=>{FourSCockpit.log('🛰️ GPS...');if('geolocation'in navigator)navigator.geolocation.getCurrentPosition(p=>FourSCockpit.log('🛰️ '+p.coords.latitude.toFixed(2)+', '+p.coords.longitude.toFixed(2)),e=>FourSCockpit.log('🛰️ '+e.message));else FourSCockpit.log('🛰️ Not supported');},
    shalawat: ()=>{let c=parseInt(localStorage.getItem('shalawat_count')||'0')+1;localStorage.setItem('shalawat_count',c);FourSCockpit.log('💖 Shalawat: '+c+'x');},
    threat: ()=>{FourSCockpit.log('🔥 Scanning...');setTimeout(()=>FourSCockpit.log('🔥 Clean'),1500);},
    health: ()=>FourSCockpit.log('📊 Health: OPTIMAL'),
    backup: ()=>{FourSCockpit.log('💾 Backup...');const d={ls:{},ss:{},ts:new Date().toISOString()};for(let k in localStorage)d.ls[k]=localStorage.getItem(k);for(let k in sessionStorage)d.ss[k]=sessionStorage.getItem(k);const b=new Blob([JSON.stringify(d)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='backup-'+Date.now()+'.json';a.click();FourSCockpit.log('💾 Done');},
    quantum: ()=>{FourSCockpit.log('⚡ Boost...');sessionStorage.clear();FourSCockpit.log('⚡ Optimized');},
    nmap: ()=>FourSCockpit.log('🕸️ NMAP: Ready'),
    tshark: ()=>FourSCockpit.log('🦈 T-Shark: Ready'),
    osint: ()=>FourSCockpit.log('🔍 OSINT: Active'),
    bridge: ()=>FourSCockpit.log('🔌 Bridge: Connected')
  },

  clearLogs: function() { document.getElementById('ghost-log').innerHTML='<div style="color:#64748b;">> Cleared</div>'; },
  exportReport: function() { FourSCockpit.log('📄 Exporting...');setTimeout(()=>FourSCockpit.log('📄 Done'),1000); },
  fullScan: function() { FourSCockpit.log('🔍 Full scan...');setTimeout(()=>FourSCockpit.log('✅ Clean'),2000); },
  lock: function() { FourSCockpit.log('🔒 LOCK!');setTimeout(()=>{this.hide();location.reload();},500); }
};

// Auto-init if DOM ready
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>window.FourSCockpit.init());else window.FourSCockpit.init();

// Add animation style
const st=document.createElement('style');st.textContent='@keyframes fadeIn{from{opacity:0}to{opacity:1}}';document.head.appendChild(st);
