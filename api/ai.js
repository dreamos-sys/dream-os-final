// Vercel Edge Function: AI Gateway Proxy
export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { prompt, model = 'openai/gpt-4o-mini' } = await req.json();
    const API_KEY = process.env.AI_GATEWAY_API_KEY;

    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call AI Gateway
    const res = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: 'Kamu adalah asisten Dream OS. Jawab dengan bahasa Indonesia yang lembut, penuh hikmah, dan efisien. Akhiri dengan "Bi idznillah" jika konteksnya tentang harapan.' 
          },
          { role: 'user', content: prompt }
        ],
        stream: false,
        max_tokens: 512
      })
    });

    const data = await res.json();
    
    return new Response(JSON.stringify({
      response: data.choices?.[0]?.message?.content || 'No response',
      model,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Gateway error:', error);
    return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
