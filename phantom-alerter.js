/**
 * 🛡️ PHANTOM ALERTER - Telegram Bot Integration
 * Kirim notifikasi keamanan langsung ke HP via Telegram
 */

// ===== ISI TOKEN & CHAT ID TELEGRAMMU! =====
const TELEGRAM_BOT_TOKEN = 'ISI_TOKEN_BOT_KAMU_DISINI';  // <-- GANTI!
const TELEGRAM_CHAT_ID = 'ISI_CHAT_ID_KAMU_DISINI';      // <-- GANTI!

async function sendTelegramAlert(message) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID ||
        TELEGRAM_BOT_TOKEN.includes('ISI_TOKEN') || 
        TELEGRAM_CHAT_ID.includes('ISI_CHAT')) {
        console.warn('⚠️ Telegram belum dikonfigurasi. Alert tidak terkirim.');
        return false;
    }

    const text = `🛡️ *DREAM OS SECURITY ALERT*\n\n${message}\n\n⏰ ${new Date().toLocaleString('id-ID')}\n🔒 *Phantom Security Layer*`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });
        
        if (!response.ok) {
            console.error('Gagal kirim alert:', await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error('Network error saat kirim alert:', error);
        return false;
    }
}

// ===== INTEGRASI KE SISTEM =====
window.PhantomAlerter = {
    newDevice: (userEmail) => {
        sendTelegramAlert(`📱 *NEW DEVICE DETECTED*\nUser: \`${userEmail}\`\nAksi: Device fingerprint baru terdaftar.`);
    },
    failedLogin: (userEmail, reason) => {
        sendTelegramAlert(`⛔ *FAILED LOGIN*\nUser: \`${userEmail}\`\nAlasan: ${reason}`);
    },
    blockedAccess: (userEmail) => {
        sendTelegramAlert(`🚫 *ACCESS BLOCKED*\nUser: \`${userEmail}\` telah diblokir sementara karena > 3x gagal login.`);
    },
    suspiciousActivity: (userEmail, activity) => {
        sendTelegramAlert(`⚠️ *SUSPICIOUS ACTIVITY*\nUser: \`${userEmail}\`\nAktivitas: ${activity}`);
    },
    newBooking: (ruang, peminjam, tgl) => {
        sendTelegramAlert(`📅 *NEW BOOKING*\nRuang: ${ruang}\nPeminjam: ${peminjam}\nTanggal: ${tgl}`);
    },
    approvalRequest: (type, judul, nominal) => {
        sendTelegramAlert(`📋 *APPROVAL REQUEST*\nTipe: ${type}\nJudul: ${judul}\nNominal: ${nominal || '-'}`);
    },
    k3Urgent: (lokasi, kategori) => {
        sendTelegramAlert(`🚨 *K3 URGENT!*\nLokasi: ${lokasi}\nKategori: ${kategori}\nSEGERA TINDAK LANJUT!`);
    },
    systemStartup: () => {
        sendTelegramAlert(`✅ *SYSTEM STARTUP*\nDream OS berhasil dijalankan.\nUser: ${JSON.parse(localStorage.getItem('dreamos_bound_user')||'{}').email || 'Unknown'}`);
    }
};

console.log('🛡️ Phantom Alerter: READY (Telegram Bot)');
