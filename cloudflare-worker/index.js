/**
 * DREAM OS SYNC WORKER
 * Version: 1.0 Beta (Anti-Conflict Engine)
 * Architect: Dream Team
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (auth !== env.API_KEY) {
      return new Response(JSON.stringify({ error: 'Unauthorized', version: '1.0 Beta' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    if (url.pathname === '/sync') {
      if (request.method === 'GET') {
        // Kembalikan semua modul beserta timestamp-nya
        const modules = await env.DREAMOS_KV.list({ prefix: 'dreamos::' });
        const data = {};
        const timestamps = {};
        
        for (const key of modules.keys) {
          const raw = await env.DREAMOS_KV.get(key.name, 'json');
          if (raw) {
            // key.name format: 'dreamos::maintenance_tasks'
            const moduleName = key.name.replace('dreamos::', '');
            data[moduleName] = raw.data;
            timestamps[moduleName] = raw.timestamp;
          }
        }
        
        return new Response(JSON.stringify({
          version: '1.0 Beta',
          data,
          timestamps,
          serverTime: new Date().toISOString()
        }), { headers: { 'Content-Type': 'application/json' } });
      }
      
      if (request.method === 'POST') {
        try {
          const payload = await request.json();
          const incoming = payload.data || {};
          const now = new Date().toISOString();
          let updated = 0;
          let conflicts = 0;

          for (const [moduleName, value] of Object.entries(incoming)) {
            const kvKey = `dreamos::${moduleName}`;
            const current = await env.DREAMOS_KV.get(kvKey, 'json') || { data: null, timestamp: '0' };
            
            // Bandingkan timestamp
            if (now > current.timestamp) {
              await env.DREAMOS_KV.put(kvKey, JSON.stringify({
                data: value,
                timestamp: now
              }));
              updated++;
            } else {
              conflicts++;
            }
          }

          return new Response(JSON.stringify({ 
            success: true, 
            version: '1.0 Beta',
            updated,
            conflicts,
            serverTime: now
          }), { headers: { 'Content-Type': 'application/json' } });

        } catch(e) {
          return new Response(JSON.stringify({ error: 'Invalid payload' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};
