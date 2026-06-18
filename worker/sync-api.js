// Cloudflare Worker - DreamOS KV Sync API
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const key = url.searchParams.get('key');
    const prefix = url.searchParams.get('prefix');

    try {
      // GET: Ambil satu key atau semua data dengan prefix
      if (request.method === 'GET') {
        if (key) {
          const value = await env.DREAMOS_KV.get(key);
          return new Response(JSON.stringify({ key, value }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else if (prefix) {
          const keys = await env.DREAMOS_KV.list({ prefix });
          const results = [];
          for (const k of keys.keys) {
            const value = await env.DREAMOS_KV.get(k.name);
            results.push({ key: k.name, value, updated_at: k.metadata?.updated_at });
          }
          return new Response(JSON.stringify(results), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // POST: Simpan data ke KV
      if (request.method === 'POST') {
        const body = await request.json();
        const now = new Date().toISOString();
        await env.DREAMOS_KV.put(body.key, body.value, {
          metadata: { updated_at: now },
          expirationTtl: 86400 * 365 // 1 tahun
        });
        return new Response(JSON.stringify({ success: true, updated_at: now }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
