/**
 * 🛡️ PHANTOM ALERTER - Secure via Cloudflare Worker
 * Worker URL: dreamos-alert.afumum234.workers.dev
 */

const WORKER_URL = 'https://dreamos-alert.afumum234.workers.dev';

async function sendToWorker(type, data) {
  if (!WORKER_URL) return false;
  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data, timestamp: Date.now() })
    });
    return response.ok;
  } catch(e) {
    console.error('Worker error:', e);
    return false;
  }
}

window.PhantomAlerter = {
  failedLogin: (email, reason) => sendToWorker('FAILED_LOGIN', { email, reason }),
  newDevice: (email) => sendToWorker('NEW_DEVICE', { email }),
  newBooking: (ruang, peminjam, tgl) => sendToWorker('NEW_BOOKING', { ruang, peminjam, tgl }),
  k3Urgent: (lokasi, kategori) => sendToWorker('K3_URGENT', { lokasi, kategori }),
  approvalRequest: (tipe, judul) => sendToWorker('APPROVAL_REQUEST', { tipe, judul }),
  systemStartup: () => sendToWorker('SYSTEM_STARTUP', { email: JSON.parse(localStorage.getItem('dreamos_bound_user')||'{}').email || 'Unknown' })
};

console.log('🛡️ Phantom Alerter Secure Ready');
