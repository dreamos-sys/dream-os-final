const BankEncryption={_key:null,async getKey(){if(this._key)return this._key;const u=JSON.parse(localStorage.getItem('dreamos_bound_user')||'{}');const m=new TextEncoder();const k=await crypto.subtle.importKey('raw',m.encode((u.id||'system')+'-dreamos-bank'),{name:'PBKDF2'},false,['deriveKey']);this._key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:m.encode('bank-salt-v3'),iterations:200000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);return this._key},
async enc(p){const k=await this.getKey();const iv=crypto.getRandomValues(new Uint8Array(12));const c=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,new TextEncoder().encode(p));const r=new Uint8Array(iv.length+c.byteLength);r.set(iv);r.set(new Uint8Array(c),iv.length);return btoa(String.fromCharCode(...r))},
async dec(d){const k=await this.getKey();const r=new Uint8Array(atob(d).split('').map(c=>c.charCodeAt(0)));const iv=r.slice(0,12);const c=r.slice(12);const p=await crypto.subtle.decrypt({name:'AES-GCM',iv},k,c);return new TextDecoder().decode(p)},
async secureSet(k,v){localStorage.setItem('enc_'+k,await this.enc(JSON.stringify(v)))},
async secureGet(k){const d=localStorage.getItem('enc_'+k);if(!d)return null;try{return JSON.parse(await this.dec(d))}catch(e){return null}},
resetKey(){this._key=null}
};window.BankEncryption=BankEncryption;console.log('🏦 AES-256-GCM Ready');
