(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={key:`Mr.M_Architect_2025`,check:t=>t===e.key},t={async sync(){console.log(`🛰️ Syncing Body State...`);try{let[e,t]=await Promise.all([fetch(`./data/prayer.json`),fetch(`./data/zikir.json`)]);if(!e.ok||!t.ok)throw Error(`Cloud Data Unreachable`);return{pray:await e.json(),zikir:await t.json()}}catch(e){return console.error(`❌ State Sync Failed:`,e),null}}},n={render:e=>{let t=document.getElementById(`dashboard-content`);t.innerHTML=`
      <div style='text-align:center; margin-bottom:30px;'>
        <div style='font-family:"Amiri",serif; font-size:1.8rem; color:#d97706;'>${e?`${e.zikir.name} (${e.zikir.trans})`:`بِسْمِ اللَّهِ`}</div>
        <div style='font-size:0.8rem; color:#10b981; font-weight:800; margin-top:5px;'>📍 ${e?`${e.loc.city} • ${e.pray.data.timings.Maghrib}`:`Syncing...`}</div>
      </div>
      <div class='grid'>
        ${n.item(`terminal`,`CMD`)} ${n.item(`hard-hat`,`K3`)} ${n.item(`shield-alt`,`SEC`)}
        ${n.item(`broom`,`JAN`)} ${n.item(`tools`,`ENG`)} ${n.item(`bolt`,`POW`)}
        ${n.item(`tint`,`WTR`)} ${n.item(`wifi`,`NET`)} ${n.item(`cog`,`SET`)}
      </div>
    `},item:(e,t)=>`
    <div class='mod-card'>
      <i class='fas fa-${e}'></i>
      <span>${t}</span>
    </div>
  `,transition:()=>{document.getElementById(`login-screen`).classList.remove(`active`),document.getElementById(`dashboard-screen`).classList.add(`active`)}};document.addEventListener(`DOMContentLoaded`,()=>{let r=document.getElementById(`loginBtn`),i=document.getElementById(`accessKey`);r.addEventListener(`click`,async()=>{if(e.check(i.value)){alert(`🤲 Bismillah! Akses Diterima. Thuma'ninah Mode Active.`),n.transition(),n.render(null);let e=await t.sync();n.render(e)}else alert(`❌ Cek Integritas, Sultan!`)})});