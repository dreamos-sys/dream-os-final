// Dream OS Carousel — 7 Slides, 7 Detik, AI-Enhanced
// Edit slides di array, logic terpisah

const carouselData = {
    slides: [
        // ... slide 1-3 sama seperti sebelumnya ...
        {
            id: 'weather',
            icon: 'cloud-rain',
            titleKey: 'carousel.weather_title',
            // Dynamic content — akan di-fill oleh AI
            content: `<div id="weather-ai-content" class="text-center py-4">
                <i data-lucide="cloud" class="w-12 h-12 text-amber-400 mx-auto mb-2 animate-pulse"></i>
                <p class="text-xs text-slate-400">Loading AI Prediction...</p>
            </div>`
        },
        // ... slide 5-7 sama ...
    ],
    
    // ... (kode init, render, autoSlide sama seperti sebelumnya) ...
    
    // NEW: Load AI Weather Prediction
    async loadWeatherPrediction() {
        const container = document.getElementById('weather-ai-content');
        if (!container || !window.aiService) return;
        
        // Coba dapat lokasi user (opsional)
        let location = 'Depok, Indonesia'; // Default
        if (navigator.geolocation) {
            try {
                const pos = await new Promise((res, rej) => 
                    navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
                );
                location = `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
            } catch (e) {
                console.log('📍 Geo fallback to default');
            }
        }
        
        // Query ke Nemo-120B
        const result = await aiService.predictWeather(location);
        
        if (result.success) {
            container.innerHTML = `
                <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <p class="text-xs mb-2">🌤️ ${result.response.split('\n')[0]}</p>
                    ${result.response.includes('⚠️') ? 
                        `<p class="text-[10px] text-amber-400 mb-1">${result.response.match(/⚠️.*?(?=\.|$)/)?.[0] || 'AI Warning'}</p>` : ''}
                    <p class="text-[10px] text-slate-300">${result.response.split('\n').slice(1).join('<br>')}</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-center">
                    <p class="text-xs text-slate-400">🌤️ Cuaca: Cerah Berawan</p>
                    <p class="text-[10px] text-slate-500 mt-1">(AI Agent offline — fallback mode)</p>
                </div>
            `;
        }
        
        setTimeout(() => lucide.createIcons(), 50);
    },
    
    // Override init untuk load AI after render
    init() {
        this.render();
        this.startAutoSlide();
        this.attachDotListeners();
        // Load AI prediction after carousel ready
        setTimeout(() => this.loadWeatherPrediction(), 1000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.carouselData) carouselData.init();
});
