<script>
  import Header from './lib/components/Header.svelte';
  import Slider from './lib/components/Slider.svelte';
  import Dashboard from './lib/components/Dashboard.svelte';
  import './app.css';

  let currentView = 'home';
  let activeModuleId = null;
  let moduleContent = "";
  let isLoading = false;

  const utils = { esc: (s) => String(s||'').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])) };
  const currentUser = { name: 'My Bro', role: 'Master Architect', email: 'dreamos@internal.sys' };

  // 🧠 Logic Sakti: Daftarkan semua modul agar dikenali Vite saat Build
  const allModules = import.meta.glob('./lib/modules/*/module.js');

  async function loadModule(id, folder) {
    isLoading = true;
    currentView = 'module_viewer';
    activeModuleId = id;
    moduleContent = '<div class="text-center p-10">⏳ Memuat Energi Modul...</div>';

    try {
      // Cari path modul yang sesuai di dalam glob
      const path = `./lib/modules/${folder}/module.js`;
      
      if (allModules[path]) {
        const module = await allModules[path]();
        const result = await module.default({}, utils, null, currentUser, null, null, null, {}, 'id');
        
        if (typeof result === 'string') {
          moduleContent = result;
        } else if (typeof result === 'function') {
          moduleContent = result();
        }
      } else {
        throw new Error(`Path ${path} tidak ditemukan di sistem.`);
      }
    } catch (err) {
      console.error(err);
      moduleContent = `<div class="p-6 text-red-500">❌ Gagal memuat modul ${id}.<br><small>${err.message}</small></div>`;
    } finally {
      isLoading = false;
    }
  }

  function handleModuleOpen(event) {
    const id = event.detail.id;
    const folderMap = {
      'cc': 'commandcenter',
      'booking': 'booking',
      'k3': 'k3',
      'sekuriti': 'sekuriti',
      'janitor_in': 'janitor-indoor',
      'janitor_out': 'janitor-outdoor',
      'stok': 'stok',
      'maintenance': 'maintenance',
      'asset': 'asset'
    };
    loadModule(id, folderMap[id] || id);
  }

  function openNav(view) {
    if (view === 'home') {
      currentView = 'home';
      activeModuleId = null;
    } else {
      loadModule(view, view);
    }
  }
</script>

<main class="min-h-screen bg-[#020617] text-slate-200 pb-28 font-inter">
  {#if currentView === 'home'}
    <Header />
    <div class="p-4 space-y-6">
      <Slider />
      <Dashboard on:openModule={handleModuleOpen} />
    </div>
  {:else}
    <div class="min-h-screen bg-slate-950">
       <div class="p-4 flex justify-between items-center border-b border-slate-800 bg-slate-900/50 sticky top-0 z-50">
          <span class="text-emerald-500 font-bold uppercase tracking-widest">{activeModuleId}</span>
          <button on:click={() => openNav('home')} class="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg text-sm border border-red-500/30">✕ Tutup</button>
       </div>
       <div id="module-container">
         {@html moduleContent}
       </div>
    </div>
  {/if}

  <nav class="fixed bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-800 p-4 pb-8 flex justify-around items-center z-40 backdrop-blur-md">
    <button on:click={() => openNav('home')} class="flex flex-col items-center {currentView === 'home' ? 'text-emerald-500' : 'text-slate-500'}">
      <span class="text-xl">🏠</span><span class="text-[10px] mt-1 font-bold">Home</span>
    </button>
    <button on:click={() => openNav('profile')} class="flex flex-col items-center {activeModuleId === 'profile' ? 'text-emerald-500' : 'text-slate-500'}">
      <span class="text-xl">👤</span><span class="text-[10px] mt-1 font-bold">Profile</span>
    </button>
    
    <div class="relative -mt-12">
      <button on:click={() => loadModule('qr', 'qr')} class="bg-emerald-500 p-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] border-4 border-[#020617]">
        <span class="text-2xl">💠</span>
      </button>
    </div>

    <button on:click={() => openNav('about')} class="flex flex-col items-center {activeModuleId === 'about' ? 'text-emerald-500' : 'text-slate-500'}">
      <span class="text-xl">ℹ️</span><span class="text-[10px] mt-1 font-bold">About</span>
    </button>
    <button on:click={() => openNav('setting')} class="flex flex-col items-center {activeModuleId === 'setting' ? 'text-emerald-500' : 'text-slate-500'}">
      <span class="text-xl">⚙️</span><span class="text-[10px] mt-1 font-bold">Setting</span>
    </button>
  </nav>
</main>
