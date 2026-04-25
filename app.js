import{getPath}from'./scripts/helpers/router.js';
import{renderGrid}from'./scripts/helpers/ui.js';
const d=document,g=i=>d.getElementById(i);
window.bukaModul=async i=>{
  const c=g('module-container');
  c.innerHTML='<div id="module-viewport" class="p-4"></div>'; // BANGUN KAMARNYA DULU!
  try{
    const m=await import(getPath(i));
    await m.default();
  }catch(e){
    c.innerHTML='<p class="text-red-500">Kabel Putus!</p>';
    console.error(e);
  }
};
d.addEventListener('DOMContentLoaded',()=>{
  window.renderGrid=renderGrid;
  const f=g('login-form');
  if(f)f.onsubmit=e=>{
    e.preventDefault();
    g('login-screen').style.display='none';
    g('dashboard-screen').classList.add('active');
    renderGrid();
  }
});
