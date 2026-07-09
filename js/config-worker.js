/**
 * Dream OS API Gateway Configuration
 * Digunakan untuk mengarahkan frontend ke Cloudflare Worker
 */
window.DREAMOS_WORKER = {
  // Ganti dengan URL worker setelah deploy
  url: 'https://dreamos-sync-api.afumum234.workers.dev',
  endpoints: {
    sync: '/sync',
    broadcast: '/broadcast',
    audit: '/audit',
    command: '/command',
    health: '/health'
  },
  // API Key untuk otentikasi ke worker (di-set manual setelah deploy)
  apiKey: 'dreamos-worker-key-production'
};
