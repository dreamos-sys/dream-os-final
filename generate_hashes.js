const crypto = require('crypto');
const salt = 'dreamos_salt_2026';

function getHash(password) {
    return crypto.createHash('sha256').update(password + salt).digest('hex');
}

console.log('--------------------------------------------------');
console.log('SALIN 3 KODE DI BAWAH INI:');
console.log('1. Hash DEV   (PIN_VERIFIED_BY_HASH):');
console.log(getHash('PIN_VERIFIED_BY_HASH'));
console.log('2. Hash KABAG (4dm1n_k@b49):');
console.log(getHash('4dm1n_k@b49'));
console.log('3. Hash KOORD (4dm1n_k002d):');
console.log(getHash('4dm1n_k002d'));
console.log('--------------------------------------------------');
