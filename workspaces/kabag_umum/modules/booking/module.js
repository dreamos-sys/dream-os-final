import{BOOKING_RULES as R}from'./config/rules.js';
export default async function init(){
document.getElementById('module-viewport').innerHTML=`
<div class="p-5 bg-white rounded-3xl border border-emerald-100 shadow-sm">
<h2 class="font-bold text-emerald-600 text-center">🗓️ BOOKING</h2>
<button onclick="location.reload()" class="w-full mt-4 p-3 bg-slate-100 rounded-xl text-xs font-bold">BACK</button>
</div>`;
console.log("R:",R.ROLES);
}
