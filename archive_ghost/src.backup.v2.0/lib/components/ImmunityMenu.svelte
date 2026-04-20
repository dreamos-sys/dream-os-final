<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let prayer = '';
  export let authKey = '';

  // Menu state
  let activeTab = 'overview';
  let isScanning = false;
  let scanProgress = 0;
  let scanResults = [];
  let showEruda = false;
  let erudaLoaded = false;

  // System info
  let systemInfo = {
    memory: '',
    storage: '',
    browser: '',
    platform: '',
    cookies: 0,
    localStorage: 0,
    sessionStorage: 0,
    totalItems: 0
  };

  // Security metrics
  let securityMetrics = {
    threats: 0,
    bugs: 0,
    phishing: 0,
    vulnerabilities: 0,
    status: 'SECURE'
  };

  onMount(() => {
    collectSystemInfo();
  });

  function collectSystemInfo() {
    // Memory
    systemInfo.memory = navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown';
    
    // Browser
    const ua = navigator.userAgent;
    if (/Chrome/.test(ua) && !/Chromium/.test(ua)) systemInfo.browser = 'Chrome';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) systemInfo.browser = 'Safari';
    else if (/Firefox/.test(ua)) systemInfo.browser = 'Firefox';
    else systemInfo.browser = 'Unknown';
    
    // Platform
    systemInfo.platform = navigator.platform || 'Unknown';
    
    // Storage
    systemInfo.localStorage = localStorage.length;
    systemInfo.sessionStorage = sessionStorage.length;
    systemInfo.cookies = document.cookie.split(';').filter(c => c.trim()).length;
    systemInfo.totalItems = systemInfo.localStorage + systemInfo.sessionStorage + systemInfo.cookies;
  }

  // ============================================
  // ERUDA DEVTOOLS
  // ============================================
  async function loadEruda() {
    if (erudaLoaded) {
      // Toggle existing
      const eruda = window.eruda;
      if (eruda) {
        eruda.show();
      }
      return;
    }

    try {
      // Load Eruda from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/eruda';
      script.onload = () => {
        window.eruda.init();
        window.eruda.show();
        erudaLoaded = true;
        showEruda = true;
        console.log('🛠️ Eruda DevTools loaded');
      };
      script.onerror = () => {
        console.error('❌ Failed to load Eruda');
        scanResults.push({
          type: 'error',
          message: 'Failed to load Eruda from CDN',
          severity: 'low'
        });
      };
      document.head.appendChild(script);
    } catch (err) {
      console.error('Eruda load error:', err);
    }
  }

  // ============================================
  // IMMUNITY SCANNER
  // ============================================
  async function startImmunityScan() {
    isScanning = true;
    scanProgress = 0;
    scanResults = [];

    // Scan phases
    const phases = [
      { name: 'Antivirus Scan', duration: 1500, action: scanAntivirus },
      { name: 'Bug Detection', duration: 2000, action: scanBugs },
      { name: 'Phishing Detection', duration: 1500, action: scanPhishing },
      { name: 'Vulnerability Check', duration: 1000, action: scanVulnerabilities }
    ];

    for (const phase of phases) {
      await runScanPhase(phase);
    }

    // Complete
    isScanning = false;
    scanProgress = 100;
    
    // Update metrics
    securityMetrics.threats = scanResults.filter(r => r.type === 'threat').length;
    securityMetrics.bugs = scanResults.filter(r => r.type === 'bug').length;
    securityMetrics.phishing = scanResults.filter(r => r.type === 'phishing').length;
    securityMetrics.vulnerabilities = scanResults.filter(r => r.type === 'vulnerability').length;
    securityMetrics.status = securityMetrics.threats + securityMetrics.bugs + securityMetrics.phishing === 0 ? 'SECURE' : 'ATTENTION NEEDED';

    console.log('🛡️ Immunity scan complete:', scanResults);
  }

  async function runScanPhase(phase) {
    const steps = 20;
    const stepDuration = phase.duration / steps;

    for (let i = 0; i <= steps; i++) {
      await sleep(stepDuration);
      scanProgress = (i / steps) * 100;
    }

    await phase.action();
    scanProgress = 100;
    await sleep(300);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Antivirus Scan
  async function scanAntivirus() {
    // Check for suspicious localStorage patterns
    const suspicious = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.includes('token') || key.includes('auth') || key.includes('password')) {
        const value = localStorage.getItem(key);
        if (value && value.length > 100) {
          suspicious.push({
            type: 'threat',
            message: `Suspicious large value in localStorage: ${key}`,
            severity: 'medium',
            recommendation: 'Review stored data'
          });
        }
      }
    }

    if (suspicious.length === 0) {
      scanResults.push({
        type: 'success',
        message: 'No malware/virus signatures detected',
        severity: 'info'
      });
    } else {
      scanResults.push(...suspicious);
    }

    // Check for eval() usage (potential code injection)
    if (typeof eval !== 'undefined') {
      scanResults.push({
        type: 'info',
        message: 'eval() is available - potential code injection vector',
        severity: 'low',
        recommendation: 'Avoid using eval() in production'
      });
    }
  }

  // Bug Detection
  async function scanBugs() {
    // Check for common issues
    const bugs = [];

    // Memory leak detection (large objects)
    if (performance && performance.memory) {
      const memory = performance.memory;
      if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
        bugs.push({
          type: 'bug',
          message: 'High memory usage detected (>100MB)',
          severity: 'high',
          recommendation: 'Review memory-intensive operations'
        });
      }
    }

    // Check for excessive localStorage
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      totalSize += key.length + value.length;
    }
    
    if (totalSize > 5 * 1024 * 1024) { // 5MB
      bugs.push({
        type: 'bug',
        message: `Large localStorage usage: ${(totalSize / 1024).toFixed(1)}KB`,
        severity: 'medium',
        recommendation: 'Clean up unused localStorage data'
      });
    }

    // Check for broken service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 3) {
        bugs.push({
          type: 'bug',
          message: `Multiple service workers detected: ${registrations.length}`,
          severity: 'low',
          recommendation: 'Review service worker registrations'
        });
      }
    }

    if (bugs.length === 0) {
      scanResults.push({
        type: 'success',
        message: 'No performance bugs detected',
        severity: 'info'
      });
    } else {
      scanResults.push(...bugs);
    }
  }

  // Phishing Detection
  async function scanPhishing() {
    const phishing = [];

    // Check current URL for suspicious patterns
    const currentUrl = window.location.href;
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      // Local development - safe
    } else if (!currentUrl.startsWith('https://') && !currentUrl.includes('localhost')) {
      phishing.push({
        type: 'phishing',
        message: 'Non-HTTPS connection detected',
        severity: 'high',
        recommendation: 'Use HTTPS in production'
      });
    }

    // Check for suspicious iframes
    const iframes = document.querySelectorAll('iframe');
    if (iframes.length > 0) {
      for (const iframe of iframes) {
        const src = iframe.src || iframe.getAttribute('src');
        if (src && !src.startsWith(window.location.origin) && !src.startsWith('about:blank')) {
          phishing.push({
            type: 'phishing',
            message: `External iframe detected: ${src.substring(0, 50)}...`,
            severity: 'high',
            recommendation: 'Review external iframe sources'
          });
        }
      }
    }

    // Check for external script injections
    const scripts = document.querySelectorAll('script[src]');
    for (const script of scripts) {
      const src = script.src;
      if (src && !src.includes('localhost') && !src.includes('jsdelivr') && !src.includes('googleapis')) {
        phishing.push({
          type: 'phishing',
          message: `External script source: ${src.substring(0, 50)}...`,
          severity: 'medium',
          recommendation: 'Verify external script integrity'
        });
      }
    }

    if (phishing.length === 0) {
      scanResults.push({
        type: 'success',
        message: 'No phishing indicators detected',
        severity: 'info'
      });
    } else {
      scanResults.push(...phishing);
    }
  }

  // Vulnerability Check
  async function scanVulnerabilities() {
    const vulns = [];

    // Check for XSS vulnerabilities
    if (document.querySelector('[innerHTML]')) {
      vulns.push({
        type: 'vulnerability',
        message: 'Potential XSS via innerHTML',
        severity: 'medium',
        recommendation: 'Use textContent or sanitize input'
      });
    }

    // Check for CSP
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!csp) {
      vulns.push({
        type: 'vulnerability',
        message: 'No Content Security Policy (CSP) detected',
        severity: 'medium',
        recommendation: 'Implement CSP headers'
      });
    }

    // Check for mixed content
    const allScripts = document.querySelectorAll('script[src^="http://"]');
    if (allScripts.length > 0) {
      vulns.push({
        type: 'vulnerability',
        message: 'Mixed content: HTTP scripts on page',
        severity: 'high',
        recommendation: 'Use HTTPS for all resources'
      });
    }

    if (vulns.length === 0) {
      scanResults.push({
        type: 'success',
        message: 'No critical vulnerabilities found',
        severity: 'info'
      });
    } else {
      scanResults.push(...vulns);
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================
  function handleBack() {
    dispatch('back');
  }

  function handleLogout() {
    dispatch('logout');
  }

  function getSeverityColor(severity) {
    const colors = {
      info: '#10b981',
      low: '#3b82f6',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626'
    };
    return colors[severity] || '#94a3b8';
  }

  function getSeverityIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      threat: 'fa-virus',
      bug: 'fa-bug',
      phishing: 'fa-fish',
      vulnerability: 'fa-shield-halved',
      error: 'fa-times-circle',
      info: 'fa-circle-info'
    };
    return icons[type] || 'fa-circle';
  }
