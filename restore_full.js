const fs = require('fs');
    const devHash = "ec363f85aa74ef12cb507cbaaf199eeb13723b121780f0cfc257d1abb1796ece";
    const devEmail = "dreamos.sch.id@gmail.com";

    const html = `<!DOCTYPE html>
    <html lang="id" data-theme="dark">
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';">
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta charset="UTF-8">
        <link rel="manifest" href="./manifest.json">
        <meta name="theme-color" content="#020617">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dream OS • v1.0 Final</title>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;600;800&family=Orbitron:wght@500;700&display=swap" rel="stylesheet">
        <script src="js/config-supabase.js"></script>
        <script>
        window.DreamGeo = { get: () => new Promise((res, rej) => { if (!navigator.geolocation) return rej('GPS Not Supported'); navigator.geolocation.getCurrentPosition(pos => res({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6), acc: Math.round(pos.coords.accuracy) }), err => rej(err.message), { enableHighAccuracy: true, timeout: 10000 }); }), stamp: async function(payload) { try { const loc = await this.get(); payload.gps_lat = loc.lat; payload.gps_lng = loc.lng; payload.gps_acc = loc.acc + 'm'; } catch(e) { payload.gps_lat = 'DENIED'; } return payload; } };
        window.HybridSync = { outboxKey: 'dreamos_sync_outbox', push: function(table, payload) { let box = JSON.parse(localStorage.getItem(this.outboxKey) || '[]'); payload._table = table; payload._timestamp = new Date().toISOString(); box.push(payload); localStorage.setItem(this.outboxKey, JSON.stringify(box)); this.updateUI(); if (navigator.onLine) this.flush(); }, flush: async function() { if (!navigator.onLine) return; let box = JSON.parse(localStorage.getItem(this.outboxKey) || '[]'); if (box.length === 0) return; let successCount = 0; for (let i = 0; i < box.length; i++) { let item = box[i]; let table = item._table; delete item._table; delete item._timestamp; try { let res = await fetch(window.DREAMOS_CONFIG.supabaseUrl + '/rest/v1/' + table, { method: 'POST', headers: { 'apikey': window.DREAMOS_CONFIG.supabaseKey, 'Authorization': 'Bearer ' + window.DREAMOS_CONFIG.supabaseKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }, body: JSON.stringify(item) }); if (res.ok) successCount++; } catch(e) {} } if (successCount > 0) { box.splice(0, successCount); localStorage.setItem(this.outboxKey, JSON.stringify(box)); } this.updateUI(); }, updateUI: function() { let box = JSON.parse(localStorage.getItem(this.outboxKey) || '[]'); let badge = document.getElementById('sync-badge'); if (badge) { if (box.length > 0) { badge.innerHTML = '📦 Outbox: ' + box.length; badge.style.background = 'rgba(245,158,11,0.2)'; badge.style.color = '#f59e0b'; } else { badge.innerHTML = '☁️ Synced'; badge.style.background = 'rgba(16,185,129,0.1)'; badge.style.color = '#10b981'; } } } };
        window.addEventListener('online', () => { if(window.HybridSync) window.HybridSync.flush(); });
        document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "dark");
        </script>
        <style>
            :root { --bg-void: #F1F5F9; --text-main: #334155; --neon-accent: #0284C7; --neon-warning: #E11D48; --glass-border: rgba(15,23,42,0.08); --panel-bg: #fff; --text-primary: #0F172A; --text-dim: #64748B; }
            [data-theme="dark"] { --bg-void: #020617; --text-main: #e2e8f0; --neon-accent: #0ea5e9; --neon-warning: #e11d48; --glass-border: rgba(255,255,255,0.05); --panel-bg: #1e293b; --text-primary: #f8fafc; --text-dim: #94a3b8; }
            body { margin:0; background:transparent; color:var(--text-main); font-family:'Inter',sans-serif; min-height:100vh; }
            #login-screen { position:fixed; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background:transparent; z-index:10000; overflow:hidden; }
            .login-content { width:100%; max-width:400px; padding:2rem; text-align:center; position:relative; z-index:1; }
            .logo-img { width:90px; height:90px; border-radius:1.2rem; margin:1rem 0; cursor:pointer; }
            .arabic { font-family:'Amiri',serif; color:#00ff9d; font-size:1.8rem; font-weight:800; }
            .shalawat { font-family:'Amiri',serif; color:#0ea5e9; font-size:0.9rem; margin-bottom:1rem; }
            .login-input { width:100%; padding:1rem; border:1px solid rgba(45,212,191,0.3); border-radius:1rem; background:rgba(15,23,42,0.6); color:#fff; font-family:'Orbitron',monospace; letter-spacing:4px; text-align:center; outline:none; box-sizing:border-box; margin-bottom:1rem; }
            .btn-login { width:100%; padding:1rem; background:linear-gradient(135deg,#0ea5e9,#06b6d4); color:#fff; border:none; border-radius:1rem; font-weight:700; cursor:pointer; font-size:1.1rem; }
            .lockout-msg { color:var(--neon-warning); font-size:0.8rem; margin-top:10px; display:none; }
            #main-app { display:none; padding-bottom:70px; }
            .header-main { padding:2rem 1.5rem 1rem; text-align:center; border-bottom:2px solid var(--neon-accent); }
            .header-main .logo-img { width:48px; height:48px; border-radius:12px; cursor:pointer; }
            .header-main .arabic { font-size:1.5rem; margin-bottom:0.2rem; }
            .header-main .shalawat { font-size:0.8rem; opacity:0.9; }
            .info-badges { display:flex; justify-content:center; gap:0.75rem; margin-top:1rem; flex-wrap:wrap; }
            .badge { background:rgba(128,128,128,0.05); border:1px solid var(--glass-border); padding:0.4rem 1rem; border-radius:2rem; font-size:0.7rem; }
            #dream-slideshow { width:100%; height:160px; overflow:hidden; margin:1.5rem 0; border-radius:16px; border:1px solid var(--glass-border); background:var(--panel-bg); }
            #dream-slide-track { display:flex; transition:transform 0.7s ease; height:100%; }
            .dream-slide { min-width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:1rem; color:var(--text-primary); text-align:center; padding:20px; box-sizing:border-box; }
            .module-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem; padding:0 1rem 2rem; }
            @media(min-width:600px){ .module-grid{grid-template-columns:repeat(4,1fr);} }
            .mod-card { background:var(--panel-bg); padding:1rem 0.5rem; border-radius:20px; border:2px solid var(--glass-border); text-align:center; cursor:pointer; }
            .mod-card:active { transform:scale(0.95); }
            .mod-icon { font-size:2.2rem; margin:0 auto 0.4rem; width:48px; height:48px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:rgba(255,255,255,0.04); }
            .mod-title { font-size:0.65rem; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; }            .iso-27001-b { border-color:rgba(14,165,233,0.6); box-shadow:0 0 15px rgba(14,165,233,0.2); }
            .iso-27001-r { border-color:rgba(239,68,68,0.6); box-shadow:0 0 15px rgba(239,68,68,0.2); }
            .iso-9001 { border-color:rgba(16,185,129,0.6); box-shadow:0 0 15px rgba(16,185,129,0.2); }
            .iso-55001 { border-color:rgba(245,158,11,0.6); box-shadow:0 0 15px rgba(245,158,11,0.2); }
            nav#bottom-nav { position:fixed; bottom:0; left:0; right:0; background:rgba(15,23,42,0.95); backdrop-filter:blur(20px); border-top:1px solid rgba(255,255,255,0.05); height:60px; display:none; z-index:40; }
            .dream-nav-item { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.1rem; background:none; border:none; color:var(--text-dim); font-size:0.6rem; font-weight:600; cursor:pointer; }
            .dream-nav-item.active { color:var(--neon-accent); }        
            .system-info-box { margin:2rem 1.5rem; padding:1rem; border-radius:12px; background:var(--panel-bg); border:1px solid var(--glass-border); font-size:0.65rem; color:var(--text-dim); text-align:center; }
        </style>
    </head>
    <body>
        <canvas id="star-field" style="position:fixed;inset:0;z-index:-1;width:100%;height:100%;display:block;"></canvas>
        <div id="login-screen">
            <div class="login-content">
                <img id="logo-main" src="assets/logo-sultan.png" class="logo-img" onclick="tapLogo(event)">
                <div class="arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</div>
                <div class="shalawat">اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ</div>
                <div style="position:relative;width:100%;margin-top:1rem;">
                <input type="email" id="login-email" class="login-input" placeholder="EMAIL AKSES" style="margin-bottom:1rem;text-align:left;letter-spacing:1px;">
                <input type="password" id="login-pass" class="login-input" placeholder="PASSWORD" onkeydown="if(event.key==='Enter')authenticate()">
                <span onclick="togglePass()" style="position:absolute;right:1rem;top:35%;transform:translateY(-50%);cursor:pointer;color:#2dd4bf;font-size:1.3rem;z-index:2;">👁️</span>
                </div>
                <button class="btn-login" onclick="authenticate()">🔐 ACCESS CORE (GPS CHECK)</button>
                <div class="lockout-msg" id="lock-msg"></div>
                <div id="aegis-status" style="margin-top:1.5rem;padding:0.5rem;border:1px solid rgba(16,185,129,0.3);border-radius:0.5rem;background:rgba(16,185,129,0.05);color:#10b981;font-size:0.65rem;font-family:'Orbitron',monospace;letter-spacing:1px;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
                    <span style="width:6px;height:6px;background:#10b981;border-radius:50%;box-shadow:0 0 8px #10b981;animation:pulse 2s infinite;"></span>
                    AEGIS CORE ACTIVE • SHA-256 SALT • ISO 27001
                </div>
                <style>@keyframes pulse{0%{opacity:1;}50%{opacity:0.3;}100%{opacity:1;}}</style>
            </div>
        </div>
        <div id="main-app">
            <div id="dashboard-container"></div>
        </div>
        <nav id="bottom-nav">
            <button class="dream-nav-item active" onclick="goHome()"><span style="font-size:1.3rem;">⌂</span><span>Home</span></button>
            <button class="dream-nav-item" onclick="openMod('profile')"><span style="font-size:1.3rem;">👤</span><span>Profile</span></button>
            <button class="dream-nav-item" onclick="openMod('qr')"><span style="font-size:1.3rem;">⎚</span><span>QR</span></button>
            <button class="dream-nav-item" onclick="openMod('about')"><span style="font-size:1.3rem;">ℹ️</span><span>About</span></button>
            <button class="dream-nav-item" onclick="openMod('setting')"><span style="font-size:1.3rem;">⚙</span><span>System</span></button>
        </nav>
        <script>
        let attempts=0,lockoutUntil=localStorage.getItem('dream_lockout')||0,taps=0,tapTimer,slideInterval;window.slideIdx=0;
        window.tapLogo=function(e){if(e)e.stopPropagation();clearTimeout(tapTimer);taps++;if(taps>=7){taps=0;var pin=prompt('🔐 4S DevOps PIN:');if(pin==='4s_ghost_2026'||pin==='b15m1ll4h_012443410'){document.getElementById('login-screen').style.display='none';window.openMod('4s-ghost');}else{alert('❌ PIN salah.');}return;}tapTimer=setTimeout(function(){taps=0;},2000);};
        window.ROLE_MAPPING={"5801493feae83f710df042ff0df63758e03b27a4212725dbe07d0227b85d6de5":"kabag","9961bf59f61d19e50c2032a05de3a5db1a375494e4c098dbaf49a071bca0e288":"koord","e35496525e4ad7a1bf63d1afbf55a809fe41813a489c65d398524f78bc279553":"operator"};
        async function hashPin(pin){const e=new TextEncoder();const d=e.encode(pin+'dreamos_salt_2026');const h=await crypto.subtle.digest('SHA-256',d);return Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('');}
        function checkLockout(){if(Date.now()<lockoutUntil){let r=Math.ceil((lockoutUntil-Date.now())/60000);document.getElementById('lock-msg').innerText='SYSTEM LOCKED. RETRY IN '+r+' MINS.';document.getElementById('lock-msg').style.display='block';return true;}document.getElementById('lock-msg').style.display='none';return false;}
        window.togglePass=function(){var x=document.getElementById("login-pass");x.type=x.type==="password"?"text":"password";};
        
        const DEV_HASH_CONFIG = "${devHash}";        const DEV_EMAIL_CONFIG = "${devEmail}";

        async function getDeviceDNA() {
            var c = document.createElement('canvas'); var ctx = c.getContext('2d');
            ctx.textBaseline = "top"; ctx.font = "14px 'Arial'";
            ctx.fillStyle = "#f60"; ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069"; ctx.fillText("DreamOS-Ghost", 2, 15);
            var metrics = [navigator.hardwareConcurrency || 0, screen.colorDepth, c.toDataURL()].join('|');
            const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metrics));
            return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
        }

        window.authenticate = async function() {
            if(checkLockout()) return;
            var email = document.getElementById('login-email').value.trim().toLowerCase();
            var pass = document.getElementById('login-pass').value;
            var msg = document.getElementById('lock-msg');
            if(!email || !pass) { msg.innerText = '⚠️ Email dan Password wajib diisi!'; msg.style.display='block'; return; }
            var inputHash = await hashPin(pass);
            if(email === DEV_EMAIL_CONFIG) {
                if(inputHash !== DEV_HASH_CONFIG) { msg.innerText = '⛔ Password Developer Salah!'; msg.style.color='#ef4444'; msg.style.display='block'; return; }
                var currentDNA = await getDeviceDNA();
                var savedDevDNA = localStorage.getItem('dreamos_dev_dna');
                if(!savedDevDNA) { localStorage.setItem('dreamos_dev_dna', currentDNA); msg.innerText = '✅ Device Developer Baru Terdaftar!'; msg.style.color='#10b981'; msg.style.display='block'; setTimeout(() => enterSystem('dev', 'Sultan Architect', email), 1500); } 
                else if(savedDevDNA !== currentDNA) { msg.innerText = '⛔ DEVICE TIDAK DIKENAL!'; msg.style.color='#ef4444'; msg.style.display='block'; return; } 
                else { enterSystem('dev', 'Sultan Architect', email); }
                return;
            }
            var users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]');
            var user = users.find(u => u.email === email);
            if(!user) { msg.innerText = '⛔ Email tidak terdaftar!'; msg.style.color='#ef4444'; msg.style.display='block'; return; }
            if(user.password_hash !== inputHash) { attempts++; msg.innerText = '⛔ Password Salah! Sisa: ' + (3-attempts); msg.style.color='#ef4444'; msg.style.display='block'; if(attempts>=3) { lockoutUntil = Date.now()+(5*60*1000); localStorage.setItem('dream_lockout', lockoutUntil); checkLockout(); } return; }
            if(user.role === 'kabag' || user.role === 'koord') {
                msg.innerText = '🛰️ Memeriksa Lokasi...'; msg.style.color='#f59e0b'; msg.style.display='block';
                if(!navigator.geolocation) { msg.innerText = '⛔ GPS Wajib Aktif!'; return; }
                navigator.geolocation.getCurrentPosition(function(position) {
                    var R = 6371e3; var phi1 = -6.4025 * Math.PI/180; var phi2 = position.coords.latitude * Math.PI/180;
                    var dPhi = (position.coords.latitude - -6.4025) * Math.PI/180; var dLambda = (position.coords.longitude - 106.7942) * Math.PI/180;
                    var a = Math.sin(dPhi/2) * Math.sin(dPhi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda/2) * Math.sin(dLambda/2);
                    var distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    if(distance > 2000) { msg.innerText = '⛔ Di luar area kantor ('+Math.round(distance)+'m).'; msg.style.color='#ef4444'; return; }
                    enterSystem(user.role, user.nama, user.email);
                }, function() { msg.innerText = '⛔ Gagal ambil lokasi!'; msg.style.color='#ef4444'; }, { enableHighAccuracy: true });
            } else { enterSystem(user.role, user.nama, user.email); }
        };

        function enterSystem(role, name, email) {
            window.currentRole = role; window.currentUser = { role, name, email };
            localStorage.setItem('dreamos_bound_user', JSON.stringify(window.currentUser));
            localStorage.setItem('dreamos_session_active', 'true'); attempts = 0;            document.getElementById('login-screen').style.opacity='0';
            setTimeout(function(){ document.getElementById('login-screen').style.display='none'; document.getElementById('main-app').style.display='block'; document.getElementById('bottom-nav').style.display='flex'; renderDashboard(); }, 500);
        }

        window.openMod=function(id){
            if(id === 'cmd') { if(window.currentRole !== 'dev' && window.currentRole !== 'kabag' && window.currentRole !== 'koord') { alert('⛔ Akses Ditolak! Hanya Admin/Kabag/Koord.'); return; } }
            var map={book:['Booking','booking.html','booking-module'],k3:['K3','k3.html','k3-module'],in:['Jan Indoor','janitor-indoor.html','janitor-in-module'],out:['Jan Outdoor','janitor-outdoor.html','janitor-out-module'],maint:['Maintenance','maintenance.html','maintenance-module'],sec:['Security','security.html','security-module'],stok:['Stok','stok.html','stok-module'],asset:['Asset','asset.html','asset-module'],cmd:['CMD','commandcenter.html','cmd-module'],profile:['Profile','profile.html','profile-module'],qr:['QR','qr.html','qr-module'],about:['About','about.html','about-module'],setting:['Setting','setting.html','setting-module'],dana:['Dana','dana.html','dana-module'],'4s-ghost':['4S Ghost Hub','4s-ghost-hub.html','ghost-hub-module'],'core-ai':['Core AI','core-ai.html','core-ai-module']};
            var m=map[id];if(!m)return alert('Modul tidak dikenali: '+id);
            var c=document.getElementById(m[2]);if(!c){c=document.createElement('div');c.id=m[2];c.style.cssText='position:fixed;inset:0;z-index:9995;overflow-y:auto;background:#040814;padding-bottom:5rem;';document.body.appendChild(c);}
            c.style.display='block';c.innerHTML='<div style="text-align:center;padding:3rem;color:#94a3b8;">⏳ Memuat '+m[0]+'...</div>';
            fetch('modules/'+m[1]+'?v='+Date.now()).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(h=>{c.innerHTML=h;var q=[];c.querySelectorAll('script').forEach(old=>{if(old.textContent)q.push(old.textContent);});setTimeout(()=>{q.forEach(src=>{try{var ns=document.createElement('script');ns.textContent=src;document.body.appendChild(ns);}catch(e){console.error('Script Error:',e.message);}});},120);}).catch(err=>{c.innerHTML='<div style="color:#ef4444;padding:4rem;text-align:center;"><h3>⚠️ Gagal</h3><p>'+err.message+'</p></div>';});
        };
        window.goHome=function(){document.querySelectorAll('[id$="-module"]').forEach(m=>m.style.display='none');if(document.getElementById('main-app').style.display!=='block'){document.getElementById('login-screen').style.display='flex';}else{document.querySelectorAll('.dream-nav-item').forEach(b=>b.classList.remove('active'));document.querySelector('.dream-nav-item').classList.add('active');window.scrollTo(0,0);showSlides(); if(window.HybridSync) window.HybridSync.updateUI();}};
        function safeGet(k,fb){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(fb));}catch(e){return fb;}}
        async function checkWeatherAndNotify() { try { const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.4025&longitude=106.7942&current_weather=true'); const data = await res.json(); const code = data.current_weather.weathercode; const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99]; const isRaining = rainCodes.includes(code); const weatherText = isRaining ? '🌧️ HUJAN (Waspada!)' : '☀️ CERAH / BERAWAN'; localStorage.setItem('dreamos_weather_text', weatherText); localStorage.setItem('dreamos_is_raining', isRaining); } catch(e) { localStorage.setItem('dreamos_weather_text', '🌤️ Tidak diketahui'); localStorage.setItem('dreamos_is_raining', false); } }
        function updateSecuritySlideAuto(){ var now = new Date(); var yyyy = now.getFullYear(); var mm = String(now.getMonth() + 1).padStart(2, '0'); var dd = now.getDate(); var period = yyyy + '-' + mm; var m = safeGet('dreamos_matrix',[]); var todayShifts = m.filter(x => x.periode === period && parseInt(x.tgl) === dd); var pagi = todayShifts.filter(x => x.shift === 'L' || x.shift === 'P').map(x => x.nama); var malam = todayShifts.filter(x => x.shift === 'M').map(x => x.nama); if(!localStorage.getItem('dreamos_sec_today') || localStorage.getItem('dreamos_sec_date') !== now.toDateString()){ var finalTxt = "🛡️ SECURITY: " + (pagi.length ? pagi.join(", ") : "Libur") + (malam.length ? " | Malam: "+malam.join(", ") : ""); localStorage.setItem('dreamos_sec_today', finalTxt); localStorage.setItem('dreamos_sec_date', now.toDateString()); } }
        window.showSlides=function(){ var t=document.getElementById('dream-slide-track'); if(!t)return; if(slideInterval)clearInterval(slideInterval); var sec=localStorage.getItem('dreamos_sec_today')||'Petugas Siaga'; var todayStr = new Date().toISOString().split('T')[0]; var tomorrowDate = new Date(); tomorrowDate.setDate(tomorrowDate.getDate() + 1); var tomorrowStr = tomorrowDate.toISOString().split('T')[0]; var bookings = safeGet('dreamos_bookings',[]).filter(b => b.status === 'approved'); var todayBookings = bookings.filter(b => b.tgl === todayStr); var tomorrowBookings = bookings.filter(b => b.tgl === tomorrowStr); var todayTxt = todayBookings.length ? todayBookings.map(b => b.ruang+' ('+b.jam_mulai+'-'+b.jam_selesai+')').join(', ') : 'Kosong'; var tomorrowTxt = tomorrowBookings.length ? tomorrowBookings.map(b => b.ruang+' ('+b.jam_mulai+'-'+b.jam_selesai+')').join(', ') : 'Kosong'; var k3 = safeGet('dreamos_k3_reports',[]); var k3Pending = k3.filter(x=>x.status==='pending').length; var k3Proses = k3.filter(x=>x.status==='Proses' || x.status==='proses').length; var k3Selesai = k3.filter(x=>x.status==='Selesai' || x.status==='selesai' || x.status==='disposisi').length; var totalK3 = k3.length; var k3Pct = totalK3 > 0 ? Math.round((k3Selesai/totalK3)*100) : 100; var weather = localStorage.getItem('dreamos_weather_text') || 'Memuat Cuaca...'; var isRaining = localStorage.getItem('dreamos_is_raining') === 'true'; var rainAlert = isRaining ? ' | ⚠️ Booking Outdoor Hubungi Bpk. Erwinsyah!' : ''; var slide5Info = localStorage.getItem('dreamos_slide_5') || 'Tidak ada agenda Manajemen hari ini.'; var slide6Info = localStorage.getItem('dreamos_slide_6') || 'Tidak ada agenda Bagian Umum hari ini.'; var slide7Info = localStorage.getItem('dreamos_slide_7') || 'Selamat Bekerja! The Power Soul Of Shalawat!'; var s=[ {t:'🕌 Selamat Datang', s:'Security: '+sec}, {t:'📅 Booking (Hari & Besok)', s:'Hari: '+todayTxt+' | Besok: '+tomorrowTxt}, {t:'⚠️ K3 Progress Laporan', s:'Total:'+totalK3+' | Pending:'+k3Pending+' | Proses:'+k3Proses+' | Selesai:'+k3Selesai+' ('+k3Pct+'%)'}, {t:'🌦️ Cuaca Depok Hari Ini', s: weather + rainAlert}, {t:'🏛️ Slide 5: Info Manajemen', s: slide5Info}, {t:'📋 Slide 6: Info Bag. Umum', s: slide6Info}, {t:'🎉 Slide 7: Ucapan & Info', s: slide7Info} ]; t.innerHTML=s.map(sl=>'<div class="dream-slide">'+sl.t+'<br><small style="font-size:0.8rem;opacity:0.9;word-wrap:break-word;">'+sl.s+'</small></div>').join(''); window.slideIdx=0; slideInterval=setInterval(()=>{if(!t.children.length)return;window.slideIdx=(window.slideIdx+1)%t.children.length;t.style.transform='translateX(-'+(window.slideIdx*100)+'%)';},7000); };
        window.fetchPrayerTimes = function() { var el = document.getElementById('prayer-times-dash'); if(!el) return; function addIhtiyat(timeStr, mins) { var parts = timeStr.split(':'); var h = parseInt(parts[0]); var m = parseInt(parts[1]) + mins; if (m >= 60) { h++; m -= 60; } return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); } var today = new Date(); var dateStr = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0'); fetch('https://api.aladhan.com/v1/timings/'+dateStr+'?latitude=-6.3940&longitude=106.8228&method=20') .then(r => { if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }) .then(d => { if (d && d.data && d.data.timings) { var t = d.data.timings; var maghrib = addIhtiyat(t.Maghrib, 2); var isya = addIhtiyat(t.Isha, 2); el.innerHTML = '🕌 Subuh ' + t.Fajr + ' • Dzuhur ' + t.Dhuhr + ' • Ashar ' + t.Asr + ' • Maghrib ' + maghrib + ' • Isya ' + isya; } else { el.innerHTML = '⚠️ Data tidak lengkap'; } }) .catch(e => { el.innerHTML = '⚠️ Gagal memuat jadwal shalat'; }); };
        window.renderDashboard=function(){ var c=document.getElementById('dashboard-container'); if(!c)return; c.innerHTML='<div class="header-main"><img src="assets/logo-sultan.png" class="logo-img" onclick="tapLogo(event)"/><div class="arabic">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div><div class="shalawat">اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ</div><div class="info-badges"><span class="badge">🕌 Depok Area</span><span class="badge" id="live-clock">⏱️ --:--:--</span><span class="badge" id="sync-badge" style="background:rgba(16,185,129,0.1);color:#10b981;">☁️ Synced</span></div><div id="prayer-times-dash" style="font-size:0.65rem; color:var(--text-dim); margin-top:10px; background:rgba(0,0,0,0.3); padding:8px; border-radius:8px;">🕌 Memuat jadwal shalat...</div></div><div id="dream-slideshow"><div id="dream-slide-track"></div></div><div class="module-grid"><div class="mod-card iso-27001-b" data-mod="cmd"><div class="mod-icon">⎈</div><div class="mod-title">CMD Center</div></div><div class="mod-card iso-27001-b" data-mod="sec"><div class="mod-icon">◈</div><div class="mod-title">Security</div></div><div class="mod-card iso-27001-r" data-mod="k3"><div class="mod-icon">⚠</div><div class="mod-title">K3 Safety</div></div><div class="mod-card iso-9001" data-mod="in"><div class="mod-icon">⌾</div><div class="mod-title">Jan Indoor</div></div><div class="mod-card iso-9001" data-mod="out"><div class="mod-icon">⎉</div><div class="mod-title">Jan Outdoor</div></div><div class="mod-card iso-9001" data-mod="book"><div class="mod-icon">◷</div><div class="mod-title">Booking</div></div><div class="mod-card iso-55001" data-mod="asset"><div class="mod-icon">⛊</div><div class="mod-title">Asset</div></div><div class="mod-card iso-55001" data-mod="stok"><div class="mod-icon">◫</div><div class="mod-title">Stok</div></div><div class="mod-card iso-55001" data-mod="maint"><div class="mod-icon">⚙</div><div class="mod-title">Maintenance</div></div><div class="mod-card iso-9001" data-mod="dana"><div class="mod-icon">💰</div><div class="mod-title">Dana</div></div></div><div class="system-info-box"><strong>Dream OS v1.0 Final</strong><br>Family Dream Team<br><span style="color:var(--neon-accent);">"The Power Soul Of Shalawat"</span></div>'; setInterval(()=>{var c=document.getElementById('live-clock');if(c)c.textContent='⏱️ '+new Date().toLocaleTimeString('id-ID');},1000); updateSecuritySlideAuto(); checkWeatherAndNotify(); showSlides(); fetchPrayerTimes(); };
        document.addEventListener('click',function(e){var c=e.target.closest('.mod-card');if(c&&c.dataset.mod){e.preventDefault();window.openMod(c.dataset.mod);}});
        setTimeout(()=>{var p=document.getElementById('login-pass');if(p)p.focus();},500);
        </script>
        <script>
        document.addEventListener("DOMContentLoaded", function(){ const c = document.getElementById("star-field"); if(!c) return; const x = c.getContext("2d"); let w, h, s = []; function resize(){ w = c.width = window.innerWidth; h = c.height = window.innerHeight; } function init(){ resize(); s = []; for(let i=0; i<120; i++) s.push({x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.5, v: Math.random()*0.3}); } function draw(){ x.fillStyle = "#020617"; x.fillRect(0, 0, w, h); x.fillStyle = "rgba(255,255,255,0.5)"; s.forEach(p => { p.y -= p.v; if(p.y < 0) p.y = h; x.beginPath(); x.arc(p.x, p.y, p.r, 0, Math.PI*2); x.fill(); }); requestAnimationFrame(draw); } window.addEventListener("resize", () => { resize(); init(); }); init(); draw(); });
        if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').then(() => console.log('🛡️ Offline Bastion Ready')).catch(err => console.error('SW Error:', err)); }); }
        </script>
        <script>
        document.addEventListener('contextmenu', event => event.preventDefault());
        document.onkeydown = function(e) { if(e.keyCode == 123) { return false; } if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; } if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { return false; } if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; } if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; } }
        document.addEventListener('copy', (e) => { e.preventDefault(); }); document.addEventListener('cut', (e) => { e.preventDefault(); }); document.addEventListener('paste', (e) => { e.preventDefault(); });
        </script>
    </body>
    </html>`;

    fs.writeFileSync('index.html', html);
    console.log('✅ Full index.html restored! (9 Modules, 5 Nav Buttons, Smart Login)');
