addEventListener('fetch', event => {
  event.respondWith(new Response(JSON.stringify({
    status: 'healthy',
    version: '1.0',
    uptime: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  }))
})
