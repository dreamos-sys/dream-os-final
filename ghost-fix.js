// Script untuk mengganti ghost hub lama dengan yang baru
var oldGhost = document.getElementById('ghost-hub');
if (oldGhost) {
  // Buat iframe yang memuat halaman 4s-ghost terbaru
  var iframe = document.createElement('iframe');
  iframe.src = 'modules/4s-ghost.html';
  iframe.style.width = '100%';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.zIndex = '99999';
  document.body.appendChild(iframe);
  oldGhost.remove(); // hapus yang lama
}
