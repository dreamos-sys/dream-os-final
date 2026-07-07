        // ========== FUNGSI LENGKAP DASHBOARD ==========
        function startLiveClock() {
            setInterval(() => {
                const el = document.getElementById('live-clock');
                if (el) el.textContent = '⏱️ ' + new Date().toLocaleTimeString('id-ID');
            }, 1000);
        }

        function startBatteryMonitor() {
            if ('getBattery' in navigator) {
                navigator.getBattery().then(b => {
                    const el = document.getElementById('battery-status');
                    const update = () => {
                        const level = Math.round(b.level * 100);
                        const charging = b.charging ? '⚡' : '🔋';
                        if (el) el.textContent = charging + ' ' + level + '%';
                    };
                    update();
                    b.addEventListener('levelchange', update);
                    b.addEventListener('chargingchange', update);
                }).catch(() => {
                    const el = document.getElementById('battery-status');
                    if (el) el.textContent = '🔋 --%';
                });
            }
        }

        async function checkConnection() {
            const el = document.getElementById('connection-status');
            if (!el) return;
            if (!navigator.onLine) {
                el.textContent = '📡 Offline';
                el.className = 'badge offline';
                return;
            }
            try {
                const start = Date.now();
                const res = await fetch('https://gbigjdhifispatrrskgh.supabase.co/rest/v1/', {
                    method: 'HEAD',
                    headers: { 'apikey': window.DREAMOS_CONFIG?.supabaseKey || '' }
                });
                const latency = Date.now() - start;
                if (res.ok) {
                    el.textContent = '📡 Online (' + latency + 'ms)';
                    el.className = 'badge online';
                } else {
                    throw new Error('Status ' + res.status);
                }
            } catch (e) {
                el.textContent = '📡 Offline';
                el.className = 'badge offline';
            }
            setInterval(checkConnection, 30000);
        }

        async function fetchPrayerTimes() {
            const el = document.getElementById('prayer-times-dash');
            if (!el) return;
            try {
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                // Koordinat Jakarta default
                const lat = -6.2088;
                const lon = 106.8456;
                const res = await fetch('https://api.aladhan.com/v1/timings/' + year + '-' + month + '-' + day + '?latitude=' + lat + '&longitude=' + lon + '&method=20');
                const data = await res.json();
                if (data.code === 200) {
                    const t = data.data.timings;
                    el.innerHTML = '🕌 Subuh ' + t.Fajr + ' | Dzuhur ' + t.Dhuhr + ' | Ashar ' + t.Asr + ' | Maghrib ' + t.Maghrib + ' | Isya ' + t.Isha;
                } else {
                    el.textContent = '🕌 Gagal memuat waktu shalat.';
                }
            } catch (e) {
                el.textContent = '🕌 Gagal memuat waktu shalat.';
            }
        }

        function showSlides() {
            const track = document.getElementById('dream-slide-track');
            const dotsContainer = document.getElementById('slide-dots');
            if (!track || !dotsContainer) return;

            const slide5 = localStorage.getItem('dreamos_slide_5') || '🌟 Selamat Datang di Dream OS Enterprise';
            const slide6 = localStorage.getItem('dreamos_slide_6') || '🏫 Sistem Manajemen Sekolah Terpadu';
            const slide7 = localStorage.getItem('dreamos_slide_7') || '🔒 Keamanan & K3 Prioritas Utama';
            const secSlide = localStorage.getItem('dreamos_sec_today') || '🛡️ Security: Siaga penuh';

            const slides = [slide5, slide6, slide7, secSlide];
            
            track.innerHTML = slides.map(s => '<div class="dream-slide">' + s + '</div>').join('');
            dotsContainer.innerHTML = slides.map((_, i) => '<span class="dot' + (i === 0 ? ' active' : '') + '" onclick="goToSlide(' + i + ')"></span>').join('');

            function goToSlide(idx) {
                window.slideIdx = idx;
                track.style.transform = 'translateX(-' + (idx * 100) + '%)';
                document.querySelectorAll('#slide-dots .dot').forEach((d, i) => d.classList.toggle('active', i === idx));
            }

            window.goToSlide = goToSlide;

            slideInterval = setInterval(() => {
                window.slideIdx = (window.slideIdx + 1) % slides.length;
                goToSlide(window.slideIdx);
            }, 5000);
        }

        // Starfield canvas animation
        (function() {
            const canvas = document.getElementById('star-field');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let stars = [];
            let animationId;

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            function createStars() {
                const count = Math.floor((canvas.width * canvas.height) / 2000);
                stars = [];
                for (let i = 0; i < count; i++) {
                    stars.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        r: Math.random() * 1.5,
                        speed: 0.02 + Math.random() * 0.05
                    });
                }
            }
            createStars();
            window.addEventListener('resize', createStars);

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#e2e8f0';
                for (let s of stars) {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    ctx.fill();
                    s.y += s.speed;
                    if (s.y > canvas.height) {
                        s.y = 0;
                        s.x = Math.random() * canvas.width;
                    }
                }
                animationId = requestAnimationFrame(animate);
            }
            animate();

            window.addEventListener('beforeunload', () => cancelAnimationFrame(animationId));
        })();

        // Fungsi goHome
        window.goHome = function() {
            const modContainer = document.getElementById('mod-container');
            if (modContainer) {
                modContainer.style.display = 'none';
                modContainer.innerHTML = '';
            }
            document.getElementById('main-app').style.display = 'block';
            document.getElementById('bottom-nav').style.display = 'block';
            renderDashboard();
        };
