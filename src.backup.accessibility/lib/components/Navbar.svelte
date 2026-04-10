<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  export let activeTab = 'home';
  
  const navItems = [
    { id: 'home', icon: 'fa-house', label: 'Home', color: '#10b981' },
    { id: 'profile', icon: 'fa-user', label: 'Profile', color: '#3b82f6' },
    { id: 'scan', icon: 'fa-qrcode', label: 'Scan', color: '#10b981', isCenter: true },
    { id: 'about', icon: 'fa-circle-info', label: 'About', color: '#6366f1' },
    { id: 'settings', icon: 'fa-gear', label: 'Settings', color: '#64748b' }
  ];

  function handleNav(item) {
    if (item.id === 'scan') {
      dispatch('scan');
      return;
    }
    activeTab = item.id;
    dispatch('nav', { tab: item.id });
  }
</script>

<nav class="iso-navbar"  aria-label="Main navigation">
  <div class="nav-container">
    {#each navItems as item}
      {#if item.isCenter}
        <!-- Center QR Scan Button (Emphasized) -->
        <button 
          class="nav-item center-item" 
          on:click={() => handleNav(item)}
          aria-label="QR Code Scanner"
          style="--nav-color: {item.color}">
          <div class="scan-button">
            <i class="fas {item.icon}"></i>
          </div>
          <span class="nav-label">{item.label}</span>
        </button>
      {:else}
        <!-- Regular Nav Items -->
        <button 
          class="nav-item {activeTab === item.id ? 'active' : ''}" 
          on:click={() => handleNav(item)}
          aria-label="{item.label}"
          style="--nav-color: {item.color}">
          <div class="nav-icon-wrapper">
            <i class="fas {item.icon}"></i>
          </div>
          <span class="nav-label">{item.label}</span>
        </button>
      {/if}
    {/each}
  </div>
  
  <!-- Safe area for mobile devices -->
  <div class="safe-area-bottom"></div>
</nav>

<style>
  .iso-navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-top: 1px solid rgba(226, 232, 240, 0.5);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .nav-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding: 8px 8px 4px;
    position: relative;
    height: 70px;
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 4px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    min-width: 60px;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-icon-wrapper {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-item i {
    font-size: 1.25rem;
    color: #94a3b8;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-item.active i {
    color: var(--nav-color);
    transform: scale(1.15);
  }

  .nav-item.active::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 3px;
    background: var(--nav-color);
    border-radius: 0 0 4px 4px;
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .nav-label {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.3px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 2px;
  }

  .nav-item.active .nav-label {
    color: var(--nav-color);
    font-weight: 700;
  }

  .nav-item:hover {
    transform: translateY(-2px);
  }

  .nav-item:hover i {
    color: var(--nav-color);
  }

  .nav-item:active {
    transform: scale(0.95);
  }

  /* Center QR Scan Button */
  .center-item {
    flex: 1.3;
    padding-bottom: 0;
  }

  .scan-button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
      0 8px 24px rgba(16, 185, 129, 0.4),
      0 4px 12px rgba(16, 185, 129, 0.3),
      0 0 0 4px rgba(16, 185, 129, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    top: -20px;
  }

  .scan-button i {
    font-size: 1.5rem;
    color: white !important;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .center-item:hover .scan-button {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 
      0 12px 32px rgba(16, 185, 129, 0.5),
      0 6px 16px rgba(16, 185, 129, 0.4),
      0 0 0 6px rgba(16, 185, 129, 0.15);
  }

  .center-item:active .scan-button {
    transform: scale(0.95);
  }

  .center-item .nav-label {
    margin-top: -12px;
    font-weight: 700;
    color: #10b981;
  }

  .safe-area-bottom {
    height: env(safe-area-inset-bottom, 0px);
    background: transparent;
  }

  /* Active state pulse animation */
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
    }
    50% {
      box-shadow: 0 8px 32px rgba(16, 185, 129, 0.6);
    }
  }

  .center-item .scan-button {
    animation: pulse 3s ease-in-out infinite;
  }

  /* Responsive adjustments */
  @media (max-width: 360px) {
    .nav-container {
      padding: 6px 4px 2px;
    }

    .nav-item {
      min-width: 50px;
    }

    .nav-item i {
      font-size: 1.1rem;
    }

    .nav-label {
      font-size: 0.6rem;
    }

    .scan-button {
      width: 50px;
      height: 50px;
      top: -18px;
    }

    .scan-button i {
      font-size: 1.3rem;
    }
  }

  @media (min-width: 768px) {
    .nav-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .nav-item i {
      font-size: 1.4rem;
    }

    .nav-label {
      font-size: 0.7rem;
    }

    .scan-button {
      width: 62px;
      height: 62px;
      top: -24px;
    }

    .scan-button i {
      font-size: 1.7rem;
    }
  }

  /* Dark mode support (future) */
  @media (prefers-color-scheme: dark) {
    .iso-navbar {
      background: rgba(15, 23, 42, 0.85);
      border-top-color: rgba(51, 65, 85, 0.5);
    }
  }

  /* Accessibility */
  .nav-item:focus-visible {
    outline: 2px solid var(--nav-color);
    outline-offset: 4px;
    border-radius: 8px;
  }

  .center-item:focus-visible {
    outline: none;
  }

  .center-item:focus-visible .scan-button {
    outline: 3px solid white;
    outline-offset: 4px;
  }
</style>
