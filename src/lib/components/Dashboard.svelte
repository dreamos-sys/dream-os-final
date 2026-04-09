<script>
  import { onMount } from 'svelte';
  import CommandCenter from './modules/CommandCenter.svelte';
  import Settings from './modules/Settings.svelte';
  import About from './modules/About.svelte';
  import Profile from './modules/Profile.svelte';
  import GhostArchitect from './modules/GhostArchitect.svelte';

  let activeView = 'home'; // home, CC, settings, profile, about, ghost
  let currentSlide = 0;
  const slides = ["Selamat Datang Master", "Booking: 5 Antrian", "K3: Progress 85%", "Cuaca: Cerah", "CC Management: OK", "CC Umum: Aktif", "CC Ucapan: Ready"];

  const grids = [
    { id: 'CC', n: 'CommandCenter', i: '📊' }, { id: 'home', n: 'Booking', i: '📅' },
    { id: 'home', n: 'Form K3', i: '🛡️' }, { id: 'home', n: 'Security', i: '👮' },
    { id: 'home', n: 'Janitor In', i: '🧹' }, { id: 'home', n: 'Janitor Out', i: '🌳' },
    { id: 'home', n: 'Maintenance', i: '🔧' }, { id: 'home', n: 'Stok', i: '📦' },
    { id: 'home', n: 'Asset', i: '🏛️' }
  ];

  onMount(() => {
    setInterval(() => { currentSlide = (currentSlide + 1) % slides.length }, 7000);
  });

  function setView(v) { activeView = v; }
  function logout() { localStorage.clear(); window.location.hash = '#/login'; window.location.reload(); }
</script>

<div class="dashboard-wrapper min-h-screen bg-[#020617] text-white">
  
  <header class="p-6 text-center">
    <div class="text-emerald-500 font-serif text-xl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
    <div class="text-amber-500 text-[9px] tracking-widest">اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ</div>
  </header>

  <main class="p-4 pb-32">
    {#if activeView === 'home'}
      <div class="bg-slate-900/50 p-6 rounded-3xl border border-white/5 mb-6 h-32 flex flex-col justify-center">
        <span class="text-[8px] text-slate-500 tracking-[0.3em] uppercase">Neural Slide {currentSlide + 1}</span>
        <h2 class="text-sm font-semibold mt-2">{slides[currentSlide]}</h2>
      </div>

      <div class="grid grid-cols-3 gap-4">
        {#each grids as g}
          <div on:click={() => setView(g.id)} class="bg-slate-800/40 p-4 rounded-2xl flex flex-col items-center border border-white/5 active:scale-90 transition-all cursor-pointer">
            <span class="text-2xl mb-2">{g.i}</span>
            <span class="text-[8px] uppercase text-slate-400">{g.n}</span>
          </div>
        {/each}
      </div>

    {:else if activeView === 'CC'} <CommandCenter />
    {:else if activeView === 'settings'} <Settings />
    {:else if activeView === 'about'} <About />
    {:else if activeView === 'profile'} <Profile />
    {:else if activeView === 'ghost'} <GhostArchitect />
    {/if}
  </main>

  <nav class="fixed bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[35px] flex justify-around items-center p-3 z-50">
    <button on:click={() => setView('home')} class="flex flex-col items-center {activeView==='home'?'text-amber-500':'text-slate-500'}">🏠<span class="text-[8px] mt-1">Home</span></button>
    <button on:click={() => setView('profile')} class="flex flex-col items-center {activeView==='profile'?'text-amber-500':'text-slate-500'}">👤<span class="text-[8px] mt-1">Profile</span></button>
    <button on:click={() => setView('ghost')} class="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 -translate-y-6 shadow-lg shadow-amber-500/20 active:scale-90 transition-all">📷</button>
    <button on:click={() => setView('about')} class="flex flex-col items-center {activeView==='about'?'text-amber-500':'text-slate-500'}">ℹ️<span class="text-[8px] mt-1">About</span></button>
    <button on:click={() => setView('settings')} class="flex flex-col items-center {activeView==='settings'?'text-amber-500':'text-slate-500'}">⚙️<span class="text-[8px] mt-1">Settings</span></button>
  </nav>
</div>
