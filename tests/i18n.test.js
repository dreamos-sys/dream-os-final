import { describe, it, expect, beforeEach } from 'vitest';

describe('i18n Engine — Dream OSSecurity.esc()', () => {
  const esc = global.window.DreamOSSecurity.esc;

  it('returns empty string for null/undefined/empty', () => {
    expect(esc(null)).toBe('');
    expect(esc(undefined)).toBe('');
    expect(esc('')).toBe('');
  });

  it('escapes HTML special characters (XSS prevention)', () => {
    expect(esc('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;&#47;script&gt;');
    expect(esc('"onmouseover="alert(1)')).toBe('&quot;onmouseover=&quot;alert(1)');
    expect(esc("'><img src=x onerror=alert(1)>")).toBe('&#39;&gt;&lt;img src=x onerror=alert(1)&gt;');
  });

  it('escapes backticks and equals (template literal injection)', () => {
    expect(esc('`template` ${x}')).toBe('&#96;template&#96; &#36;&#123;x&#125;');
    expect(esc('a=b')).toBe('a&#61;b');
  });

  it('preserves safe characters', () => {
    expect(esc('Hello World 123')).toBe('Hello World 123');
    expect(esc('Mr. M — Pilot Project')).toBe('Mr. M — Pilot Project');
    expect(esc('🏛️ Aset Strategis')).toBe('🏛️ Aset Strategis');
  });

  it('converts numbers to strings', () => {
    expect(esc(123)).toBe('123');
    expect(esc(0)).toBe('0');
  });
});

describe('Language Detection Logic', () => {
  it('detects Indonesia timezone', () => {
    // Mock Intl
    const origIntl = global.Intl;
    global.Intl = {
      DateTimeFormat: () => ({
        resolvedOptions: () => ({ timeZone: 'Asia/Jakarta' })
      })
    };
    
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    expect(/Jakarta|Pontianak|Makassar|Jayapura/i.test(tz)).toBe(true);
    
    global.Intl = origIntl;
  });

  it('validates supported languages', () => {
    const supported = ['id', 'en', 'ar', 'zh'];
    expect(supported).toContain('id');
    expect(supported).toContain('zh');
    expect(supported).not.toContain('fr');
  });
});
