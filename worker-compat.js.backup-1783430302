addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  const auth = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (auth !== API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  // SYNC
  if (url.pathname === '/sync') {
    if (request.method === 'GET') {
      const modules = await DREAMOS_KV.list({ prefix: 'dreamos::' });
      const data = {}, timestamps = {};
      for (const key of modules.keys) {
        const raw = await DREAMOS_KV.get(key.name, 'json');
        if (raw) {
          const moduleName = key.name.replace('dreamos::', '');
          data[moduleName] = raw.data;
          timestamps[moduleName] = raw.timestamp;
        }
      }
      return new Response(JSON.stringify({ data, timestamps, serverTime: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'POST') {
      try {
        const payload = await request.json();
        const incoming = payload.data || {};
        const now = new Date().toISOString();
        let updated = 0, conflicts = 0;
        for (const [moduleName, value] of Object.entries(incoming)) {
          const kvKey = `dreamos::${moduleName}`;
          const current = await DREAMOS_KV.get(kvKey, 'json') || { data: null, timestamp: '0' };
          if (now > current.timestamp) {
            await DREAMOS_KV.put(kvKey, JSON.stringify({ data: value, timestamp: now }));
            updated++;
          } else conflicts++;
        }
        return new Response(JSON.stringify({ updated, conflicts, serverTime: now }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch(e) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
      }
    }
  }

  // BROADCAST
  if (url.pathname === '/broadcast') {
    if (request.method === 'POST') {
      try {
        const { message, level } = await request.json();
        const now = new Date().toISOString();
        const broadcasts = await DREAMOS_KV.get('system::broadcasts', 'json') || [];
        broadcasts.unshift({ message, level: level || 'info', timestamp: now });
        if (broadcasts.length > 20) broadcasts.pop();
        await DREAMOS_KV.put('system::broadcasts', JSON.stringify(broadcasts));
        return new Response(JSON.stringify({ sent: true, total: broadcasts.length }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch(e) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
      }
    }
    if (request.method === 'GET') {
      const broadcasts = await DREAMOS_KV.get('system::broadcasts', 'json') || [];
      return new Response(JSON.stringify(broadcasts), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // AUDIT
  if (url.pathname === '/audit') {
    if (request.method === 'POST') {
      try {
        const { action, detail } = await request.json();
        const now = new Date().toISOString();
        const logs = await DREAMOS_KV.get('system::audit', 'json') || [];
        logs.unshift({ action, detail, timestamp: now });
        if (logs.length > 200) logs.pop();
        await DREAMOS_KV.put('system::audit', JSON.stringify(logs));
        return new Response(JSON.stringify({ logged: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch(e) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
      }
    }
    if (request.method === 'GET') {
      const logs = await DREAMOS_KV.get('system::audit', 'json') || [];
      return new Response(JSON.stringify(logs), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // COMMAND
  if (url.pathname === '/command') {
    if (request.method === 'POST') {
      try {
        const { command, target } = await request.json();
        const now = new Date().toISOString();
        const commands = await DREAMOS_KV.get('system::commands', 'json') || [];
        commands.unshift({ command, target: target || 'all', timestamp: now, executed: false });
        if (commands.length > 50) commands.pop();
        await DREAMOS_KV.put('system::commands', JSON.stringify(commands));
        return new Response(JSON.stringify({ issued: true, commandId: commands[0].timestamp }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch(e) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
      }
    }
    if (request.method === 'GET') {
      const commands = await DREAMOS_KV.get('system::commands', 'json') || [];
      return new Response(JSON.stringify(commands), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // HEALTH
  if (url.pathname === '/health') {
    const kvStatus = await DREAMOS_KV.get('dreamos::maintenance_tasks', 'json') ? 'ok' : 'empty';
    return new Response(JSON.stringify({
      status: 'healthy',
      kv: kvStatus,
      uptime: new Date().toISOString(),
      version: '1.0 Beta Remote'
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response('Not Found', { status: 404 });
}
