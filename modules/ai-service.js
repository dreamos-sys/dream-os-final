// Dream OS AI Service — Bridge to Nemo-120B (Port 8082)
// Modular, lightweight, with graceful fallback

const aiService = {
    config: {
        baseURL: 'http://127.0.0.1:8082', // Local Nemo-120B
        endpoint: '/api/v1/ai-agent',
        timeout: 8000,
        model: 'nemo-120b',
        fallback: true // Use mock data if offline
    },
    
    // Health check
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
    
    // Main query function
    async query(prompt, context = {}) {
        const isOnline = await this.isReady();
        
        if (!isOnline && this.config.fallback) {
            return this.fallbackResponse(prompt, context);
        }
        
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.config.timeout);
            
            const res = await fetch(`${this.config.baseURL}${this.config.endpoint}`, {
                method: 'POST',                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    model: this.config.model,
                    context: { role: context.role || 'STAFF', time: new Date().toISOString(), ...context },
                    stream: false
                }),
                signal: controller.signal
            });
            clearTimeout(timeout);
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            
            return {
                success: true,
                response: data.response || data.answer || data.text || '',
                metadata: data.metadata || {},
                source: 'nemo-120b'
            };
        } catch (e) {
            console.warn('❌ AI Query failed:', e.message);
            return this.fallbackResponse(prompt, context);
        }
    },
    
    // Fallback responses (when AI offline)
    fallbackResponse(prompt, context) {
        const lower = prompt.toLowerCase();
        if (lower.includes('cuaca') || lower.includes('weather')) {
            return {
                success: true,
                response: '🌤️ Cerah Berawan - 32°C\n⚠️ AI Offline: Prediksi hujan 15:00 (data lokal)\nJanitor Outdoor siap siaga.',
                source: 'fallback'
            };
        }
        if (lower.includes('cari') || lower.includes('search')) {
            return {
                success: true,
                response: '🔍 Hasil Pencarian (Fallback Mode):\n• Booking: Rapat Koordinasi 09:00\n• K3: AC Ruang Rapat (Proses 60%)\n• Maintenance: Lampu Lobby (Selesai)\n\n⚠️ AI offline — gunakan keyword spesifik',
                source: 'fallback'
            };
        }
        return {
            success: true,
            response: `🤖 Response (Fallback):\n"${prompt}"\n\n⚠️ Nemo-120B offline. Fitur AI akan aktif saat terhubung.`,
            source: 'fallback'
        };
    },
        // Specialized helpers
    async predictWeather(location) {
        return this.query(`Analisis cuaca untuk ${location} 3 jam ke depan. Format: singkat, actionable, dengan warning jika ada.`, { task: 'weather' });
    },
    
    async classifyK3(report) {
        return this.query(`Klasifikasikan: "${report}". Output JSON: {category: Maintenance|Sekuriti|Janitor, priority: low|medium|high, action: string}`, { task: 'k3' });
    },
    
    async generateSPJ(data) {
        return this.query(`Buat draft SPJ dari: ${JSON.stringify(data)}. Format standar instansi, include PPh23 & PPN.`, { task: 'spj' });
    }
};

// Export for modular use
if (typeof module !== 'undefined') module.exports = aiService;
if (typeof window !== 'undefined') window.aiService = aiService;
