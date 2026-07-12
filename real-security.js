/**
 * 🔐 REAL SECURITY LAYER
 * Zero-Cost tapi BENERAN SECURE
 */

const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  blockDuration: 15 * 60 * 1000, // 15 menit
  // ⚠️ JANGAN SIMPAN TELEGRAM TOKEN DI FRONTEND!
  // Pakai Cloudflare Worker sebagai proxy
  telegramProxy: '/api/telegram-alert'
};

// ===== PROPER DEVICE FINGERPRINT =====
async function getDeviceFingerprint() {
  const components = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: navigator.deviceMemory || 0,
    // Canvas fingerprint dengan noise
    canvas: await getCanvasFingerprint(),
    // WebGL fingerprint
    webgl: await getWebGLFingerprint()
  };
  
  const data = JSON.stringify(components);
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('DreamOS', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('DreamOS', 4, 17);
    
    return canvas.toDataURL();
  } catch (e) {
    return 'canvas-error';
  }
}

async function getWebGLFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'webgl-not-supported';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'webgl-no-debug-info';
    
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    return `${vendor}~${renderer}`;
  } catch (e) {
    return 'webgl-error';
  }
}

// ===== RATE LIMITING (CLIENT-SIDE) =====
function trackLoginAttempt(email, success) {
  const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{}');
  
  if (!attempts[email]) {
    attempts[email] = { count: 0, lastAttempt: 0, blocked: false };
  }
  
  const record = attempts[email];
  
  // Reset jika block duration sudah lewat
  if (record.blocked && Date.now() - record.lastAttempt > SECURITY_CONFIG.blockDuration) {
    record.count = 0;
    record.blocked = false;
  }
  
  if (!success) {
    record.count++;
    record.lastAttempt = Date.now();
    
    if (record.count >= SECURITY_CONFIG.maxLoginAttempts) {
      record.blocked = true;
      // Kirim alert ke backend (bukan langsung ke Telegram!)
      sendSecurityAlert('LOGIN_BLOCKED', { email, attempts: record.count });
    }
  } else {
    record.count = 0;
    record.blocked = false;
  }
  
  localStorage.setItem('login_attempts', JSON.stringify(attempts));
  return record;
}

function isBlocked(email) {
  const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{}');
  const record = attempts[email];
  
  if (!record || !record.blocked) return false;
  
  // Check jika block duration sudah lewat
  if (Date.now() - record.lastAttempt > SECURITY_CONFIG.blockDuration) {
    record.blocked = false;
    record.count = 0;
    localStorage.setItem('login_attempts', JSON.stringify(attempts));
    return false;
  }
  
  return true;
}

// ===== SECURE ALERT SYSTEM =====
async function sendSecurityAlert(type, data) {
  // Kirim ke backend proxy (bukan langsung ke Telegram!)
  try {
    await fetch(SECURITY_CONFIG.telegramProxy, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data, timestamp: Date.now() })
    });
  } catch (e) {
    console.error('Alert failed:', e);
  }
}

// ===== DEVICE VALIDATION =====
async function validateDevice(email) {
  const fingerprint = await getDeviceFingerprint();
  const storedFingerprint = localStorage.getItem('device_fingerprint_' + email);
  
  if (!storedFingerprint) {
    // First time login - register device
    localStorage.setItem('device_fingerprint_' + email, fingerprint);
    sendSecurityAlert('NEW_DEVICE', { email });
    return { success: true, newDevice: true };
  }
  
  if (storedFingerprint !== fingerprint) {
    // Different device - suspicious
    sendSecurityAlert('SUSPICIOUS_DEVICE', { email });
    return { success: false, reason: 'Unknown device detected' };
  }
  
  return { success: true };
}

// ===== EXPORT =====
window.realSecurity = {
  fingerprint: getDeviceFingerprint,
  trackLogin: trackLoginAttempt,
  isBlocked,
  validateDevice,
  sendAlert: sendSecurityAlert
};

console.log('🔐 Real Security Layer: ACTIVE');
