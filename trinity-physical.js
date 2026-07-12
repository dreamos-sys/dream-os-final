/**
 * 🔐 TRINITY LAYER 1: PHYSICAL SECURITY
 */
const PHYSICAL_CONFIG = {
  maxLoginAttempts: 5,
  blockDuration: 15 * 60 * 1000,
  salt: 'DREAM_OS_SALT_2026_SECURE',
  // ⚠️ GANTI DENGAN URL WORKER LO SETELAH DEPLOY!
  alertProxy: 'https://dream-os-final.pages.dev/api/security-alert'
};

// ===== DEVICE FINGERPRINT =====
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
    canvas: await getCanvasFingerprint(),
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
  } catch (e) { return 'canvas-error'; }
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
  } catch (e) { return 'webgl-error'; }
}

// ===== ENCRYPTION (AES-256-GCM + PBKDF2) =====
async function deriveKey(password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password + PHYSICAL_CONFIG.salt),
    { name: 'PBKDF2' }, false, ['deriveKey']
  );
  return await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(PHYSICAL_CONFIG.salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}

async function encryptData(data, password) {
  try {
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(data))
    );
    return {
      iv: btoa(String.fromCharCode(...iv)),
      data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    };
  } catch (e) { console.error('Encryption failed:', e); return null; }
}

async function decryptData(encryptedData, password) {
  try {
    const key = await deriveKey(password);
    const iv = new Uint8Array(atob(encryptedData.iv).split('').map(c => c.charCodeAt(0)));
    const data = new Uint8Array(atob(encryptedData.data).split('').map(c => c.charCodeAt(0)));
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (e) { console.error('Decryption failed:', e); return null; }
}

// ===== RATE LIMITING =====
function trackLoginAttempt(email, success) {
  const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{}');
  if (!attempts[email]) attempts[email] = { count: 0, lastAttempt: 0, blocked: false };
  const record = attempts[email];
  
  if (record.blocked && Date.now() - record.lastAttempt > PHYSICAL_CONFIG.blockDuration) {
    record.count = 0; record.blocked = false;
  }
  
  if (!success) {
    record.count++;
    record.lastAttempt = Date.now();
    if (record.count >= PHYSICAL_CONFIG.maxLoginAttempts) {
      record.blocked = true;
      sendSecurityAlert('LOGIN_BLOCKED', { email, attempts: record.count });
    }
  } else {
    record.count = 0; record.blocked = false;
  }
  
  localStorage.setItem('login_attempts', JSON.stringify(attempts));
  return record;
}

function isBlocked(email) {
  const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{}');
  const record = attempts[email];
  if (!record || !record.blocked) return false;
  if (Date.now() - record.lastAttempt > PHYSICAL_CONFIG.blockDuration) {
    record.blocked = false; record.count = 0;
    localStorage.setItem('login_attempts', JSON.stringify(attempts));
    return false;
  }
  return true;
}

// ===== DEVICE VALIDATION =====
async function validateDevice(email) {
  const fingerprint = await getDeviceFingerprint();
  const storedFingerprint = localStorage.getItem('device_fingerprint_' + email);
  
  if (!storedFingerprint) {
    localStorage.setItem('device_fingerprint_' + email, fingerprint);
    sendSecurityAlert('NEW_DEVICE', { email });
    return { success: true, newDevice: true };
  }
  
  if (storedFingerprint !== fingerprint) {
    sendSecurityAlert('SUSPICIOUS_DEVICE', { email });
    return { success: false, reason: 'Unknown device detected' };
  }
  
  return { success: true };
}

// ===== SECURITY ALERT (via proxy) =====
async function sendSecurityAlert(type, data) {
  try {
    await fetch(PHYSICAL_CONFIG.alertProxy, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data, timestamp: Date.now() })
    });
  } catch (e) { console.error('Alert failed:', e); }
}

// ===== EXPORT =====
window.trinityPhysical = {
  fingerprint: getDeviceFingerprint,
  encrypt: encryptData, decrypt: decryptData,
  trackLogin: trackLoginAttempt, isBlocked, validateDevice,
  sendAlert: sendSecurityAlert
};

console.log('🔐 Trinity Layer 1 (Physical): ACTIVE');
