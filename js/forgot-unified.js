// ==========================================
// DREAM OS — UNIFIED FORGOT PASSWORD (v2)
// File eksternal: bebas drama escaping inline!
// ==========================================

async function dreamosForgot(){
  var el = document.getElementById('email-input');
  var em = (el && el.value) ? el.value.trim() : prompt('Email akun kamu:');
  if(!em) return;

  if(!window.Auth){
    alert('❌ Auth module belum siap — cek koneksi.');
    return;
  }

  // Step 1: Coba Supabase password reset
  var r = await Auth.requestPasswordReset(em);
  if(r.success){
    alert('✅ Email reset dikirim ke ' + em + '\nCek inbox / spam!');
    return;
  }

  // Step 2: Cek user lokal (akun lama)
  var users = [];
  try { users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]'); } catch(e){}
  var user = null;
  for (var i=0;i<users.length;i++){
    if ((users[i].email||'').toLowerCase() === em.toLowerCase()) { user = users[i]; break; }
  }

  if(user){
    showModalUpgrade(user);
  } else {
    alert('❌ Email tidak terdaftar.\nPastikan email yang dimasukkan benar.');
  }
}

function showModalUpgrade(user){
  var wrap = document.createElement('div');
  wrap.id = 'upgrade-modal';
  wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:99999;padding:1rem;';
  var card = document.createElement('div');
  card.style.cssText = 'background:rgba(15,23,42,.95);border:2px solid #00ff9d;border-radius:16px;padding:2rem;max-width:450px;width:100%;';
  card.innerHTML =
    '<h2 style="color:#00ff9d;margin:0 0 1rem 0;font-size:1.3rem;">🔄 Upgrade Akun ke Cloud</h2>' +
    '<p style="color:#94a3b8;font-size:.9rem;margin-bottom:1rem;line-height:1.5;">Akun <b style="color:#00ff9d;">' + user.email + '</b> terdaftar sebagai user lokal.<br>Buat password baru untuk upgrade ke sistem cloud:</p>' +
    '<input type="password" id="upgrade-pw" placeholder="Password baru (min 8 karakter)" style="width:100%;padding:.75rem;border:1px solid #334155;border-radius:8px;background:rgba(15,23,42,.5);color:#e2e8f0;margin-bottom:.5rem;box-sizing:border-box;">' +
    '<input type="password" id="upgrade-pw-confirm" placeholder="Konfirmasi password" style="width:100%;padding:.75rem;border:1px solid #334155;border-radius:8px;background:rgba(15,23,42,.5);color:#e2e8f0;margin-bottom:1rem;box-sizing:border-box;">' +
    '<button id="upgrade-go" style="width:100%;padding:.75rem;border:none;border-radius:8px;background:#00ff9d;color:#0d1428;font-weight:700;cursor:pointer;font-size:1rem;margin-bottom:.5rem;">🔑 Upgrade & Login</button>' +
    '<button id="upgrade-cancel" style="width:100%;padding:.5rem;border:none;border-radius:8px;background:none;color:#94a3b8;cursor:pointer;">Batal</button>';
  wrap.appendChild(card);
  document.body.appendChild(wrap);
  card.querySelector('#upgrade-go').addEventListener('click', function(){ doUpgrade(user.email); });
  card.querySelector('#upgrade-cancel').addEventListener('click', function(){ wrap.remove(); });
}

async function doUpgrade(email){
  var pw = document.getElementById('upgrade-pw').value;
  var pw2 = document.getElementById('upgrade-pw-confirm').value;

  if(pw.length < 8){ alert('❌ Password minimal 8 karakter!'); return; }
  if(pw !== pw2){ alert('❌ Password tidak cocok!'); return; }

  var r = await Auth.signUp(email, pw, { nama: email.split('@')[0], role: 'user' });
  if(!r.success){ alert('❌ ' + r.error); return; }

  var login = await Auth.login(email, pw);
  if(!login.success){ alert('❌ ' + login.error); return; }

  try {
    window.safeStorageSet('dreamos_bound_user', JSON.stringify({
      id: login.user.id,
      email: login.user.email,
      nama: (login.user.user_metadata && login.user.user_metadata.nama) || email.split('@')[0],
      role: (login.user.user_metadata && login.user.user_metadata.role) || 'user'
    }));
    window.safeStorageSet('dreamos_session_active', 'true');
  } catch(e){}

  var users = [];
  try { users = JSON.parse(localStorage.getItem('dreamos_users_db') || '[]'); } catch(e){}
  users = users.filter(function(u){ return (u.email||'').toLowerCase() !== email.toLowerCase(); });
  try { window.safeStorageSet('dreamos_users_db', JSON.stringify(users)); } catch(e){}

  var m = document.getElementById('upgrade-modal');
  if (m) m.remove();
  alert('✅ Akun di-upgrade ke cloud!\nSemua data aman. Kamu sudah login.');
  location.reload();
}
