export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Forbidden', { status: 403 });
  
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.OLLAMA_API_KEY; // Pastikan ini sudah di set di Vercel/Config
    
    const res = await fetch('https://ollama.com/api/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-oss:120b',
        messages: [
          { role: 'system', content: 'Asisten Dream OS Sovereign. Jawab dengan hikmah, panggil user Sultan. Akhiri: Bi idznillah.' },
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });

    const data = await res.json();
    return new Response(JSON.stringify({ response: data.message.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Cloud Connection Failed' }), { status: 500 });
  }
}
