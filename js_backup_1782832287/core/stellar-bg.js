// 🌌 DREAM OS GLOBAL STELLAR BACKGROUND
// Aman, ringan, tidak menyentuh modul apa pun.
(function() {
  // Hanya buat satu canvas
  if (document.getElementById('stellar-bg')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'stellar-bg';
  canvas.style.cssText = 'position:fixed; inset:0; z-index:0; pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let w, h, stars = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((w * h) / 8000); // kepadatan rendah, ringan
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2,
        v: Math.random() * 0.15
      });
    }
  }

  function draw() {
    if (document.hidden) {
      requestAnimationFrame(draw);
      return; // pause saat tab tidak aktif
    }
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    stars.forEach(s => {
      s.y -= s.v;
      if (s.y < 0) { s.y = h; s.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();
