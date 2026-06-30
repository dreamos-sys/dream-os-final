// ========== SECURE CONFIG (ENCRYPTED) ==========
// PIN disimpan dalam bentuk hash, tidak plaintext
const SECURE_CONFIG = (function() {
    // Hash PIN yang valid (SHA-256 dari PIN + salt)
    const VALID_HASHES = {
        dev: 'ec363f85aa74ef12cb507cbaaf199eeb13723b121780f0cfc257d1abb1796ece',
        kabag: '5801493feae83f710df042ff0df63758e03b27a4212725dbe07d0227b85d6de5',
        koord: '9961bf59f61d19e50c2032a05de3a5db1a375494e4c098dbaf49a071bca0e288'
    };
    
    // Salt untuk hashing
    const SALT = 'dreamos_enterprise_salt_2026';
    
    return {
        VALID_HASHES,
        SALT,
        // Fungsi untuk verifikasi PIN
        verifyPin: async function(pin, role) {
            const encoder = new TextEncoder();
            const data = encoder.encode(pin + this.SALT);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hash = Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            return hash === this.VALID_HASHES[role];
        }
    };
})();
