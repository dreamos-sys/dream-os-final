export const config = { runtime: 'edge' };
export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Forbidden', { status: 403 });
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.AI_GATEWAY_API_KEY;
    const res = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${API_KEY}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Asisten Dream OS Sovereign. Jawab dengan hikmah, panggil user Sultan. Akhiri: Bi idznillah.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 256
      })
    });
    const data = await res.json();
    return new Response(JSON.stringify({ response: data.choices[0].message.content }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) { return new Response('Offline', { status: 500 }); }
}
