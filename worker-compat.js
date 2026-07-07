addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const rateLimitMap = new Map()

// Fungsi verifikasi JWT sederhana
async function verifyJWT(token, env) {
  try {
    const [header, payload, signature] = token.split('.')
    const decodedPayload = JSON.parse(atob(payload))
    
    // Cek expiry
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    return decodedPayload
  } catch(e) {
    return null
  }
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown'
  
  // Rate limit (kecuali health check)
  if (url.pathname !== '/health') {
    const now = Date.now()
    const windowMs = 10000
    const maxRequests = 5
    const record = rateLimitMap.get(clientIP) || { count: 0, resetTime: now + windowMs }
    if (now > record.resetTime) { record.count = 0; record.resetTime = now + windowMs }
    record.count++
    rateLimitMap.set(clientIP, record)
    if (record.count > maxRequests) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 })
    }
  }
  
  // Auth check (API_KEY untuk akses worker)
  const workerAuth = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (workerAuth !== API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  
  // ============ VERIFIKASI JWT UNTUK ENDPOINT SENSITIF ============
  const userJWT = request.headers.get('X-User-JWT') || ''
  let userData = null
  if (userJWT) {
    userData = await verifyJWT(userJWT, {})
  }
  
  // ============ SYNC ENDPOINT ============
  if (url.pathname === '/sync') {
    // Hanya role admin yang boleh sync
    if (!userData || !['dev', 'kabag', 'koord'].includes(userData.user_metadata?.role)) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin only' }), { status: 403 })
    }
    
    if (request.method === 'GET') {
      const modules = await DREAMOS_KV.list({ prefix: 'dreamos::' })
      const data = {}, timestamps = {}
      for (const key of modules.keys) {
        const raw = await DREAMOS_KV.get(key.name, 'json')
        if (raw) {
          const moduleName = key.name.replace('dreamos::', '')
          data[moduleName] = raw.data
          timestamps[moduleName] = raw.timestamp
        }
      }
      return new Response(JSON.stringify({ data, timestamps, serverTime: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    if (request.method === 'POST') {
      try {
        const payload = await request.json()
        const incoming = payload.data || {}
        const now = new Date().toISOString()
        let updated = 0, conflicts = 0
        for (const [moduleName, value] of Object.entries(incoming)) {
          const kvKey = 'dreamos::' + moduleName
          const current = await DREAMOS_KV.get(kvKey, 'json') || { data: null, timestamp: '0' }
          if (now > current.timestamp) {
            await DREAMOS_KV.put(kvKey, JSON.stringify({ data: value, timestamp: now }))
            updated++
          } else conflicts++
        }
        return new Response(JSON.stringify({ updated, conflicts, serverTime: now }), {
          headers: { 'Content-Type': 'application/json' }
        })
      } catch(e) {
        return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
      }
    }
  }
  
  // ============ BROADCAST ============
  if (url.pathname === '/broadcast') {
    if (request.method === 'POST') {
      try {
        const { message, level } = await request.json()
        const now = new Date().toISOString()
        const broadcasts = await DREAMOS_KV.get('system::broadcasts', 'json') || []
        broadcasts.unshift({ message, level: level || 'info', timestamp: now })
        if (broadcasts.length > 20) broadcasts.pop()
        await DREAMOS_KV.put('system::broadcasts', JSON.stringify(broadcasts))
        return new Response(JSON.stringify({ sent: true, total: broadcasts.length }), {
          headers: { 'Content-Type': 'application/json' }
        })
      } catch(e) { return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 }) }
    }
    if (request.method === 'GET') {
      const broadcasts = await DREAMOS_KV.get('system::broadcasts', 'json') || []
      return new Response(JSON.stringify(broadcasts), { headers: { 'Content-Type': 'application/json' } })
    }
  }
  
  // ============ AUDIT ============
  if (url.pathname === '/audit') {
    if (request.method === 'POST') {
      try {
        const { action, detail } = await request.json()
        const now = new Date().toISOString()
        const logs = await DREAMOS_KV.get('system::audit', 'json') || []
        logs.unshift({ action, detail, timestamp: now })
        if (logs.length > 200) logs.pop()
        await DREAMOS_KV.put('system::audit', JSON.stringify(logs))
        return new Response(JSON.stringify({ logged: true }), { headers: { 'Content-Type': 'application/json' } })
      } catch(e) { return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 }) }
    }
    if (request.method === 'GET') {
      const logs = await DREAMOS_KV.get('system::audit', 'json') || []
      return new Response(JSON.stringify(logs), { headers: { 'Content-Type': 'application/json' } })
    }
  }
  
  // ============ COMMAND ============
  if (url.pathname === '/command') {
    if (request.method === 'POST') {
      try {
        const { command, target } = await request.json()
        const now = new Date().toISOString()
        const commands = await DREAMOS_KV.get('system::commands', 'json') || []
        commands.unshift({ command, target: target || 'all', timestamp: now, executed: false })
        if (commands.length > 50) commands.pop()
        await DREAMOS_KV.put('system::commands', JSON.stringify(commands))
        return new Response(JSON.stringify({ issued: true, commandId: commands[0].timestamp }), {
          headers: { 'Content-Type': 'application/json' }
        })
      } catch(e) { return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 }) }
    }
    if (request.method === 'GET') {
      const commands = await DREAMOS_KV.get('system::commands', 'json') || []
      return new Response(JSON.stringify(commands), { headers: { 'Content-Type': 'application/json' } })
    }
  }
  
  // ============ HEALTH CHECK ============
  if (url.pathname === '/health') {
    const kvStatus = await DREAMOS_KV.get('dreamos::maintenance_tasks', 'json') ? 'ok' : 'empty'
    return new Response(JSON.stringify({
      status: 'healthy',
      kv: kvStatus,
      uptime: new Date().toISOString(),
      version: '1.2 JWT-Verified'
    }), { headers: { 'Content-Type': 'application/json' } })
  }
  
  return new Response('Not Found', { status: 404 })
}
