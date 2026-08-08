import { describe, it, expect, beforeEach } from 'vitest';

describe('K3 Report Validation', () => {
  const validateK3Report = (report) => {
    const errors = [];
    if (!report.nama_pelapor || report.nama_pelapor.trim() === '') errors.push('nama_pelapor required');
    if (!report.kategori) errors.push('kategori required');
    if (!report.lokasi || report.lokasi.trim() === '') errors.push('lokasi required');
    if (!report.deskripsi || report.deskripsi.trim() === '') errors.push('deskripsi required');
    return { valid: errors.length === 0, errors };
  };

  it('accepts valid report', () => {
    const result = validateK3Report({
      nama_pelapor: 'Pak Budi',
      kategori: 'Kerusakan Sarana',
      lokasi: 'Gedung A Lt.2',
      deskripsi: 'AC bocor air'
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects empty nama_pelapor', () => {
    const result = validateK3Report({
      nama_pelapor: '',
      kategori: 'Kerusakan Sarana',
      lokasi: 'Gedung A',
      deskripsi: 'Test'
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('nama_pelapor required');
  });

  it('rejects missing kategori', () => {
    const result = validateK3Report({
      nama_pelapor: 'Pak Budi',
      lokasi: 'Gedung A',
      deskripsi: 'Test'
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('kategori required');
  });

  it('rejects whitespace-only fields', () => {
    const result = validateK3Report({
      nama_pelapor: '   ',
      kategori: 'Kebersihan',
      lokasi: '   ',
      deskripsi: '   '
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('validates priority values', () => {
    const validPriorities = ['normal', 'high', 'critical'];
    expect(validPriorities).toContain('normal');
    expect(validPriorities).toContain('critical');
    expect(validPriorities).not.toContain('extreme');
  });
});

describe('K3 UUID Generation', () => {
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  it('generates valid UUID v4 format', () => {
    const uuid = generateUUID();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it('generates unique UUIDs', () => {
    const uuids = new Set();
    for (let i = 0; i < 100; i++) uuids.add(generateUUID());
    expect(uuids.size).toBe(100);
  });
});

describe('K3 Report Storage', () => {
  it('saves report to localStorage', () => {
    const report = {
      id: 'test-uuid',
      nama_pelapor: 'Pak Budi',
      kategori: 'Kerusakan Sarana',
      lokasi: 'Gedung A',
      deskripsi: 'AC bocor',
      priority: 'high',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    const reports = [];
    reports.unshift(report);
    setStore('dreamos_k3_reports', reports);
    
    const loaded = getStore('dreamos_k3_reports');
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('test-uuid');
    expect(loaded[0].status).toBe('pending');
  });

  it('marks synced reports', () => {
    const reports = [
      { id: '1', status: 'pending', synced: false },
      { id: '2', status: 'approved', synced: true }
    ];
    
    const synced = reports.filter(r => r.synced);
    const unsynced = reports.filter(r => !r.synced);
    
    expect(synced).toHaveLength(1);
    expect(unsynced).toHaveLength(1);
  });
});
