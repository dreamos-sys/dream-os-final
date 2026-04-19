// modules/booking/index.js
// Dream OS v2.1 - Booking Module (Adapted from v2.0)
// ✅ System Lock after 16:00 • Friday Prayer Block • AI Agent Integrated • Zero Extra Files

import { ai } from '../../services/ai-agent.js';

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
const timeToDecimal = t => { const [h,m]=t.split(':').map(Number); return h+(m/60); };
const decimalToTime = d => { const h=Math.floor(d), m=Math.round((d-h)*60); return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; };
const getDayName = d => ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][new Date(d+'T00:00:00').getDay()];
const isSunday = d => new Date(d+'T00:00:00').getDay()===0;
const isSaturday = d => new Date(d+'T00:00:00').getDay()===6;
const isFriday = d => new Date(d+'T00:00:00').getDay()===5;
const isHoliday = d => CONFIG.HOLIDAYS_2026.includes(d);
const getMinDate = () => { const d=new Date(); d.setDate(d.getDate()+CONFIG.MIN_BOOKING_DAYS); return d.toISOString().split('T')[0]; };
const getMaxDate = () => { const d=new Date(); d.setDate(d.getDate()+CONFIG.MAX_BOOKING_DAYS); return d.toISOString().split('T')[0]; };

// Unified toast (fallback to alert if no utils)
const doToast = (msg, type='info') => {
  if (typeof showToast === 'function') return showToast(msg, type);  if (window.showToast) return window.showToast(msg, type);
  console.log(`[Booking][${type}] ${msg}`);
  // Fallback visual toast
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:${type==='error'?'#ef4444':type==='success'?'#22c55e':'#3b82f6'};color:white;padding:12px 24px;border-radius:12px;z-index:9999;animation:fadeInUp 0.3s;`;
  document.body.appendChild(el);
  setTimeout(()=>{el.style.opacity='0';setTimeout(()=>el.remove(),300)},2500);
};

// ========== CORE LOGIC: SYSTEM LOCK ==========
function checkSystemLock(bookingData = null) {
  const now = new Date();
  const currentHours = now.getHours() + now.getMinutes()/60;
  const userRole = (window.currentUser?.role) || 'regular';
  const canOverride = CONFIG.OVERRIDE_ROLES.includes(userRole);
  const lockStatus = { isLocked:false, reason:null, canOverride, isFridayPrayerBlock:false };

  // Lock after 16:00
  if (currentHours > CONFIG.WORK_HOURS.end && !canOverride) {
    lockStatus.isLocked = true;
    lockStatus.reason = `Sistem booking tutup setelah jam ${decimalToTime(CONFIG.WORK_HOURS.end)}. Hubungi Kabag/Koord untuk booking malam.`;
    return lockStatus;
  }
  // Lock Sunday
  if (isSunday(new Date().toISOString().split('T')[0]) && !canOverride) {
    lockStatus.isLocked = true;
    lockStatus.reason = 'Hari Minggu LIBUR. Booking tidak tersedia.';
    return lockStatus;
  }
  // Friday Prayer Block
  if (isFriday(new Date().toISOString().split('T')[0]) && bookingData?.sarana) {
    const start = timeToDecimal(bookingData.jam_mulai), end = timeToDecimal(bookingData.jam_selesai);
    const pStart = CONFIG.FRIDAY_PRAYER_BLOCK.start, pEnd = CONFIG.FRIDAY_PRAYER_BLOCK.end;
    if (CONFIG.FRIDAY_BLOCKED_ROOMS.includes(bookingData.sarana) && start < pEnd && end > pStart) {
      lockStatus.isLocked = true;
      lockStatus.isFridayPrayerBlock = true;
      lockStatus.reason = `❌ ${bookingData.sarana} tidak tersedia Jumat ${decimalToTime(pStart)}-${decimalToTime(pEnd)} untuk Shalat Jumat.`;
      return lockStatus;
    }
  }
  // Holiday lock
  if (isHoliday(new Date().toISOString().split('T')[0]) && !canOverride) {
    lockStatus.isLocked = true;
    lockStatus.reason = 'Hari ini libur nasional. Booking tidak tersedia.';
    return lockStatus;
  }
  return lockStatus;
}
// Show lock overlay modal
function showLockOverlay(reason, canOverride) {
  let overlay = document.getElementById('booking-lock-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'booking-lock-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:none;align-items:center;justify-content:center;z-index:9999;';
    overlay.innerHTML = `
      <div class="glass-card" style="max-width:500px;text-align:center;border:2px solid #f59e0b;">
        <div style="font-size:3rem;margin-bottom:1rem;">🔒</div>
        <h2 style="color:#f59e0b;margin-bottom:1rem;">Booking Ditutup</h2>
        <p id="lock-reason" style="margin-bottom:1.5rem;color:#e2e8f0;"></p>
        ${canOverride ? `<button id="lock-override" class="btn-primary" style="margin-right:8px;">Lanjut (Override)</button>`:''}
        <button id="lock-close" class="btn-primary" style="background:#64748b;">${canOverride?'Batal':'Mengerti'}</button>
      </div>`;
    document.body.appendChild(overlay);
    document.getElementById('lock-close')?.addEventListener('click', ()=>overlay.style.display='none');
    document.getElementById('lock-override')?.addEventListener('click', ()=>{
      overlay.style.display='none';
      const form=document.getElementById('bookingForm');
      if(form){form.dataset.override='true';doToast('⚠️ Booking dengan persetujuan khusus','warning');}
    });
  }
  document.getElementById('lock-reason').textContent = reason;
  overlay.style.display = 'flex';
}

// ========== VALIDATION ==========
function validateBooking(data) {
  const errors=[], warnings=[];
  const selected = new Date(data.tgl+'T00:00:00'), today = new Date(); today.setHours(0,0,0,0);
  if (selected < today) errors.push('Tanggal tidak boleh masa lalu!');
  if (isSunday(data.tgl)) errors.push('❌ Hari Minggu LIBUR!');
  if (isHoliday(data.tgl)) errors.push('❌ Tanggal merah LIBUR!');
  if (isSaturday(data.tgl)) warnings.push('⚠️ Sabtu hanya untuk team umum (perlu approval)');
  
  const mulai = timeToDecimal(data.jam_mulai), selesai = timeToDecimal(data.jam_selesai);
  if (mulai < CONFIG.WORK_HOURS.start) errors.push(`Jam mulai minimal ${decimalToTime(CONFIG.WORK_HOURS.start)}`);
  if (selesai > CONFIG.WORK_HOURS.end) errors.push(`Jam selesai maksimal ${decimalToTime(CONFIG.WORK_HOURS.end)}`);
  if (selesai <= mulai) errors.push('Jam selesai harus > jam mulai!');
  
  if (isFriday(data.tgl) && CONFIG.FRIDAY_BLOCKED_ROOMS.includes(data.sarana)) {
    const pStart=CONFIG.FRIDAY_PRAYER_BLOCK.start, pEnd=CONFIG.FRIDAY_PRAYER_BLOCK.end;
    if (mulai < pEnd && selesai > pStart) errors.push(`❌ ${data.sarana} tidak tersedia Jumat ${decimalToTime(pStart)}-${decimalToTime(pEnd)} untuk Shalat Jumat`);
  }
  if (data.sarana === 'Masjid (Maintenance)') errors.push('❌ Masjid sedang maintenance!');
  return {errors, warnings};
}

// ========== DOUBLE BOOKING CHECK (LocalStorage fallback) ==========async function checkDoubleBooking(data) {
  // Simulasi: cek dari localStorage (ganti dengan Supabase call kalau sudah integrate)
  const existing = JSON.parse(localStorage.getItem('dream_bookings') || '[]');
  const mulai = timeToDecimal(data.jam_mulai), selesai = timeToDecimal(data.jam_selesai);
  const conflict = existing.find(b => 
    b.sarana === data.sarana && b.tgl === data.tgl && b.status !== 'cancelled' &&
    mulai < timeToDecimal(b.jam_selesai) && selesai > timeToDecimal(b.jam_mulai)
  );
  if (conflict) return { hasConflict:true, message:`❌ BENTROK! ${data.sarana} sudah di-booking ${conflict.nama}` };
  return { hasConflict:false };
}

// ========== AI INTEGRATION: SMART SUGGESTION ==========
async function getAISuggestion(data) {
  try {
    const prompt = `Untuk booking "${data.keperluan||'acara'}" di ${data.sarana} tanggal ${data.tgl} jam ${data.jam_mulai}-${data.jam_selesai}, apa yang perlu disiapkan? (ATK, konsumsi, peralatan, cleaning). Jawab singkat 1 kalimat dalam Bahasa Indonesia.`;
    return await ai.query(prompt, { module:'booking', context:data });
  } catch(e) {
    return '💡 Mode offline: Pastikan persiapan manual sesuai kebutuhan acara.';
  }
}

// ========== RENDER UI (Using existing CSS classes from style.css) ==========
function renderForm(currentUser = {}) {
  return `
    <div class="module-header">
      <h2>📅 Booking Sarana</h2>
      <p class="subtitle">Anti double booking • System Lock • AI Smart Suggestion</p>
    </div>
    
    <!-- System Lock Alert -->
    <div id="system-lock-alert" class="alert alert-warning" style="display:none">
      <i class="fas fa-exclamation-triangle"></i>
      <span id="lock-alert-message"></span>
    </div>
    
    <form id="bookingForm" class="glass-card" style="text-align:left">
      <div class="form-row">
        <div class="form-group">
          <label>Nama Pemohon *</label>
          <input type="text" name="nama" required value="${currentUser.name||''}" placeholder="Nama lengkap">
        </div>
        <div class="form-group">
          <label>Divisi</label>
          <input type="text" name="divisi" value="${currentUser.role||''}" placeholder="Divisi">
        </div>
      </div>
      
      <div class="form-group">
        <label>No. HP *</label>        <input type="tel" name="no_hp" required placeholder="08xx-xxxx-xxxx">
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Sarana *</label>
          <select name="sarana" id="sarana" required>
            <option value="">-- Pilih --</option>
            ${CONFIG.SARANA_LIST.map(s=>`<option value="${s}">${s}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Tanggal *</label>
          <input type="date" name="tgl" id="tgl" required min="${getMinDate()}" max="${getMaxDate()}" value="${getMinDate()}">
          <p id="dateWarning" class="error-msg" style="display:none;font-size:0.75rem"></p>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Jam Mulai *</label>
          <input type="time" name="jam_mulai" id="jam_mulai" required min="07:30" max="16:00" value="08:00">
        </div>
        <div class="form-group">
          <label>Jam Selesai *</label>
          <input type="time" name="jam_selesai" id="jam_selesai" required min="07:30" max="16:00" value="10:00">
        </div>
      </div>
      
      <div class="form-group">
        <label>Peralatan Tambahan</label>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;background:rgba(255,255,255,0.05);padding:12px;border-radius:12px">
          ${CONFIG.PERALATAN_LIST.map(alat=>`
            <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem">
              <input type="checkbox" name="alat" value="${alat}"> ${alat}
            </label>
          `).join('')}
        </div>
      </div>
      
      <div class="form-group">
        <label>Keperluan</label>
        <textarea name="keperluan" rows="3" placeholder="Jelaskan keperluan booking..."></textarea>
      </div>
      
      <!-- AI Suggestion Box -->
      <div id="ai-suggestion" class="ai-box" style="display:none">
        <i class="fas fa-robot"></i>
        <p id="ai-text">💡 AI menganalisis kebutuhan booking...</p>
      </div>      
      <button type="submit" class="btn-primary" id="submitBtn">
        <span class="btn-text">✅ AJUKAN BOOKING</span>
        <span class="btn-loading" style="display:none">⏳ Memproses...</span>
      </button>
    </form>
    
    <div class="ai-box" style="margin-top:16px;background:rgba(59,130,246,0.1);border-color:rgba(59,130,246,0.3)">
      <i class="fas fa-info-circle" style="color:#3b82f6"></i>
      <p style="font-size:0.85rem">
        • Jam operasional: <strong>07:30-16:00</strong> (Senin-Jumat)<br>
        • Jumat 10:30-13:00: Aula/Serbaguna <strong>tidak tersedia</strong> (Shalat Jumat)<br>
        • Booking minimal <strong>H-1</strong> • Minggu & Libur: <strong>LIBUR</strong>
      </p>
    </div>
  `;
}

// ========== MAIN INIT FUNCTION (v2.1 Pattern) ==========
export default async function initBooking() {
  const container = document.getElementById('module-container');
  if (!container) return;
  
  const currentUser = window.currentUser || { name:'User', role:'regular' };
  
  // Render UI
  container.innerHTML = renderForm(currentUser);
  
  // DOM References
  const form = document.getElementById('bookingForm');
  const tglInput = document.getElementById('tgl');
  const dateWarning = document.getElementById('dateWarning');
  const submitBtn = document.getElementById('submitBtn');
  const lockAlert = document.getElementById('system-lock-alert');
  const lockMsg = document.getElementById('lock-alert-message');
  const aiBox = document.getElementById('ai-suggestion');
  const aiText = document.getElementById('ai-text');
  
  // ✅ Check System Lock on Load
  const lockStatus = checkSystemLock();
  if (lockStatus.isLocked) {
    lockAlert.style.display = 'flex';
    lockMsg.textContent = lockStatus.reason;
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = '🔒 Sistem Ditutup';
    if (!lockStatus.canOverride || lockStatus.isFridayPrayerBlock) {
      showLockOverlay(lockStatus.reason, lockStatus.canOverride);
    }
  }
    // ✅ Date Change Handler (warning for Sunday/Saturday/Friday)
  tglInput?.addEventListener('change', (e) => {
    const d = e.target.value;
    const day = getDayName(d);
    if (isSunday(d) || isHoliday(d)) {
      dateWarning.style.display='block'; dateWarning.textContent=`${day} - LIBUR!`; dateWarning.className='error-msg show';
    } else if (isSaturday(d)) {
      dateWarning.style.display='block'; dateWarning.textContent=`${day} - Optional (perlu approval)`; dateWarning.className='error-msg show'; dateWarning.style.color='#f59e0b';
    } else if (isFriday(d)) {
      dateWarning.style.display='block'; dateWarning.textContent=`${day} - Jumat Berkah!`; dateWarning.className='error-msg show'; dateWarning.style.color='#3b82f6';
    } else {
      dateWarning.style.display='none';
    }
  });
  
  // ✅ Real-time Validation + AI Suggestion (debounced)
  let aiTimeout;
  ['sarana','tgl','jam_mulai','jam_selesai','keperluan'].forEach(id=>{
    document.getElementById(id)?.addEventListener('input', () => {
      // Re-check Friday prayer block
      const formData = {
        sarana: document.getElementById('sarana')?.value,
        tgl: document.getElementById('tgl')?.value,
        jam_mulai: document.getElementById('jam_mulai')?.value,
        jam_selesai: document.getElementById('jam_selesai')?.value
      };
      if (formData.sarana && formData.tgl && formData.jam_mulai && formData.jam_selesai) {
        const lc = checkSystemLock(formData);
        if (lc.isFridayPrayerBlock) {
          lockAlert.style.display='flex'; lockMsg.textContent=lc.reason; lockAlert.className='alert alert-warning';
        } else {
          lockAlert.style.display='none';
        }
      }
      // AI Suggestion (debounced 800ms)
      clearTimeout(aiTimeout);
      aiTimeout = setTimeout(async () => {
        if (formData.sarana && formData.tgl) {
          aiBox.style.display = 'flex';
          aiText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI menganalisis...';
          const suggestion = await getAISuggestion(formData);
          aiText.textContent = `💡 ${suggestion}`;
        }
      }, 800);
    });
  });
  
  // ✅ Form Submit Handler
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();    const isOverride = form.dataset.override === 'true';
    const data = Object.fromEntries(new FormData(form));
    data.alat = form.querySelectorAll('input[name="alat"]:checked').forEach(cb=>cb.value).join(', ');
    
    // Re-check lock before submit
    const lc = checkSystemLock(data);
    if (lc.isLocked && !isOverride && !lc.canOverride) {
      doToast(lc.reason, 'error'); showLockOverlay(lc.reason, false); return;
    }
    
    // Validation
    const val = validateBooking(data);
    if (val.errors.length) { val.errors.forEach(err=>doToast(err,'error')); return; }
    if (val.warnings.length) val.warnings.forEach(w=>doToast(w,'warning'));
    
    // Double booking check
    doToast('🔍 Mengecek ketersediaan...', 'info');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display='none';
    submitBtn.querySelector('.btn-loading').style.display='inline';
    
    const double = await checkDoubleBooking(data);
    if (double.hasConflict) {
      doToast(double.message, 'error');
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').style.display='inline';
      submitBtn.querySelector('.btn-loading').style.display='none';
      return;
    }
    
    // Save booking (LocalStorage fallback)
    try {
      const newBooking = {
        id: `BK-${Date.now()}`,
        nama: data.nama, sarana: data.sarana, tgl: data.tgl,
        jam_mulai: data.jam_mulai, jam_selesai: data.jam_selesai,
        peralatan: data.alat || '', keperluan: data.keperluan || '',
        status: (isOverride || lc.canOverride) ? 'pending' : 'approved',
        created_at: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('dream_bookings')||'[]');
      existing.push(newBooking);
      localStorage.setItem('dream_bookings', JSON.stringify(existing));
      
      // Emit event for other modules (janitor, stok, etc.)
      if (window.router?.emit) {
        window.router.emit('booking:created', newBooking);
      }
      
      doToast('✅ Booking berhasil! Menunggu approval.', 'success');      form.reset(); tglInput.value = getMinDate(); dateWarning.style.display='none';
      delete form.dataset.override;
      
    } catch(err) {
      doToast('❌ Gagal: '+err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').style.display='inline';
      submitBtn.querySelector('.btn-loading').style.display='none';
    }
  });
  
  // ✅ Cleanup function (returned to router)
  return () => {
    clearTimeout(aiTimeout);
    console.log('🧹 Booking module cleaned up');
  };
}
