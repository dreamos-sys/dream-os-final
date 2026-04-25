// 🚀 Dream OS v3.2.3 — Sovereign Command Center
// Click handlers + AI 120B Integration
console.log("🚀 Dream OS v3.2.3 Loaded");

// ✅ GLOBAL: Fungsi buka modul (dipakai oleh onclick attribute)
window.bukaModul = async (modId) => {
  console.log("🔥 Module requested:", modId);
  
  const moduleMap = {
    'cc': 'commandcenter', 'booking': 'booking', 'k3': 'k3',
    'sekuriti': 'sekuriti', 'jan-indoor': 'janitor-indoor',
    'jan-outdoor': 'janitor-outdoor', 'stok': 'stok',
    'maint': 'maintenance', 'inventaris': 'inventaris'
  };
  
  const folder = moduleMap[modId];
  if (!folder) { alert("Modul tidak ditemukan: " + modId); return; }
  
  try {
    const basePath = window.location.pathname.includes('dream-os-final') ? '/dream-os-final' : '';
    const url = `${basePath}/workspaces/kabag_umum/modules/${folder}/module.js?t=${Date.now()}`;
    console.log("📥 Loading:", url);
    
    const mod = await import(url);
    const viewport = document.getElementById('module-viewport') || 
                    (() => { const el = document.createElement('div'); el.id = 'module-viewport'; el.className = 'p-4'; document.getElementById('module-container')?.appendChild(el); return el; })();
    
    viewport.innerHTML = '<div class="text-center p-8"><i class="fas fa-spinner fa-spin text-3xl text-emerald-500"></i><p class="mt-2">Loading...</p></div>';
    
    if (mod.default) await mod.default();
    else throw new Error("Module has no export default");
    
  } catch (err) {
    console.error("❌ Load failed:", err);
    alert("Gagal load " + folder + ": " + err.message);
  }
};

// ✅ GLOBAL: AI 120B Diagnostic (OpenRouter)
window.aiDiagnose = async () => {
  const query = prompt("🤖 AI Analyst:\n\nDeskripsikan masalah sistem atau error:");
  if (!query?.trim()) return;
  
  // Get API key from localStorage or prompt
  let apiKey = localStorage.getItem('dreamos_120b_key');
  if (!apiKey) {
    apiKey = prompt("🔑 Masukkan OpenRouter API Key (sk-or-...):");
    if (!apiKey) return;
    localStorage.setItem('dreamos_120b_key', apiKey);
  }  
  // Show loading
  const loading = document.createElement('div');
  loading.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center';
  loading.innerHTML = '<div class="bg-white p-6 rounded-2xl shadow-xl"><i class="fas fa-brain fa-spin text-4xl text-indigo-600"></i><p class="mt-3">AI 120B thinking...</p></div>';
  document.body.appendChild(loading);
  
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'nousresearch/nous-hermes-2:120b',
        messages: [
          { role: 'system', content: "You are Dream OS Sovereign AI. Analyze problems concisely. Output format:\n🎯 **Diagnosis**: [root cause]\n🔧 **Solusi**: [technical steps]\n🛡️ **Pencegahan**: [anti-recurrence]\nUse Bahasa Indonesia. Short & actionable." },
          { role: 'user', content: query }
        ],
        temperature: 0.2, max_tokens: 600
      })
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const result = data.choices[0].message.content;
    
    // Show result in modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="font-bold text-lg text-indigo-700">🤖 AI Analyst Report</h3>
          <button id="close-ai" class="text-slate-400 hover:text-red-500 text-2xl">&times;</button>
        </div>
        <div class="p-5">
          <div class="mb-4 p-3 bg-slate-50 rounded-lg border-l-4 border-indigo-500 text-sm italic">"${query.replace(/"/g, '&quot;')}"</div>
          <div id="ai-output" class="prose prose-indigo max-w-none"></div>
        </div>
        <div class="p-4 border-t text-center">
          <button id="copy-ai" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">📋 Copy</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Format markdown-lite    const formatted = result
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/🎯|🔧|🛡️/g, m => `<span class="text-xl mr-1">${m}</span>`)
      .replace(/\n/g, '<br>');
    document.getElementById('ai-output').innerHTML = formatted;
    
    // Event listeners
    document.getElementById('close-ai').onclick = () => { modal.remove(); loading.remove(); };
    modal.onclick = (e) => { if (e.target === modal) { modal.remove(); loading.remove(); } };
    document.getElementById('copy-ai').onclick = () => {
      navigator.clipboard.writeText(result);
      alert('✅ Copied!');
    };
    
  } catch (err) {
    alert('❌ AI Error: ' + err.message);
  } finally {
    loading.remove();
  }
};

// ✅ SETUP: Event delegation untuk grid buttons
function setupGridHandlers() {
  document.querySelectorAll('[data-modul]').forEach(btn => {
    const modId = btn.getAttribute('data-modul');
    btn.onclick = (e) => { e.preventDefault(); window.bukaModul(modId); };
    btn.style.cursor = 'pointer';
    console.log("✅ Button wired:", modId);
  });
}

// ✅ SETUP: Bottom navigation
function setupBottomNav() {
  const navMap = {
    'home': () => document.getElementById('module-container').innerHTML = '<div class="p-4 text-center text-emerald-600"><i class="fas fa-home text-4xl mb-2"></i><p>Home Dashboard</p></div>',
    'profile': () => document.getElementById('module-container').innerHTML = '<div class="p-4 text-center text-blue-600"><i class="fas fa-user text-4xl mb-2"></i><p>Profile: Mr. Architect</p></div>',
    'qr': () => document.getElementById('module-container').innerHTML = '<div class="p-4 text-center text-purple-600"><i class="fas fa-qrcode text-6xl mb-2"></i><p>QR Scanner</p></div>',
    'about': () => document.getElementById('module-container').innerHTML = '<div class="p-4 text-center text-orange-600"><i class="fas fa-info-circle text-4xl mb-2"></i><p>About Dream OS v3.2.3</p></div>',
    'setting': () => document.getElementById('module-container').innerHTML = '<div class="p-4 text-center text-gray-600"><i class="fas fa-cog text-4xl mb-2"></i><p>Settings</p></div>'
  };
  
  Object.entries(navMap).forEach(([id, handler]) => {
    const btn = document.querySelector(`[data-route="#${id}"]`);
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        handler();
      };    }
  });
}

// ✅ INIT: Setelah DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOM Ready");
  
  // Login handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('dashboard-screen')?.classList.add('active');
      setupGridHandlers();
      setupBottomNav();
    };
  }
  
  // Auto-setup if already on dashboard
  if (document.getElementById('dashboard-screen')?.classList.contains('active')) {
    setupGridHandlers();
    setupBottomNav();
  }
  
  // Add AI button to grid if not exists
  setTimeout(() => {
    const grid = document.querySelector('.grid-9') || document.querySelector('#module-grid');
    if (grid && !document.getElementById('btn-ai-diag')) {
      const aiBtn = document.createElement('button');
      aiBtn.id = 'btn-ai-diag';
      aiBtn.className = 'mod bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-4';
      aiBtn.innerHTML = '<i class="fas fa-brain text-3xl mb-2"></i><span class="text-xs font-bold">AI ANALYST</span>';
      aiBtn.onclick = window.aiDiagnose;
      aiBtn.style.cursor = 'pointer';
      grid.appendChild(aiBtn);
      console.log("✅ AI Analyst button added");
    }
  }, 500);
});
