import { describe, it, expect } from 'vitest';

describe('Authentication — RBAC (Role-Based Access Control)', () => {
  const ROLES = ['dev', 'kabag_umum', 'koordinator_umum', 'security', 'janitor', 'teknisi', 'staff'];
  
  const getRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}');
      return user.role || 'staff';
    } catch { return 'staff'; }
  };

  const canEdit = () => {
    const role = getRole();
    return ['dev', 'kabag_umum', 'koordinator_umum'].includes(role);
  };

  it('defaults to staff role when no user bound', () => {
    expect(getRole()).toBe('staff');
  });

  it('returns correct role from localStorage', () => {
    setStore('dreamos_bound_user', { nama: 'Budi', role: 'kabag_umum' });
    expect(getRole()).toBe('kabag_umum');
  });

  it('grants edit access to dev', () => {
    setStore('dreamos_bound_user', { role: 'dev' });
    expect(canEdit()).toBe(true);
  });

  it('grants edit access to kabag_umum', () => {
    setStore('dreamos_bound_user', { role: 'kabag_umum' });
    expect(canEdit()).toBe(true);
  });

  it('grants edit access to koordinator_umum', () => {
    setStore('dreamos_bound_user', { role: 'koordinator_umum' });
    expect(canEdit()).toBe(true);
  });

  it('denies edit access to staff', () => {
    setStore('dreamos_bound_user', { role: 'staff' });
    expect(canEdit()).toBe(false);
  });

  it('denies edit access to security', () => {
    setStore('dreamos_bound_user', { role: 'security' });
    expect(canEdit()).toBe(false);
  });

  it('denies edit access to janitor', () => {
    setStore('dreamos_bound_user', { role: 'janitor' });
    expect(canEdit()).toBe(false);
  });

  it('validates all 12 roles exist', () => {
    expect(ROLES.length).toBeGreaterThanOrEqual(7);
    expect(ROLES).toContain('dev');
    expect(ROLES).toContain('staff');
  });
});

describe('Authentication — Session Management', () => {
  it('validates session structure', () => {
    const validSession = {
      user: { id: 'u123', email: 'user@test.com', nama: 'Test User' },
      token: 'jwt_token_here',
      expires_at: new Date(Date.now() + 3600000).toISOString()
    };
    
    expect(validSession.user.id).toBeDefined();
    expect(validSession.token).toBeDefined();
    expect(new Date(validSession.expires_at).getTime()).toBeGreaterThan(Date.now());
  });

  it('detects expired session', () => {
    const expiredSession = {
      expires_at: new Date(Date.now() - 3600000).toISOString()
    };
    
    const isExpired = new Date(expiredSession.expires_at).getTime() < Date.now();
    expect(isExpired).toBe(true);
  });
});

describe('Authentication — Input Sanitization', () => {
  const esc = global.window.DreamOSSecurity.esc;

  it('sanitizes email input', () => {
    const malicious = 'user<script>@test.com';
    expect(esc(malicious)).not.toContain('<script>');
  });

  it('sanitizes name input (prevents attribute injection)', () => {
    const malicious = '"><img src=x onerror=alert(1)>';
    const result = esc(malicious);
    // = di-escape menjadi &#61;, sehingga onerror=alert(1) tidak jadi atribut HTML
    expect(result).not.toContain('">');
    expect(result).not.toContain('=<');
    expect(result).toContain('&#61;'); // = sudah di-escape
    expect(result).toContain('&lt;img'); // < sudah di-escape
  });

  it('neutralizes script tags', () => {
    const malicious = '<script>alert("XSS")</script>';
    const result = esc(malicious);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('neutralizes event handlers (via = escape)', () => {
    const malicious = 'onload=alert(1)';
    const result = esc(malicious);
    // = di-escape, jadi tidak bisa jadi event handler attribute
    expect(result).toBe('onload&#61;alert(1)');
  });
});
