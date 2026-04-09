/**
 * Dream OS - AI Loader (Browser-Compatible)
 * Auto-detects local/online AI assets and registers them
 */
(function() {
    'use strict';
    
    // Ensure namespace exists
    if (!window.DreamOS) window.DreamOS = {};
    if (!window.DreamOS.ai) window.DreamOS.ai = { registry: {}, config: {}, loader: {} };
    
    window.DreamOS.ai.loader = {
        // Detect local models via Ollama API
        detectOllama: async () => {
            try {
                const res = await fetch('http://localhost:11434/api/tags', { 
                    mode: 'cors',
                    headers: { 'Accept': 'application/json' }
                });
                if (!res.ok) throw new Error('Ollama not reachable');
                const data = await res.json();
                return (data.models || []).map(m => ({
                    id: `ollama-${m.name.replace(/[:.]/g, '-')}`,
                    name: m.name,
                    size: m.size,
                    task: 'chat',
                    runtime: 'ollama-api',
                    priority: 1,
                    endpoint: 'http://localhost:11434/api/generate'
                }));
            } catch (e) {
                console.log('[AI] Ollama detection:', e.message);
                return [];
            }
        },
        
        // Register a model/adapter in the registry
        register: (id, module, options = {}) => {
            window.DreamOS.ai.registry[id] = {
                module,
                options,
                loaded: false,
                async load() {
                    if (this.loaded) return this.module;
                    if (module.init) await module.init(options);
                    this.loaded = true;
                    return this.module;
                }
            };
            console.log(`✅ AI registered: ${id}`);
        },
        
        // Build registry from detected assets
        buildRegistry: async () => {
            console.log('🔍 Building AI registry...');
            
            // Detect Ollama models
            const ollamaModels = await window.DreamOS.ai.loader.detectOllama();
            console.log(`  • Found ${ollamaModels.length} Ollama models`);
            
            // Register each detected model
            for (const model of ollamaModels) {
                window.DreamOS.ai.loader.register(model.id, {
                    type: 'chat',
                    async generate(prompt, options = {}) {
                        const res = await fetch(model.endpoint, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                model: model.name,
                                prompt: prompt,
                                stream: false,
                                options: { temperature: options.temperature ?? 0.7 }
                            })
                        });
                        if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
                        const data = await res.json();
                        return {
                            content: data.response || '',
                            metadata: { model: model.name, provider: 'ollama' }
                        };
                    }
                }, model);
            }
            
            // Load config if available
            try {
                const configRes = await fetch('./config/ai.registry.json');
                if (configRes.ok) {
                    window.DreamOS.ai.config = await configRes.json();
                    console.log('  • Config loaded');
                }
            } catch (e) {
                console.log('[AI] Config not found (optional)');
            }
            
            console.log(`🧠 Registry ready: ${Object.keys(window.DreamOS.ai.registry).length} models`);
            return { local: ollamaModels.length, online: 0 };
        }
    };
    
    console.log('🔌 DreamOS.ai.loader ready');
})();
