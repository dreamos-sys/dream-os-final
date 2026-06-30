/* Dream Component v2.0 - Pro Grade & CSP Compliant */

window.DreamComponent = {
    // 🎨 Theme consistency (sinkron sama Dream OS)
    theme: {
        font: "'Inter', sans-serif",
        bg: '#020617',
        text: '#e2e8f0',
        dim: '#94a3b8',
        panel: 'rgba(15,23,42,0.6)',
        border: 'rgba(255,255,255,0.08)'
    },

    /**
     * Create standard module shell (CSP SAFE - No inline onclick)
     */
    createModuleShell: (config) => {
        const { id = 'module', title = 'Module', color = '#00ff9d', content = '', onBack = null } = config;
        const shellId = `${id}-shell`;
        
        // Register back handler globally (CSP compliant)
        if (onBack && typeof onBack === 'function') {
            window[`_back_${id}`] = onBack;
        }

        return `
<div id="${shellId}" style="min-height:100vh;background:${this.theme.bg};color:${this.theme.text};font-family:${this.theme.font};padding-bottom:6rem;">
    <div style="padding:1.5rem;max-width:600px;margin:0 auto;">
        <button data-back="${id}" style="background:rgba(255,255,255,0.05);color:${color};border:1px solid ${color}44;padding:0.6rem 1.2rem;border-radius:0.5rem;cursor:pointer;font-weight:600;margin-bottom:1.5rem;font-size:0.85rem;transition:0.2s;">← Kembali</button>
        <h2 style="color:${color};font-size:1.5rem;margin-bottom:0.3rem;font-weight:700;">${this.esc(title)}</h2>
        <p style="color:${this.theme.dim};font-size:0.75rem;margin-bottom:1.5rem;">ISO 27001 • Secure Module</p>
        ${content}
    </div>
</div>
<script>
(function(){
    var btn = document.querySelector('[data-back="${id}"]');
    if(btn && window._back_${id}) btn.addEventListener('click', window._back_${id});
})();
</script>`;
    },

    /**
     * Create panel wrapper
     */
    panel: (content, borderColor = '') => `        <div style="background:${this.theme.panel};border:1px solid ${borderColor || this.theme.border};border-radius:1rem;padding:1rem;margin-bottom:1rem;backdrop-filter:blur(10px);">
            ${content}
        </div>`,

    /**
     * Create input field (XSS Safe via DreamLib)
     */
    input: (label, id, opts = {}) => `
        <div style="margin-bottom:1rem;">
            <label style="display:block;color:${this.theme.dim};font-size:0.8rem;margin-bottom:0.4rem;font-weight:500;">${this.esc(label)}</label>
            <input type="${opts.type || 'text'}" id="${this.esc(id)}" class="dream-input" 
                   value="${this.esc(opts.value || '')}" 
                   placeholder="${this.esc(opts.placeholder || '')}"
                   ${opts.disabled ? 'disabled' : ''}
                   ${opts.required ? 'required' : ''}>
        </div>`,

    /**
     * Create button
     */
    button: (text, opts = {}) => `
        <button class="dream-btn ${opts.variant || 'primary'}" data-btn="${this.esc(opts.id || '')}">
            ${this.esc(text)}
        </button>`,

    /**
     * Create select dropdown
     */
    select: (label, id, options, opts = {}) => {
        let optionsHtml = options.map(o => 
            `<option value="${this.esc(o.value)}" ${o.value === opts.value ? 'selected' : ''}>${this.esc(o.label)}</option>`
        ).join('');
        
        return `
            <div style="margin-bottom:1rem;">
                <label style="display:block;color:${this.theme.dim};font-size:0.8rem;margin-bottom:0.4rem;font-weight:500;">${this.esc(label)}</label>
                <select id="${this.esc(id)}" class="dream-input">${optionsHtml}</select>
            </div>`;
    },

    /**
     * Create table
     */
    table: (headers, rows, opts = {}) => {
        let headerHtml = headers.map(h => `<th style="padding:0.6rem;text-align:left;border-bottom:1px solid ${this.theme.border};color:${this.theme.dim};font-size:0.75rem;">${this.esc(h)}</th>`).join('');
        let rowsHtml = rows.map(row => {
            let cells = row.map(cell => `<td style="padding:0.6rem;border-bottom:1px solid ${this.theme.border};font-size:0.8rem;">${this.esc(String(cell))}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
                return `
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;">
                    <thead><tr>${headerHtml}</tr></thead>
                    <tbody>${rowsHtml}</tbody>
                </table>
            </div>`;
    },

    /**
     * XSS Protection (Use DreamLib if available, fallback built-in)
     */
    esc: (str) => {
        if (window.DreamLib && DreamLib.esc) return DreamLib.esc(str);
        return String(str).replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[m]);
    }
};

// 🎨 Inject CSS (Auto-load)
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('dream-comp-styles')) {
        const style = document.createElement('style');
        style.id = 'dream-comp-styles';
        style.textContent = `
            .dream-input {
                width:100%; padding:0.7rem;
                background:rgba(15,23,42,0.8);
                border:1px solid rgba(255,255,255,0.1);
                border-radius:0.5rem;
                color:#e2e8f0; font-size:0.85rem;
                font-family:'Inter',sans-serif;
                transition:0.2s;
            }
            .dream-input:focus { 
                border-color:#0ea5e9; 
                outline:none;
                box-shadow:0 0 0 3px rgba(14,165,233,0.1);
            }
            .dream-input:disabled { opacity:0.5; cursor:not-allowed; }
            
            .dream-btn {
                width:100%; padding:0.75rem;
                border:none; border-radius:0.5rem;
                font-weight:700; font-size:0.9rem;
                cursor:pointer; transition:0.2s;
                font-family:'Inter',sans-serif;
            }
            .dream-btn:active { transform:scale(0.98); }            .dream-btn.primary { background:#0ea5e9; color:#000; }
            .dream-btn.success { background:#10b981; color:#fff; }
            .dream-btn.danger { background:#ef4444; color:#fff; }
            .dream-btn.ghost { background:rgba(255,255,255,0.05); color:#e2e8f0; border:1px solid rgba(255,255,255,0.1); }
        `;
        document.head.appendChild(style);
    }
});
