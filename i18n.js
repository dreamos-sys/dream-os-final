const DREAM_I18N = {
  id: {
    login_title: '⚡ ACCESS CORE', login_email: '📧 EMAIL', login_password: '🔐 PASSWORD',
    login_connecting: '⏳ Menghubungkan...', login_error_empty: '⛔ Email dan password harus diisi!',
    login_error_auth: '⛔ Email atau password salah', login_error_server: '⚠️ Gagal menghubungkan server',
    login_success: '✅ Berhasil!', dashboard_title: 'Dream OS Enterprise RBAC', dashboard_role: 'Role',
    dashboard_loading: 'Memuat...', dashboard_online: '📡 Online', dashboard_offline: '📡 Offline',
    dashboard_checking: '📡 Memeriksa...', dashboard_prayer: '🕌 Memuat waktu shalat...',
    dashboard_prayer_fail: '🕌 Gagal memuat jadwal', dashboard_logout: '🚪 Keluar',
    dashboard_logout_confirm: 'Yakin logout?', dashboard_mod_loading: 'Memuat modul...',
    nav_home: 'Home', nav_profile: 'Profile', nav_qr: 'QR', nav_about: 'About', nav_system: 'System',
    profile_title: '👤 Profile', profile_overview: '📊 Overview', profile_edit: '✏️ Edit',
    profile_security: '🔒 Security', profile_users: '👥 Users', profile_settings: '⚙️ Settings',
    profile_name: 'Nama', profile_email: 'Email', profile_role: 'Role', profile_device_dna: 'Device DNA',
    profile_save: '💾 Simpan', profile_upload: '📷 Upload', profile_change_password: '🔑 Ganti Password',
    profile_old_password: 'Password lama', profile_new_password: 'Password baru',
    profile_confirm_password: 'Konfirmasi', profile_register: '➕ Daftar Pengguna Baru',
    profile_register_nama: 'Nama Lengkap', profile_register_email: 'Email', profile_register_role: 'Role',
    profile_register_password: 'Password (min 6 karakter)', profile_logout: '🚪 Logout',
    cmd_title: '🏢 COMMAND CENTER PRO', cmd_users: '👥 Users', cmd_dana: '💰 Dana', cmd_k3: '⚠️ K3',
    cmd_maint: '🔧 Maint', cmd_booking: '📅 Booking', cmd_audit: '📜 Audit', cmd_system: '⚙️ System',
    cmd_add_user: '➕ TAMBAH USER BARU', cmd_save_user: '✅ SIMPAN USER', cmd_print: '🖨️ Cetak',
    cmd_sync: '☁️ Sync ke Cloud', cmd_export_csv: '📥 CSV', cmd_approve: '✅', cmd_reject: '❌',
    cmd_pending: 'Pending', cmd_approved: 'Approved', cmd_rejected: 'Rejected', cmd_budget: '📊 Anggaran',
    cmd_pagu: '💰 Pagu', sec_title: '🛡️ Security Ops Center Pro', sec_jadwal: '📅 Jadwal Matriks',
    sec_input_log: '📝 Input Serah Terima', sec_report: '📊 Buku Laporan (PDF)', sec_bridge: '🚨 Trigger & Slide',
    sec_petugas: 'Petugas', sec_total_log: 'Total Log', sec_urgent: 'Urgent', sec_petugas_aktif: 'Petugas Aktif',
    sec_waktu: 'Waktu', sec_save_log: '💾 SIMPAN LOG SERAH TERIMA', sec_update_slide: '🚀 UPDATE SLIDE PUBLIK SEKARANG',
    ji_title: '🧹 Janitor Indoor', ji_petugas: 'Nama Petugas', ji_gedung: 'Gedung', ji_lantai: 'Lantai',
    ji_riwayat: '📜 Riwayat', ji_export_csv: '📥 CSV', ji_submit_cloud: '☁️ Submit', ji_cetak: '🖨️ Cetak',
    ji_reset_shift: 'Reset Shift', ji_total_item: 'Total Item', ji_selesai: 'Selesai', ji_progress: 'Progress',
    jo_title: '🌿 Janitor Outdoor', jo_area: 'Area / Taman', jo_zona: 'Zona', jo_daily: '📋 Ceklis Harian',
    jo_weekly: '🗓️ Tugas Mingguan', book_title: '📅 Booking Ruangan', book_form: 'FORM BOOKING',
    book_tgl: 'Tanggal', book_ruang: 'Ruangan', book_peminjam: 'Nama Peminjam', book_jam_mulai: 'Jam Mulai',
    book_jam_selesai: 'Jam Selesai', book_save: '✅ SIMPAN BOOKING', book_list: '📋 DAFTAR BOOKING',
    asset_title: '🏛️ Manajemen Aset & Gudang', asset_gudang: '📦 Gudang & Stok', asset_strategis: '🏢 Aset Strategis',
    asset_rab: '📊 RAB & Pajak', asset_log: '📜 Audit Log', asset_save: '💾 SIMPAN', asset_nama: 'Nama Barang/Aset',
    asset_qty: 'Jumlah', asset_lokasi: 'Lokasi', stok_title: '📦 Stok Gudang', stok_add: '✅ SIMPAN BARANG',
    stok_list: '📋 Daftar Barang', stok_sync: '☁️ Sync Semua', maint_title: '🔧 Maintenance & Perawatan',
    maint_add: '➕ Buat Tugas', maint_judul: 'Judul Pekerjaan', maint_lokasi: 'Lokasi / Area',
    maint_petugas: 'Nama Teknisi', maint_jenis: 'Jenis', maint_prioritas: 'Prioritas', maint_biaya: 'Estimasi Biaya',
    maint_active: '📋 Tugas Aktif', maint_history: '📜 Riwayat', set_title: '⚙️ Enterprise Settings',
    set_display: '🎨 Display', set_access: '♿ Access', set_language: '🌍 Language', set_advanced: '🔬 Advanced',
    set_dark_mode: 'Dark Mode', set_font_scale: 'Font Scale', set_starfield: 'Starfield', set_glass: 'Glass Intensity',
    set_reset: '🔄 Reset Default', set_export: '📥 Export', set_import: '📤 Import', notif_title: 'Notifikasi',
    notif_empty: 'Tidak ada notifikasi.', notif_booking_new: 'Booking baru: ', notif_dana_approved: 'Dana disetujui: ',
    btn_save: '💾 Simpan', btn_cancel: '❌ Batal', btn_delete: '🗑️ Hapus', btn_edit: '✏️ Edit',
    btn_back: '← Kembali', btn_close: '✕ Tutup', btn_yes: 'Ya', btn_no: 'Tidak', confirm_delete: 'Hapus data ini?',
    confirm_reset: 'Reset data?', loading: 'Memuat...', no_data: 'Belum ada data.', success: '✅ Berhasil!',
    error: '⚠️ Gagal', access_denied: '⛔ Akses Ditolak!', session_expired: '⏰ Sesi berakhir, silakan login ulang.',
    welcome: 'Assalamualaikum, selamat datang.'
  },
  en: {
    login_title: '⚡ ACCESS CORE', login_email: '📧 EMAIL', login_password: '🔐 PASSWORD',
    login_connecting: '⏳ Connecting...', login_error_empty: '⛔ Email and password required!',
    login_error_auth: '⛔ Invalid email or password', login_error_server: '⚠️ Failed to connect to server',
    login_success: '✅ Success!', dashboard_title: 'Dream OS Enterprise RBAC', dashboard_role: 'Role',
    dashboard_loading: 'Loading...', dashboard_online: '📡 Online', dashboard_offline: '📡 Offline',
    dashboard_checking: '📡 Checking...', dashboard_prayer: '🕌 Loading prayer times...',
    dashboard_prayer_fail: '🕌 Failed to load schedule', dashboard_logout: '🚪 Logout',
    dashboard_logout_confirm: 'Are you sure to logout?', dashboard_mod_loading: 'Loading module...',
    nav_home: 'Home', nav_profile: 'Profile', nav_qr: 'QR', nav_about: 'About', nav_system: 'System',
    profile_title: '👤 Profile', profile_overview: '📊 Overview', profile_edit: '✏️ Edit',
    profile_security: '🔒 Security', profile_users: '👥 Users', profile_settings: '⚙️ Settings',
    profile_name: 'Name', profile_email: 'Email', profile_role: 'Role', profile_device_dna: 'Device DNA',
    profile_save: '💾 Save', profile_upload: '📷 Upload', profile_change_password: '🔑 Change Password',
    profile_old_password: 'Old Password', profile_new_password: 'New Password',
    profile_confirm_password: 'Confirm', profile_register: '➕ Register New User',
    profile_register_nama: 'Full Name', profile_register_email: 'Email', profile_register_role: 'Role',
    profile_register_password: 'Password (min 6 chars)', profile_logout: '🚪 Logout',
    cmd_title: '🏢 COMMAND CENTER PRO', cmd_users: '👥 Users', cmd_dana: '💰 Budget', cmd_k3: '⚠️ Safety',
    cmd_maint: '🔧 Maintenance', cmd_booking: '📅 Booking', cmd_audit: '📜 Audit', cmd_system: '⚙️ System',
    cmd_add_user: '➕ ADD NEW USER', cmd_save_user: '✅ SAVE USER', cmd_print: '🖨️ Print',
    cmd_sync: '☁️ Sync to Cloud', cmd_export_csv: '📥 CSV', cmd_approve: '✅', cmd_reject: '❌',
    cmd_pending: 'Pending', cmd_approved: 'Approved', cmd_rejected: 'Rejected', cmd_budget: '📊 Budget',
    cmd_pagu: '💰 Cap', sec_title: '🛡️ Security Ops Center Pro', sec_jadwal: '📅 Schedule Matrix',
    sec_input_log: '📝 Input Handover', sec_report: '📊 Report Book (PDF)', sec_bridge: '🚨 Trigger & Slide',
    sec_petugas: 'Officer', sec_total_log: 'Total Logs', sec_urgent: 'Urgent', sec_petugas_aktif: 'Active Officers',
    sec_waktu: 'Time', sec_save_log: '💾 SAVE HANDOVER LOG', sec_update_slide: '🚀 UPDATE PUBLIC SLIDE NOW',
    ji_title: '🧹 Janitor Indoor', ji_petugas: 'Officer Name', ji_gedung: 'Building', ji_lantai: 'Floor',
    ji_riwayat: '📜 History', ji_export_csv: '📥 CSV', ji_submit_cloud: '☁️ Submit', ji_cetak: '🖨️ Print',
    ji_reset_shift: 'Reset Shift', ji_total_item: 'Total Items', ji_selesai: 'Done', ji_progress: 'Progress',
    jo_title: '🌿 Janitor Outdoor', jo_area: 'Area / Garden', jo_zona: 'Zone', jo_daily: '📋 Daily Checklist',
    jo_weekly: '🗓️ Weekly Tasks', book_title: '📅 Room Booking', book_form: 'BOOKING FORM',
    book_tgl: 'Date', book_ruang: 'Room', book_peminjam: 'Borrower Name', book_jam_mulai: 'Start Time',
    book_jam_selesai: 'End Time', book_save: '✅ SAVE BOOKING', book_list: '📋 BOOKING LIST',
    asset_title: '🏛️ Asset & Warehouse Management', asset_gudang: '📦 Warehouse & Stock',
    asset_strategis: '🏢 Strategic Assets', asset_rab: '📊 Budget & Tax', asset_log: '📜 Audit Log',
    asset_save: '💾 SAVE', asset_nama: 'Item/Asset Name', asset_qty: 'Quantity', asset_lokasi: 'Location',
    stok_title: '📦 Warehouse Stock', stok_add: '✅ SAVE ITEM', stok_list: '📋 Item List', stok_sync: '☁️ Sync All',
    maint_title: '🔧 Maintenance & Repair', maint_add: '➕ Create Task', maint_judul: 'Job Title',
    maint_lokasi: 'Location / Area', maint_petugas: 'Technician Name', maint_jenis: 'Type',
    maint_prioritas: 'Priority', maint_biaya: 'Estimated Cost', maint_active: '📋 Active Tasks',
    maint_history: '📜 History', set_title: '⚙️ Enterprise Settings', set_display: '🎨 Display',
    set_access: '♿ Access', set_language: '🌍 Language', set_advanced: '🔬 Advanced',
    set_dark_mode: 'Dark Mode', set_font_scale: 'Font Scale', set_starfield: 'Starfield',
    set_glass: 'Glass Intensity', set_reset: '🔄 Reset Default', set_export: '📥 Export', set_import: '📤 Import',
    notif_title: 'Notifications', notif_empty: 'No notifications.', notif_booking_new: 'New booking: ',
    notif_dana_approved: 'Budget approved: ', btn_save: '💾 Save', btn_cancel: '❌ Cancel', btn_delete: '🗑️ Delete',
    btn_edit: '✏️ Edit', btn_back: '← Back', btn_close: '✕ Close', btn_yes: 'Yes', btn_no: 'No',
    confirm_delete: 'Delete this data?', confirm_reset: 'Reset data?', loading: 'Loading...', no_data: 'No data yet.',
    success: '✅ Success!', error: '⚠️ Failed', access_denied: '⛔ Access Denied!',
    session_expired: '⏰ Session expired, please login again.', welcome: 'Welcome, peace be upon you.'
  },
  ar: {
    login_title: '⚡ الدخول للنظام', login_email: '📧 البريد الإلكتروني', login_password: '🔐 كلمة المرور',
    login_connecting: '⏳ جاري الاتصال...', login_error_empty: '⛔ البريد وكلمة المرور مطلوبان!',
    login_error_auth: '⛔ بريد أو كلمة مرور غير صحيحة', login_error_server: '⚠️ فشل الاتصال بالخادم',
    login_success: '✅ تم بنجاح!', dashboard_title: 'Dream OS Enterprise RBAC', dashboard_role: 'الدور',
    dashboard_loading: 'جاري التحميل...', dashboard_online: '📡 متصل', dashboard_offline: '📡 غير متصل',
    dashboard_checking: '📡 جاري الفحص...', dashboard_prayer: '🕌 جاري تحميل مواقيت الصلاة...',
    dashboard_prayer_fail: '🕌 فشل تحميل الجدول', dashboard_logout: '🚪 خروج',
    dashboard_logout_confirm: 'هل أنت متأكد من الخروج؟', dashboard_mod_loading: 'جاري تحميل الوحدة...',
    nav_home: 'الرئيسية', nav_profile: 'الملف', nav_qr: 'QR', nav_about: 'حول', nav_system: 'النظام',
    profile_title: '👤 الملف الشخصي', profile_overview: '📊 نظرة عامة', profile_edit: '✏️ تعديل',
    profile_security: '🔒 الأمان', profile_users: '👥 المستخدمين', profile_settings: '⚙️ الإعدادات',
    profile_name: 'الاسم', profile_email: 'البريد', profile_role: 'الدور', profile_device_dna: 'بصمة الجهاز',
    profile_save: '💾 حفظ', profile_upload: '📷 رفع', profile_change_password: '🔑 تغيير كلمة المرور',
    profile_old_password: 'كلمة المرور القديمة', profile_new_password: 'كلمة المرور الجديدة',
    profile_confirm_password: 'تأكيد', profile_register: '➕ تسجيل مستخدم جديد',
    profile_register_nama: 'الاسم الكامل', profile_register_email: 'البريد', profile_register_role: 'الدور',
    profile_register_password: 'كلمة المرور (6 أحرف على الأقل)', profile_logout: '🚪 خروج',
    cmd_title: '🏢 مركز القيادة', cmd_users: '👥 المستخدمين', cmd_dana: '💰 الميزانية', cmd_k3: '⚠️ السلامة',
    cmd_maint: '🔧 الصيانة', cmd_booking: '📅 الحجز', cmd_audit: '📜 التدقيق', cmd_system: '⚙️ النظام',
    cmd_add_user: '➕ إضافة مستخدم', cmd_save_user: '✅ حفظ المستخدم', cmd_print: '🖨️ طباعة',
    cmd_sync: '☁️ مزامنة', cmd_export_csv: '📥 CSV', cmd_approve: '✅', cmd_reject: '❌',
    cmd_pending: 'قيد الانتظار', cmd_approved: 'موافق', cmd_rejected: 'مرفوض', cmd_budget: '📊 الميزانية',
    cmd_pagu: '💰 السقف', sec_title: '🛡️ مركز العمليات الأمنية', sec_jadwal: '📅 جدول المناوبات',
    sec_input_log: '📝 تسليم واستلام', sec_report: '📊 دفتر التقارير (PDF)', sec_bridge: '🚨 تحديث الشاشة',
    sec_petugas: 'الضابط', sec_total_log: 'إجمالي السجلات', sec_urgent: 'عاجل', sec_petugas_aktif: 'الضباط النشطون',
    sec_waktu: 'الوقت', sec_save_log: '💾 حفظ سجل التسليم', sec_update_slide: '🚀 تحديث الشاشة العامة',
    ji_title: '🧹 النظافة الداخلية', ji_petugas: 'اسم العامل', ji_gedung: 'المبنى', ji_lantai: 'الطابق',
    ji_riwayat: '📜 السجل', ji_export_csv: '📥 CSV', ji_submit_cloud: '☁️ إرسال', ji_cetak: '🖨️ طباعة',
    ji_reset_shift: 'إعادة تعيين', ji_total_item: 'إجمالي العناصر', ji_selesai: 'تم', ji_progress: 'التقدم',
    jo_title: '🌿 النظافة الخارجية', jo_area: 'المنطقة', jo_zona: 'النطاق', jo_daily: '📋 القائمة اليومية',
    jo_weekly: '🗓️ المهام الأسبوعية', book_title: '📅 حجز الغرف', book_form: 'نموذج الحجز',
    book_tgl: 'التاريخ', book_ruang: 'الغرفة', book_peminjam: 'اسم المستعير', book_jam_mulai: 'وقت البداية',
    book_jam_selesai: 'وقت النهاية', book_save: '✅ حفظ الحجز', book_list: '📋 قائمة الحجوزات',
    asset_title: '🏛️ إدارة الأصول والمخازن', asset_gudang: '📦 المخزن', asset_strategis: '🏢 الأصول الاستراتيجية',
    asset_rab: '📊 الميزانية والضرائب', asset_log: '📜 سجل التدقيق', asset_save: '💾 حفظ',
    asset_nama: 'اسم الصنف/الأصل', asset_qty: 'الكمية', asset_lokasi: 'الموقع', stok_title: '📦 مخزن المستودع',
    stok_add: '✅ حفظ الصنف', stok_list: '📋 قائمة الأصناف', stok_sync: '☁️ مزامنة الكل',
    maint_title: '🔧 الصيانة والإصلاح', maint_add: '➕ إنشاء مهمة', maint_judul: 'عنوان المهمة',
    maint_lokasi: 'الموقع', maint_petugas: 'اسم الفني', maint_jenis: 'النوع', maint_prioritas: 'الأولوية',
    maint_biaya: 'التكلفة المقدرة', maint_active: '📋 المهام النشطة', maint_history: '📜 السجل',
    set_title: '⚙️ إعدادات المؤسسة', set_display: '🎨 العرض', set_access: '♿ الوصول',
    set_language: '🌍 اللغة', set_advanced: '🔬 متقدم', set_dark_mode: 'الوضع الداكن',
    set_font_scale: 'حجم الخط', set_starfield: 'حقل النجوم', set_glass: 'شفافية الزجاج',
    set_reset: '🔄 إعادة التعيين', set_export: '📥 تصدير', set_import: '📤 استيراد',
    notif_title: 'الإشعارات', notif_empty: 'لا توجد إشعارات.', notif_booking_new: 'حجز جديد: ',
    notif_dana_approved: 'تمت الموافقة على الميزانية: ', btn_save: '💾 حفظ', btn_cancel: '❌ إلغاء',
    btn_delete: '🗑️ حذف', btn_edit: '✏️ تعديل', btn_back: '← رجوع', btn_close: '✕ إغلاق',
    btn_yes: 'نعم', btn_no: 'لا', confirm_delete: 'هل تريد حذف هذه البيانات؟', confirm_reset: 'هل تريد إعادة التعيين؟',
    loading: 'جاري التحميل...', no_data: 'لا توجد بيانات.', success: '✅ تم بنجاح!', error: '⚠️ فشل',
    access_denied: '⛔ تم رفض الوصول!', session_expired: '⏰ انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى.',
    welcome: 'السلام عليكم، أهلاً وسهلاً.'
  },
  zh: {
    login_title: '⚡ 访问核心', login_email: '📧 电子邮件', login_password: '🔐 密码',
    login_connecting: '⏳ 连接中...', login_error_empty: '⛔ 电子邮件和密码为必填项！',
    login_error_auth: '⛔ 电子邮件或密码错误', login_error_server: '⚠️ 无法连接到服务器',
    login_success: '✅ 成功！', dashboard_title: 'Dream OS 企业版 RBAC', dashboard_role: '角色',
    dashboard_loading: '加载中...', dashboard_online: '📡 在线', dashboard_offline: '📡 离线',
    dashboard_checking: '📡 检查中...', dashboard_prayer: '🕌 正在加载礼拜时间...',
    dashboard_prayer_fail: '🕌 加载时间表失败', dashboard_logout: '🚪 退出',
    dashboard_logout_confirm: '确定要退出吗？', dashboard_mod_loading: '正在加载模块...',
    nav_home: '主页', nav_profile: '个人资料', nav_qr: 'QR', nav_about: '关于', nav_system: '系统',
    profile_title: '👤 个人资料', profile_overview: '📊 概览', profile_edit: '✏️ 编辑',
    profile_security: '🔒 安全', profile_users: '👥 用户', profile_settings: '⚙️ 设置',
    profile_name: '姓名', profile_email: '电子邮件', profile_role: '角色', profile_device_dna: '设备指纹',
    profile_save: '💾 保存', profile_upload: '📷 上传', profile_change_password: '🔑 更改密码',
    profile_old_password: '旧密码', profile_new_password: '新密码',
    profile_confirm_password: '确认', profile_register: '➕ 注册新用户',
    profile_register_nama: '全名', profile_register_email: '电子邮件', profile_register_role: '角色',
    profile_register_password: '密码（至少6个字符）', profile_logout: '🚪 退出',
    cmd_title: '🏢 指挥中心专业版', cmd_users: '👥 用户', cmd_dana: '💰 预算', cmd_k3: '⚠️ 安全',
    cmd_maint: '🔧 维护', cmd_booking: '📅 预订', cmd_audit: '📜 审计', cmd_system: '⚙️ 系统',
    cmd_add_user: '➕ 添加新用户', cmd_save_user: '✅ 保存用户', cmd_print: '🖨️ 打印',
    cmd_sync: '☁️ 同步到云端', cmd_export_csv: '📥 CSV', cmd_approve: '✅', cmd_reject: '❌',
    cmd_pending: '待处理', cmd_approved: '已批准', cmd_rejected: '已拒绝', cmd_budget: '📊 预算',
    cmd_pagu: '💰 上限', sec_title: '🛡️ 安全运营中心专业版', sec_jadwal: '📅 值班表',
    sec_input_log: '📝 交接记录', sec_report: '📊 报告簿 (PDF)', sec_bridge: '🚨 触发和幻灯片',
    sec_petugas: '官员', sec_total_log: '总记录', sec_urgent: '紧急', sec_petugas_aktif: '活跃官员',
    sec_waktu: '时间', sec_save_log: '💾 保存交接记录', sec_update_slide: '🚀 立即更新公共幻灯片',
    ji_title: '🧹 室内清洁', ji_petugas: '官员姓名', ji_gedung: '建筑', ji_lantai: '楼层',
    ji_riwayat: '📜 历史', ji_export_csv: '📥 CSV', ji_submit_cloud: '☁️ 提交', ji_cetak: '🖨️ 打印',
    ji_reset_shift: '重置班次', ji_total_item: '总项目', ji_selesai: '完成', ji_progress: '进度',
    jo_title: '🌿 室外清洁', jo_area: '区域/花园', jo_zona: '地带', jo_daily: '📋 每日清单',
    jo_weekly: '🗓️ 每周任务', book_title: '📅 房间预订', book_form: '预订表格',
    book_tgl: '日期', book_ruang: '房间', book_peminjam: '借用人姓名', book_jam_mulai: '开始时间',
    book_jam_selesai: '结束时间', book_save: '✅ 保存预订', book_list: '📋 预订列表',
    asset_title: '🏛️ 资产与仓库管理', asset_gudang: '📦 仓库和库存', asset_strategis: '🏢 战略资产',
    asset_rab: '📊 预算和税务', asset_log: '📜 审计日志', asset_save: '💾 保存',
    asset_nama: '物品/资产名称', asset_qty: '数量', asset_lokasi: '位置', stok_title: '📦 仓库库存',
    stok_add: '✅ 保存物品', stok_list: '📋 物品清单', stok_sync: '☁️ 全部同步',
    maint_title: '🔧 维护与修理', maint_add: '➕ 创建任务', maint_judul: '工作标题',
    maint_lokasi: '位置/区域', maint_petugas: '技术员姓名', maint_jenis: '类型', maint_prioritas: '优先级',
    maint_biaya: '预估成本', maint_active: '📋 活跃任务', maint_history: '📜 历史记录',
    set_title: '⚙️ 企业设置', set_display: '🎨 显示', set_access: '♿ 辅助功能',
    set_language: '🌍 语言', set_advanced: '🔬 高级', set_dark_mode: '暗黑模式',
    set_font_scale: '字体大小', set_starfield: '星空', set_glass: '玻璃强度',
    set_reset: '🔄 恢复默认', set_export: '📥 导出', set_import: '📤 导入',
    notif_title: '通知', notif_empty: '无通知。', notif_booking_new: '新预订：',
    notif_dana_approved: '预算已批准：', btn_save: '💾 保存', btn_cancel: '❌ 取消', btn_delete: '🗑️ 删除',
    btn_edit: '✏️ 编辑', btn_back: '← 返回', btn_close: '✕ 关闭', btn_yes: '是', btn_no: '否',
    confirm_delete: '删除此数据？', confirm_reset: '重置数据？', loading: '加载中...', no_data: '暂无数据。',
    success: '✅ 成功！', error: '⚠️ 失败', access_denied: '⛔ 访问被拒绝！',
    session_expired: '⏰ 会话已过期，请重新登录。', welcome: '欢迎，愿您平安。'
  }
};

