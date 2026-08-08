(function(){
  function show(err){
    try{
      var box=document.getElementById('dreamos-errbox');
      if(!box){
        box=document.createElement('div');
        box.id='dreamos-errbox';
        box.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#7f1d1d;color:#fff;font:11px monospace;padding:8px;max-height:45vh;overflow:auto;white-space:pre-wrap;border-top:2px solid #ef4444;';
        box.onclick=function(){box.style.display='none';};
        document.body.appendChild(box);
      }
      box.style.display='block';
      box.textContent+=err+'\n';
    }catch(e){}
  }
  window.addEventListener('error',function(e){
    show('❌ '+(e.message||'error')+' @ '+(e.filename||'').split('/').pop()+':'+e.lineno);
  });
  window.addEventListener('unhandledrejection',function(e){
    var r=e.reason;
    show('❌ promise: '+(r&&r.message?r.message:r));
  });
  console.log('[ErrorReporter] aktif');
})();
