/* Dream Component v1.0 - Module shell generator */

window.DreamComponent = {
    /**
     * Create standard module shell
     * @param {Object} config
     * @param {string} config.id - module id (e.g., 'profile')
     * @param {string} config.title - module title
     * @param {string} config.color - accent color
     * @param {string} config.content - inner HTML content
     * @param {Function} config.onBack - back button handler (default: goHome)
     */
    createModuleShell: (config) => {
        const {
            id = 'module',
            title = 'Module',
            color = '#00ff9d',
            content = '',
            onBack = 'goHome()'
        } = config;

        return `
<div id="${id}-root" style="min-height:100vh;background:linear-gradient(135deg,#060b1a,#0f172a);color:#e2e8f0;font-family:'Space Grotesk',sans-serif;padding-bottom:6rem;">
    <div style="padding:1.5rem;max-width:600px;margin:0 auto;">
        <button onclick="${onBack}" style="background:rgba(255,255,255,0.1);color:${color};border:1px solid ${color}44;padding:0.5rem 1rem;border-radius:0.5rem;cursor:pointer;font-weight:600;margin-bottom:1.5rem;">← Kembali</button>
        <h2 style="color:${color};font-size:1.5rem;margin-bottom:0.5rem;">${title}</h2>
        ${content}
    </div>
</div>`;
    },

    /**
     * Create dream-panel wrapper
     */
    panel: (content, borderColor = '') => `
        <div class="dream-panel" style="${borderColor ? 'border-color:' + borderColor + ';' : ''}margin-bottom:1.5rem;">
            ${content}
        </div>`,

    /**
     * Create input field
     */
    input: (label, id, opts = {}) => `
        <div style="margin-bottom:1rem;">
            <label style="display:block;color:#94a3b8;font-size:0.875rem;margin-bottom:0.5rem;">${label}</label>
            <input type="${opts.type || 'text'}" id="${id}" class="dream-input" 
                   value="${DreamLib.esc(opts.value || '')}" 
                   placeholder="${opts.placeholder || ''}"
                   ${opts.disabled ? 'disabled' : ''}>
        </div>`
};

// CSS untuk dream-input (inject langsung)
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('dream-comp-styles')) {
        const style = document.createElement('style');
        style.id = 'dream-comp-styles';
        style.textContent = `
            .dream-input {
                width:100%; padding:0.75rem;
                background:rgba(30,41,59,0.8);
                border:1px solid rgba(0,255,157,0.2);
                border-radius:0.5rem;
                color:#e2e8f0; font-size:0.875rem;
                font-family:'Space Grotesk',sans-serif;
            }
            .dream-input:focus { border-color:#00ff9d; outline:none; }
            .dream-input:disabled { opacity:0.7; background:rgba(20,30,45,0.8); }
        `;
        document.head.appendChild(style);
    }
});
