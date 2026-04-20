<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Crash state
  let crashPhase = 0; // 0: initial, 1: warning, 2: crash, 3: sholawat
  let glitchText = '';
  let deviceData = null;
  let photoCaptured = false;
  let sholawatProgress = 0;
  let showWarning = false;
  
  // Device information
  let deviceInfo = {
    platform: '',
    browser: '',
    screen: '',
    memory: '',
    cores: '',
    connection: '',
    intrusionTime: '',
    attempts: 0
  };

  onMount(() => {
    // Start crash sequence
    startCrashSequence();
  });

  function startCrashSequence() {
    // Phase 1: Warning (0.5s)
    setTimeout(() => {
      crashPhase = 1;
      showWarning = true;
      collectDeviceInfo();
    }, 500);

    // Phase 2: Full crash (2s)
    setTimeout(() => {
      crashPhase = 2;
      attemptPhotoCapture();
    }, 2000);

    // Phase 3: Sholawat cloning (3s)
    setTimeout(() => {
      crashPhase = 3;
      startSholawatClone();
    }, 3500);

    // Phase 4: Complete (6s)
    setTimeout(() => {
      dispatch('complete');
    }, 6500);
  }

  function collectDeviceInfo() {
    const ua = navigator.userAgent;
    
    deviceInfo = {
      platform: navigator.platform || 'Unknown',
      browser: getBrowserName(ua),
      screen: `${window.screen.width}x${window.screen.height}`,
      memory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown',
      cores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores` : 'Unknown',
      connection: navigator.connection ? navigator.connection.effectiveType : 'Unknown',
      intrusionTime: new Date().toISOString(),
      attempts: 3
    };

    // Store intrusion data
    const intrusionLog = {
      timestamp: deviceInfo.intrusionTime,
      device: deviceInfo,
      userAgent: ua,
      type: 'GHOST_AUTH_FAILURE',
      severity: 'CRITICAL'
    };

    localStorage.setItem('INTRUSION_LOG', JSON.stringify(intrusionLog));
    localStorage.setItem('GHOST_TRAP_ACTIVATED', 'TRUE');
    
    console.warn('🚨 INTRUSION DETECTED:', intrusionLog);
  }

  async function attemptPhotoCapture() {
    try {
      // Try to access camera (will likely fail due to permissions)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      // If successful, capture frame
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      // Store captured image
      const imageData = canvas.toDataURL('image/jpeg');
      localStorage.setItem('INTRUSION_PHOTO', imageData);
      
      // Stop camera
      stream.getTracks().forEach(track => track.stop());
      
      photoCaptured = true;
      console.log('📷 Photo captured and stored');
    } catch (err) {
      // Camera access denied or unavailable
      photoCaptured = false;
      console.warn('📷 Camera access denied:', err.message);
      
      // Store attempt metadata anyway
      localStorage.setItem('PHOTO_ATTEMPT', JSON.stringify({
        timestamp: new Date().toISOString(),
        error: err.message,
        available: !!navigator.mediaDevices
      }));
    }
  }

  function startSholawatClone() {
    // Animate sholawat cloning 1001x
    let count = 0;
    const total = 1001;
    const interval = setInterval(() => {
      count += 42; // Speed: ~24 iterations to reach 1001
      if (count >= total) {
        count = total;
        clearInterval(interval);
        
        // Store completed sholawat
        localStorage.setItem('SHOLAWAT_FORCED_1001', 'COMPLETED');
        localStorage.setItem('SHOLAWAT_CLONE_TIME', new Date().toISOString());
        
        console.log('🕌 Sholawat 1001x cloned as "hadiah hidayah"');
      }
      sholawatProgress = count;
    }, 50);
  }

  function getBrowserName(ua) {
    if (/Chrome/.test(ua) && !/Chromium/.test(ua)) return 'Chrome';
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
    if (/Firefox/.test(ua)) return 'Firefox';
    if (/Edge/.test(ua)) return 'Edge';
    return 'Unknown';
  }

  // Glitch text animation
  const glitchMessages = [
    'SYSTEM BREACH DETECTED',
    'UNAUTHORIZED ACCESS ATTEMPT',
    'INTRUSION LOGGED',
    'DEVICE CLONING...',
    'SHOLAWAT PROTOCOL ACTIVATED',
    '1001x HADIAH HIDAYAH'
  ];

  let currentGlitch = 0;
  const glitchInterval = setInterval(() => {
    glitchText = glitchMessages[currentGlitch % glitchMessages.length];
    currentGlitch++;
  }, 800);

  function cleanup() {
    clearInterval(glitchInterval);
  }
</script>

<svelte:window on:unload={cleanup} />

<div class="fake-crash" class:phase-{crashPhase}>
  <!-- Static Noise Background -->
  <div class="static-noise"></div>
  
  <!-- Glitch Overlay -->
  <div class="glitch-overlay">
    <div class="glitch-text" data-text={glitchText}>
      {glitchText}
    </div>
  </div>

  <!-- Warning Phase -->
  {#if showWarning}
    <div class="warning-box">
      <div class="warning-icon">⚠️</div>
      <h2 class="warning-title">SECURITY BREACH</h2>
      <p class="warning-text">
        3 failed authentication attempts detected. 
        Initiating Ghost Protocol v4.0...
      </p>
    </div>
  {/if}

  <!-- Device Info Phase -->
  {#if crashPhase >= 2 && deviceInfo}
    <div class="device-info-box">
      <div class="info-header">
        <i class="fas fa-fingerprint"></i>
        <h3>Device Fingerprint Collected</h3>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Platform:</span>
          <span class="info-value">{deviceInfo.platform}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Browser:</span>
          <span class="info-value">{deviceInfo.browser}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Screen:</span>
          <span class="info-value">{deviceInfo.screen}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Cores:</span>
          <span class="info-value">{deviceInfo.cores}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Memory:</span>
          <span class="info-value">{deviceInfo.memory}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Connection:</span>
          <span class="info-value">{deviceInfo.connection}</span>
        </div>
      </div>
      <div class="photo-status" class:success={photoCaptured} class:failed={!photoCaptured}>
        <i class="fas fa-camera"></i>
        <span>Photo: {photoCaptured ? 'CAPTURED ✓' : 'DENIED ✗'}</span>
      </div>
    </div>
  {/if}

  <!-- Sholawat Clone Phase -->
  {#if crashPhase >= 3}
    <div class="sholawat-box">
      <div class="sholawat-icon">🕌</div>
      <h3>Sholawat Protocol</h3>
      <p class="sholawat-text">Cloning Sholawat 1001x as "Hadiah Hidayah"...</p>
      
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: {(sholawatProgress / 1001) * 100}%"></div>
        </div>
        <div class="progress-text">{sholawatProgress}/1001</div>
      </div>
      
      <p class="sholawat-arabic">اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ</p>
    </div>
  {/if}

  <!-- Fatal Error Message -->
  <div class="fatal-error">
    <div class="error-code">FATAL_ERROR: 0xDEADBEEF</div>
    <div class="error-desc">Ghost Authentication Failed - Security Lockdown Activated</div>
  </div>
</div>

<style>
  .fake-crash {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: #000;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow: hidden;
    font-family: 'Courier New', monospace;
  }

  /* Static Noise Animation */
  .static-noise {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        rgba(0, 255, 0, 0.03) 0px,
        transparent 1px,
        transparent 2px,
        rgba(0, 255, 0, 0.03) 3px
      );
    animation: staticNoise 0.1s infinite;
    pointer-events: none;
  }

  @keyframes staticNoise {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
  }

  /* Glitch Overlay */
  .glitch-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
  }

  .glitch-text {
    font-size: 1.5rem;
    font-weight: 900;
    color: #ef4444;
    text-shadow: 
      2px 2px #00ff00,
      -2px -2px #0000ff;
    animation: glitchText 0.3s infinite;
    text-align: center;
    padding: 0 20px;
  }

  @keyframes glitchText {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  /* Warning Box */
  .warning-box {
    position: relative;
    z-index: 20;
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid #ef4444;
    border-radius: 16px;
    padding: 28px;
    text-align: center;
    max-width: 400px;
    animation: warningPulse 1s ease-in-out infinite;
  }

  @keyframes warningPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
    50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.8); }
  }

  .warning-icon {
    font-size: 3.5rem;
    margin-bottom: 16px;
    animation: shake 0.5s ease infinite;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .warning-title {
    font-size: 1.5rem;
    font-weight: 900;
    color: #ef4444;
    margin: 0 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .warning-text {
    font-size: 0.9rem;
    color: #fca5a5;
    line-height: 1.5;
    margin: 0;
  }

  /* Device Info Box */
  .device-info-box {
    position: relative;
    z-index: 20;
    background: rgba(99, 102, 241, 0.1);
    border: 2px solid #6366f1;
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 100%;
    margin-top: 20px;
    animation: slideUp 0.5s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .info-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }

  .info-header i {
    font-size: 1.8rem;
    color: #6366f1;
  }

  .info-header h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #a5b4fc;
    margin: 0;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .info-label {
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
  }

  .info-value {
    font-size: 0.85rem;
    color: #e2e8f0;
    font-weight: 700;
    word-break: break-all;
  }

  .photo-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .photo-status.failed {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .photo-status.success {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.4);
  }

  /* Sholawat Box */
  .sholawat-box {
    position: relative;
    z-index: 20;
    background: rgba(16, 185, 129, 0.1);
    border: 2px solid #10b981;
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 100%;
    margin-top: 20px;
    text-align: center;
    animation: slideUp 0.5s ease;
  }

  .sholawat-icon {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  .sholawat-box h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #10b981;
    margin: 0 0 8px 0;
  }

  .sholawat-text {
    font-size: 0.85rem;
    color: #6ee7b7;
    margin: 0 0 16px 0;
  }

  .progress-container {
    margin-bottom: 16px;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 10px;
    transition: width 0.05s linear;
  }

  .progress-text {
    font-size: 0.85rem;
    font-weight: 700;
    color: #10b981;
  }

  .sholawat-arabic {
    font-size: 1.2rem;
    color: #6ee7b7;
    margin: 0;
    line-height: 1.8;
  }

  /* Fatal Error */
  .fatal-error {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 20;
  }

  .error-code {
    font-size: 0.85rem;
    font-weight: 700;
    color: #ef4444;
    margin-bottom: 6px;
    text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  }

  .error-desc {
    font-size: 0.75rem;
    color: #94a3b8;
    max-width: 300px;
    line-height: 1.4;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .fake-crash {
      padding: 16px;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }

    .glitch-text {
      font-size: 1.2rem;
    }

    .warning-box,
    .device-info-box,
    .sholawat-box {
      padding: 20px;
    }
  }
</style>
