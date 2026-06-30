import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Hapus semua definisi fungsi authenticate (lama dan override)
# Pola: window.authenticate = async function() ... sampai }; (diikuti oleh tutup fungsi)
# Kita gunakan regex yang mencari "window.authenticate = async function()" lalu apapun hingga baris yang hanya berisi "};" (atau "};" diikuti spasi)
content = re.sub(r'window\.authenticate\s*=\s*async\s*function\s*\(\)\s*\{.*?\n\s*\};', '', content, flags=re.DOTALL)

# Hapus fungsi handleLeaderGPS yang sudah tidak terpakai
content = re.sub(r'function\s+handleLeaderGPS\s*\([^)]*\)\s*\{.*?\n\s*\}', '', content, flags=re.DOTALL)

# Sekarang sisipkan fungsi login baru yang sudah disempurnakan sebelum </body>
new_login = '''
<script>
// ✅ LOGIN SYSTEM v2.0 (VIP Bypass GPS)
window.authenticate = async function() {
    var email = document.getElementById('login-email').value.trim().toLowerCase();
    var pass = document.getElementById('login-pass').value;
    var msg = document.getElementById('lock-msg');

    if (!email || !pass) {
        msg.innerText = '⚠️ Email dan Password wajib diisi!';
        msg.style.display = 'block';
        return;
    }

    // Hash password
    var encoder = new TextEncoder();
    var data = encoder.encode(pass + 'dreamos_salt_2026');
    var hashBuffer = await crypto.subtle.digest('SHA-256', data);
    var inputHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    // Whitelist VIP (Developer / Kabag / Koordinator) -> LANGSUNG MASUK TANPA GPS
    if (email === 'dreamos.sch.id@gmail.com' && inputHash === 'ec363f85aa74ef12cb507cbaaf199eeb13723b121780f0cfc257d1abb1796ece') {
        enterSystem('dev', 'Sultan Architect', email);
        return;
    }
    if (email === 'vespaexcelhijaucedar@gmail.com' && inputHash === '5801493feae83f710df042ff0df63758e03b27a4212725dbe07d0227b85d6de5') {
        enterSystem('kabag', 'Bpk. Hanung', email);
        return;
    }
    if (email === 'erwinsyah1679@gmail.com' && inputHash === '9961bf59f61d19e50c2032a05de3a5db1a375494e4c098dbaf49a071bca0e288') {
        enterSystem('koord', 'Bpk. Erwinsyah', email);
        return;
    }

    // Cek database lokal & cloud
    var users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]');
    var user = users.find(u => u.email === email && u.password_hash === inputHash);

    if (!user && navigator.onLine) {
        msg.innerText = '☁️ Mencari di database pusat...';
        msg.style.display = 'block';
        try {
            var res = await fetch(window.DREAMOS_CONFIG.supabaseUrl + '/rest/v1/users?email=eq.' + encodeURIComponent(email), {
                headers: { 'apikey': window.DREAMOS_CONFIG.supabaseKey, 'Authorization': 'Bearer ' + window.DREAMOS_CONFIG.supabaseKey }
            });
            var cloudUsers = await res.json();
            if (cloudUsers && cloudUsers.length > 0) {
                user = cloudUsers[0];
                if (!users.find(u => u.email === user.email)) {
                    users.push(user);
                    localStorage.setItem('dreamos_users_db', JSON.stringify(users));
                }
            }
        } catch(e) {}
    }

    if (!user) {
        msg.innerText = '⛔ Email atau Password salah!';
        msg.style.display = 'block';
        return;
    }

    // VIP (kabag/koord/dev dari database) tetap bebas GPS
    var isVIP = ['dev', 'kabag', 'koord'].includes(user.role);
    if (isVIP) {
        enterSystem(user.role, user.nama, user.email);
        return;
    }

    // STAFF: perlu GPS & Device Binding
    if (!navigator.geolocation) {
        msg.innerText = '⛔ HP tidak mendukung GPS!';
        msg.style.display = 'block';
        return;
    }
    navigator.geolocation.getCurrentPosition(async function(pos) {
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        var currentDNA = getDeviceDNA();
        var distance = getDistance(lat, lng, -6.411514, 106.839846);
        if (distance > 500) {
            msg.innerText = '⛔ Anda di luar area kerja (' + Math.round(distance) + 'm).';
            msg.style.display = 'block';
            return;
        }
        if (user.device_dna && user.device_dna !== currentDNA) {
            msg.innerText = '⛔ Device tidak dikenali! Hubungi Kabag.';
            msg.style.display = 'block';
            return;
        }
        if (!user.device_dna) {
            user.device_dna = currentDNA;
            var idx = users.indexOf(user);
            if (idx !== -1) {
                users[idx] = user;
                localStorage.setItem('dreamos_users_db', JSON.stringify(users));
            }
        }
        enterSystem(user.role, user.nama, user.email);
    }, function(err) {
        msg.innerText = '⛔ GPS diperlukan untuk staff.';
        msg.style.display = 'block';
    }, { enableHighAccuracy: true, timeout: 10000 });
};

// Fungsi bantu (ditaruh global)
function getDeviceDNA() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = '#069';
    ctx.fillText('DreamOS-Ghost', 2, 15);
    var metrics = [navigator.hardwareConcurrency || 0, screen.colorDepth, canvas.toDataURL()].join('|');
    return btoa(metrics).substring(0, 20);
}
function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371e3;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
<-/script>
'''

# Sisipkan sebelum </body>
content = content.replace('</body>', new_login + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Login system berhasil diperbaiki!')
