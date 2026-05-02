// Dream OS AI Service — Bridge to Nemo-120B
const aiService = {
    config: {
        baseURL: 'http://127.0.0.1:8082',
        endpoint: '/api/v1/ai-agent',
        timeout: 8000,
        model: 'nemo-120b',
        fallback: true
    },
    async isReady() {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.config.timeout);
            const res = await fetch(`${this.config.baseURL}${this.config.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: 'ping', model: this.config.model }),
                signal: controller.signal
            });
            clearTimeout(timeout);
            return res.ok;
        } catch (e) {
            console.log('⚠️ AI Agent offline, using fallback mode');
            return false;
        }
    },
    async query(prompt, context = {}) {
        const isOnline = await this.isReady();
        if (!isOnline && this.config.fallback) return this.fallbackResponse(prompt, context);
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.config.timeout);
            const res = await fetch(`${this.config.baseURL}${this.config.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt, model: this.config.model,
                    context: { role: context.role || 'STAFF', time: new Date().toISOString(), ...context },
                    stream: false
                }),
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return { success: true, response: data.response || data.answer || data.text || '', source: 'nemo-120b' };
        } catch (e) {
            console.warn('❌ AI Query failed:', e.message);
            return this.fallbackResponse(prompt, context);
        }
    },
    fallbackResponse(prompt, context) {
        const lower = prompt.toLowerCase();
        if (lower.includes('cuaca') || lower.includes('weather')) {
            return { success: true, response: '🌤️ Cerah Berawan - 32°C\n⚠️ AI Offline: Prediksi hujan 15:00\nJanitor Outdoor siap siaga.', source: 'fallback' };
        }
        if (lower.includes('cari') || lower.includes('search')) {
            return { success: true, response: '🔍 Hasil Pencarian (Fallback):\n• Booking: Rapat 09:00\n• K3: AC Ruang Rapat (60%)\n• Maintenance: Lampu Lobby (Done)', source: 'fallback' };
        }
        return { success: true, response: `🤖 Response (Fallback): "${prompt}"\n\n⚠️ Nemo-120B offline.`, source: 'fallback' };
    },
    async predictWeather(location) { return this.query(`Analisis cuaca untuk ${location} 3 jam ke depan.`, { task: 'weather' }); },
    async classifyK3(report) { return this.query(`Klasifikasikan: "${report}". Output JSON: {category, priority, action}`, { task: 'k3' }); },
    async generateSPJ(data) { return this.query(`Buat draft SPJ dari: ${JSON.stringify(data)}.`, { task: 'spj' }); }
};
if (typeof module !== 'undefined') module.exports = aiService;
if (typeof window !== 'undefined') window.aiService = aiService;
