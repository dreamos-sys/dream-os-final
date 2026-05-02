const carouselModule = {
    init() {
        const container = document.getElementById('carousel-slides');
        const dots = document.getElementById('carousel-dots');
        container.innerHTML = `<div class="carousel-slide active">
            <h4 class="text-xs font-bold text-teal-400 mb-1">Selamat Datang</h4>
            <p class="text-[9px] text-slate-400">Out of The Box Inside</p>
        </div>`;
        dots.innerHTML = `<div class="dot active"></div>`;
        document.getElementById('carousel-container').classList.remove('hidden');
    }
};
