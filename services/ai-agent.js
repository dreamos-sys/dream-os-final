// services/ai-agent.js
// Smart AI Brain • OpenRouter Integration • Offline Fallback

export class AIAgent {
  constructor(config = {}) {
    this.api = config.api || 'https://openrouter.ai/api/v1/chat/completions';
    // Default menggunakan model Qwen 2.5 yang ringan dan cepat
    this.model = config.model || 'qwen/qwen-2.5-7b-instruct';
    
    // Cache untuk menyimpan respon sementara (5 menit)
    this.cache = new Map();
    this.cacheTime = 5 * 60 * 1000; 
    
    // Cek status koneksi awal
    this.isOnline = navigator.onLine;
    
    // Listener koneksi internet
    window.addEventListener('online', () => { 
      this.isOnline = true; 
      console.log('🟢 AI Online');
    });
    window.addEventListener('offline', () => { 
      this.isOnline = false; 
      console.log('🔴 AI Offline Mode');
    });
  }

  // Fungsi utama untuk bertanya ke AI
  async query(prompt, context = {}) {
    const key = prompt + JSON.stringify(context);
    
    // 1. Cek Cache (Hemat Token)
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.ts < this.cacheTime) {
      return cached.res;
    }

    // 2. Mode Offline (Fallback Cepat)
    if (!this.isOnline) {
      return this._getOfflineResponse(prompt);
    }

    // 3. Request ke API (OpenRouter)
    try {
      const response = await fetch(this.api, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dream_ai_key') || 'sk-or-v1-demo'}`, // Ganti dengan API Key jika ada
          'Content-Type': 'application/json',
          'HTTP-Referer': location.origin,
          'X-Title': 'Dream OS v2.1'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'Kamu adalah asisten Dream OS. Jawab singkat, membantu, dan sopan. Gunakan Bahasa Indonesia.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 150
        })
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '⚠️ AI tidak merespons.';
      
      // Simpan ke cache
      this.cache.set(key, { res: text, ts: Date.now() });
      return text;

    } catch (error) {
      console.warn('AI Error:', error);
      return '⚠️ Koneksi AI gagal. Menggunakan mode offline.';
    }
  }

  // Respon sederhana saat offline
  _getOfflineResponse(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('booking') || p.includes('ruang')) return '📅 Mode Offline: Pastikan jadwal tidak bentrok secara manual.';
    if (p.includes('k3') || p.includes('bahaya')) return '⚠️ Mode Offline: Segera amankan area dan lapor atasan.';
    if (p.includes('janitor') || p.includes('bersih')) return '🧹 Mode Offline: Jadwalkan pembersihan sesuai prioritas.';
    return '📶 Mode Offline: AI memerlukan koneksi internet untuk analisa mendalam.';
  }
}

// Export Singleton (Satu instance untuk seluruh aplikasi)
export const ai = new AIAgent();

