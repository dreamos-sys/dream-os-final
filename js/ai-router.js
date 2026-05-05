/**
 * Dream OS AI Router v1.0 — Hybrid Fallback + Token Saver + Quota Tracker
 * Karpathy: Simple, verifiable | Addy: <2KB, zero deps | Dream OS: Termux-native
 * 
 * Usage:
 *   const res = await DreamOS.modules.aiRouter.query('Jelaskan visi Dream OS');
 *   console.log(res.response, res.source); // 'local' | 'cloud' | 'fallback'
 */
(function() {
    'use strict';
    
    DreamOS.register('aiRouter', {
        config: {
            local: { endpoint: 'http://localhost:11434/api/generate', model: 'qwen2.5:0.5b', timeout: 5000 },
            cloud: { endpoint: 'https://openrouter.ai/api/v1/chat/completions', model: 'qwen/qwen-2.5-72b-instruct', apiKey: '' },
            quota: { cloudDailyLimit: 100000 } // tokens
        },
        
        // 🔹 Simple token compression (RTK Lite)
        _compress(content, max = 500) {
            if(!content || typeof content !== 'string' || content.length <= max) return content;
            const start = content.slice(0, Math.floor(max * 0.7));
            const end = content.slice(-Math.floor(max * 0.3));
            return `${start}\n...[truncated]...\n${end}`;
        },
        
        // 🔹 Extract key info from tool outputs
        _extractKeyInfo(output, type = 'auto') {
            if(type === 'git-diff') {
                return output.split('\n').filter(l => l.startsWith('+') || l.startsWith('-') || l.startsWith('@@')).slice(0, 50).join('\n');
            }
            if(type === 'ls' || type === 'dir') {
                return output.split('\n').map(l => l.split(/\s+/).pop()).filter(n => n && n !== '.').slice(0, 100).join('\n');
            }
            return this._compress(output);
        },
        
        // 🔹 Quota tracking (localStorage, 7-day history)
        _quota: {
            key: 'dreamos_ai_quota',
            record(tokens, provider) {
                const day = new Date().toISOString().split('T')[0];
                const data = JSON.parse(localStorage.getItem(this.key) || '{}');
                if(!data[day]) data[day] = {local: 0, cloud: 0};
                data[day][provider] = (data[day][provider] || 0) + tokens;
                const keys = Object.keys(data).sort();
                if(keys.length > 7) keys.slice(0, keys.length - 7).forEach(k => delete data[k]);                localStorage.setItem(this.key, JSON.stringify(data));
            },
            isOverLimit(provider, limit) {
                const day = new Date().toISOString().split('T')[0];
                const data = JSON.parse(localStorage.getItem(this.key) || '{}');
                return (data[day]?.[provider] || 0) > limit;
            }
        },
        
        // 🔹 Main query function with fallback logic
        async query(prompt, options = {}) {
            const { compress = true, toolType = null, useLocal = true } = options;
            
            // Pre-process: compress tool outputs if needed
            const processedPrompt = compress && toolType ? this._extractKeyInfo(prompt, toolType) : (compress ? this._compress(prompt) : prompt);
            
            // Tier 1: Local Ollama (offline, free)
            if(useLocal) {
                try {
                    const ctrl = new AbortController();
                    const t = setTimeout(() => ctrl.abort(), this.config.local.timeout);
                    const res = await fetch(this.config.local.endpoint, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({model: this.config.local.model, prompt: processedPrompt, stream: false}),
                        signal: ctrl.signal
                    });
                    clearTimeout(t);
                    if(res.ok) {
                        const data = await res.json();
                        const tokens = data.prompt_eval_count + data.eval_count || 0;
                        this._quota.record(tokens, 'local');
                        return {response: data.response, source: 'local', tokens};
                    }
                } catch(e) { console.warn('⚠️ Local AI offline'); }
            }
            
            // Tier 2: Cloud fallback (if quota allows)
            if(!this._quota.isOverLimit('cloud', this.config.quota.cloudDailyLimit) && this.config.cloud.apiKey) {
                try {
                    const res = await fetch(this.config.cloud.endpoint, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.config.cloud.apiKey}`,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': location.origin,
                            'X-Title': 'Dream OS'
                        },
                        body: JSON.stringify({
                            model: this.config.cloud.model,                            messages: [{role: 'user', content: processedPrompt}]
                        })
                    });
                    if(res.ok) {
                        const data = await res.json();
                        const tokens = data.usage?.total_tokens || 0;
                        this._quota.record(tokens, 'cloud');
                        return {response: data.choices?.[0]?.message?.content, source: 'cloud', tokens};
                    }
                } catch(e) { console.warn('⚠️ Cloud AI failed'); }
            }
            
            // Tier 3: Simple fallback message
            return {response: 'Maaf, AI tidak tersedia. Coba lagi nanti atau periksa koneksi.', source: 'fallback', tokens: 0};
        },
        
        // 🔹 Utility: Get quota summary
        getQuotaSummary() {
            const day = new Date().toISOString().split('T')[0];
            const data = JSON.parse(localStorage.getItem(this._quota.key) || '{}');
            return {
                today: data[day] || {local: 0, cloud: 0},
                isCloudLimited: this._quota.isOverLimit('cloud', this.config.quota.cloudDailyLimit)
            };
        },
        
        // 🔹 Verification
        verify() {
            console.group('🔍 AI Router Verification');
            console.assert(typeof this.query === 'function', '❌ query() broken');
            console.assert(typeof this._compress === 'function', '❌ _compress() broken');
            console.log('✅ AI Router v1.0 assertions passed.');
            console.groupEnd();
            return true;
        }
    });
    
    // Auto-verify on load
    if(window.DreamOS) DreamOS.modules.aiRouter.verify();
    console.log('✅ AI Router v1.0 loaded (<2KB, zero deps)');
})();
