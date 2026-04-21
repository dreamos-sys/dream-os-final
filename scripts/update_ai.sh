#!/bin/bash
# --- GHOST UPDATE: AI GATEWAY & NEURAL BRIDGE v1.1 ---

echo "📡 Menyiapkan Gerbang AI di Awan Vercel..."
mkdir -p ~/dream-live/api

# 1. Buat file api/ai.js (Edge Runtime Mode)
cat << 'EOP' > ~/dream-live/api/ai.js
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
EOP

echo "🔗 Menyuntikkan Neural Bridge ke main.js..."
# 2. Inject Logic ke main.js (Hanya jika belum ada)
if ! grep -q "window.askSultanAI" ~/dream-live/src/main.js; then
cat << 'BRIDGE' >> ~/dream-live/src/main.js

// --- NEURAL BRIDGE ADD-ON ---
window.askSultanAI = async (p) => {
    const area = document.querySelector('#module-container');
    area.innerHTML = '📡 Menghubungi Server Langit...';
    try {
        const r = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: p })
        });
        const d = await r.json();
        area.innerHTML = '<div class="glass-card"><p>' + d.response + '</p></div>';
    } catch (e) { area.innerHTML = '🚨 Putus Sambungan!'; }
};
BRIDGE
fi

echo "🚀 Meluncur ke GitHub (Force Mode)..."
cd ~/dream-live
git add .
git commit -m "feat: AI Neural Bridge v1.1 🧠 Bi idznillah"
git push origin main --force

echo "🦾 Operasi Selesai, Sultan! Cek link Sultan sekarang!"
