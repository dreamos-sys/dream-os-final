addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Health check TIDAK perlu auth
  if (url.pathname === '/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      uptime: new Date().toISOString(),
      version: '1.0 Public'
    }), { headers: { 'Content-Type': 'application/json' } })
  }

  // Endpoint lain butuh API_KEY
  const auth = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (auth !== API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    })
  }

  if (url.pathname === '/sync') {
    // KV belum disetel, beri tahu
    return new Response(JSON.stringify({ error: 'KV not configured' }), { status: 503 })
  }

  if (url.pathname === '/broadcast' || url.pathname === '/audit' || url.pathname === '/command') {
    return new Response(JSON.stringify({ error: 'Endpoint ready, KV needed' }), { status: 503 })
  }

  return new Response('Not Found', { status: 404 })
}
