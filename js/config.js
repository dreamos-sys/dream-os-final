/* v102-shim: jaga-jaka kalau CDN supabase gagal dimuat / project down.
   Mencegah ReferenceError mematikan seluruh config.js.
   App akan otomatis degrade ke OFFLINE MODE dengan anggun. */
if (typeof window.supabase === 'undefined') {
  console.warn('[v102-shim] supabase global tidak ada — aktifkan OFFLINE MODE');
  window.__DREAMOS_OFFLINE = true;
  window.supabase = {
    __unavailable: true,
    createClient: function () {
      console.warn('[v102-shim] createClient() dipanggil tapi Supabase tidak tersedia');
      return null;
    }
  };
}
window.SUPABASE_URL = window.SUPABASE_URL || 'https://gbigjdhifispatrrskgh.supabase.co';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'sb_publishable_MDjJgv3z5o2NNLBz3mm1sg_3pqZD2Hp';
window.supabaseClient = window.supabaseClient || supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
