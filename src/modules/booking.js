// modules/booking.js
(() => {
  const init = (core) => {
    const grid = document.querySelector('.grid-9');
    if (!grid) return;

    const el = document.createElement('div');
    el.className = 'mod';
    el.innerHTML = `<i class="fas fa-calendar-check"></i><span>BOOKING</span>`;
    
    el.onclick = () => core.emit('booking:open', { 
      msg: 'Booking clicked', 
      ts: Date.now() 
    });

    core.on('booking:confirm', (data) => {
      console.log('📅 Booking confirmed:', data);
      alert('✅ Booking berhasil!');
    });

    grid.appendChild(el);
  };

  if (window.DreamCore) {
    window.DreamCore.registerModule('Booking', init);
  } else {
    document.addEventListener('core:ready', () => {
      window.DreamCore.registerModule('Booking', init);
    });
  }
})();
