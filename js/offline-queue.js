/**
 * Dream OS Offline Queue
 * - Exponential backoff
 * - Dead letter queue
 * - Auto-sync saat online
 */

const DreamOSQueue = (function() {
  'use strict';
  
  const QUEUE_KEY = 'dreamos_offline_queue';
  const DEAD_LETTER_KEY = 'dreamos_dead_letter';
  const CFG = window.DreamOSConfig || {};
  
  function load() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); }
    catch(e) { return []; }
  }
  
  function save(q) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); }
    catch(e) { console.warn('[Queue] save failed'); }
  }
  
  // Add operation ke queue
  function push(table, op, data, opts) {
    const queue = load();
    queue.push({
      id: 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      table: table,
      op: op,           // 'insert', 'update', 'upsert', 'delete'
      data: data,
      opts: opts || {},
      retries: 0,
      created_at: new Date().toISOString(),
      next_try: Date.now()
    });
    save(queue);
    
    // Trigger flush kalau online
    if (navigator.onLine) {
      setTimeout(flush, 100);
    }
  }
  
  // Flush queue (process semua yang ready)
  async function flush() {
    if (!navigator.onLine || !window.supabaseClient) return 0;
    
    const queue = load();
    const now = Date.now();
    const ready = queue.filter(item => item.next_try <= now);
    const remaining = queue.filter(item => item.next_try > now);
    
    let success = 0;
    for (const item of ready) {
      try {
        await executeOp(item);
        success++;
      } catch (err) {
        item.retries++;
        if (item.retries >= (CFG.MAX_RETRY || 5)) {
          // Move to dead letter
          moveToDeadLetter(item, err);
        } else {
          // Exponential backoff
          const base = CFG.RETRY_BASE_MS || 1000;
          const max = CFG.RETRY_MAX_MS || 30000;
          const delay = Math.min(base * Math.pow(2, item.retries), max);
          item.next_try = now + delay;
          remaining.push(item);
        }
      }
    }
    
    save(remaining);
    return success;
  }
  
  async function executeOp(item) {
    const client = window.supabaseClient;
    let query = client.from(item.table);
    
    switch(item.op) {
      case 'insert':
        return await query.insert(item.data);
      case 'update':
        return await query.update(item.data).match(item.opts.match || { id: item.data.id });
      case 'upsert':
        return await query.upsert(item.data, { onConflict: item.opts.onConflict || 'id' });
      case 'delete':
        return await query.delete().match(item.opts.match || { id: item.data.id });
      default:
        throw new Error('Unknown operation: ' + item.op);
    }
  }
  
  function moveToDeadLetter(item, err) {
    try {
      const dl = JSON.parse(localStorage.getItem(DEAD_LETTER_KEY) || '[]');
      dl.unshift({
        ...item,
        error: (err && err.message) || String(err),
        moved_at: new Date().toISOString()
      });
      if (dl.length > 50) dl.length = 50;
      localStorage.setItem(DEAD_LETTER_KEY, JSON.stringify(dl));
    } catch(e) {}
  }
  
  // Stats
  function stats() {
    const q = load();
    const dl = JSON.parse(localStorage.getItem(DEAD_LETTER_KEY) || '[]');
    return {
      pending: q.length,
      dead_letter: dl.length,
      next_try: q.length ? Math.min(...q.map(i => i.next_try)) : null
    };
  }
  
  // Listen untuk online event
  window.addEventListener('online', function() {
    setTimeout(flush, 500);
  });
  
  return { push, flush, stats, load };
})();

window.DreamOSQueue = DreamOSQueue;
