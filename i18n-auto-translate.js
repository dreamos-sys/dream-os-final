// Dream OS Auto-Translate (v9) — defensive, tidak pernah blank-kan app
(function(){
  'use strict';
  var SKIP_TAGS = {SCRIPT:1,STYLE:1,INPUT:1,TEXTAREA:1,SELECT:1,OPTION:1,SVG:1,CANVAS:1,IFRAME:1,NOSCRIPT:1};
  var AUTO = {
    zh: {'← HOME':'← 首页','← Kembali':'← 返回','ACCESS CORE':'进入核心','⚙️ Enterprise Settings':'⚙️ 企业设置','🎨 Display':'🎨 显示','♿ Access':' 无障碍',' Language':' 语言',' System':'📊 系统','🔬 Advanced':'🔬 高级','📥 Export':' 导出',' Import':' 导入','🔄 Reset':'🔄 重置','CMD CENTER':'指挥中心','SECURITY OPS':'安全运营','K3 SAFETY':'K3 安全','JAN INDOOR':'室内清洁','JAN OUTDOOR':'室外清洁','BOOKING':'预订','ASSET':'资产','STOK GUDANG':'库存','MAINTENANCE':'维护','DANA':'资金','Pending':'待处理','Approved':'已批准','Rejected':'已拒绝','Dark Mode / Light Mode':'深色/浅色模式','Font Scale':'字体大小','Starfield Animation':'星空动画','Glass Panel Intensity':'玻璃透明度','High Contrast ISO Mode':'高对比模式','Reduced Motion':'减少动效','System Language':'系统语言','Developer Mode':'开发者模式','Auto-Save Configuration':'自动保存'},
    en: {'← Kembali':'← Back','STOK GUDANG':'STOCK','DANA':'FUND','JAN INDOOR':'JAN INDOOR','JAN OUTDOOR':'JAN OUTDOOR'},
    ar: {'← HOME':'← الرئيسية','← Kembali':'← رجوع','ACCESS CORE':'دخول','Pending':'قيد الانتظار','Approved':'موافق','Rejected':'مرفوض'}
  };
  function leaf(el){ return el.children.length===0 && !SKIP_TAGS[el.tagName]; }
  function translateDOM(lang){
    try {
      var map = AUTO[lang];
      var nodes = document.querySelectorAll('body *');
      for (var i=0;i<nodes.length;i++){
        var el = nodes[i];
        if (!leaf(el)) continue;
        var orig = el.getAttribute('data-i18n-orig');
        if (!orig){ orig = el.textContent; el.setAttribute('data-i18n-orig', orig); }
        var tr = (orig||'').trim();
        if (!tr) continue;
        if (!map || lang==='id'){ el.textContent = orig; continue; }
        var t = map[tr];
        el.textContent = (t!==undefined)? t : orig;
      }
    } catch(e){ /* jangan pernah blank-kan app */ }
  }
  var obTimer=null;
  function schedule(){ if(obTimer) clearTimeout(obTimer); obTimer=setTimeout(function(){ translateDOM(window.currentLang||'id'); }, 500); }
  try { new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true}); } catch(e){}
  window.addEventListener('dreamos-lang-changed', function(e){ translateDOM((e.detail&&e.detail.lang)||'id'); });
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ translateDOM(window.currentLang||'id'); });
  else translateDOM(window.currentLang||'id');
})();
