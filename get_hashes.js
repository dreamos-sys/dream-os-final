const crypto = require('crypto');

function getHash(text) {
    // Sama seperti fungsi hashPin di aplikasi (text + 'dreamos_salt_2026')
    const hash = crypto.createHash('sha256').update(text + 'dreamos_salt_2026').digest('hex');
    return hash;
}

console.log('--- SALIN KODE INI UNTUK DIPAKAI DI INDEX.HTML ---');
console.log('Hash Kabag (4dm1n_k@b49):', getHash('4dm1n_k@b49'));
console.log('Hash Koord (4dm1n_k002d):', getHash('4dm1n_k002d'));
console.log('Hash Dev   (PIN_VERIFIED_BY_HASH):', getHash('PIN_VERIFIED_BY_HASH'));
