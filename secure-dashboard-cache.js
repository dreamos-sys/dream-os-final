/**
 * ⚡ SECURE DASHBOARD CACHE
 * Pakai per-user encryption key (bukan hardcoded!)
 */

const CACHE_CONFIG = {
  duration: 5 * 60 * 1000 // 5 menit
};

// ===== PER-USER ENCRYPTION KEY =====
async function getUserEncryptionKey(userId) {
  // Generate key berdasarkan user ID + device fingerprint
  const fingerprint = await window.realSecurity.fingerprint();
  const keyMaterial = userId + fingerprint + 'DREAM_OS_SALT_2026';
  
  const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(keyMaterial));
  const keyBytes = new Uint8Array(keyHash);
  
  return await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

// ===== ENCRYPT CACHE =====
async function encryptCacheData(data, userId) {
  try {
    const key = await getUserEncryptionKey(userId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );
    
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
      userId // Untuk validasi
    };
  } catch (e) {
    console.error('Encryption failed:', e);
    return null;
  }
}

// ===== DECRYPT CACHE =====
async function decryptCacheData(encrypted, userId) {
  try {
    // Validasi userId
    if (encrypted.userId !== userId) {
      console.warn('Cache userId mismatch');
      return null;
    }
    
    const key = await getUserEncryptionKey(userId);
    const iv = new Uint8Array(encrypted.iv);
    const data = new Uint8Array(encrypted.data);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (e) {
    console.error('Decryption failed:', e);
    return null;
  }
}

// ===== CACHE OPERATIONS =====
async function cacheDashboardData(data, userId) {
  try {
    const encrypted = await encryptCacheData(data, userId);
    if (!encrypted) return;
    
    localStorage.setItem('dashboard_cache', JSON.stringify(encrypted));
    localStorage.setItem('cache_timestamp', Date.now().toString());
  } catch (e) {
    console.error('Cache save failed:', e);
  }
}

async function loadDashboardFromCache(userId) {
  try {
    const timestamp = parseInt(localStorage.getItem('cache_timestamp') || '0');
    if (Date.now() - timestamp > CACHE_CONFIG.duration) {
      return null; // Cache expired
    }
    
    const encrypted = localStorage.getItem('dashboard_cache');
    if (!encrypted) return null;
    
    return await decryptCacheData(JSON.parse(encrypted), userId);
  } catch (e) {
    console.error('Cache load failed:', e);
    return null;
  }
}

// ===== SMART DASHBOARD LOAD =====
async function smartDashboardLoad(userId) {
  // Try load from cache first
  const cached = await loadDashboardFromCache(userId);
  
  if (cached) {
    console.log('⚡ Dashboard loaded from cache');
    renderDashboardWithData(cached);
    
    // Update cache in background
    fetchDashboardData().then(fresh => {
      cacheDashboardData(fresh, userId);
      renderDashboardWithData(fresh);
    });
  } else {
    console.log('📡 Dashboard loaded from server');
    const data = await fetchDashboardData();
    await cacheDashboardData(data, userId);
    renderDashboardWithData(data);
  }
}

// ===== EXPORT =====
window.secureDashboardCache = {
  save: cacheDashboardData,
  load: loadDashboardFromCache,
  smartLoad: smartDashboardLoad
};

console.log('⚡ Secure Dashboard Cache: READY');
