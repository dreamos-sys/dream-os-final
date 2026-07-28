/**
 * Dream OS — optimized Supabase Realtime for bookings
 * - single channel
 * - debounce merge/pull
 * - event filter INSERT|UPDATE|DELETE
 */
(function (global) {
  'use strict';

  var DEBOUNCE_MS = 450;
  var channelName = 'dreamos-bookings-rt';
  var timer = null;
  var bound = false;

  function getLocal() {
    try { return JSON.parse(localStorage.getItem('dreamos_bookings') || '[]'); }
    catch (e) { return []; }
  }
  function saveLocal(arr) {
    localStorage.setItem('dreamos_bookings', JSON.stringify(arr));
    try { global.dispatchEvent(new CustomEvent('booking-updated', { detail: { source: 'realtime' } })); } catch (e) {}
  }

  function mergeRows(remoteRows) {
    var map = {};
    getLocal().forEach(function (b) { if (b && b.id) map[b.id] = b; });
    (remoteRows || []).forEach(function (b) {
      if (b && b.id) map[b.id] = Object.assign({}, map[b.id] || {}, b);
    });
    return Object.keys(map).map(function (k) { return map[k]; })
      .sort(function (a, b) {
        return String(b.created_at || '').localeCompare(String(a.created_at || ''));
      });
  }

  /** Pull ringan: kolom yang dipakai UI saja */
  async function pullOptimized() {
    var sb = global.supabaseClient;
    if (!sb) return;
    var res = await sb.from('bookings')
      .select('id,tgl,tgl_display,ruang,nama_peminjam,no_hp,divisi,jam_mulai,jam_selesai,keperluan,sarana_alat,status,created_at,created_by,approved_by,approved_at,reject_reason')
      .order('created_at', { ascending: false })
      .limit(200);
    if (res.error) throw res.error;
    saveLocal(mergeRows(res.data || []));
    return res.data;
  }

  function schedulePull(reason) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      pullOptimized()
        .then(function () {
          if (typeof global.renderBookings === 'function') global.renderBookings();
          console.log('[RT] pull OK', reason || '');
        })
        .catch(function (e) { console.warn('[RT] pull', e); });
    }, DEBOUNCE_MS);
  }

  function toastOrNotify(title, body) {
    try {
      if ('Notification' in global && Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: './assets/icon-192.png',
          badge: './assets/icon-192.png',
          tag: 'dreamos-booking-rt'
        });
      }
    } catch (e) {}
    try {
      var n = JSON.parse(localStorage.getItem('dreamos_notifications') || '[]');
      n.unshift({ type: 'info', msg: title + ' — ' + body, time: new Date().toISOString() });
      if (n.length > 50) n.length = 50;
      localStorage.setItem('dreamos_notifications', JSON.stringify(n));
    } catch (e) {}
  }

  function startBookingRealtime() {
    var sb = global.supabaseClient;
    if (!sb || !sb.channel) {
      console.warn('[RT] supabaseClient belum siap');
      return;
    }
    if (bound) return;
    bound = true;

    // Initial optimized pull
    schedulePull('init');

    sb.channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        function (payload) {
          var ev = payload.eventType;
          var row = payload.new || payload.old || {};
          // Merge satu baris dulu (cepat), lalu debounce full pull
          if (ev === 'DELETE' && payload.old && payload.old.id) {
            saveLocal(getLocal().filter(function (b) { return b.id !== payload.old.id; }));
          } else if (payload.new && payload.new.id) {
            var map = {};
            getLocal().forEach(function (b) { if (b && b.id) map[b.id] = b; });
            map[payload.new.id] = Object.assign({}, map[payload.new.id] || {}, payload.new);
            saveLocal(Object.keys(map).map(function (k) { return map[k]; }));
          }
          if (typeof global.renderBookings === 'function') global.renderBookings();

          if (ev === 'INSERT') {
            toastOrNotify(
              '📅 Booking baru',
              (row.ruang || '') + ' · ' + (row.nama_peminjam || '') + ' · ' +
              (row.jam_mulai || '') + '–' + (row.jam_selesai || '')
            );
          } else if (ev === 'UPDATE' && row.status) {
            toastOrNotify(
              '📋 Booking ' + row.status,
              (row.ruang || '') + ' · ' + (row.nama_peminjam || '')
            );
          }
          schedulePull(ev);
        }
      )
      .subscribe(function (status) {
        console.log('[RT] status', status);
      });
  }

  global.DreamBookingRT = {
    start: startBookingRealtime,
    pull: pullOptimized,
    schedulePull: schedulePull
  };

  // Auto-start saat client siap
  function tryStart() {
    if (global.supabaseClient) startBookingRealtime();
    else setTimeout(tryStart, 800);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryStart);
  } else {
    tryStart();
  }
})(window);
