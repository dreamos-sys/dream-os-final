// Dream OS Carousel — 7 Slides, 7 Detik
// Edit slides disini, nggak perlu ubah index.html!

const carouselData = {
    slides: [
        {
            id: 'welcome',
            icon: 'hand',
            titleKey: 'carousel.welcome_title',
            content: `<h3 class="text-sm font-bold text-amber-400 mb-2" data-i18n="carousel.welcome_title">Selamat Datang</h3>
                     <p class="text-xs text-slate-300 mb-4" data-i18n="carousel.welcome_text">Selamat datang Bapak/Ibu. Silahkan dipilih formnya sesuai kebutuhan. Terima kasih.</p>
                     <i data-lucide="hand" class="w-12 h-12 text-emerald-400 mx-auto"></i>`
        },
        {
            id: 'booking',
            icon: 'calendar',
            titleKey: 'carousel.booking_title',
            content: `<h3 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4"></i> <span data-i18n="carousel.booking_title">Jadwal Booking</span></h3>
                     <div class="space-y-2">
                         <div class="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                             <p class="text-[10px] text-slate-400">Hari Ini</p>
                             <p class="text-xs font-semibold">Rapat Koordinasi - 09:00 WIB</p>
                         </div>
                         <div class="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                             <p class="text-[10px] text-emerald-400">Besok</p>
                             <p class="text-xs font-semibold">Kunjungan Yayasan - 13:00 WIB</p>
                         </div>
                     </div>`
        },
        {
            id: 'k3',
            icon: 'activity',
            titleKey: 'carousel.k3_title',
            content: `<h3 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2"><i data-lucide="activity" class="w-4 h-4"></i> <span data-i18n="carousel.k3_title">Progress K3</span></h3>
                     <div class="space-y-2">
                         <div class="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                             <div class="flex justify-between text-[10px] mb-1"><span>AC Ruang Rapat</span><span class="text-amber-400">Proses</span></div>
                             <div class="w-full bg-slate-800 rounded-full h-1.5"><div class="bg-amber-400 h-1.5 rounded-full" style="width: 60%"></div></div>
                         </div>
                         <div class="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                             <div class="flex justify-between text-[10px] mb-1"><span>Kebersihan Lobby</span><span class="text-emerald-400">Selesai</span></div>
                             <div class="w-full bg-slate-800 rounded-full h-1.5"><div class="bg-emerald-400 h-1.5 rounded-full" style="width: 100%"></div></div>
                         </div>
                     </div>`
        },
        {
            id: 'weather',
            icon: 'cloud-rain',
            titleKey: 'carousel.weather_title',            content: `<h3 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2"><i data-lucide="cloud-rain" class="w-4 h-4"></i> <span data-i18n="carousel.weather_title">Cuaca & AI Warning</span></h3>
                     <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                         <p class="text-xs mb-2">🌤️ Cerah Berawan - 32°C</p>
                         <p class="text-[10px] text-amber-400 mb-1">⚠️ AI Prediction:</p>
                         <p class="text-[10px] text-slate-300">Hujan ringan pukul 15:00. Janitor Outdoor siap siaga. Security pantau area parkir.</p>
                     </div>`
        },
        {
            id: 'management',
            icon: 'building-2',
            titleKey: 'carousel.management_title',
            content: `<h3 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2"><i data-lucide="building-2" class="w-4 h-4"></i> <span data-i18n="carousel.management_title">Info Management</span></h3>
                     <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                         <p class="text-[10px] text-slate-400 mb-1">Rapat CEO & Yayasan</p>
                         <p class="text-xs font-semibold">Pukul 09:00 WIB di Ruang Rapat SMA</p>
                     </div>`
        },
        {
            id: 'team',
            icon: 'users',
            titleKey: 'carousel.team_title',
            content: `<h3 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2"><i data-lucide="users" class="w-4 h-4"></i> <span data-i18n="carousel.team_title">Info Team Umum</span></h3>
                     <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                         <p class="text-[10px] text-slate-400 mb-1">Rapat Mingguan</p>
                         <p class="text-xs font-semibold">Jam 09:00 WIB di R. Koord Bagian Umum</p>
                     </div>`
        },
        {
            id: 'social',
            icon: 'gift',
            titleKey: 'carousel.social_title',
            content: `<h3 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2"><i data-lucide="gift" class="w-4 h-4"></i> <span data-i18n="carousel.social_title">Ucapan & Info</span></h3>
                     <div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                         <p class="text-xs mb-1">🎂 Selamat Ulang Tahun</p>
                         <p class="text-[10px] text-slate-300">Pak Budi (Komisi 3 Bulan). Semoga berkah dan sukses selalu!</p>
                     </div>`
        }
    ],
    
    currentSlide: 0,
    interval: null,
    SLIDE_DURATION: 7000, // 7 detik
    
    init() {
        this.render();
        this.startAutoSlide();
        this.attachDotListeners();
    },
    
    render() {        const container = document.getElementById('carousel-container');
        if (!container) return;
        
        container.innerHTML = `
            <div id="carousel-slides">
                ${this.slides.map((slide, i) => `
                    <div class="carousel-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
                        ${slide.content}
                    </div>
                `).join('')}
            </div>
            <div class="carousel-dots">
                ${this.slides.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`).join('')}
            </div>
        `;
        
        setTimeout(() => lucide.createIcons(), 50);
    },
    
    startAutoSlide() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, this.SLIDE_DURATION);
    },
    
    nextSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        
        slides[this.currentSlide].classList.remove('active');
        dots[this.currentSlide].classList.remove('active');
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        
        slides[this.currentSlide].classList.add('active');
        dots[this.currentSlide].classList.add('active');
    },
    
    attachDotListeners() {
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            });
        });
    },
    
    goToSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');        
        slides[this.currentSlide].classList.remove('active');
        dots[this.currentSlide].classList.remove('active');
        
        this.currentSlide = index;
        
        slides[this.currentSlide].classList.add('active');
        dots[this.currentSlide].classList.add('active');
        
        // Reset timer
        clearInterval(this.interval);
        this.startAutoSlide();
    }
};

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    carouselData.init();
});
