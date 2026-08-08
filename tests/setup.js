// Global test setup — mock browser APIs & Dream OS globals
import { beforeEach, vi } from 'vitest';

// ===== localStorage Mock =====
const store = {};
global.localStorage = {
  getItem: vi.fn((key) => store[key] || null),
  setItem: vi.fn((key, value) => { store[key] = String(value); }),
  removeItem: vi.fn((key) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
  get length() { return Object.keys(store).length; },
  key: vi.fn((i) => Object.keys(store)[i] || null)
};

// ===== window.safeStorageSet (Dream OS custom) =====
global.window = global.window || {};
global.window.safeStorageSet = vi.fn((key, value) => {
  try {
    store[key] = String(value);
  } catch (e) {
    throw new Error('QuotaExceededError');
  }
});

// ===== window.showToast (Dream OS custom) =====
global.window.showToast = vi.fn();

// ===== window.BankAudit (Dream OS custom) =====
global.window.BankAudit = {
  log: vi.fn()
};

// ===== window.DreamOSConfig (Enterprise Config) =====
global.window.DreamOSConfig = {
  SETTINGS_SYNC_DELAY_MS: 1200,
  PHOTO_MAX_WIDTH: 800,
  PHOTO_QUALITY: 0.6,
  MAX_PHOTO_SIZE_BYTES: 10 * 1024 * 1024,
  LOG_MAX_LENGTH: 400,
  SEARCH_DEBOUNCE_MS: 300
};

// ===== window.DreamOSSecurity (XSS Sanitizer) =====
global.window.DreamOSSecurity = {
  esc: (s) => {
    if (s === null || s === undefined || s === '') return '';
    return String(s).replace(/[&<>"'`=\/]/g, (c) => 
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;','=':'&#61;','/':'&#47;'})[c]
    );
  },
  report: vi.fn()
};

// ===== window.OfflineQueue =====
global.window.OfflineQueue = {
  add: vi.fn()
};

// ===== window.supabaseClient (Mock) =====
global.window.supabaseClient = {
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user' } } } })
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
    upsert: vi.fn().mockResolvedValue({ data: [], error: null }),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
  }))
};

// ===== Reset state before each test =====
beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
  vi.clearAllMocks();
});

// ===== Helper: flush promises =====
global.flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

// ===== Helper: set localStorage data =====
global.setStore = (key, data) => {
  store[key] = JSON.stringify(data);
};

// ===== Helper: get localStorage data =====
global.getStore = (key) => {
  try { return JSON.parse(store[key] || 'null'); }
  catch { return null; }
};
