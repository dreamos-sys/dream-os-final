const fs = require('fs');

    // --- KONFIGURASI KEAMANAN ---
    // GANTI "MASUKKAN_HASH_DEV_DISINI" DENGAN KODE HASH PANJANG LO!
    const DEV_HASH = "MASUKKAN_HASH_DEV_DISINI"; 
    const DEV_EMAIL = "dreamos.sch.id@gmail.com";

    const htmlContent = `<!DOCTYPE html>
    <html lang="id" data-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dream OS • Smart Login</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
            body { margin:0; background:#020617; color:#e2e8f0; font-family:'Inter',sans-serif; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; }
            .login-box { width:90%; max-width:400px; padding:2rem; background:#1e293b; border-radius:1rem; border:1px solid #334155; text-align:center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            input { width:100%; padding:1rem; margin-bottom:1rem; background:#0f172a; border:1px solid #334155; border-radius:0.5rem; color:#fff; box-sizing:border-box; font-size:1rem; outline:none; }
            input:focus { border-color: #0ea5e9; }
            button { width:100%; padding:1rem; background:#0ea5e9; color:#fff; border:none; border-radius:0.5rem; font-weight:700; font-size:1.1rem; cursor:pointer; transition:0.2s; }
            button:active { transform:scale(0.98); }
            #msg { color:#ef4444; font-size:0.8rem; margin-top:10px; min-height:1.2rem; }
            #dashboard { display:none; width:100%; height:100vh; padding:2rem; box-sizing:border-box; text-align:center; background:#020617; }
            .grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:2rem; }
        </style>
    </head>
    <body>

        <div id="login-screen" class="login-box">
            <h2 style="color:#0ea5e9; margin-bottom:0.5rem;">🕌 Dream OS</h2>
            <p style="color:#94a3b8; font-size:0.8rem; margin-bottom:1.5rem;">Smart Cognitive Facility System</p>
            <input type="email" id="email" placeholder="Email Akses (Gmail)">
            <div style="position:relative;">
                <input type="password" id="pass" placeholder="Password" style="margin-bottom:0;">
                <span onclick="togglePass()" style="position:absolute;right:1rem;top:1.2rem;cursor:pointer;color:#94a3b8;">👁️</span>
            </div>
            <br><br>
            <button onclick="authenticate()">🔐 MASUK SISTEM</button>
            <div id="msg"></div>
        </div>

        <div id="dashboard">
            <h1 id="welcome-text" style="color:#0ea5e9;">Selamat Datang!</h1>
            <p style="color:#94a3b8;">Role: <span id="role-text" style="color:#fff; font-weight:bold;">-</span></p>
            
            <div class="grid">
                <button onclick="openCmd()" style="background:#8b5cf6;">⎈ Command Center</button>
                <button onclick="logout()" style="background:#ef4444;">🚪 Logout</button>
            </div>
            <p style="margin-top:2rem; font-size:0.7rem; color:#64748b;">Sistem Aman • Device Bound • GPS Active</p>        </div>

        <script>
        const DEV_HASH_CONFIG = "${DEV_HASH}";
        const DEV_EMAIL_CONFIG = "${DEV_EMAIL}";

        async function hashPin(pin){
            const e = new TextEncoder();
            const d = e.encode(pin + 'dreamos_salt_2026');
            const h = await crypto.subtle.digest('SHA-256', d);
            return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('');
        }

        async function getDeviceDNA() {
            var c = document.createElement('canvas'); var ctx = c.getContext('2d');
            ctx.textBaseline = "top"; ctx.font = "14px 'Arial'";
            ctx.fillStyle = "#f60"; ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069"; ctx.fillText("DreamOS-Ghost", 2, 15);
            var metrics = [navigator.hardwareConcurrency || 0, screen.colorDepth, c.toDataURL()].join('|');
            const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metrics));
            return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
        }

        window.togglePass = function(){
            var x = document.getElementById("pass");
            x.type = x.type === "password" ? "text" : "password";
        }

        window.authenticate = async function() {
            var email = document.getElementById('email').value.trim().toLowerCase();
            var pass = document.getElementById('pass').value;
            var msg = document.getElementById('msg');
            msg.innerText = "Memproses..."; msg.style.color = "#f59e0b";

            if(!email || !pass) { msg.innerText = "⚠️ Email dan Password wajib diisi!"; return; }

            var inputHash = await hashPin(pass);

            // 1. CEK DEVELOPER (SULTAN)
            if(email === DEV_EMAIL_CONFIG) {
                if(inputHash !== DEV_HASH_CONFIG) { msg.innerText = "⛔ Password Developer Salah!"; return; }
                
                var currentDNA = await getDeviceDNA();
                var savedDevDNA = localStorage.getItem('dreamos_dev_dna');
                
                if(!savedDevDNA) {
                    localStorage.setItem('dreamos_dev_dna', currentDNA);
                    msg.innerText = "✅ Device Baru Terdaftar! Akses Penuh Diberikan.";
                    setTimeout(() => loginSuccess('dev', 'Sultan Architect'), 1000);
                } else if(savedDevDNA !== currentDNA) {                    msg.innerText = "⛔ DEVICE TIDAK DIKENAL! Akses Developer hanya untuk HP Somay.";
                } else {
                    loginSuccess('dev', 'Sultan Architect');
                }
                return;
            }

            // 2. CEK DATABASE USER
            var users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]');
            var user = users.find(u => u.email === email);

            if(!user) { msg.innerText = "⛔ Email tidak terdaftar! Hubungi Admin."; return; }
            if(user.password_hash !== inputHash) { msg.innerText = "⛔ Password Salah!"; return; }

            // 3. CEK GPS KHUSUS KABAG & KOORD
            if(user.role === 'kabag' || user.role === 'koord') {
                msg.innerText = "🛰️ Memeriksa Lokasi Kantor...";
                if(!navigator.geolocation) { msg.innerText = "⛔ GPS Wajib Aktif!"; return; }

                navigator.geolocation.getCurrentPosition(function(pos) {
                    var R = 6371e3; var phi1 = -6.4025 * Math.PI/180; var phi2 = pos.coords.latitude * Math.PI/180;
                    var dPhi = (pos.coords.latitude - -6.4025) * Math.PI/180; 
                    var dLambda = (pos.coords.longitude - 106.7942) * Math.PI/180;
                    var a = Math.sin(dPhi/2) * Math.sin(dPhi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda/2) * Math.sin(dLambda/2);
                    var distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                    if(distance > 2000) { 
                        msg.innerText = "⛔ GAGAL! Di luar area kantor ("+Math.round(distance)+"m)."; 
                    } else {
                        loginSuccess(user.role, user.nama);
                    }
                }, function() { msg.innerText = "⛔ Gagal mengambil lokasi!"; }, { enableHighAccuracy: true });
            } else {
                loginSuccess(user.role, user.nama);
            }
        };

        function loginSuccess(role, name) {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('welcome-text').innerText = "Selamat Datang, " + name;
            document.getElementById('role-text').innerText = role.toUpperCase();
            localStorage.setItem('dreamos_current_user', JSON.stringify({role, name}));
        }

        window.openCmd = function() {
            var user = JSON.parse(localStorage.getItem('dreamos_current_user'));
            if(user && (user.role === 'dev' || user.role === 'kabag' || user.role === 'koord')) {
                window.location.href = 'modules/commandcenter.html';
            } else {                alert("⛔ Akses Ditolak! Hanya Admin/Kabag/Koord.");
            }
        };

        window.logout = function() {
            localStorage.removeItem('dreamos_current_user');
            location.reload();
        };
        </script>
    </body>
    </html>`;

    fs.writeFileSync('index.html', htmlContent);
    console.log('✅ index.html berhasil dibuat dengan sistem Smart Login!');
