(function() {
    'use strict';
    const AI = {
        config: {
            localEndpoint: 'http://localhost:11434/api/generate',
            localModel: 'qwen2.5:0.5b',
            fallbackEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
            fallbackModel: 'qwen/qwen-2.5-72b-instruct',
            timeout: 5000,
            cacheKey: 'dreamos_ai_cache'
        },
        cache: {
            get(q) { try { return JSON.parse(localStorage.getItem(AI.config.cacheKey))?.[q]; } catch { return null; } },
            set(q, a) { try { const c = JSON.parse(localStorage.getItem(AI.config.cacheKey)) || {}; c[q] = a; localStorage.setItem(AI.config.cacheKey, JSON.stringify(c)); } catch {} }
        },
        async query(prompt) {
            if (!prompt?.trim()) return { error: 'Prompt kosong' };
            const cached = this.cache.get(prompt.trim());
            if (cached) return { response: cached, source: 'cache' };

            try {
                const ctrl = new AbortController();
                const t = setTimeout(() => ctrl.abort(), this.config.timeout);
                const res = await fetch(this.config.localEndpoint, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({model: this.config.localModel, prompt, stream: false}),
                    signal: ctrl.signal
                });
                clearTimeout(t);
                if(res.ok) {
                    const data = await res.json();
                    if(data.response) { this.cache.set(prompt, data.response); return {response: data.response, source: 'local'}; }
                }
            } catch(e) { console.warn('Ollama offline, fallback ke RAG'); }

            return { error: 'Maaf, AI lokal offline. Menggunakan RAG Core.' };
        },
        verify() {
            return typeof this.query === 'function';
        }
    };
    if (window.DreamOS) {
        DreamOS.register('aiCore', AI);
        console.log('✅ AI Core Loaded');
    }
})();
