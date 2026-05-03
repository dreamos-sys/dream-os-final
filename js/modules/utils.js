window.DreamOSModules = window.DreamOSModules || {};
window.DreamOSModules.utils = {
    copyText(text) {
        navigator.clipboard.writeText(text).then(() => alert('✅ Copied!')).catch(() => alert('📋 Copy manual:\n' + text));
    }
};
