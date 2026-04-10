<script>
  import Header from './lib/components/Header.svelte';
  import Slider from './lib/components/Slider.svelte';
  import Dashboard from './lib/components/Dashboard.svelte';
  import './app.css';
</script>

<main class="min-h-screen bg-[#020617] text-slate-200 pb-24 font-inter">
  <Header />
  
  <div class="p-4 space-y-6">
    <Slider />
    <Dashboard />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #020617;
  }
</style>
