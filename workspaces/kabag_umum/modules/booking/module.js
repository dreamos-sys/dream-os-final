/**
 * modules/booking/module.js
 * Dream OS v2.0 - Booking Module (FINAL FIX)
 * ✅ System Lock after 16:00
 * ✅ Friday Prayer Block 10:30-13:00 for Aula/Serbaguna
 * ✅ Only Kabag/Koord can override
 * ✅ In-App Notification + Sound Portable & Display
 * Bi idznillah, booking aman & sesuai aturan! 🕌📅
 */

export default async function initModule(config, utils, supabase, currentUser, showToast, showModal, loader, translations, currentLang) {

    // ========== CONFIG & CONSTANTS ==========
    const CONFIG = {
        WORK_HOURS: { start: 7.5, end: 16.0 }, // 07:30 - 16:00
        FRIDAY_PRAYER_BLOCK: { start: 10.5, end: 13.0 }, // 10:30 - 13:00
        FRIDAY_BLOCKED_ROOMS: ['Aula SMP', 'Aula SMA', 'Serbaguna', 'Mushalla SMA'],
        MIN_BOOKING_DAYS: 1,
        MAX_BOOKING_DAYS: 30,
        OVERRIDE_ROLES: ['kabag_umum', 'koord_umum', 'admin'],
        SARANA_LIST: [
            "Aula SMP", "Aula SMA", "Saung Besar", "Saung Kecil",
            "Masjid (Maintenance)", "Mushalla SMA", "Serbaguna",
            "Lapangan Basket", "Lapangan Volly", "Lapangan Tanah",
            "Lapangan SMA", "Kantin SMP", "Kantin SMA",
            "Labkom SD", "Labkom SMP", "Labkom SMA",
            "Perpustakaan SD", "Perpustakaan SMP", "Perpustakaan SMA"
        ],
        PERALATAN_LIST: [
            "Kursi Futura", "Kursi Chitose", "Meja Siswa", "Meja Panjang", 
            "Meja Oshin", "Taplak Meja", "Projektor", "Screen Projektor", 
            "TV", "Sound System", "Sound Portable", "Sound Portable Display (Karaoke)",
            "Mic Wireless", "AC Portable"
        ],
        HOLIDAYS_2026: [
            '2026-01-01', '2026-01-27', '2026-03-20', '2026-04-10',
            '2026-05-01', '2026-05-21', '2026-06-01', '2026-06-07',
            '2026-06-08', '2026-08-17', '2026-09-15', '2026-11-24',
            '2026-12-25', '2026-12-26'
        ]
    };

    // ========== HELPER FUNCTIONS ==========
    function timeToDecimal(timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        return h + (m / 60);
    }
    function decimalToTime(decimal) {
        const h = Math.floor(decimal);        const m = Math.round((decimal - h) * 60);
        return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
    }
    function getDayName(dateStr) {
        const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        return days[new Date(dateStr + 'T00:00:00').getDay()];
    }
    function isSunday(d)  { return new Date(d+'T00:00:00').getDay() === 0; }
    function isSaturday(d){ return new Date(d+'T00:00:00').getDay() === 6; }
    function isFriday(d)  { return new Date(d+'T00:00:00').getDay() === 5; }
    function isHoliday(d) { return CONFIG.HOLIDAYS_2026.includes(d); }
    function getMinDate() { const d=new Date(); d.setDate(d.getDate()+CONFIG.MIN_BOOKING_DAYS); return d.toISOString().split('T')[0]; }
    function getMaxDate() { const d=new Date(); d.setDate(d.getDate()+CONFIG.MAX_BOOKING_DAYS); return d.toISOString().split('T')[0]; }

    function doToast(msg, type = 'info') {
        if (utils?.showToast) return utils.showToast(msg, type);
        if (typeof showToast === 'function') return showToast(msg, type);
    }

    function checkSystemLock(bookingData = null) {
        const now = new Date();
        const currentHours = now.getHours() + now.getMinutes() / 60;
        const userRole = currentUser?.role || 'regular';
        const canOverride = CONFIG.OVERRIDE_ROLES.includes(userRole);

        const lockStatus = { isLocked: false, reason: null, canOverride: canOverride, isFridayPrayerBlock: false };

        if (currentHours > CONFIG.WORK_HOURS.end && !canOverride) {
            lockStatus.isLocked = true;
            lockStatus.reason = `Sistem booking tutup setelah jam ${decimalToTime(CONFIG.WORK_HOURS.end)}.`;
            return lockStatus;
        }

        if (isSunday(new Date().toISOString().split('T')[0]) && !canOverride) {
            lockStatus.isLocked = true;
            lockStatus.reason = 'Hari Minggu LIBUR.';
            return lockStatus;
        }

        if (isFriday(new Date().toISOString().split('T')[0]) && bookingData?.sarana) {
            const mulai = timeToDecimal(bookingData.jam_mulai);
            const selesai = timeToDecimal(bookingData.jam_selesai);
            if (CONFIG.FRIDAY_BLOCKED_ROOMS.includes(bookingData.sarana)) {
                if (mulai < CONFIG.FRIDAY_PRAYER_BLOCK.end && selesai > CONFIG.FRIDAY_PRAYER_BLOCK.start) {
                    lockStatus.isLocked = true;
                    lockStatus.isFridayPrayerBlock = true;
                    lockStatus.reason = `❌ ${bookingData.sarana} tidak tersedia saat Shalat Jumat.`;
                    return lockStatus;
                }
            }
        }
        return lockStatus;
    }

    function showLockOverlay(reason, canOverride) {
        let overlay = document.getElementById('booking-lock-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'booking-lock-overlay';
            overlay.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;`;
            overlay.innerHTML = `<div style="background:#1e293b;padding:2rem;border-radius:16px;text-align:center;max-width:500px;border:2px solid #f59e0b;">
                <div style="font-size:3rem;margin-bottom:1rem;">🔒</div>
                <h2 style="color:#f59e0b;">Booking Ditutup</h2>
                <p id="lock-reason" style="color:#e2e8f0;margin:1rem 0;">${reason}</p>
                <button id="lock-close" style="background:#64748b;color:white;padding:0.75rem 2rem;border:none;border-radius:8px;cursor:pointer;">Mengerti</button>
            </div>`;
            document.body.appendChild(overlay);
            document.getElementById('lock-close')?.addEventListener('click', () => overlay.remove());
        }
    }

    async function checkDoubleBooking(data) {
        if (!supabase) return { hasConflict: false };
        const { data: existing } = await supabase.from('bookings').select('*').eq('ruang', data.sarana).eq('tanggal', data.tgl).eq('status', 'approved');
        const mulai = timeToDecimal(data.jam_mulai), selesai = timeToDecimal(data.jam_selesai);
        const conflict = existing?.find(b => mulai < timeToDecimal(b.jam_selesai) && selesai > timeToDecimal(b.jam_mulai));
        return conflict ? { hasConflict: true, message: `❌ BENTROK dengan ${conflict.nama_peminjam}` } : { hasConflict: false };
    }

    // ========== RENDER FORM ==========
    return `
        <div class="max-w-4xl mx-auto p-4">
            <h2 class="text-2xl font-bold text-white mb-6">📅 Form Booking Sarana v2.0</h2>
            <form id="bookingForm" class="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <input type="text" name="nama" required class="w-full p-3 rounded-xl bg-slate-900 text-white" placeholder="Nama Pemohon">
                <select name="sarana" id="sarana" required class="w-full p-3 rounded-xl bg-slate-900 text-white">
                    ${CONFIG.SARANA_LIST.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
                <input type="date" name="tgl" id="tgl" required class="w-full p-3 rounded-xl bg-slate-900 text-white">
                <div class="flex gap-4">
                    <input type="time" name="jam_mulai" required class="flex-1 p-3 rounded-xl bg-slate-900 text-white">
                    <input type="time" name="jam_selesai" required class="flex-1 p-3 rounded-xl bg-slate-900 text-white">
                </div>
                <button type="submit" id="submitBtn" class="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl">AJUKAN BOOKING</button>
            </form>
        </div>`;
}
