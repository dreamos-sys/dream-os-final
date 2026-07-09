addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Health check TIDAK perlu API_KEY
  if (url.pathname === '/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      uptime: new Date().toISOString(),
      version: '1.0 NoEnv'
    }), { headers: { 'Content-Type': 'application/json' } })
  }

  // Untuk endpoint lain, tetap butuh API_KEY (tapi untuk sekarang health check dulu)
  return new Response('Not Found', { status: 404 })
}
