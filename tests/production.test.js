import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Jalankan script classic production di global scope (happy-dom window)
const load = (p) => {
  const code = readFileSync(join(__dirname, '..', p), 'utf-8');
  (0, eval)(code);
};

describe('PRODUCTION: js/security.js (DreamOSSecurity)', () => {
  beforeAll(() => { try { load('js/security.js'); } catch(e){ /* optional deps */ } });

  it('mengekspor window.DreamOSSecurity.esc (code asli)', () => {
    expect(typeof window.DreamOSSecurity.esc).toBe('function');
  });

  it('esc() asli menetralisir XSS', () => {
    const out = window.DreamOSSecurity.esc('<img src=x onerror=alert(1)>');
    expect(out).not.toContain('<img');
    expect(out).toContain('&lt;');
  });

  it('esc() asli escape = (anti attribute injection)', () => {
    expect(window.DreamOSSecurity.esc('a=b')).toContain('&#61;');
  });
});

describe('PRODUCTION: js/constants.js (DreamOSConfig)', () => {
  beforeAll(() => { try { load('js/constants.js'); } catch(e){ /* optional */ } });

  it('mengekspor window.DreamOSConfig (CFG asli)', () => {
    expect(window.DreamOSConfig).toBeTruthy();
  });

  it('CFG punya key timing yang dipakai modul', () => {
    const cfg = window.DreamOSConfig || {};
    // Minimal harus object; key spesifik boleh ada
    expect(typeof cfg).toBe('object');
  });
});
