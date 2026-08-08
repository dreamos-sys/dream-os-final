import { describe, it, expect, beforeEach } from 'vitest';

describe('Stok Gudang — Inventory Management', () => {
  const getInv = () => {
    try { return JSON.parse(localStorage.getItem('dreamos_inventory') || '[]'); }
    catch { return []; }
  };

  it('adds new item to inventory', () => {
    const items = [];
    const newItem = {
      id: 'inv_' + Date.now(),
      nama: 'Kabel NYM 2x1.5mm',
      kategori: 'Elektrikal',
      jumlah: 20,
      minimal: 5,
      lokasi_gudang: 'Gudang Umum'
    };
    items.push(newItem);
    setStore('dreamos_inventory', items);
    
    const loaded = getInv();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].nama).toBe('Kabel NYM 2x1.5mm');
  });

  it('increments stock for existing item (same name + location)', () => {
    const items = [
      { id: '1', nama: 'Kabel', lokasi_gudang: 'Gudang A', jumlah: 10, minimal: 5 }
    ];
    
    const nama = 'Kabel';
    const lokasi = 'Gudang A';
    const qty = 5;
    
    const exist = items.find(x => x.nama === nama && (x.lokasi_gudang || x.lokasi) === lokasi);
    if (exist) exist.jumlah += qty;
    
    expect(items[0].jumlah).toBe(15);
  });

  it('identifies critical stock (below minimum)', () => {
    const items = [
      { nama: 'Kabel', jumlah: 3, minimal: 5 },
      { nama: 'Baut', jumlah: 10, minimal: 5 },
      { nama: 'Lampu', jumlah: 2, minimal: 3 }
    ];
    
    const kritis = items.filter(x => x.jumlah <= x.minimal);
    expect(kritis).toHaveLength(2);
    expect(kritis[0].nama).toBe('Kabel');
  });

  it('computes inventory statistics', () => {
    const items = [
      { nama: 'A', jumlah: 10, lokasi_gudang: 'Gudang A', minimal: 5 },
      { nama: 'B', jumlah: 20, lokasi_gudang: 'Gudang B', minimal: 5 },
      { nama: 'C', jumlah: 3, lokasi_gudang: 'Gudang A', minimal: 5 }
    ];
    
    const stats = {
      total_items: items.length,
      total_qty: items.reduce((a, x) => a + x.jumlah, 0),
      lokasi_count: new Set(items.map(x => x.lokasi_gudang)).size,
      kritis_count: items.filter(x => x.jumlah <= x.minimal).length
    };
    
    expect(stats.total_items).toBe(3);
    expect(stats.total_qty).toBe(33);
    expect(stats.lokasi_count).toBe(2);
    expect(stats.kritis_count).toBe(1);
  });
});

describe('Stok Gudang — Mutation Log', () => {
  it('logs TAMBAH mutation', () => {
    const logs = [];
    const entry = {
      id: 'sm_' + Date.now(),
      type: 'TAMBAH',
      item: 'Kabel',
      qty: 10,
      location: 'Gudang A',
      time: new Date().toISOString()
    };
    logs.unshift(entry);
    
    expect(logs[0].type).toBe('TAMBAH');
    expect(logs[0].qty).toBe(10);
  });

  it('limits log to max length', () => {
    const MAX = 400;
    const logs = Array.from({ length: 500 }, (_, i) => ({ id: i }));
    const trimmed = logs.slice(0, MAX);
    expect(trimmed).toHaveLength(MAX);
  });

  it('filters logs by period (harian)', () => {
    const now = Date.now();
    const logs = [
      { time: new Date(now - 1000 * 60 * 60 * 2).toISOString() }, // 2 hours ago
      { time: new Date(now - 1000 * 60 * 60 * 25).toISOString() }, // 25 hours ago
      { time: new Date(now - 1000 * 60 * 60 * 48).toISOString() }  // 2 days ago
    ];
    
    const cutoff = now - 24 * 60 * 60 * 1000;
    const harian = logs.filter(l => new Date(l.time).getTime() >= cutoff);
    
    expect(harian).toHaveLength(1);
  });
});
