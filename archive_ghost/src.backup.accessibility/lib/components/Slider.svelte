<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let currentSlide = 0;
  const slides = [
    { id: 1, title: "Assalamualaikum", content: "Aura Glow Lembut - Digital Greeting", type: "greeting" },
    { id: 2, title: "Real Booking Data", content: "Reminder: Jadwal Esok Hari Terverifikasi", type: "booking" },
    { id: 3, title: "K3 Intel Routing", content: "Maint | Sekuriti | Janitor - Progress Active", type: "k3" },
    { id: 4, title: "AI Weather & Lalin", content: "Status: SIAGA HUJAN - Divisi Persiapan Posisi!", type: "weather" },
    { id: 5, title: "CC Management", content: "Data Internal & High-Level Overview", type: "management" },
    { id: 6, title: "CC Umum", content: "Informasi Operasional Bagian Umum", type: "umum" },
    { id: 7, title: "CC Team Message", content: "The Power Soul of Shalawat - Semangat Team!", type: "team" }
  ];

  onMount(() => {
    const interval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
    }, 7000); // LOCK 7 DETIK
    return () => clearInterval(interval);
  });
</script>

<div class="relative h-40 w-full overflow-hidden rounded-xl bg-slate-900/50 border border-emerald-500/30 p-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
  {#key currentSlide}
    <div in:fade={{ duration: 800 }} class="flex flex-col items-center justify-center h-full text-center">
      <h2 class="text-xs uppercase tracking-widest text-emerald-400 mb-2">NEURAL_SLIDE_0{currentSlide + 1}</h2>
      <h1 class="text-xl font-bold text-white mb-1 shadow-emerald-500">{slides[currentSlide].title}</h1>
      <p class="text-xs text-slate-400">{slides[currentSlide].content}</p>
      <div class="mt-4 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
        <div class="bg-emerald-500 h-full transition-all duration-[7000ms] linear" style="width: 100%"></div>
      </div>
    </div>
  {/key}
</div>
