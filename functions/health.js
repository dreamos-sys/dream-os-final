export async function onRequest(context) {
  return new Response(JSON.stringify({
    status: 'healthy',
    uptime: new Date().toISOString(),
    version: '1.0 Pages Function'
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
