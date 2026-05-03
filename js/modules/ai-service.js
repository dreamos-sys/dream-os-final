window.DreamOSModules = window.DreamOSModules || {};

window.DreamOSModules['ai-service'] = {
    config: { baseURL: 'http://127.0.0.1:8082', endpoint: '/api/v1/ai-agent', timeout: 8000, model: 'nemo-120b', fallback: true },
    
    init() {        console.log('🤖 AI Service module initialized');
    },
    
    async isReady() {
        try {
            const c = new AbortController();
            const t = setTimeout(() => c.abort(), this.config.timeout);
            const r = await fetch(`${this.config.baseURL}${this.config.endpoint}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt: 'ping', model: this.config.model}),
                signal: c.signal
            });
            clearTimeout(t);
            return r.ok;
        } catch(e) {
            return false;
        }
    },
    
    async query(prompt, context = {}) {
        const on = await this.isReady();
        if (!on && this.config.fallback) return this.fallback(prompt, context);
        
        try {
            const c = new AbortController();
            const t = setTimeout(() => c.abort(), this.config.timeout);
            const r = await fetch(`${this.config.baseURL}${this.config.endpoint}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    prompt,
                    model: this.config.model,
                    context: {role: context.role || 'STAFF', time: new Date().toISOString(), ...context},
                    stream: false
                }),
                signal: c.signal
            });
            clearTimeout(t);
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const d = await r.json();
            return {success: true, response: d.response || d.answer || d.text || '', source: 'nemo-120b'};
        } catch(e) {
            return this.fallback(prompt, context);
        }
    },
    
    fallback(prompt) {
        const l = prompt.toLowerCase();
        if(l.includes('cuaca') || l.includes('weather')) {            return {success: true, response: '🌤️ Cerah Berawan - 32°C\n⚠️ AI Offline: Prediksi hujan 15:00\nJanitor Outdoor siap siaga.', source: 'fallback'};
        }
        return {success: true, response: `🤖 Response (Fallback): "${prompt}"`, source: 'fallback'};
    },
    
    async loadAIWeather() {
        const container = document.getElementById('weather-ai');
        if (!container) return;
        
        container.innerHTML = '<p class="text-sm text-white/70">🤖 AI thinking...</p>';
        const result = await this.predictWeather('Depok, Indonesia');
        
        if (result.success) {
            const isFallback = result.source === 'fallback';
            container.innerHTML = `<p class="text-sm text-white mb-1">${result.response.split('\n')[0]}</p>${result.response.includes('⚠️') ? `<p class="text-xs text-orange-400 mb-1">${result.response.match(/⚠️.*?(?=\.|$)/)?.[0] || ''}</p>` : ''}<p class="text-xs text-white/70">${result.response.split('\n').slice(1).join('<br>')}</p>${isFallback ? '<p class="text-[9px] text-orange-400/80 mt-1">⚠️ AI offline</p>' : ''}`;
            
            const badge = document.getElementById('ai-status');
            if (badge) {
                badge.textContent = isFallback ? 'AI: Fallback' : 'AI: Online';
                badge.className = `px-1.5 py-0.5 rounded text-[8px] ${isFallback ? 'bg-orange-500/80' : 'bg-emerald-500/80'} pulse`;
            }
        }
    },
    
    async predictWeather(loc) {
        return this.query(`Analisis cuaca untuk ${loc} 3 jam ke depan.`, {task: 'weather'});
    }
};
