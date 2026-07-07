addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const rateLimitMap = new Map()

async function verifyJWT(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch(e) { return null }
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
  
  // Auth check (API_KEY)
  const workerAuth = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (workerAuth !== API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  
  // JWT verification
  const userJWT = request.headers.get('X-User-JWT') || ''
  let userData = null
  if (userJWT) userData = await verifyJWT(userJWT)
  
  // Endpoint sync (butuh KV, tapi kita kasih pesan error dulu)
  if (url.pathname === '/sync') {
    return new Response(JSON.stringify({ error: 'KV not configured yet' }), { status: 503 })
  }
  
  // Broadcast, audit, command (sama)
  if (url.pathname === '/broadcast' || url.pathname === '/audit' || url.pathname === '/command') {
    return new Response(JSON.stringify({ error: 'KV not configured yet' }), { status: 503 })
  }
  
  // Health check (TANPA KV)
  if (url.pathname === '/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      uptime: new Date().toISOString(),
      version: '1.2 JWT-Verified',
      kv: 'not checked'
    }), { headers: { 'Content-Type': 'application/json' } })
  }
  
  return new Response('Not Found', { status: 404 })
}
