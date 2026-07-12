# 🌌 Dream OS v1.0 • Production Ready
**Sistem Operasional Fasilitas Terintegrasi • Client-Side Architecture • ISO Compliant**

Dream OS adalah platform manajemen operasional berbasis web yang dirancang khusus untuk **Bagian Umum & Koordinator Fasilitas**. Dibangun dengan arsitektur klien-first, modul terstruktur, dan berjalan sepenuhnya di sisi perangkat dengan deployment statis. Fokus utama: keandalan operasional, aksesibilitas inklusif, dan kepatuhan terhadap standar internasional.

---

## 📦 Fitur Inti (v1.0)
| Modul | Fungsi | Standar |
|-------|--------|---------|
| 📱 Dashboard Dinamis | Slide & grid modul yang dapat dikonfigurasi oleh Administrator/Kabag | ISO 9001 |
| ⎈ Command Center | Pusat kendali verifikasi, monitoring sistem, dan tindakan administratif | ISO 27001 A.9.2 |
| 👤 Profil & Identitas | Data pengguna, pengelolaan kode akses, verifikasi perangkat, dan riwayat aktivitas | ISO 27001 A.9.2.1 |
| 🏢 Aset & Stok | Pelacakan siklus hidup, penyusutan, penandaan QR, dan pelaporan inventaris | ISO 55001 |
| 🕌 Jadwal & Monitoring | Informasi jadwal ibadah otomatis, sinkronisasi offline, dan pemantauan status sistem | WCAG 2.2 |
| ⚙️ Pengaturan & Aksesibilitas | Penyesuaian tampilan, dukungan multibahasa, kontras tinggi, dan mode fokus | ISO 9241-171 |

---

## ♿ Aksesibilitas & Inklusi
Dream OS dirancang sesuai **ISO 9241-171** dan **WCAG 2.2 Level AA**:
- 🔤 Penyesuaian ukuran teks (80–140%) & dukungan font ramah disleksia
- 🌓 Mode kontras tinggi (rasio 7:1) & simulasi kesulitan warna
- 📏 Garis fokus baca & area sentuh minimal 48px
- 🧘 Antarmuka sederhana & peringatan visual
- 🌍 Dukungan multibahasa dengan otomatisasi tata letak RTL
- ⏱️ Manajemen sesi otomatis & penguncian perangkat (ISO 27001 A.9.4.2)

---

## 🏗️ Arsitektur Teknis
- **Frontend:** JavaScript murni (ES5/ES6), tanpa framework eksternal, moduler & terstruktur
- **Penyimpanan:** LocalStorage dengan mekanisme log error, cadangan & pemulihan data
- **Tampilan:** CSS Variables, responsif mobile-first, fallback tampilan mandiri
- **Deployment:** GitHub Pages (penyampaian otomatis pada branch `gh-pages`)
- **Keamanan:** Kebijakan konten terenkripsi, enkapsulasi modul, delegasi event, dan pemisahan kode dari markup
- **Pencatatan:** Batas error tersembunyi, ekspor log, dan jejak audit perangkat

---

## 🚀 Panduan Instalasi & Penggunaan
1. Unduh repositori: `git clone https://github.com/dreamos-sys/dream-os-final.git`
2. Buka `index.html` melalui browser modern (Chrome/Edge/Firefox)
3. **Konfigurasi Akses:** Sistem akan meminta kode akses saat penggunaan pertama. Atur kode yang aman (minimal 6 karakter) melalui `👤 Profil` atau `⚙️ Pengaturan`.
4. Akses modul melalui dashboard atau buka langsung `modules/nama-modul.html`
5. Atur konfigurasi tampilan & grid melalui `⎈ Command Center` (akses administratif)

> 🔐 **Catatan Keamanan:** Kode akses bersifat unik per perangkat dan disimpan secara lokal. Untuk pengaturan ulang atau distribusi akses internal, silakan menghubungi Koordinator Bagian Umum.

---

## 💾 Cadangan & Pemulihan Data
- Ekspor: `Pengaturan → Data & Sistem → Ekspor Cadangan JSON`
- Impor: `Pengaturan → Data & Sistem → Impor Cadangan JSON`
- Seluruh data tersimpan di perangkat masing-masing. Tidak bergantung pada server eksternal.

---

## 📜 Lisensi & Kepatuhan
- © 2024–2026 Dream OS System. Hak cipta dilindungi.
- Mematuhi: ISO 9241-171, WCAG 2.2 AA, ISO 27001, ISO 55001, ISO 9001
- Identitas Sistem: `The Power Soul Of Shalawat`
- Dilarang mendistribusikan ulang, memodifikasi, atau memanfaatkan tanpa persetujuan tertulis dari pengembang inti & manajemen.

---

## 🤝 Audit & Dukungan Teknis
Repositori ini dikelola secara terkontrol untuk stabilitas operasional internal.  
Untuk pelaporan temuan, permintaan penyesuaian institusional, atau audit kepatuhan, hubungi tim pengembang melalui saluran resmi Bagian Umum.

**🕌 Dibangun dengan presisi, diakses dengan inklusivitas.**  
*Barakallahu fiikum. Engineered by Family Dream Team.*

## 🎯 MISI ROADMAP
# 🎯 Dream OS Enterprise Roadmap
... (copy-paste checklist di atas) ...

## 🚀 NEXT STEPS
# 🎯 LANGKAH SELANJUTNYA - SUPABASE AUTH

## 1. Buat User di Supabase Dashboard
- Buka https://supabase.com/dashboard/project/gbigjdhifispatrrskgh
- Authentication > Users > Add User
- Isi email & password (minimal 6 karakter)
- Centang "Auto Confirm User"
- Klik "Create User"

## 2. Atur User Metadata (Role)
- Setelah user dibuat, klik user tersebut
- Di bagian "User Metadata", tambahkan:
  { "nama": "Nama Lengkap", "role": "dev" }
- Untuk role lain: guru, security, janitor, maintenance, staff
- Klik Save

## 3. Uji Login
- Buka https://dreamos-sys.github.io/dream-os-final
- Masukkan email & password yang sudah dibuat
- Harus masuk ke dashboard

## 4. Matikan Auto-Login Lama (Opsional)
- Auto-login berdasarkan role 'dev' dan session masih ada di index.html
- Bisa dinonaktifkan setelah Supabase Auth berjalan lancar

## 5. Langkah Berikutnya
- Migrasi data user dari localStorage ke Supabase (tabel public.users)
- Aktifkan Row Level Security (RLS)
- Buat halaman registrasi (signUp)
