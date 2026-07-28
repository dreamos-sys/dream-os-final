(function(){
'use strict';

// coba angkat bcrypt lokal di latar (diam-diam; kalau nggak ada ya device-hash)
if(typeof bcrypt==='undefined'){
  var s=document.createElement('script'); s.src='js/bcrypt.min.js';
  s.onerror=function(){}; document.head.appendChild(s);
}

function safeUsers(){ try{return JSON.parse(localStorage.getItem('dreamos_users_db')||'[]');}catch(e){return [];} }
function saveUsers(a){ localStorage.setItem('dreamos_users_db', JSON.stringify(a)); }

// device-hash: algoritma PERSIS sama dengan yang dipakai halaman bootstrap
function deviceHash(plain){
  var h=0, str=String(plain)+'dreamos_salt_2026';
  for(var i=0;i<str.length;i++){ h=((h<<5)-h)+str.charCodeAt(i); h|=0; }
  return 'hash_'+Math.abs(h).toString(16);
}

window.verifyPassword=function(plain,stored){
  if(!plain||!stored) return false;
  var p=String(plain), h=String(stored);
  if(h.indexOf('$2a$')===0||h.indexOf('$2b$')===0||h.indexOf('$2y$')===0){
    if(typeof bcrypt!=='undefined'){ try{ return bcrypt.compareSync(p,h); }catch(e){} }
    return false;
  }
  return h===deviceHash(p);
};
window.hashPasswordBcrypt=function(plain){
  if(typeof bcrypt!=='undefined'){ try{ return bcrypt.hashSync(String(plain),10); }catch(e){} }
  return deviceHash(plain);
};

// rate-limit (anti brute-force di sisi klien)
function getFail(){ try{return JSON.parse(localStorage.getItem('dreamos_login_fails')||'{}')||{};}catch(e){return {};} }
function checkRate(){ var d=getFail(); if(Date.now()<(d.until||0)){ var s=Math.ceil((d.until-Date.now())/1000); throw new Error('🔒 Terlalu banyak percobaan. Coba lagi '+s+' detik'); } }
function recordFail(){ var d=getFail(); d.count=(Number(d.count)||0)+1; if(d.count>=5){ d.until=Date.now()+Math.min(300000,30000*Math.pow(2,Math.max(0,d.count-5))); d.count=0; } localStorage.setItem('dreamos_login_fails',JSON.stringify(d)); }
function clearFail(){ localStorage.removeItem('dreamos_login_fails'); }

// device MFA pin
window.setDeviceMfaPin=function(pin){ if(!pin||String(pin).length<4) throw new Error('PIN minimal 4 digit'); localStorage.setItem('dreamos_mfa_pin_hash',window.hashPasswordBcrypt(pin)); localStorage.setItem('dreamos_mfa_enabled','true'); return true; };
window.verifyDeviceMfaPin=function(pin){ var s=localStorage.getItem('dreamos_mfa_pin_hash'); if(!s) return true; return window.verifyPassword(pin,s); };
window.isMfaEnabled=function(){ return localStorage.getItem('dreamos_mfa_enabled')==='true' && !!localStorage.getItem('dreamos_mfa_pin_hash'); };

// AES-GCM (wajib passphrase, tanpa kunci bawaan yang lemah)
async function deriveKey(pp){ if(!pp||String(pp).length<8) throw new Error('Passphrase minimal 8 karakter'); var enc=new TextEncoder(); var m=await crypto.subtle.importKey('raw',enc.encode(pp),'PBKDF2',false,['deriveKey']); return crypto.subtle.deriveKey({name:'PBKDF2',salt:enc.encode('dreamos_aes_v2'),iterations:120000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt']); }
window.encryptSensitive=async function(pt,pp){ var k=await deriveKey(pp); var iv=crypto.getRandomValues(new Uint8Array(12)); var c=await crypto.subtle.encrypt({name:'AES-GCM',iv:iv},k,new TextEncoder().encode(String(pt))); var o=new Uint8Array(iv.length+c.byteLength); o.set(iv,0); o.set(new Uint8Array(c),iv.length); var bin=''; for(var i=0;i<o.length;i++) bin+=String.fromCharCode(o[i]); return btoa(bin); };
window.decryptSensitive=async function(b64,pp){ var k=await deriveKey(pp); var raw=Uint8Array.from(atob(b64),function(c){return c.charCodeAt(0);}); var iv=raw.slice(0,12); var d=raw.slice(12); var p=await crypto.subtle.decrypt({name:'AES-GCM',iv:iv},k,d); return new TextDecoder().decode(p); };

// sync metadata user dari Supabase (bukan password)
window.syncUserFromSupabase=function(u){ if(!u||!u.email) return null; var email=u.email.toLowerCase(); var users=safeUsers(); var i=users.findIndex(function(x){return (x.email||'').toLowerCase()===email;}); var md=u.user_metadata||{}; var row={id:u.id,email:email,nama:md.nama||email.split('@')[0],role:md.role||'staff',status:'active',source:'supabase',last_sync:new Date().toISOString()}; if(i===-1) users.push(row); else users[i]=Object.assign({},users[i],row); saveUsers(users); return row; };

// ── SATU PINTU LOGIN RESMI ──
window.doSecureLogin=async function(email,password,devicePin){
  email=String(email||'').trim().toLowerCase(); password=String(password||'');
  if(!email||!password) throw new Error('Email dan password wajib diisi');
  checkRate();
  if(window.isMfaEnabled()){ if(!devicePin) throw new Error('Device PIN wajib (MFA aktif)'); if(!window.verifyDeviceMfaPin(devicePin)){ recordFail(); throw new Error('Device PIN salah'); } }
  var users=safeUsers();
  var local=users.find(function(u){return (u.email||'').toLowerCase()===email;});
  if(local&&local.password_hash){
    if(!window.verifyPassword(password,local.password_hash)){ recordFail(); throw new Error('Password salah'); }
    if(String(local.password_hash).indexOf('$2')!==0&&typeof bcrypt!=='undefined'){ local.password_hash=window.hashPasswordBcrypt(password); var idx=users.findIndex(function(u){return (u.email||'').toLowerCase()===email;}); if(idx!==-1){users[idx]=local;saveUsers(users);} }
    clearFail();
    return {source:'local',user:{id:local.id||('local_'+email),email:local.email,nama:local.nama||email.split('@')[0],role:local.role||'staff'}};
  }
  if(window.supabaseClient&&window.supabaseClient.auth){
    try{
      var r=await window.supabaseClient.auth.signInWithPassword({email:email,password:password});
      if(r.error) throw r.error;
      var meta=window.syncUserFromSupabase(r.data.user); clearFail();
      return {source:'supabase',user:{id:r.data.user.id,email:r.data.user.email,nama:meta.nama,role:meta.role},session:r.data.session};
    }catch(e){ recordFail(); throw new Error(e.message||'Login gagal'); }
  }
  recordFail();
  throw new Error('User tidak ditemukan. Seed admin dulu atau daftar di Supabase.');
};
window.authenticateHybrid=window.doSecureLogin;
console.log('[Auth] security layer siap (bcrypt opsional, device-hash cadangan)');
})();