// ========== GLOBAL i18n FUNCTIONS ==========
window.currentLang = localStorage.getItem('dreamos_lang') || 'id';

window.t = function(key) {
  return (DREAM_I18N[window.currentLang] && DREAM_I18N[window.currentLang][key]) || key;
};

// 🔥 FUNGSI BARU: Set bahasa langsung (bukan cycling)
window.setLanguage = function(lang) {
  if (!DREAM_I18N[lang]) return false;
  window.currentLang = lang;
  localStorage.setItem('dreamos_lang', lang);
  localStorage.setItem('dreamos_settings_lang', lang);
  
  // Update direction
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  
  // Refresh dashboard
  if (typeof window.renderDashboard === 'function') {
    window.renderDashboard();
  }
  
  // Update semua tombol bahasa
  const langBtns = document.querySelectorAll('[onclick*="setLanguage"], [onclick*="toggleLanguage"]');
  langBtns.forEach(btn => { btn.textContent = '🌐 ' + lang.toUpperCase(); });
  
  console.log('🌍 Language changed to: ' + lang.toUpperCase());
  if (window.BankAudit) BankAudit.log('LANGUAGE_CHANGE', { to: lang });
  return true;
};

window.toggleLanguage = function() {
  const langs = ['id', 'en', 'ar', 'zh'];
  const idx = langs.indexOf(window.currentLang);
  const next = langs[(idx + 1) % langs.length];
  window.setLanguage(next);
};

window.getAllLanguages = function() { return Object.keys(DREAM_I18N); };
window.getCurrentLanguage = function() { return window.currentLang; };

// Set RTL saat startup
document.documentElement.setAttribute('dir', window.currentLang === 'ar' ? 'rtl' : 'ltr');

console.log('🌍 i18n Ready - Current: ' + window.currentLang.toUpperCase() + ' | Available: id, en, ar, zh');
