// 🕌 Prayer Helper — Jadwal Shalat + UI Adaptif Maghrib
// Usage: import { initPrayerUI, isAfterMaghrib } from './prayer.js'

export const PRAYER_API = '/api/prayer';

// Fetch prayer times from backend
export async function fetchPrayerTimes(lat = null, lon = null) {
  const qs = new URLSearchParams();
  if (lat && lon) {
    qs.append('lat', lat);
    qs.append('lon', lon);
  }
  qs.append('method', '4'); // Kemenag RI
  
  try {
    const res = await fetch(`${PRAYER_API}?${qs}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('⚠️ Prayer API error:', err.message);
    // Fallback: return mock data (biar UI nggak broken)
    return {
      date: new Date().toLocaleDateString('id-ID'),
      prayers: { fajr: '04:30', dhuhr: '12:00', asr: '15:15', maghrib: '18:00', isha: '19:15' },
      fallback: true
    };
  }
}

// Cek apakah sekarang sudah lewat Maghrib
export function isAfterMaghrib(maghribTime) {
  const [h, m] = maghribTime.split(':').map(Number);
  const maghrib = new Date();
  maghrib.setHours(h, m, 0, 0);
  return new Date() >= maghrib;
}

// Adaptif UI: ganti tema setelah Maghrib
export function adaptUIAfterMaghrib(isAfter) {
  const root = document.documentElement;
  if (isAfter) {
    // Tema malam: White Batik Betawi → Dark Elegant
    root.style.setProperty('--bg-primary', '#0f172a');
    root.style.setProperty('--text-primary', '#f1f5f9');
    root.style.setProperty('--accent-color', '#fbbf24'); // Emas Sultan
    document.body.classList.add('maghrib-mode');
  } else {
    // Tema siang: White Batik Betawi
    root.style.setProperty('--bg-primary', '#f8fafc');
    root.style.setProperty('--text-primary', '#0f172a');
    root.style.setProperty('--accent-color', '#10b981'); // Emerald
    document.body.classList.remove('maghrib-mode');
  }
}

// Init prayer UI (panggil sekali di DOMContentLoaded)
export async function initPrayerUI() {
  // Coba dapat lokasi user (opsional, butuh permission)
  let lat, lon;
  if ('geolocation' in navigator) {
    try {
      const pos = await new Promise((resolve, reject) => 
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    } catch (e) {
      console.log('📍 Geolocation denied, using Jakarta default');
    }
  }
  
  // Fetch + render
  const data = await fetchPrayerTimes(lat, lon);
  if (data.fallback) {
    console.log('🕌 Using fallback prayer times');
  }
  
  // Tampilkan di UI (contoh: tambahkan widget kecil)
  const prayerWidget = document.createElement('div');
  prayerWidget.id = 'prayer-widget';
  prayerWidget.className = 'fixed bottom-20 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-2 rounded-xl shadow-lg text-xs';
  prayerWidget.innerHTML = `
    <div class="font-bold text-emerald-600 dark:text-amber-400">🕌 ${data.prayers.maghrib}</div>
    <div class="text-gray-500 dark:text-gray-400">Maghrib</div>
  `;
  document.body.appendChild(prayerWidget);
  
  // Adaptif UI
  adaptUIAfterMaghrib(isAfterMaghrib(data.prayers.maghrib));
  
  // Schedule re-check every 5 minutes (biar UI update pas Maghrib tiba)
  setInterval(() => {
    adaptUIAfterMaghrib(isAfterMaghrib(data.prayers.maghrib));
  }, 300000);
  
  return data;
}
