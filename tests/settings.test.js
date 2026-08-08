import { describe, it, expect, beforeEach } from 'vitest';

describe('Settings State Management', () => {
  const DEFAULTS = {
    theme: 'dark',
    fontSize: 100,
    highContrast: false,
    reduceMotion: false,
    starfield: true,
    glassIntensity: 85,
    lang: 'id',
    autoDetect: false,
    devMode: false,
    autoSave: true
  };

  it('loads defaults when no saved settings', () => {
    const saved = JSON.parse(localStorage.getItem('dreamos_settings') || '{}');
    const state = {};
    Object.keys(DEFAULTS).forEach(k => state[k] = saved[k] !== undefined ? saved[k] : DEFAULTS[k]);
    
    expect(state.theme).toBe('dark');
    expect(state.fontSize).toBe(100);
    expect(state.highContrast).toBe(false);
    expect(state.lang).toBe('id');
  });

  it('merges saved settings with defaults', () => {
    setStore('dreamos_settings', { theme: 'light', fontSize: 120 });
    
    const saved = JSON.parse(localStorage.getItem('dreamos_settings') || '{}');
    const state = {};
    Object.keys(DEFAULTS).forEach(k => state[k] = saved[k] !== undefined ? saved[k] : DEFAULTS[k]);
    
    expect(state.theme).toBe('light');
    expect(state.fontSize).toBe(120);
    expect(state.starfield).toBe(true); // default
    expect(state.lang).toBe('id'); // default
  });

  it('handles corrupted JSON gracefully', () => {
    localStorage.getItem.mockReturnValueOnce('not valid json {');
    
    let state;
    try {
      const saved = JSON.parse(localStorage.getItem('dreamos_settings') || '{}');
      state = {};
      Object.keys(DEFAULTS).forEach(k => state[k] = saved[k] !== undefined ? saved[k] : DEFAULTS[k]);
    } catch(e) {
      state = JSON.parse(JSON.stringify(DEFAULTS));
    }
    
    expect(state.theme).toBe('dark');
  });

  it('toggles theme between dark and light', () => {
    let state = { ...DEFAULTS };
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    expect(state.theme).toBe('light');
    
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    expect(state.theme).toBe('dark');
  });

  it('validates fontSize bounds (80-140%)', () => {
    const validateFontSize = (val) => Math.max(80, Math.min(140, parseInt(val)));
    
    expect(validateFontSize(100)).toBe(100);
    expect(validateFontSize(50)).toBe(80);
    expect(validateFontSize(200)).toBe(140);
    expect(validateFontSize('abc')).toBe(80);
  });

  it('validates glassIntensity bounds (30-100%)', () => {
    const validateGlass = (val) => Math.max(30, Math.min(100, parseInt(val)));
    
    expect(validateGlass(85)).toBe(85);
    expect(validateGlass(10)).toBe(30);
    expect(validateGlass(150)).toBe(100);
  });

  it('computes correct alpha for glass panel', () => {
    const computeAlpha = (intensity) => (intensity / 100).toFixed(2);
    
    expect(computeAlpha(85)).toBe('0.85');
    expect(computeAlpha(50)).toBe('0.50');
    expect(computeAlpha(100)).toBe('1.00');
    expect(computeAlpha(30)).toBe('0.30');
  });
});

describe('Settings Export/Import', () => {
  const DEFAULTS = { theme: 'dark', fontSize: 100, lang: 'id' };
  
  it('exports settings as JSON', () => {
    const state = { theme: 'light', fontSize: 120, lang: 'en' };
    const jsonStr = JSON.stringify(state, null, 2);
    
    expect(jsonStr).toContain('"theme": "light"');
    expect(jsonStr).toContain('"fontSize": 120');
    
    // Re-parse to validate
    const parsed = JSON.parse(jsonStr);
    expect(parsed.theme).toBe('light');
  });

  it('imports settings safely (ignores unknown keys)', () => {
    const imported = { theme: 'light', fontSize: 110, malicious: 'bad', __proto__: { x: 1 } };
    const state = {};
    Object.keys(DEFAULTS).forEach(k => {
      if (imported[k] !== undefined) state[k] = imported[k];
    });
    
    expect(state.theme).toBe('light');
    expect(state.fontSize).toBe(110);
    expect(state.malicious).toBeUndefined();
  });
});
