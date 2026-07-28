/**
 * Web Push subscribe
 * Ganti VAPID_PUBLIC_KEY dengan key dari server (Supabase Edge / Cloudflare Worker)
 */
(function (global) {
  'use strict';

  // TODO: isi public key VAPID (base64 url-safe)
  var VAPID_PUBLIC_KEY = global.DREAMOS_VAPID_PUBLIC || '';

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var raw = atob(base64);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  async function ensureSW() {
    if (!('serviceWorker' in navigator)) throw new Error('SW not supported');
    var reg = await navigator.serviceWorker.register('./sw.js');
    await navigator.serviceWorker.ready;
    return reg;
  }

  async function subscribePush() {
    var reg = await ensureSW();
    if (!('PushManager' in window)) {
      console.warn('[Push] PushManager tidak tersedia');
      return null;
    }
    if (!VAPID_PUBLIC_KEY) {
      console.warn('[Push] VAPID_PUBLIC_KEY kosong — hanya local Notification aktif');
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      return null;
    }
    var perm = await Notification.requestPermission();
    if (perm !== 'granted') throw new Error('Izin notifikasi ditolak');

    var sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Simpan lokal + kirim ke backend Anda
    try {
      localStorage.setItem('dreamos_push_sub', JSON.stringify(sub.toJSON()));
    } catch (e) {}

    // Contoh kirim ke Supabase table push_subscriptions (buat tabel dulu)
    if (global.supabaseClient) {
      try {
        var user = {};
        try { user = JSON.parse(localStorage.getItem('dreamos_bound_user') || '{}'); } catch (e) {}
        await global.supabaseClient.from('push_subscriptions').upsert({
          endpoint: sub.endpoint,
          keys: sub.toJSON().keys,
          email: user.email || null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'endpoint' });
      } catch (e) {
        console.warn('[Push] simpan sub ke DB', e);
      }
    }

    console.log('[Push] subscribed');
    return sub;
  }

  global.DreamPush = { subscribe: subscribePush, ensureSW: ensureSW };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      subscribePush().catch(function (e) { console.warn(e); });
    });
  } else {
    subscribePush().catch(function (e) { console.warn(e); });
  }
})(window);
