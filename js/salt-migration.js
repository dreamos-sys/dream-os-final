/**
 * SALT MIGRATION HELPER
 * Detect encrypted data dengan salt lama, trigger re-encryption dengan salt baru
 */
(function() {
  'use strict';
  
  const OLD_SALT_MARKER = 'v2';  // Marker untuk data yang di-encrypt pakai salt lama
  
  window.migrateEncryptedData = async function() {
    console.log('[Migration] Checking for stale encrypted data...');
    
    let migrated = 0;
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (key.startsWith('enc_') || key.startsWith('sec_')) {
        try {
          const value = localStorage.getItem(key);
          if (!value) continue;
          
          // Try decrypt dengan salt baru
          const decrypted = await BankEncryption.decrypt(value.slice(4)); // skip 'enc_'
          
          // Re-encrypt dengan salt baru (implicit karena pakai function baru)
          if (decrypted) {
            await BankEncryption.secureSet(key.replace('enc_', ''), JSON.parse(decrypted));
            migrated++;
          }
        } catch (e) {
          // Decrypt gagal = salt lama, hapus data (user perlu re-login)
          console.warn(`[Migration] Removing stale encrypted data: ${key}`);
          localStorage.removeItem(key);
        }
      }
    }
    
    if (migrated > 0) {
      console.log(`[Migration] ✅ ${migrated} items re-encrypted with new salt`);
    } else {
      console.log('[Migration] ✅ No stale data found');
    }
    
    return migrated;
  };
  
  // Auto-run saat load
  if (window.BankEncryption) {
    setTimeout(window.migrateEncryptedData, 2000);
  }
})();
