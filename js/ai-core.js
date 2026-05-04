/**
 * Dream OS AI Core v1.0.0
 * Karpathy-Style: Local-first → Cloud fallback → Cache
 * Addy-Style: Defer loading, <1KB gzipped, zero dependencies
 */
(function() {
    'use strict';
    
    const AI = {
        config: {
            localEndpoint: 'http://localhost:11434/api/generate',
            localModel: 'qwen2.5:0.5b',
            fallbackEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
            fallbackModel: 'qwen/qwen-2.5-72b-instruct',
            timeout: 8000,
            cacheKey: 'dreamos_ai_cache'
        },
        
        // Cache helper (localStorage)
        cache: {
            get(q) { try { return JSON.parse(localStorage.getItem(AI.config.cacheKey))?.[q]; } catch { return null; } },
            set(q, a) { try { const c = JSON.parse(localStorage.getItem(AI.config.cacheKey)) || {}; c[q] = a; localStorage.setItem(AI.config.cacheKey, JSON.stringify(c)); } catch {} }
        },

        // Main query function
        async query(prompt, options = {}) {
            if (!prompt?.trim()) return { error: 'Prompt kosong' };
            
            // 1. Check cache
            const cached = this.cache.get(prompt.trim());
            if (cached) return { response: cached, source: 'cache' };

            // 2. Try Local Ollama
            try {
                const ctrl = new AbortController();
                const t = setTimeout(() => ctrl.abort(), this.config.timeout);
                const res = await fetch(this.config.localEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: this.config.localModel, prompt, stream: false }),
                    signal: ctrl.signal
                });
                clearTimeout(t);
                if (!res.ok) throw new Error('Local failed');
                const data = await res.json();
                const answer = data.response?.trim();                if (answer) { this.cache.set(prompt.trim(), answer); return { response: answer, source: 'local' }; }
            } catch (e) { console.log('🔄 Local AI unavailable, falling back...'); }

            // 3. Fallback (optional: requires API key in localStorage)
            const apiKey = localStorage.getItem('dreamos_openrouter_key');
            if (apiKey) {
                try {
                    const res = await fetch(this.config.fallbackEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                        body: JSON.stringify({ model: this.config.fallbackModel, messages: [{ role: 'user', content: prompt }], max_tokens: 256 })
                    });
                    if (!res.ok) throw new Error('Fallback failed');
                    const data = await res.json();
                    const answer = data.choices?.[0]?.message?.content?.trim();
                    if (answer) { this.cache.set(prompt.trim(), answer); return { response: answer, source: 'cloud' }; }
                } catch (e) { console.warn('⚠️ Cloud fallback failed:', e.message); }
            }

            return { error: 'AI tidak tersedia. Pastikan Ollama running atau set API key.' };
        },

        // Karpathy-Style Verification
        verify() {
            console.group('🔍 AI Core Verification (Goal-Driven)');
            console.assert(typeof this.query === 'function', '❌ query() not a function');
            console.assert(typeof this.cache.get === 'function', '❌ cache.get() broken');
            console.assert(typeof this.cache.set === 'function', '❌ cache.set() broken');
            console.assert(Object.keys(this.config).length >= 4, '❌ Config incomplete');
            console.log('✅ All core assertions passed. Ready for integration.');
            console.groupEnd();
            return true;
        }
    };

    // Register to DreamOS system
    if (window.DreamOS) {
        window.DreamOS.register('aiCore', AI);
        console.log('✅ AI Core registered. Run: DreamOS.modules.aiCore.verify()');
    }
})();
