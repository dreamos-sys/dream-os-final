/**
 * Dream OS API Gateway Configuration
 * Menggunakan Cloudflare Pages Functions
 */
window.DREAMOS_WORKER = {
  url: 'https://dream-os-final.pages.dev',
  endpoints: {
    health: '/health',
    sync: '/sync',
    broadcast: '/broadcast',
    audit: '/audit',
    command: '/command'
  },
  apiKey: 'dreamos-worker-key-production'
};
