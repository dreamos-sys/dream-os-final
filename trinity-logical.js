/**
 * 🧠 TRINITY LAYER 2: LOGICAL SECURITY
 * Smart strategies untuk defense in depth
 */

// ===== HONEY POT ENDPOINT DETECTION =====
function checkHoneyPot(url) {
  const honeypots = [
    '/admin-super-secret',
    '/wp-admin',
    '/phpmyadmin',
    '/.env',
    '/backup.sql'
  ];
  
  return honeypots.some(hp => url.includes(hp));
}

// ===== BEHAVIORAL VALIDATION =====
class BehavioralValidator {
  constructor() {
    this.userPatterns = new Map();
    this.loadPatterns();
  }
  
  loadPatterns() {
    const saved = localStorage.getItem('behavioral_patterns');
    if (saved) {
      this.userPatterns = new Map(JSON.parse(saved));
    }
  }
  
  savePatterns() {
    localStorage.setItem('behavioral_patterns', JSON.stringify(Array.from(this.userPatterns.entries())));
  }
  
  recordAction(userId, action, module) {
    if (!this.userPatterns.has(userId)) {
      this.userPatterns.set(userId, { actions: [], lastSeen: Date.now() });
    }
    
    const pattern = this.userPatterns.get(userId);
    pattern.actions.push({ action, module, timestamp: Date.now() });
    pattern.lastSeen = Date.now();
    
    // Keep only last 100 actions
    if (pattern.actions.length > 100) {
      pattern.actions = pattern.actions.slice(-100);
    }
    
    this.savePatterns();
  }
  
  isAnomalous(userId, action, module) {
    const pattern = this.userPatterns.get(userId);
    if (!pattern || pattern.actions.length < 10) {
      return false; // Not enough data
    }
    
    // Check if this action is unusual for this user
    const recentActions = pattern.actions.slice(-20);
    const actionCount = recentActions.filter(a => a.action === action && a.module === module).length;
    
    // If this action appears > 50% of the time, it's normal
    // If < 10%, it's suspicious
    const ratio = actionCount / recentActions.length;
    
    if (ratio < 0.1) {
      return true; // Anomalous
    }
    
    return false;
  }
}

const behavioralValidator = new BehavioralValidator();

// ===== SMART CACHE STRATEGY =====
const CACHE_CONFIG = {
  duration: 5 * 60 * 1000, // 5 menit
  maxRetries: 3
};

async function smartCacheLoad(userId, fetchFunction) {
  const cacheKey = `smart_cache_${userId}`;
  const timestampKey = `smart_cache_timestamp_${userId}`;
  
  // Try load from cache
  const cached = localStorage.getItem(cacheKey);
  const timestamp = parseInt(localStorage.getItem(timestampKey) || '0');
  
  if (cached && Date.now() - timestamp < CACHE_CONFIG.duration) {
    console.log('⚡ Loaded from cache');
    return JSON.parse(cached);
  }
  
  // Fetch fresh data
  console.log('📡 Fetching fresh data');
  const data = await fetchFunction();
  
  // Save to cache
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(timestampKey, Date.now().toString());
  
  return data;
}

// ===== REQUEST INTERCEPTOR =====
function setupRequestInterceptor() {
  const originalFetch = window.fetch;
  
  window.fetch = async function(url, options) {
    // Check honeypot
    if (checkHoneyPot(url)) {
      console.warn('🍯 Honeypot triggered:', url);
      window.trinityPhysical?.sendAlert('HONEYPOT_TRIGGERED', { url });
      return new Response('Not Found', { status: 404 });
    }
    
    // Add security headers
    options = options || {};
    options.headers = options.headers || {};
    options.headers['X-Request-ID'] = crypto.randomUUID();
    options.headers['X-Timestamp'] = Date.now().toString();
    
    return originalFetch(url, options);
  };
}

// ===== EXPORT =====
window.trinityLogical = {
  checkHoneyPot,
  behavioralValidator,
  smartCacheLoad,
  setupRequestInterceptor
};

// Setup interceptor
setupRequestInterceptor();

console.log('🧠 Trinity Layer 2 (Logical): ACTIVE');
