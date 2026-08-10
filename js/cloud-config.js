// ===== DREAM OS CLOUD CONFIG (Multi-Backend Ready) =====
// Prinsip: Supabase = PRIMARY, InsForge = WARM STANDBY (DR)
// Saklar 'enabled' tetap false sampai adapter selesai diuji.
window.DreamCloud = {
  primary: 'supabase',
  standby: 'insforge',
  insforge: {
    baseUrl: 'https://7g2j2h3j.ap-southeast.insforge.app/',
    publicKey: 'ik_1f74594585d16a3b5400d669b145b79a',
    enabled: false   // ← SAKLAR DR. Jangan dinyalakan dulu!
  }
};
