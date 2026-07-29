/**
 * Dream OS — i18n unified v3
 * Kamus · t(key) · setLanguage · bridge ID→lang · RTL · optional geo hint
 * Prioritas: Settings (manual) > saved lang > geo(optional) > browser > id
 */
(function (global) {
  'use strict';

  var DREAM_I18N = {
    id: {
      login_title: '⚡ ACCESS CORE',
      login_email: '📧 EMAIL',
      login_password: '🔐 PASSWORD',
      login_connecting: '⏳ Menghubungkan...',
      login_error_empty: '⛔ Email dan password harus diisi!',
      login_error_auth: '⛔ Email atau password salah',
      login_error_server: '⚠️ Gagal menghubungkan server',
      login_success: '✅ Berhasil!',
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
      nav_home: 'Home',
      nav_profile: 'Profile',
      nav_qr: 'QR',
      nav_about: 'About',
      nav_system: 'System',
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
      welcome: 'Assalamualaikum, selamat datang.',
      settings_title: 'Pengaturan',
      lang_label: 'Bahasa',
      restricted: 'Dibatasi'
    },
    en: {
      login_title: '⚡ ACCESS CORE',
      login_email: '📧 EMAIL',
      login_password: '🔐 PASSWORD',
      login_connecting: '⏳ Connecting...',
      login_error_empty: '⛔ Email and password required!',
      login_error_auth: '⛔ Invalid email or password',
      login_error_server: '⚠️ Failed to connect to server',
      login_success: '✅ Success!',
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
      nav_home: 'Home',
      nav_profile: 'Profile',
      nav_qr: 'QR',
      nav_about: 'About',
      nav_system: 'System',
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
      welcome: 'Peace be upon you, welcome.',
      settings_title: 'Settings',
      lang_label: 'Language',
      restricted: 'Restricted',
      _fromId: {
        'Home': 'Home',
        'Profile': 'Profile',
        'Pengaturan': 'Settings',
        'Keluar': 'Logout',
        'Memuat modul...': 'Loading module...',
        'Memuat modul': 'Loading module',
        'Dibatasi': 'Restricted',
        'Silakan login': 'Please log in',
        'Yakin logout?': 'Are you sure to logout?',
        'Belum ada data.': 'No data yet.',
        'Akses Ditolak!': 'Access Denied!',
        'Assalamualaikum, selamat datang.': 'Peace be upon you, welcome.'
      }
    },
    ar: {
      login_title: '⚡ الدخول للنظام',
      login_email: '📧 البريد الإلكتروني',
      login_password: '🔐 كلمة المرور',
      login_connecting: '⏳ جاري الاتصال...',
      login_error_empty: '⛔ البريد وكلمة المرور مطلوبان!',
      login_error_auth: '⛔ بريد أو كلمة مرور غير صحيحة',
      login_error_server: '⚠️ فشل الاتصال بالخادم',
      login_success: '✅ تم بنجاح!',
      dashboard_title: 'Dream OS Enterprise RBAC',
      dashboard_role: 'الدور',
      dashboard_loading: 'جاري التحميل...',
      dashboard_online: '📡 متصل',
      dashboard_offline: '📡 غير متصل',
      dashboard_checking: '📡 جاري الفحص...',
      dashboard_prayer: '🕌 جاري تحميل مواقيت الصلاة...',
      dashboard_prayer_fail: '🕌 فشل تحميل الجدول',
      dashboard_logout: '🚪 خروج',
      dashboard_logout_confirm: 'هل أنت متأكد من الخروج؟',
      dashboard_mod_loading: 'جاري تحميل الوحدة...',
      nav_home: 'الرئيسية',
      nav_profile: 'الملف',
      nav_qr: 'QR',
      nav_about: 'حول',
      nav_system: 'النظام',
      btn_save: '💾 حفظ',
      btn_cancel: '❌ إلغاء',
      btn_delete: '🗑️ حذف',
      btn_edit: '✏️ تعديل',
      btn_back: '← رجوع',
      btn_close: '✕ إغلاق',
      btn_yes: 'نعم',
      btn_no: 'لا',
      confirm_delete: 'هل تريد حذف هذه البيانات؟',
      confirm_reset: 'هل تريد إعادة التعيين؟',
      loading: 'جاري التحميل...',
      no_data: 'لا توجد بيانات.',
      success: '✅ تم بنجاح!',
      error: '⚠️ فشل',
      access_denied: '⛔ تم رفض الوصول!',
      welcome: 'السلام عليكم، أهلاً وسهلاً.',
      settings_title: 'الإعدادات',
      lang_label: 'اللغة',
      restricted: 'مقيد',
      _fromId: {
        'Home': 'الرئيسية',
        'Profile': 'الملف',
        'Pengaturan': 'الإعدادات',
        'Keluar': 'خروج',
        'Memuat modul...': 'جاري تحميل الوحدة...',
        'Dibatasi': 'مقيد',
        'Belum ada data.': 'لا توجد بيانات.'
      }
    },
    zh: {
      login_title: '⚡ 访问核心',
      login_email: '📧 电子邮件',
      login_password: '🔐 密码',
      login_connecting: '⏳ 连接中...',
      login_error_empty: '⛔ 电子邮件和密码为必填项！',
      login_error_auth: '⛔ 电子邮件或密码错误',
      login_error_server: '⚠️ 无法连接到服务器',
      login_success: '✅ 成功！',
      dashboard_title: 'Dream OS 企业版 RBAC',
      dashboard_role: '角色',
      dashboard_loading: '加载中...',
      dashboard_online: '📡 在线',
      dashboard_offline: '📡 离线',
      dashboard_checking: '📡 检查中...',
      dashboard_prayer: '🕌 正在加载礼拜时间...',
      dashboard_prayer_fail: '🕌 加载时间表失败',
      dashboard_logout: '🚪 退出',
      dashboard_logout_confirm: '确定要退出吗？',
      dashboard_mod_loading: '正在加载模块...',
      nav_home: '主页',
      nav_profile: '个人资料',
      nav_qr: 'QR',
      nav_about: '关于',
      nav_system: '系统',
      btn_save: '💾 保存',
      btn_cancel: '❌ 取消',
      btn_delete: '🗑️ 删除',
      btn_edit: '✏️ 编辑',
      btn_back: '← 返回',
      btn_close: '✕ 关闭',
      btn_yes: '是',
      btn_no: '否',
      confirm_delete: '删除此数据？',
      confirm_reset: '重置数据？',
      loading: '加载中...',
      no_data: '暂无数据。',
      success: '✅ 成功！',
      error: '⚠️ 失败',
      access_denied: '⛔ 访问被拒绝！',
      welcome: '欢迎，愿您平安。',
      settings_title: '设置',
      lang_label: '语言',
      restricted: '受限',
      _fromId: {
        'Home': '主页',
        'Profile': '个人资料',
        'Pengaturan': '设置',
        'Keluar': '退出',
        'Memuat modul...': '正在加载模块...',
        'Dibatasi': '受限',
        'Belum ada data.': '暂无数据。'
      }
    }
  };

  global.DREAM_I18N = DREAM_I18N;

  var SUPPORTED = ['id', 'en', 'ar', 'zh'];

  function normalizeLang(code) {
    if (!code) return null;
    code = String(code).toLowerCase().split('-')[0];
    if (SUPPORTED.indexOf(code) >= 0) return code;
    // fallback kasar zona/negara → bahasa UI
    var map = {
      id: 'id', ms: 'id',
      en: 'en',
      ar: 'ar',
      zh: 'zh', cn: 'zh', tw: 'zh', hk: 'zh'
    };
    return map[code] || null;
  }

  function readSettingsLang() {
    try {
      var st = JSON.parse(localStorage.getItem('dreamos_settings') || '{}');
      if (st && st.lang && DREAM_I18N[st.lang]) return st.lang;
      // autoDetect OFF → jangan paksa geo
      if (st && st.autoDetect === false) {
        return localStorage.getItem('dreamos_lang') || 'id';
      }
    } catch (e) {}
    return null;
  }

  function readBrowserLang() {
    try {
      return normalizeLang(navigator.language || (navigator.languages && navigator.languages[0]));
    } catch (e) {
      return null;
    }
  }

  /**
   * Geo hint SAJA — tidak override Settings manual.
   * Memakai timezone (tanpa GPS) agar hemat & tanpa izin lokasi.
   * Geofencing GPS opsional terpisah (lihat tryGeoLang).
   */
  function langFromTimezone() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      // Indonesia
      if (/Jakarta|Makassar|Jayapura|Pontianak|Asia\/Jakarta|Asia\/Makassar|Asia\/Jayapura/i.test(tz)) return 'id';
      // Arab
      if (/Riyadh|Dubai|Qatar|Kuwait|Bahrain|Muscat|Cairo|Beirut|Baghdad|Jerusalem|Gaza/i.test(tz)) return 'ar';
      // China
      if (/Shanghai|Chongqing|Harbin|Urumqi|Hong_Kong|Taipei|Asia\/Shanghai|Asia\/Hong_Kong/i.test(tz)) return 'zh';
      // default English-ish zones
      if (/New_York|London|Chicago|Los_Angeles|Europe\//i.test(tz)) return 'en';
    } catch (e) {}
    return null;
  }

  /**
   * GPS geofence opsional — HANYA jika:
   * settings.autoDetect === true AND settings.geoLang === true
   * Tidak pernah menimpa pilihan manual user (dreamos_lang_locked).
   */
  function tryGeoLang(cb) {
    cb = cb || function () {};
    var st = {};
    try { st = JSON.parse(localStorage.getItem('dreamos_settings') || '{}'); } catch (e) {}
    if (st.autoDetect === false || st.geoLang !== true) {
      cb(null);
      return;
    }
    if (localStorage.getItem('dreamos_lang_locked') === '1') {
      cb(null);
      return;
    }
    if (!navigator.geolocation) {
      cb(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        var lang = null;
        // Bounding box kasar (bukan politik ketat — hanya hint UX)
        // Indonesia
        if (lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141) lang = 'id';
        // China approx
        else if (lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135) lang = 'zh';
        // Middle East rough
        else if (lat >= 12 && lat <= 38 && lng >= 25 && lng <= 60) lang = 'ar';
        else lang = 'en';
        cb(lang);
      },
      function () { cb(null); },
      { maximumAge: 3600000, timeout: 5000, enableHighAccuracy: false }
    );
  }

  function resolveInitialLang() {
    // 1) User pernah pilih manual di Settings
    if (localStorage.getItem('dreamos_lang_locked') === '1') {
      var locked = localStorage.getItem('dreamos_lang');
      if (locked && DREAM_I18N[locked]) return locked;
    }
    // 2) Settings.lang
    var fromSet = readSettingsLang();
    if (fromSet) return fromSet;
    // 3) localStorage
    var saved = localStorage.getItem('dreamos_lang');
    if (saved && DREAM_I18N[saved]) return saved;
    // 4) autoDetect: timezone (tanpa GPS)
    var st = {};
    try { st = JSON.parse(localStorage.getItem('dreamos_settings') || '{}'); } catch (e) {}
    if (st.autoDetect) {
      var tzLang = langFromTimezone();
      if (tzLang) return tzLang;
      var br = readBrowserLang();
      if (br) return br;
    }
    return 'id';
  }

  global.t = function (key) {
    var lang = global.currentLang || 'id';
    var pack = DREAM_I18N[lang] || DREAM_I18N.id;
    if (pack[key] != null) return pack[key];
    if (DREAM_I18N.id[key] != null) return DREAM_I18N.id[key];
    return key;
  };

  global.setLanguage = function (lang, opts) {
    opts = opts || {};
    lang = normalizeLang(lang) || lang;
    if (!DREAM_I18N[lang]) return false;

    global.currentLang = lang;
    localStorage.setItem('dreamos_lang', lang);

    // Kunci manual = tidak diganggu geo
    if (opts.fromUser) {
      localStorage.setItem('dreamos_lang_locked', '1');
    }

    try {
      var st = JSON.parse(localStorage.getItem('dreamos_settings') || '{}');
      st.lang = lang;
      localStorage.setItem('dreamos_settings', JSON.stringify(st));
    } catch (e) {}

    document.documentElement.lang = lang;
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    if (typeof global.renderDashboard === 'function') {
      try { global.renderDashboard(); } catch (e) {}
    }
    if (typeof global.i18nTranslate === 'function') {
      try { global.i18nTranslate(); } catch (e) {}
    }
    try {
      global.dispatchEvent(new CustomEvent('dreamos-lang-changed', { detail: { lang: lang } }));
    } catch (e) {}
    try {
      global.postMessage({ type: 'DREAMOS_LANG', lang: lang }, '*');
    } catch (e) {}

    if (opts.silent !== true) console.log('🌍 Language:', lang, opts.fromUser ? '(user)' : '');
    return true;
  };

  global.toggleLanguage = function () {
    var i = SUPPORTED.indexOf(global.currentLang);
    global.setLanguage(SUPPORTED[(i + 1) % SUPPORTED.length], { fromUser: true });
  };

  /** Dipanggil Settings: autoDetect / geoLang */
  global.applyLangDetectionPolicy = function () {
    var st = {};
    try { st = JSON.parse(localStorage.getItem('dreamos_settings') || '{}'); } catch (e) {}
    if (localStorage.getItem('dreamos_lang_locked') === '1' && st.autoDetect !== true) {
      return global.currentLang;
    }
    if (!st.autoDetect) return global.currentLang;

    var tz = langFromTimezone() || readBrowserLang();
    if (tz && tz !== global.currentLang && localStorage.getItem('dreamos_lang_locked') !== '1') {
      global.setLanguage(tz, { fromUser: false, silent: true });
    }
    if (st.geoLang === true) {
      tryGeoLang(function (g) {
        if (g && localStorage.getItem('dreamos_lang_locked') !== '1') {
          global.setLanguage(g, { fromUser: false, silent: true });
        }
      });
    }
    return global.currentLang;
  };

  // Boot
  global.currentLang = resolveInitialLang();
  document.documentElement.lang = global.currentLang;
  document.documentElement.setAttribute('dir', global.currentLang === 'ar' ? 'rtl' : 'ltr');

  // Auto-detect policy setelah load settings
  setTimeout(function () {
    try { global.applyLangDetectionPolicy(); } catch (e) {}
  }, 300);

  console.log('🌍 i18n unified v3 ·', global.currentLang);
})(window);
