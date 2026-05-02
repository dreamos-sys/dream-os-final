// Dream OS AI Service — Bridge to Nemo-120B Agent
// Modular, lightweight, Termux-friendly

const aiService = {
    // Config — edit disini aja
    config: {
        baseURL: 'http://127.0.0.1:8082', // Local Nemo-120B
        // baseURL: 'https://your-cloud-gateway.com', // Production fallback
        endpoint: '/api/v1/ai-agent',
        timeout: 10000, // 10 detik
        model: 'nemo-120b'
    },
    
    // Health check — panggil ini dulu sebelum request
    async isReady() {
        try {
            const res = await fetch(`${this.config.baseURL}${this.config.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: 'ping', model: this.config.model }),
                signal: AbortSignal.timeout(this.config.timeout)
            });
            return res.ok;
        } catch (e) {
            console.warn('⚠️ AI Service offline:', e.message);
            return false;
        }
    },
    
    // Main query function — natural language to AI
    async query(prompt, context = {}) {
        if (!await this.isReady()) {
            return { error: 'AI Agent offline', fallback: true };
        }
        
        try {
            const payload = {
                prompt,
                model: this.config.model,
                context: {
                    role: context.role || 'STAFF',
                    time: new Date().toISOString(),
                    location: context.location || null,
                    ...context
                },
                stream: false            };
            
            const res = await fetch(`${this.config.baseURL}${this.config.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(this.config.timeout)
            });
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            
            return {
                success: true,
                response: data.response || data.answer || data.text || '',
                metadata: data.metadata || {}
            };
            
        } catch (e) {
            console.error('❌ AI Query failed:', e.message);
            return { error: e.message, fallback: true };
        }
    },
    
    // Specialized helpers
    async predictWeather(location) {
        return this.query(`Analisis cuaca untuk ${location} 3 jam ke depan. Berikan warning jika ada risiko. Format: singkat, actionable.`, {
            task: 'weather_prediction',
            location
        });
    },
    
    async classifyK3(report) {
        return this.query(`Klasifikasikan laporan K3 ini: "${report}". Kategori: [Maintenance, Sekuriti, Janitor]. Output JSON: {category, priority, action}.`, {
            task: 'k3_classification'
        });
    },
    
    async generateSPJ(data) {
        return this.query(`Buat draft SPJ dari data: ${JSON.stringify(data)}. Format: standar instansi, include PPh23 & PPN.`, {
            task: 'spj_generation'
        });
    }
};

// Export for modular use
if (typeof module !== 'undefined') module.exports = aiService;
if (typeof window !== 'undefined') window.aiService = aiService;
