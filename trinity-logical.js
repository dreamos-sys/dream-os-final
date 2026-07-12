/**
 * 🧠 TRINITY LAYER 2: LOGICAL SECURITY
 */

// ===== HONEY POT DETECTION =====
function checkHoneyPot(url) {
  const honeypots = ['/admin-super-secret', '/wp-admin', '/phpmyadmin', '/.env', '/backup.sql'];
  return honeypots.some(hp => url.includes(hp));
}

// ===== BEHAVIORAL VALIDATOR =====
class BehavioralValidator {
  constructor() {
    this.userPatterns = new Map();
    this.loadPatterns();
  }
  
  loadPatterns() {
    try {
      const saved = localStorage.getItem('behavioral_patterns');
      if (saved) this.userPatterns = new Map(JSON.parse(saved));
    } catch (e) { this.userPatterns = new Map(); }
  }
  
  savePatterns() {
    try {
      localStorage.setItem('behavioral_patterns', JSON.stringify(Array.from(this.userPatterns.entries())));
    } catch (e) { console.error('Save patterns failed:', e); }
  }
  
  recordAction(userId, action, module) {
    if (!this.userPatterns.has(userId)) {
      this.userPatterns.set(userId, { actions: [], lastSeen: Date.now() });
    }
    const pattern = this.userPatterns.get(userId);
    pattern.actions.push({ action, module, timestamp: Date.now() });
    pattern.lastSeen = Date.now();
    if (pattern.actions.length > 100) pattern.actions = pattern.actions.slice(-100);
    this.savePatterns();
  }
  
  isAnomalous(userId, action, module) {
    const pattern = this.userPatterns.get(userId);
    if (!pattern || pattern.actions.length < 10) return false;
    const recentActions = pattern.actions.slice(-20);
    const actionCount = recentActions.filter(a => a.action === action && a.module === module).length;
    const ratio = actionCount / recentActions.length;
    return ratio < 0.1;
  }
}

// ===== SMART CACHE (NO FETCH OVERRIDE!) =====
const CACHE_CONFIG = { duration: 5 * 60 * 1000 };

async function smartCacheLoad(userId, fetchFunction) {
  const cacheKey = `smart_cache_${userId}`;
  const timestampKey = `smart_cache_timestamp_${userId}`;
  const cached = localStorage.getItem(cacheKey);
  const timestamp = parseInt(localStorage.getItem(timestampKey) || '0');
  
  if (cached && Date.now() - timestamp < CACHE_CONFIG.duration) {
    console.log('⚡ Loaded from cache');
    return JSON.parse(cached);
  }
  
  console.log('📡 Fetching fresh data');
  const data = await fetchFunction();
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(timestampKey, Date.now().toString());
  return data;
}

// ===== EXPORT (NO FETCH OVERRIDE!) =====
window.trinityLogical = {
  checkHoneyPot,
  behavioralValidator: new BehavioralValidator(),
  smartCacheLoad
};

console.log('🧠 Trinity Layer 2 (Logical): ACTIVE');
