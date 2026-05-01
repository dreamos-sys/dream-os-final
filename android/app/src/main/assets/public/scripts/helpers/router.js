export const moduleMap = {
    'cc': 'commandcenter',
    'k3': 'k3',
    'maint': 'maintenance',
    'booking': 'booking'
};
export const getPath = (id) => `./workspaces/kabag_umum/modules/${moduleMap[id]}/module.js?v=${Date.now()}`;
