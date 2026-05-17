// Dream OS Command Center Logic
console.log('Command Center Logic Loaded');
// Data global
window.bookings = JSON.parse(localStorage.getItem('dreamos_bookings') || '[]');
window.rabs = JSON.parse(localStorage.getItem('dreamos_rabs') || '[]');
window.realisasi = JSON.parse(localStorage.getItem('dreamos_realisasi') || '[]');
window.aset = JSON.parse(localStorage.getItem('dreamos_aset') || '[{"nama":"Laptop","jumlah":5}]');
window.audit = JSON.parse(localStorage.getItem('dreamos_audit') || '[]');
window.userRole = localStorage.getItem('dreamos_role') || 'kabag';
// Fungsi Switch Role
window.switchRole = function() {
    var roles = ['koordinator', 'kabag', 'direktur'];
    var current = localStorage.getItem('dreamos_role') || 'kabag';
    var idx = roles.indexOf(current);
    var newRole = roles[(idx + 1) % roles.length];
    localStorage.setItem('dreamos_role', newRole);
    var badge = document.getElementById('role-badge');
    if (badge) badge.innerText = 'Role: ' + newRole;
};
// Fungsi Switch Tab
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active', 'bg-teal-600/30'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    var target = document.getElementById('tab-' + tabId);
    if (target) target.classList.remove('hidden');
};
