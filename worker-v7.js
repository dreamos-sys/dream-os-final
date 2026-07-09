addEventListener('fetch', event => {
  event.respondWith(new Response(JSON.stringify({
    status: 'healthy',
    uptime: new Date().toISOString(),
    version: '1.0 Final v7'
  }), { headers: { 'Content-Type': 'application/json' } }))
})
