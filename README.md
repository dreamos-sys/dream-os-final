# 🌌 Dream OS v2.0 • Enterprise RBAC
**Sistem Operasional Fasilitas Terintegrasi • Client-Side Architecture • ISO Compliant**

Dream OS adalah platform manajemen operasional berbasis web yang dirancang khusus untuk **Bagian Umum & Koordinator Fasilitas**. Dibangun dengan arsitektur klien-first, modul terstruktur, dan berjalan sepenuhnya di sisi perangkat dengan deployment statis. Fokus utama: keandalan operasional, aksesibilitas inklusif, dan kepatuhan terhadap standar internasional.

---

## 📦 Fitur Inti
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
- **Autentikasi & Database:** Supabase (PostgreSQL) dengan Row Level Security (RLS)
- **Tampilan:** CSS Variables, responsif mobile-first, fallback tampilan mandiri (Glassmorphism)
- **Deployment:** GitHub Pages (Zero-Cost Hosting Architecture)
- **Keamanan:** Enkripsi lokal AES-256-GCM, Kebijakan CSP kelas Perbankan

---

## 🚀 Panduan Akses & Penggunaan
1. **Akses Sistem Resmi:** Kunjungi URL live deployment di `https://dreamos-sys.github.io/dream-os-final`. Hindari membuka file `index.html` secara lokal (`file://`) untuk mencegah pemblokiran protokol keamanan (CORS).
2. **Autentikasi Keamanan:** Masukkan *Email* dan *Password* resmi yang telah didaftarkan dan diotorisasi oleh Administrator Sistem (menggunakan integrasi Supabase Auth).
3. **Pemasangan PWA (Opsional):** Untuk pengalaman penuh, gunakan fitur *Add to Home Screen* / *Install* pada browser seluler Anda untuk memasang sistem ini sebagai aplikasi mandiri yang mendukung akses cepat.
4. **Navigasi Modul:** Akses seluruh modul operasional melalui Grid Utama atau Navigasi Bawah sesuai dengan hak akses (Role-Based Access Control) profil Anda.

---

## ✍️ Pengesahan Sistem & Operasional
Sistem Manajemen Operasional dan Fasilitas (Dream OS) ini dirancang dan disetujui untuk meningkatkan standar kepatuhan institusi dengan struktur otoritas:
- **Pihak Pemohon (Applicant):** Bapak Erwinsyah (Koordinator Bagian Umum)
- **Pihak Penyetuju (Approver):** Bapak Hanung Budianto S. E. (Kepala Bagian Umum)
- **Arsitek & Pengembang Utama:** Family Dream Team

---

## 📜 Lisensi & Kepatuhan
- © 2024–2026 Dream OS System. Hak cipta dilindungi.
- Mematuhi: ISO 9241-171, WCAG 2.2 AA, ISO 27001, ISO 55001, ISO 9001
- Identitas Sistem: `The Power Soul Of Shalawat`
- Dilarang mendistribusikan ulang, memodifikasi, atau memanfaatkan tanpa persetujuan tertulis dari pengembang inti & manajemen. Detail ketentuan terdapat pada file `LICENSE.txt`.
- Panduan keamanan operasional tercantum dalam file `SECURITY.md`.

---

## 🤝 Audit & Dukungan Teknis
Repositori ini dikelola secara terkontrol untuk stabilitas operasional internal.  
Untuk pelaporan temuan, permintaan penyesuaian institusional, atau audit kepatuhan, hubungi tim pengembang melalui saluran resmi Bagian Umum.

**🕌 Dibangun dengan presisi, diakses dengan inklusivitas.**  
*Barakallahu fiikum. Engineered by Family Dream Team.*