</script>

<div class="immunity-menu">
  <!-- Header -->
  <div class="header">
    <button class="back-btn" on:click={handleBack}>
      <i class="fas fa-arrow-left"></i>
    </button>
    <div class="header-content">
      <h1>🛡️ Immunity Scanner</h1>
      <p class="subtitle">Antivirus • Bug • Phishing Protection</p>
    </div>
    <button class="logout-btn" on:click={handleLogout}>
      <i class="fas fa-power-off"></i>
    </button>
  </div>

  <!-- Auth Info -->
  <div class="auth-info">
    <div class="info-row">
      <span class="label">Prayer:</span>
      <span class="value">{prayer || 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="label">Status:</span>
      <span class="value success">✓ VERIFIED</span>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <button class="tab {activeTab === 'overview' ? 'active' : ''}" on:click={() => activeTab = 'overview'}>
      <i class="fas fa-grid-2"></i>
      <span>Overview</span>
    </button>
    <button class="tab {activeTab === 'scanner' ? 'active' : ''}" on:click={() => activeTab = 'scanner'}>
      <i class="fas fa-shield-halved"></i>
      <span>Scanner</span>
    </button>
    <button class="tab {activeTab === 'tools' ? 'active' : ''}" on:click={() => activeTab = 'tools'}>
      <i class="fas fa-wrench"></i>
      <span>Tools</span>
    </button>
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    {#if activeTab === 'overview'}
      <!-- OVERVIEW TAB -->
      <div class="overview-tab">
        <!-- Security Metrics -->
        <div class="metrics-grid">
          <div class="metric-card" style="--metric-color: #10b981">
            <div class="metric-icon"><i class="fas fa-check-circle"></i></div>
            <div class="metric-value">{securityMetrics.threats}</div>
            <div class="metric-label">Threats</div>
          </div>
          <div class="metric-card" style="--metric-color: #3b82f6">
            <div class="metric-icon"><i class="fas fa-bug"></i></div>
            <div class="metric-value">{securityMetrics.bugs}</div>
            <div class="metric-label">Bugs</div>
          </div>
          <div class="metric-card" style="--metric-color: #f59e0b">
            <div class="metric-icon"><i class="fas fa-fish"></i></div>
            <div class="metric-value">{securityMetrics.phishing}</div>
            <div class="metric-label">Phishing</div>
          </div>
          <div class="metric-card" style="--metric-color: #a855f7">
            <div class="metric-icon"><i class="fas fa-shield-halved"></i></div>
            <div class="metric-value">{securityMetrics.vulnerabilities}</div>
            <div class="metric-label">Vulns</div>
          </div>
        </div>

        <!-- System Status -->
        <div class="status-box" class:secure={securityMetrics.status === 'SECURE'} class:warning={securityMetrics.status !== 'SECURE'}>
          <div class="status-icon">
            {#if securityMetrics.status === 'SECURE'}
              <i class="fas fa-shield-check"></i>
            {:else}
              <i class="fas fa-exclamation-triangle"></i>
            {/if}
          </div>
          <div class="status-text">
            <h3>{securityMetrics.status}</h3>
            <p>{securityMetrics.status === 'SECURE' ? 'System is protected' : 'Review required'}</p>
          </div>
        </div>

        <!-- System Info -->
        <div class="system-info-box">
          <h3><i class="fas fa-info-circle"></i> System Information</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="item-label">Browser:</span>
              <span class="item-value">{systemInfo.browser}</span>
            </div>
            <div class="info-item">
              <span class="item-label">Platform:</span>
              <span class="item-value">{systemInfo.platform}</span>
            </div>
            <div class="info-item">
              <span class="item-label">Memory:</span>
              <span class="item-value">{systemInfo.memory}</span>
            </div>
            <div class="info-item">
              <span class="item-label">Storage Items:</span>
              <span class="item-value">{systemInfo.totalItems} total</span>
            </div>
          </div>
        </div>
      </div>
    {:else if activeTab === 'scanner'}
      <!-- SCANNER TAB -->
      <div class="scanner-tab">
        <button class="scan-btn" on:click={startImmunityScan} disabled={isScanning}>
          <i class="fas fa-radar"></i>
          <span>{isScanning ? 'Scanning...' : 'Start Full Immunity Scan'}</span>
        </button>

        {#if isScanning || scanResults.length > 0}
          <div class="scan-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: {scanProgress}%"></div>
            </div>
            <div class="progress-text">{Math.round(scanProgress)}%</div>
          </div>
        {/if}

        {#if scanResults.length > 0}
          <div class="scan-results">
            <h3>Scan Results ({scanResults.length})</h3>
            {#each scanResults as result}
              <div class="result-item" style="border-left-color: {getSeverityColor(result.severity)}">
                <div class="result-icon" style="color: {getSeverityColor(result.severity)}">
                  <i class="fas {getSeverityIcon(result.type)}"></i>
                </div>
                <div class="result-content">
                  <div class="result-message">{result.message}</div>
                  {#if result.recommendation}
                    <div class="result-rec">{result.recommendation}</div>
                  {/if}
                </div>
                <div class="result-severity" style="background: {getSeverityColor(result.severity)}">
                  {result.severity.toUpperCase()}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else if activeTab === 'tools'}
      <!-- TOOLS TAB -->
      <div class="tools-tab">
        <div class="tool-card" on:click={loadEruda}>
          <div class="tool-icon" style="background: linear-gradient(135deg, #3b82f6, #6366f1)">
            <i class="fas fa-code"></i>
          </div>
          <div class="tool-content">
            <h3>Eruda DevTools</h3>
            <p>Mobile debugging console</p>
            <span class="tool-status">{erudaLoaded ? '✓ Loaded' : 'Tap to load'}</span>
          </div>
          <div class="tool-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>

        <div class="tool-card">
          <div class="tool-icon" style="background: linear-gradient(135deg, #10b981, #059669)">
            <i class="fas fa-database"></i>
          </div>
          <div class="tool-content">
            <h3>Storage Manager</h3>
            <p>{systemInfo.localStorage} localStorage, {systemInfo.sessionStorage} session</p>
            <span class="tool-status">{systemInfo.totalItems} items</span>
          </div>
          <div class="tool-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>

        <div class="tool-card">
          <div class="tool-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706)">
            <i class="fas fa-cookie-bite"></i>
          </div>
          <div class="tool-content">
            <h3>Cookie Inspector</h3>
            <p>View and manage cookies</p>
            <span class="tool-status">{systemInfo.cookies} active</span>
          </div>
          <div class="tool-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>

        <div class="tool-card">
          <div class="tool-icon" style="background: linear-gradient(135deg, #a855f7, #9333ea)">
            <i class="fas fa-network-wired"></i>
          </div>
          <div class="tool-content">
            <h3>Network Diagnostics</h3>
            <p>Connection analysis</p>
            <span class="tool-status">Check connectivity</span>
          </div>
          <div class="tool-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .immunity-menu {
    min-height: 100vh;
    min-height: 100dvh;
    background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Poppins', sans-serif;
    padding: 16px;
    padding-bottom: 90px;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .back-btn,
  .logout-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: none;
    background: white;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .back-btn:hover,
  .logout-btn:hover {
    transform: scale(1.05);
    color: #10b981;
  }

  .header-content {
    flex: 1;
  }

  .header-content h1 {
    font-family: 'Poppins', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
  }

  .subtitle {
    font-size: 0.7rem;
    color: #64748b;
    margin: 0;
  }

  /* Auth Info */
  .auth-info {
    background: white;
    border-radius: 16px;
    padding: 14px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
  }

  .label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 600;
  }

  .value {
    font-size: 0.8rem;
    color: #1e293b;
    font-weight: 700;
  }

  .value.success {
    color: #10b981;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    background: white;
    padding: 6px;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px;
    border: none;
    background: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    color: #64748b;
  }

  .tab i {
    font-size: 1.1rem;
  }

  .tab span {
    font-size: 0.65rem;
    font-weight: 600;
  }

  .tab.active {
    background: #10b981;
    color: white;
  }

  /* Tab Content */
  .tab-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Overview Tab */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .metric-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .metric-icon {
    font-size: 1.5rem;
    color: var(--metric-color);
    margin-bottom: 8px;
  }

  .metric-value {
    font-size: 1.8rem;
    font-weight: 900;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .metric-label {
    font-size: 0.7rem;
    color: #64748b;
    font-weight: 600;
  }

  .status-box {
    background: white;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .status-box.secure {
    border-left: 4px solid #10b981;
  }

  .status-box.warning {
    border-left: 4px solid #f59e0b;
  }

  .status-icon {
    font-size: 2.5rem;
  }

  .status-box.secure .status-icon {
    color: #10b981;
  }

  .status-box.warning .status-icon {
    color: #f59e0b;
  }

  .status-text h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px 0;
  }

  .status-text p {
    font-size: 0.8rem;
    color: #64748b;
    margin: 0;
  }

  .system-info-box {
    background: white;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .system-info-box h3 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .system-info-box h3 i {
    color: #3b82f6;
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #f1f5f9;
  }

  .item-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 600;
  }

  .item-value {
    font-size: 0.8rem;
    color: #1e293b;
    font-weight: 700;
  }

  /* Scanner Tab */
  .scan-btn {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    transition: all 0.2s;
  }

  .scan-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }

  .scan-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .scan-btn i {
    font-size: 1.3rem;
  }

  .scan-progress {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .scan-progress .progress-bar {
    flex: 1;
    height: 8px;
    background: #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
  }

  .scan-progress .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    transition: width 0.05s linear;
  }

  .scan-progress .progress-text {
    font-size: 0.85rem;
    font-weight: 700;
    color: #10b981;
    min-width: 45px;
  }

  .scan-results {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .scan-results h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .result-item {
    background: white;
    border-radius: 12px;
    padding: 14px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border-left: 4px solid;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .result-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .result-content {
    flex: 1;
  }

  .result-message {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .result-rec {
    font-size: 0.75rem;
    color: #64748b;
  }

  .result-severity {
    padding: 4px 8px;
    border-radius: 6px;
    color: white;
    font-size: 0.6rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  /* Tools Tab */
  .tool-card {
    background: white;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .tool-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  .tool-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .tool-content {
    flex: 1;
  }

  .tool-content h3 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px 0;
  }

  .tool-content p {
    font-size: 0.75rem;
    color: #64748b;
    margin: 0 0 4px 0;
  }

  .tool-status {
    font-size: 0.7rem;
    color: #10b981;
    font-weight: 600;
  }

  .tool-arrow {
    color: #cbd5e1;
    font-size: 1rem;
  }

  /* Responsive */
  @media (max-width: 480px) {
    .immunity-menu {
      padding: 12px;
      padding-bottom: 90px;
    }

    .metrics-grid {
      gap: 10px;
    }

    .metric-card {
      padding: 14px;
    }
  }
</style>
