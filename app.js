// app.js — ULTRA MINIMAL TEST (hapus semua, paste ini)
console.log("🚀 DREAM OS TEST MODE");

// 1. Expose function ke global
window.bukaModul = (id) => {
  alert("✅ WORKS! Modul: " + id);
  console.log("🔥 Click detected:", id);
};

// 2. Render 1 tombol test saja
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('module-container');
  if (container) {
    container.innerHTML = `
      <div class="p-8 text-center">
        <button onclick="window.bukaModul('TEST')" 
                class="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold">
          🧪 TEST BUTTON
        </button>
        <p class="mt-4 text-sm text-gray-500">Kalau klik ini muncul alert → sistem jalan!</p>
      </div>
    `;
  }
});

// 3. Auto-render setelah login (jika ada form)
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard-screen')?.classList.add('active');
    // Trigger render
    const container = document.getElementById('module-container');
    if (container && !container.querySelector('button')) {
      container.innerHTML = `<button onclick="window.bukaModul('TEST')" class="p-4 bg-blue-500 text-white rounded">TEST</button>`;
    }
  };
}

