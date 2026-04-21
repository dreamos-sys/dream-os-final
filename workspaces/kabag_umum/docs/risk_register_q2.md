# 🛡️ RISK REGISTER: PROYEK DIGITALISASI Q2 (v1.0)

Dokumen ini mencatat potensi hambatan dan rencana mitigasi untuk menjaga kelancaran operasional Dream OS.

| ID | Risiko | Probabilitas | Dampak | Rencana Mitigasi | PIC |
|:---|:---|:---:|:---:|:---|:---|
| R01 | OCR Gagal baca log manual (tulisan tangan blur) | Tinggi | Menengah | Tim admin melakukan verifikasi manual 10% sampel tiap batch. | Koordinator |
| R02 | Downtime Supabase / Jaringan Putus | Rendah | Tinggi | Implementasi sistem "Local Cache" di Termux (Offline-First). | Dev Team |
| R03 | Resistensi Staf terhadap Command Center | Menengah | Menengah | Sesi training intensif & penyediaan `docs/panduan_staf_termux.md`. | Mr. M |
| R04 | Bug pada Logika Anti-Double Booking | Sangat Rendah | Sangat Tinggi | Menjalankan "Beyoncé Rule Test" (10x simulasi) sebelum Go-Live. | Dev Team |
| R05 | Kebocoran API Key Supabase | Rendah | Sangat Tinggi | Rotasi Key setiap 90 hari & penggunaan Environment Variables. | Admin |

## 📈 KRITERIA PENILAIAN
* **Probabilitas**: Sangat Rendah / Rendah / Menengah / Tinggi
* **Dampak**: Kecil / Menengah / Tinggi / Sangat Tinggi

---
*Terakhir diupdate: April 2026*
*Status: 🟢 Terpantau Aman*
