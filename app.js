// app.js — Dream OS v3.2.3 (Layout Preserved + Click Fixed)
console.log("🚀 DREAM OS V3.2.3 LOADED");

// ✅ GLOBAL FUNCTION UNTUK MODUL
window.bukaModul = async (modId) => {
  console.log("🔥 MODUL DIPANGGIL:", modId);
  
  const moduleMap = {
    'cc': 'commandcenter',
    'booking': 'booking',
    'k3': 'k3',
    'sekuriti': 'sekuriti',
    'jan-indoor': 'janitor-indoor',
    'jan-outdoor': 'janitor-outdoor',
    'stok': 'stok',
    'maint': 'maintenance',
    'inventaris': 'inventaris'
  };
  
  const folder = moduleMap[modId];
  if (!folder) {
    alert("Modul tidak ditemukan: " + modId);
    return;
  }
  
  try {
    const basePath = window.location.pathname.includes('dream-os-final') 
      ? '/dream-os-final' 
      : '';
    const url = `${basePath}/workspaces/kabag_umum/modules/${folder}/module.js?t=${Date.now()}`;
    
    console.log("📥 Loading:", url);
    const mod = await import(url);
    
    const viewport = document.getElementById('module-viewport');
    if (!viewport) {
      document.getElementById('module-container').innerHTML = 
        '<div id="module-viewport" class="p-4"></div>';
    }
    
    if (mod.default) {
      await mod.default();
      console.log("✅ Modul loaded:", folder);
    } else {
      throw new Error("No export default");
    }
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Gagal load " + folder + ": " + err.message);
  }};

// ✅ SETUP EVENT LISTENERS SETELAH DOM READY
document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOM Ready");
  
  // LOGIN HANDLER
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('dashboard-screen')?.classList.add('active');
      setupModuleButtons();
    };
  }
  
  // BOTTOM NAVIGATION HANDLERS
  setupBottomNav();
});

// ✅ SETUP TOMBOL MODUL (GRID 9)
function setupModuleButtons() {
  console.log("🔧 Setting up module buttons...");
  
  // Tambahin onclick ke semua button yang punya data-modul attribute
  document.querySelectorAll('[data-modul]').forEach(btn => {
    const modId = btn.getAttribute('data-modul');
    btn.onclick = () => {
      console.log(" Button clicked:", modId);
      window.bukaModul(modId);
    };
    btn.style.cursor = 'pointer';
    console.log("✅ Button setup:", modId);
  });
}

// ✅ BOTTOM NAVIGATION
function setupBottomNav() {
  const navButtons = {
    'home': () => {
      document.getElementById('module-container').innerHTML = `
        <div class="p-4 text-center text-emerald-600">
          <i class="fas fa-home text-4xl mb-2"></i>
          <p>Home - Dashboard Utama</p>
        </div>
      `;
    },
    'profile': () => {
      document.getElementById('module-container').innerHTML = `        <div class="p-4 text-center text-blue-600">
          <i class="fas fa-user text-4xl mb-2"></i>
          <p>Profile - Mr. Architect</p>
        </div>
      `;
    },
    'qr': () => {
      document.getElementById('module-container').innerHTML = `
        <div class="p-4 text-center text-purple-600">
          <i class="fas fa-qrcode text-6xl mb-2"></i>
          <p>QR Scanner</p>
        </div>
      `;
    },
    'about': () => {
      document.getElementById('module-container').innerHTML = `
        <div class="p-4 text-center text-orange-600">
          <i class="fas fa-info-circle text-4xl mb-2"></i>
          <p>About - Dream OS v3.2.3</p>
        </div>
      `;
    },
    'setting': () => {
      document.getElementById('module-container').innerHTML = `
        <div class="p-4 text-center text-gray-600">
          <i class="fas fa-cog text-4xl mb-2"></i>
          <p>Settings</p>
        </div>
      `;
    }
  };
  
  // Setup click handlers untuk bottom nav
  Object.keys(navButtons).forEach(id => {
    const btn = document.querySelector(`[data-route="#${id}"]`);
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Run handler
        navButtons[id]();
      };
    }
  });
}

// ✅ AUTO-INIT JIKA SUDAH LOGIN
if (document.getElementById('dashboard-screen')?.classList.contains('active')) {  setupModuleButtons();
  setupBottomNav();
}
