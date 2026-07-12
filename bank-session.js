const BankSession={DURATION:7200000,create(u){const s={id:crypto.randomUUID(),uid:u.id,email:u.email,role:u.role,created:Date.now(),expires:Date.now()+this.DURATION,last:Date.now()};localStorage.setItem('sid',s.id);BankEncryption.secureSet('session',s);return s},
async valid(){const s=await BankEncryption.secureGet('session');if(!s||Date.now()>s.expires){this.destroy();return false}s.last=Date.now();await BankEncryption.secureSet('session',s);return true},
async refresh(){const s=await BankEncryption.secureGet('session');if(s){s.expires=Date.now()+this.DURATION;await BankEncryption.secureSet('session',s)}},
destroy(){['sid','enc_session','dreamos_bound_user','dreamos_session_active'].forEach(k=>localStorage.removeItem(k));BankEncryption.resetKey()},
logout(){this.destroy();window.location.reload()}
};window.BankSession=BankSession;
setInterval(async()=>{if(localStorage.getItem('dreamos_session_active')==='true'){const v=await BankSession.valid();if(!v)BankSession.logout()}},30000);
console.log('🏦 Session Management Ready');
