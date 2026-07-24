# 🔐 Kebijakan Keamanan • Dream OS Enterprise

## Versi yang Didukung
| Versi | Didukung | Status |
|---|---|---|
| v2.0.x (Enterprise RBAC) | ✅ | Aktif — direkomendasikan |
| v1.0.x (Final) | ✅ | Maintenance kritis saja |
| < v1.0 | ❌ | Tidak didukung |

## Melaporkan Kerentanan
Kami sangat menghargai kontribusi komunitas dalam menjaga keamanan Dream OS. Jika Anda menemukan celah keamanan:

**JANGAN** membuka Issue publik. Kirim laporan ke:
📧 **dreamos.sch.id@gmail.com** dengan subjek: `[SECURITY] - Deskripsi Singkat`

- **Waktu respons:** Kami akan mengonfirmasi laporan dalam 2×24 jam dan memberikan pembaruan berkala.
- **Proses:** Setelah diverifikasi, kami akan:
  1. Menentukan tingkat keparahan (Critical/High/Medium/Low)
  2. Merilis patch dalam 7 hari untuk Critical, 30 hari untuk lainnya
  3. Memberi kredit kepada pelapor (kecuali diminta anonim)
- **Kebijakan:** Laporan yang diterima akan ditangani secara rahasia hingga patch dirilis. Kami tidak akan mengambil tindakan hukum terhadap peneliti keamanan yang bertindak dengan itikad baik.

## Standar Keamanan
Dream OS Enterprise dibangun dengan:
- 🔐 **AES-256-GCM** untuk enkripsi data lokal
- 🛡️ **Row-Level Security** di database (Supabase RLS)
- 🔑 **Session Management** 2-jam dengan auto-expiry
- 📜 **Audit Trail** terenkripsi (ISO 27001 compliant)
- 🚫 **Rate Limiting** via Cloudflare Worker
- 🧬 **Device Fingerprinting** untuk verifikasi perangkat

Engineered by Family Dream Team • The Power Soul Of Shalawat
