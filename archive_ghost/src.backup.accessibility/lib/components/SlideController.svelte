<script>
  import { onMount } from 'svelte';
  let currentSlide = 0;
  const slides = [
    { id: 1, name: "Greeting Pro-Religius" },
    { id: 2, name: "Booking Data (Today/Tomorrow)" },
    { id: 3, name: "K3 Report & Progress" },
    { id: 4, name: "Weather & Lalin Mitigasi" },
    { id: 5, name: "CC: Management" },
    { id: 6, name: "CC: Bagian Umum" },
    { id: 7, name: "CC: Ucapan Umum" }
  ];

  onMount(() => {
    const interval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
    }, 7000);
    return () => clearInterval(interval);
  });
</script>

<div class="slide-container p-4 h-48 bg-slate-900/50 rounded-xl m-4 border border-slate-700">
  <div class="text-amber-400 text-xs font-bold uppercase mb-2">Section {currentSlide + 1}</div>
  <div class="text-lg font-semibold">{slides[currentSlide].name}</div>
  </div>
