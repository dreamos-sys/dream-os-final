// core/router.js
// Hash-based Router for PWA/APK • Zero Dependency • Lazy Load Ready

export class DreamRouter {
  constructor() {
    this.routes = {};
    this.current = '#home';
    this.container = document.getElementById('module-container');
    this.history = ['#home'];
    this.cleanupFn = null;

    // Listen to hash changes
    window.addEventListener('hashchange', () => this._handleRoute());
    
    // Initial load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._handleRoute());
    } else {
      this._handleRoute();
    }

    // Bind bottom nav clicks
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const route = btn.dataset.route;
        if (route && route !== this.current) {
          this.history.push(route);
          window.location.hash = route;
        }
      });
    });
  }

  // Register module: router.register('#home', () => import('./modules/home/index.js').then(m => m.default()))
  register(path, loaderFn) {
    this.routes[path] = loaderFn;
  }

  async _handleRoute() {
    let hash = window.location.hash || '#home';
    if (hash === this.current) return;
    
    this.current = hash;
    this.container.innerHTML = '<div class="skeleton-loader"><div class="skeleton"></div><div class="skeleton short"></div></div>';

    try {
      const loader = this.routes[hash];
      if (loader) {
        // Execute previous cleanup
        if (this.cleanupFn) this.cleanupFn();
        
        // Lazy load & init module
        const initFn = await loader();
        this.cleanupFn = initFn() || null;
      } else {
        this.container.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i><p>Modul belum tersedia</p><button class="btn-sm" onclick="window.location.hash='#home'">Kembali</button></div>`;
      }
    } catch (err) {
      console.error('Router error:', err);
      this.container.innerHTML = `<div class="error-state"><i class="fas fa-exclamation-triangle"></i><p>Gagal memuat modul</p><button class="btn-sm" onclick="window.location.reload()">Refresh</button></div>`;
    }
  }

  // Manual back navigation
  goBack() {
    if (this.history.length > 1) {
      this.history.pop();
      window.location.hash = this.history[this.history.length - 1];
    } else {
      window.location.hash = '#home';
    }
  }
}

export const router = new DreamRouter();

