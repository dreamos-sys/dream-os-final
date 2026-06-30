// theme.js - Sistem Tema Dream OS (Dark/Light)
const ThemeEngine = {
    current: localStorage.getItem('dreamos_theme') || 'dark',
    themes: {
        dark: {
            '--bg-deep-space': '#060b1a',
            '--bg-dark-matter': '#0f172a',
            '--bg-void': '#1a1f3a',
            '--neon-tawhid': '#00ff9d',
            '--quantum-blue': '#00d4ff',
            '--amber-glow': '#f59e0b',
            '--coral-danger': '#ef4444',
            '--glass-bg': 'rgba(255, 255, 255, 0.03)',
            '--glass-border': 'rgba(255, 255, 255, 0.06)',
            '--text-primary': '#e2e8f0',
            '--text-secondary': '#94a3b8',
            '--card-bg': 'linear-gradient(135deg, #1e293b, #0f172a)',
            '--input-bg': 'rgba(0,0,0,0.4)',
            '--body-bg': '#060b1a'
        },
        light: {
            '--bg-deep-space': '#f8fafc',
            '--bg-dark-matter': '#ffffff',
            '--bg-void': '#e2e8f0',
            '--neon-tawhid': '#059669',
            '--quantum-blue': '#0284c7',
            '--amber-glow': '#d97706',
            '--coral-danger': '#dc2626',
            '--glass-bg': 'rgba(0, 0, 0, 0.02)',
            '--glass-border': 'rgba(0, 0, 0, 0.1)',
            '--text-primary': '#0f172a',
            '--text-secondary': '#475569',
            '--card-bg': 'linear-gradient(135deg, #ffffff, #f1f5f9)',
            '--input-bg': 'rgba(0,0,0,0.05)',
            '--body-bg': '#f8fafc'
        }
    },
    apply(theme) {
        this.current = theme;
        const vars = this.themes[theme];
        Object.keys(vars).forEach(key => {
            document.documentElement.style.setProperty(key, vars[key]);
        });
        localStorage.setItem('dreamos_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    },
    toggle() {
        const next = this.current === 'dark' ? 'light' : 'dark';
        this.apply(next);
        return next;
    },
    init() {
        // Deteksi preferensi sistem jika belum diset manual
        if (!localStorage.getItem('dreamos_theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.current = prefersDark ? 'dark' : 'light';
        }
        this.apply(this.current);
        console.log('🎨 Theme Engine ready (' + this.current + ' mode)');
    }
};

// Inisialisasi tema saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    ThemeEngine.init();
});
