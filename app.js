import{getPath}from'./scripts/helpers/router.js';import{renderGrid}from'./scripts/helpers/ui.js';
window.bukaModul=async i=>(await import(getPath(i))).default();
document.addEventListener('DOMContentLoaded',()=>{
window.renderGrid=renderGrid;const d=document,g=i=>d.getElementById(i),f=g('login-form');
if(f)f.onsubmit=e=>{e.preventDefault();g('login-screen').style.display='none';
g('dashboard-screen').classList.add('active');renderGrid()}});
