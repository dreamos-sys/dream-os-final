/**
 * 🌍 DREAM OS - GLOBAL i18n SYSTEM
 * Semua modul otomatis bisa pakai t('key') setelah file ini di-load
 */

// ========== DICTIONARY LENGKAP ==========
const DREAM_I18N = {
  id: {
    // 🔐 LOGIN
    login_title: '⚡ ACCESS CORE',
    login_email: '📧 EMAIL',
    login_password: '🔐 PASSWORD',
    login_connecting: '⏳ Menghubungkan...',
    login_error_empty: '⛔ Email dan password harus diisi!',
    login_error_auth: '⛔ Email atau password salah',
    login_error_server: '⚠️ Gagal menghubungkan server',
    login_success: '✅ Berhasil!',

    // 🏠 DASHBOARD
    dashboard_title: 'Dream OS Enterprise RBAC',
    dashboard_role: 'Role',
    dashboard_loading: 'Memuat...',
    dashboard_online: '📡 Online',
    dashboard_offline: '📡 Offline',
    dashboard_checking: '📡 Memeriksa...',
    dashboard_prayer: '🕌 Memuat waktu shalat...',
    dashboard_prayer_fail: '🕌 Gagal memuat jadwal',
    dashboard_logout: '🚪 Keluar',
    dashboard_logout_confirm: 'Yakin logout?',
    dashboard_mod_loading: 'Memuat modul...',

    // 🧭 NAVIGASI
    nav_home: 'Home',
    nav_profile: 'Profile',
    nav_qr: 'QR',
    nav_about: 'About',
    nav_system: 'System',

    // 👤 PROFILE
    profile_title: '👤 Profile',
    profile_overview: '📊 Overview',
    profile_edit: '✏️ Edit',
    profile_security: '🔒 Security',
    profile_users: '👥 Users',
    profile_settings: '⚙️ Settings',
    profile_name: 'Nama',
    profile_email: 'Email',
    profile_role: 'Role',
    profile_device_dna: 'Device DNA',
    profile_save: '💾 Simpan',
    profile_upload: '📷 Upload',
    profile_change_password: '🔑 Ganti Password',
    profile_old_password: 'Password lama',
    profile_new_password: 'Password baru',
    profile_confirm_password: 'Konfirmasi',
    profile_register: '➕ Daftar Pengguna Baru',
    profile_register_nama: 'Nama Lengkap',
    profile_register_email: 'Email',
    profile_register_role: 'Role',
    profile_register_password: 'Password (min 6 karakter)',
    profile_logout: '🚪 Logout',

    // 🏢 COMMAND CENTER
    cmd_title: '🏢 COMMAND CENTER PRO',
    cmd_users: '👥 Users',
    cmd_dana: '💰 Dana',
    cmd_k3: '⚠️ K3',
    cmd_maint: '🔧 Maint',
    cmd_booking: '📅 Booking',
    cmd_audit: '📜 Audit',
    cmd_system: '⚙️ System',
    cmd_add_user: '➕ TAMBAH USER BARU',
    cmd_save_user: '✅ SIMPAN USER',
    cmd_print: '🖨️ Cetak',
    cmd_sync: '☁️ Sync ke Cloud',
    cmd_export_csv: '📥 CSV',
    cmd_approve: '✅',
    cmd_reject: '❌',
    cmd_pending: 'Pending',
    cmd_approved: 'Approved',
    cmd_rejected: 'Rejected',
    cmd_budget: '📊 Anggaran',
    cmd_pagu: '💰 Pagu',

    // 🛡️ SECURITY
    sec_title: '🛡️ Security Ops Center Pro',
    sec_jadwal: '📅 Jadwal Matriks',
    sec_input_log: '📝 Input Serah Terima',
    sec_report: '📊 Buku Laporan (PDF)',
    sec_bridge: '🚨 Trigger & Slide',
    sec_petugas: 'Petugas',
    sec_total_log: 'Total Log',
    sec_urgent: 'Urgent',
    sec_petugas_aktif: 'Petugas Aktif',
    sec_waktu: 'Waktu',
    sec_save_log: '💾 SIMPAN LOG SERAH TERIMA',
    sec_update_slide: '🚀 UPDATE SLIDE PUBLIK SEKARANG',

    // 🧹 JANITOR INDOOR
    ji_title: '🧹 Janitor Indoor',
    ji_petugas: 'Nama Petugas',
    ji_gedung: 'Gedung',
    ji_lantai: 'Lantai',
    ji_riwayat: '📜 Riwayat',
    ji_export_csv: '📥 CSV',
    ji_submit_cloud: '☁️ Submit',
    ji_cetak: '🖨️ Cetak',
    ji_reset_shift: 'Reset Shift',
    ji_total_item: 'Total Item',
    ji_selesai: 'Selesai',
    ji_progress: 'Progress',

    // 🌿 JANITOR OUTDOOR
    jo_title: '🌿 Janitor Outdoor',
    jo_area: 'Area / Taman',
    jo_zona: 'Zona',
    jo_daily: '📋 Ceklis Harian',
    jo_weekly: '🗓️ Tugas Mingguan',

    // 📅 BOOKING
    book_title: '📅 Booking Ruangan',
    book_form: 'FORM BOOKING',
    book_tgl: 'Tanggal',
    book_ruang: 'Ruangan',
    book_peminjam: 'Nama Peminjam',
    book_jam_mulai: 'Jam Mulai',
    book_jam_selesai: 'Jam Selesai',
    book_save: '✅ SIMPAN BOOKING',
    book_list: '📋 DAFTAR BOOKING',

    // 🏢 ASSET
    asset_title: '🏛️ Manajemen Aset & Gudang',
    asset_gudang: '📦 Gudang & Stok',
    asset_strategis: '🏢 Aset Strategis',
    asset_rab: '📊 RAB & Pajak',
    asset_log: '📜 Audit Log',
    asset_save: '💾 SIMPAN',
    asset_nama: 'Nama Barang/Aset',
    asset_qty: 'Jumlah',
    asset_lokasi: 'Lokasi',

    // 📦 STOK
    stok_title: '📦 Stok Gudang',
    stok_add: '✅ SIMPAN BARANG',
    stok_list: '📋 Daftar Barang',
    stok_sync: '☁️ Sync Semua',

    // 🔧 MAINTENANCE
    maint_title: '🔧 Maintenance & Perawatan',
    maint_add: '➕ Buat Tugas',
    maint_judul: 'Judul Pekerjaan',
    maint_lokasi: 'Lokasi / Area',
    maint_petugas: 'Nama Teknisi',
    maint_jenis: 'Jenis',
    maint_prioritas: 'Prioritas',
    maint_biaya: 'Estimasi Biaya',
    maint_active: '📋 Tugas Aktif',
    maint_history: '📜 Riwayat',

    // ⚙️ SETTINGS
    set_title: '⚙️ Enterprise Settings',
    set_display: '🎨 Display',
    set_access: '♿ Access',
    set_language: '🌍 Language',
    set_advanced: '🔬 Advanced',
    set_dark_mode: 'Dark Mode',
    set_font_scale: 'Font Scale',
    set_starfield: 'Starfield',
    set_glass: 'Glass Intensity',
    set_reset: '🔄 Reset Default',
    set_export: '📥 Export',
    set_import: '📤 Import',

    // 🔔 NOTIFICATION
    notif_title: 'Notifikasi',
    notif_empty: 'Tidak ada notifikasi.',
    notif_booking_new: 'Booking baru: ',
    notif_dana_approved: 'Dana disetujui: ',

    // 🌐 GENERAL
    btn_save: '💾 Simpan',
    btn_cancel: '❌ Batal',
    btn_delete: '🗑️ Hapus',
    btn_edit: '✏️ Edit',
    btn_back: '← Kembali',
    btn_close: '✕ Tutup',
    btn_yes: 'Ya',
    btn_no: 'Tidak',
    confirm_delete: 'Hapus data ini?',
    confirm_reset: 'Reset data?',
    loading: 'Memuat...',
    no_data: 'Belum ada data.',
    success: '✅ Berhasil!',
    error: '⚠️ Gagal',
    access_denied: '⛔ Akses Ditolak!',
    session_expired: '⏰ Sesi berakhir, silakan login ulang.',
    welcome: 'Assalamualaikum, selamat datang.',
  },

  en: {
    // 🔐 LOGIN
    login_title: '⚡ ACCESS CORE',
    login_email: '📧 EMAIL',
    login_password: '🔐 PASSWORD',
    login_connecting: '⏳ Connecting...',
    login_error_empty: '⛔ Email and password required!',
    login_error_auth: '⛔ Invalid email or password',
    login_error_server: '⚠️ Failed to connect to server',
    login_success: '✅ Success!',

    // 🏠 DASHBOARD
    dashboard_title: 'Dream OS Enterprise RBAC',
    dashboard_role: 'Role',
    dashboard_loading: 'Loading...',
    dashboard_online: '📡 Online',
    dashboard_offline: '📡 Offline',
    dashboard_checking: '📡 Checking...',
    dashboard_prayer: '🕌 Loading prayer times...',
    dashboard_prayer_fail: '🕌 Failed to load schedule',
    dashboard_logout: '🚪 Logout',
    dashboard_logout_confirm: 'Are you sure to logout?',
    dashboard_mod_loading: 'Loading module...',

    // 🧭 NAVIGASI
    nav_home: 'Home',
    nav_profile: 'Profile',
    nav_qr: 'QR',
    nav_about: 'About',
    nav_system: 'System',

    // 👤 PROFILE
    profile_title: '👤 Profile',
    profile_overview: '📊 Overview',
    profile_edit: '✏️ Edit',
    profile_security: '🔒 Security',
    profile_users: '👥 Users',
    profile_settings: '⚙️ Settings',
    profile_name: 'Name',
    profile_email: 'Email',
    profile_role: 'Role',
    profile_device_dna: 'Device DNA',
    profile_save: '💾 Save',
    profile_upload: '📷 Upload',
    profile_change_password: '🔑 Change Password',
    profile_old_password: 'Old Password',
    profile_new_password: 'New Password',
    profile_confirm_password: 'Confirm',
    profile_register: '➕ Register New User',
    profile_register_nama: 'Full Name',
    profile_register_email: 'Email',
    profile_register_role: 'Role',
    profile_register_password: 'Password (min 6 chars)',
    profile_logout: '🚪 Logout',

    // 🏢 COMMAND CENTER
    cmd_title: '🏢 COMMAND CENTER PRO',
    cmd_users: '👥 Users',
    cmd_dana: '💰 Budget',
    cmd_k3: '⚠️ Safety',
    cmd_maint: '🔧 Maintenance',
    cmd_booking: '📅 Booking',
    cmd_audit: '📜 Audit',
    cmd_system: '⚙️ System',
    cmd_add_user: '➕ ADD NEW USER',
    cmd_save_user: '✅ SAVE USER',
    cmd_print: '🖨️ Print',
    cmd_sync: '☁️ Sync to Cloud',
    cmd_export_csv: '📥 CSV',
    cmd_approve: '✅',
    cmd_reject: '❌',
    cmd_pending: 'Pending',
    cmd_approved: 'Approved',
    cmd_rejected: 'Rejected',
    cmd_budget: '📊 Budget',
    cmd_pagu: '💰 Cap',

    // 🛡️ SECURITY
    sec_title: '🛡️ Security Ops Center Pro',
    sec_jadwal: '📅 Schedule Matrix',
    sec_input_log: '📝 Input Handover',
    sec_report: '📊 Report Book (PDF)',
    sec_bridge: '🚨 Trigger & Slide',
    sec_petugas: 'Officer',
    sec_total_log: 'Total Logs',
    sec_urgent: 'Urgent',
    sec_petugas_aktif: 'Active Officers',
    sec_waktu: 'Time',
    sec_save_log: '💾 SAVE HANDOVER LOG',
    sec_update_slide: '🚀 UPDATE PUBLIC SLIDE NOW',

    // 🧹 JANITOR INDOOR
    ji_title: '🧹 Janitor Indoor',
    ji_petugas: 'Officer Name',
    ji_gedung: 'Building',
    ji_lantai: 'Floor',
    ji_riwayat: '📜 History',
    ji_export_csv: '📥 CSV',
    ji_submit_cloud: '☁️ Submit',
    ji_cetak: '🖨️ Print',
    ji_reset_shift: 'Reset Shift',
    ji_total_item: 'Total Items',
    ji_selesai: 'Done',
    ji_progress: 'Progress',

    // 🌿 JANITOR OUTDOOR
    jo_title: '🌿 Janitor Outdoor',
    jo_area: 'Area / Garden',
    jo_zona: 'Zone',
    jo_daily: '📋 Daily Checklist',
    jo_weekly: '🗓️ Weekly Tasks',

    // 📅 BOOKING
    book_title: '📅 Room Booking',
    book_form: 'BOOKING FORM',
    book_tgl: 'Date',
    book_ruang: 'Room',
    book_peminjam: 'Borrower Name',
    book_jam_mulai: 'Start Time',
    book_jam_selesai: 'End Time',
    book_save: '✅ SAVE BOOKING',
    book_list: '📋 BOOKING LIST',

    // 🏢 ASSET
    asset_title: '🏛️ Asset & Warehouse Management',
    asset_gudang: '📦 Warehouse & Stock',
    asset_strategis: '🏢 Strategic Assets',
    asset_rab: '📊 Budget & Tax',
    asset_log: '📜 Audit Log',
    asset_save: '💾 SAVE',
    asset_nama: 'Item/Asset Name',
    asset_qty: 'Quantity',
    asset_lokasi: 'Location',

    // 📦 STOK
    stok_title: '📦 Warehouse Stock',
    stok_add: '✅ SAVE ITEM',
    stok_list: '📋 Item List',
    stok_sync: '☁️ Sync All',

    // 🔧 MAINTENANCE
    maint_title: '🔧 Maintenance & Repair',
    maint_add: '➕ Create Task',
    maint_judul: 'Job Title',
    maint_lokasi: 'Location / Area',
    maint_petugas: 'Technician Name',
    maint_jenis: 'Type',
    maint_prioritas: 'Priority',
    maint_biaya: 'Estimated Cost',
    maint_active: '📋 Active Tasks',
    maint_history: '📜 History',

    // ⚙️ SETTINGS
    set_title: '⚙️ Enterprise Settings',
    set_display: '🎨 Display',
    set_access: '♿ Access',
    set_language: '🌍 Language',
    set_advanced: '🔬 Advanced',
    set_dark_mode: 'Dark Mode',
    set_font_scale: 'Font Scale',
    set_starfield: 'Starfield',
    set_glass: 'Glass Intensity',
    set_reset: '🔄 Reset Default',
    set_export: '📥 Export',
    set_import: '📤 Import',

    // 🔔 NOTIFICATION
    notif_title: 'Notifications',
    notif_empty: 'No notifications.',
    notif_booking_new: 'New booking: ',
    notif_dana_approved: 'Budget approved: ',

    // 🌐 GENERAL
    btn_save: '💾 Save',
    btn_cancel: '❌ Cancel',
    btn_delete: '🗑️ Delete',
    btn_edit: '✏️ Edit',
    btn_back: '← Back',
    btn_close: '✕ Close',
    btn_yes: 'Yes',
    btn_no: 'No',
    confirm_delete: 'Delete this data?',
    confirm_reset: 'Reset data?',
    loading: 'Loading...',
    no_data: 'No data yet.',
    success: '✅ Success!',
    error: '⚠️ Failed',
    access_denied: '⛔ Access Denied!',
    session_expired: '⏰ Session expired, please login again.',
    welcome: 'Welcome, peace be upon you.',
  }
};

// ========== GLOBAL i18n FUNCTIONS ==========
window.currentLang = localStorage.getItem('dreamos_lang') || 'id';

window.t = function(key) {
  return (DREAM_I18N[window.currentLang] && DREAM_I18N[window.currentLang][key]) || key;
};

window.toggleLanguage = function() {
  window.currentLang = window.currentLang === 'id' ? 'en' : 'id';
  localStorage.setItem('dreamos_lang', window.currentLang);
  // Reload dashboard untuk menerapkan bahasa baru
  if (typeof window.renderDashboard === 'function') window.renderDashboard();
  // Update language toggle button
  const langBtns = document.querySelectorAll('[onclick*="toggleLanguage"]');
  langBtns.forEach(btn => { btn.textContent = '🌐 ' + (window.currentLang === 'id' ? 'EN' : 'ID'); });
};

window.getAllLanguages = function() {
  return Object.keys(DREAM_I18N);
};

window.getCurrentLanguage = function() {
  return window.currentLang;
};

console.log('🌍 i18n System Ready - Current: ' + window.currentLang.toUpperCase());
console.log('📚 Available: ' + Object.keys(DREAM_I18N).join(', '));
