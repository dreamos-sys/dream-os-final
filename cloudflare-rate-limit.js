/**
 * 🏦 RATE LIMIT WORKER - Deploy ke Cloudflare Workers
 * Copy-paste ke https://dash.cloudflare.com > Workers > Create
 */
export default {
  async fetch(request, env) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const key = `ratelimit:${ip}`;
    
    // Ambil counter dari KV
    const current = await env.RATE_LIMIT_KV.get(key);
    const count = current ? parseInt(current) : 0;
    
    // Batas: 100 request per 15 menit
    if (count >= 100) {
      return new Response('Rate limit exceeded', { 
        status: 429,
        headers: { 'Retry-After': '900', 'Content-Type': 'text/plain' }
      });
    }
    
    // Increment counter, expire 15 menit
    await env.RATE_LIMIT_KV.put(key, (count + 1).toString(), { expirationTtl: 900 });
    
    // Forward ke GitHub Pages
    return fetch(request);
  }
};
