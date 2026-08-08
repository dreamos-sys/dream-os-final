/**
 * Dream OS Constants
 * Semua magic numbers dikumpulkan di sini untuk mudah di-tune
 */

const DreamOSConfig = {
  // === STORAGE ===
  STORAGE_LIMIT_MB: 50,           // Trigger cleanup kalau > 50MB
  LOCAL_STORAGE_MAX_BYTES: 4.5 * 1024 * 1024,  // 4.5MB safety margin
  
  // === TIMING ===
  DEBOUNCE_MS: 300,               // Debounce render/input
  THROTTLE_MS: 1000,              // Throttle API calls
  SESSION_TIMEOUT_MS: 30 * 60 * 1000,  // 30 menit
  PRESENCE_HEARTBEAT_MS: 60 * 1000,    // 1 menit
  
  // === RETENTION ===
  DATA_RETENTION_DAYS: 90,        // Laporan terpadu, log
  CACHE_RETENTION_HOURS: 24,      // Weather, prayer
  
  // === NETWORK ===
  API_TIMEOUT_MS: 15000,          // 15 detik
  MAX_RETRY: 5,                   // Retry queue
  RETRY_BASE_MS: 1000,            // Exponential backoff base
  RETRY_MAX_MS: 30000,            // Max 30 detik
  
  // === UI ===
  TOAST_DURATION_MS: 3500,
  SLIDER_AUTO_MS: 7000,
  MODAL_Z_INDEX: 99999,
  
  // === PAGINATION ===
  PAGE_SIZE: 50,
  MAX_LOG_ENTRIES: 200,
  MAX_NOTIFICATIONS: 80,
  
  // === SECURITY ===
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_MINUTES: 15,
  
  // === BUSINESS RULES ===
  BOOKING_MIN_HOURS_AHEAD: 24,    // H-1
  WORK_START_HOUR: 7.5,           // 07:30
  WORK_END_HOUR: 16,              // 16:00
  FRIDAY_PRAYER_BLOCK_START: 10.5,
  FRIDAY_PRAYER_BLOCK_END: 13
};

window.DreamOSConfig = DreamOSConfig;
