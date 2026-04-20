export const A11Y = {
  minTouch: 44, recommendedTouch: 48,
  contrastNormal: 4.5, contrastLarge: 3,
  focus: "3px solid #10b981",
  skipId: "main-content"
};
export const LABELS = {
  commandcenter: "Command Center - Dashboard monitoring sistem",
  booking: "Booking - Reservasi dan penjadwalan",
  k3: "K3 - Keselamatan dan Kesehatan Kerja",
  sekuriti: "Sekuriti - Keamanan dan akses kontrol",
  stok: "Stok - Manajemen inventaris",
  maintenance: "Maintenance - Pemeliharaan aset",
  asset: "Asset - Daftar dan tracking aset",
  qr: "QR Scanner - Scan barcode dan QR code",
  profile: "Profile - Informasi pengguna",
  about: "About - Tentang aplikasi",
  setting: "Setting - Konfigurasi aplikasi"
};
export const aria = (k,c="") => (LABELS[k]?`${LABELS[k]} ${c}`:k.replace(/-/g," ")).trim();
