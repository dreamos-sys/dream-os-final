// Dream OS Auto-Translate (v8) — terjemahkan teks leaf tanpa edit modul
(function(){
  'use strict';

  var AUTO = {
    zh: {
      '← HOME':'← 首页','← Kembali':'← 返回','ACCESS CORE':'进入核心',
      '📧 EMAIL':'📧 邮箱','🔐 PASSWORD':' 密码',
      '⚙️ Enterprise Settings':'⚙️ 企业设置','🎨 Display':'🎨 显示','♿ Access':'♿ 无障碍',
      '🌍 Language':'🌍 语言','📊 System':' 系统',' Advanced':' 高级',
      '📥 Export':'📥 导出','📤 Import':' 导入','🔄 Reset':'🔄 重置',
      'CMD CENTER':'指挥中心','SECURITY OPS':'安全运营','K3 SAFETY':'K3 安全',
      'JAN INDOOR':'室内清洁','JAN OUTDOOR':'室外清洁','BOOKING':'预订','ASSET':'资产',
      'STOK GUDANG':'库存','MAINTENANCE':'维护','DANA':'资金',
      'Pending':'待处理','Approved':'已批准','Rejected':'已拒绝',
      'Dark Mode / Light Mode':'深色 / 浅色模式','Font Scale':'字体大小',
      'Starfield Animation':'星空动画','Glass Panel Intensity':'玻璃透明度',
      'High Contrast ISO Mode':'高对比模式','Reduced Motion':'减少动效',
      'System Language':'系统语言','Auto-Detect Timezone':'自动检测时区',
      'Developer Mode':'开发者模式','Auto-Save Configuration':'自动保存配置',
      '🏠':'🏠','👤':'👤','📱':'📱','️':'ℹ️','️':'️'
    },
    en: {
      '← HOME':'← HOME','← Kembali':'← Back','ACCESS CORE':'ACCESS CORE',
      '⚙️ Enterprise Settings':'⚙️ Enterprise Settings','🎨 Display':'🎨 Display',
      '♿ Access':'♿ Access','🌍 Language':'🌍 Language','📊 System':' System',
      '🔬 Advanced':'🔬 Advanced',' Export':' Export','📤 Import':'📤 Import',' Reset':'🔄 Reset',
      'CMD CENTER':'CMD CENTER','SECURITY OPS':'SECURITY OPS','K3 SAFETY':'K3 SAFETY',
      'JAN INDOOR':'JAN INDOOR','JAN OUTDOOR':'JAN OUTDOOR','BOOKING':'BOOKING','ASSET':'ASSET',
      'STOK GUDANG':'STOCK','MAINTENANCE':'MAINTENANCE','DANA':'FUND',
      'Pending':'Pending','Approved':'Approved','Rejected':'Rejected',
      'Dark Mode / Light Mode':'Dark / Light Mode','Font Scale':'Font Scale',
      'Starfield Animation':'Starfield Animation','Glass Panel Intensity':'Glass Intensity',
      'High Contrast ISO Mode':'High Contrast','Reduced Motion':'Reduced Motion',
      'System Language':'System Language','Auto-Detect Timezone':'Auto Timezone',
      'Developer Mode':'Developer Mode','Auto-Save Configuration':'Auto-Save'
    },
    ar: {
      '← HOME':'← الرئيسية','← Kembali':'← رجوع','ACCESS CORE':'دخول',
      '⚙️ Enterprise Settings':'⚙️ الإعدادات','🎨 Display':' العرض',' Access':'♿ وصول',
      '🌍 Language':' اللغة',' System':'📊 النظام','🔬 Advanced':' متقدم',
      '📥 Export':' تصدير','📤 Import':'📤 استيراد','🔄 Reset':'🔄 إعادة',
      'Pending':'قيد الانتظار','Approved':'موافق','Rejected':'مرفوض'
    }
  };

  function leafOnly(el){ return el.children.length === 0; }

  function translateDOM(lang){
    var map = AUTO[lang];
    var nodes = document.querySelectorAll('body *');
    for (var i=0;i<nodes.length;i++){
      var el = nodes[i];
      if (!leafOnly(el)) continue;
      var orig = el.getAttribute('data-i18n-orig');
      if (!orig) { orig = el.textContent; el.setAttribute('data-i18n-orig', orig); }
      var trimmed = (orig || '').trim();
      if (!trimmed) continue;
      if (!map || lang === 'id') { el.textContent = orig; continue; }
      var t = map[trimmed];
      el.textContent = (t !== undefined) ? t : orig;
    }
  }

  // Debounce observer untuk konten dinamis
  var obTimer = null;
  function scheduleTranslate(){
    if (obTimer) clearTimeout(obTimer);
    obTimer = setTimeout(function(){ translateDOM(window.currentLang || 'id'); }, 400);
  }

  try {
    var mo = new MutationObserver(scheduleTranslate);
    mo.observe(document.body, { childList:true, subtree:true });
  } catch(e){}

  window.addEventListener('dreamos-lang-changed', function(e){
    translateDOM((e.detail && e.detail.lang) || 'id');
  });

  // Apply saat load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ translateDOM(window.currentLang || 'id'); });
  } else {
    translateDOM(window.currentLang || 'id');
  }
})();
