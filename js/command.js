console.log('Command Center Logic Loaded');
window.bookings = JSON.parse(localStorage.getItem('dreamos_bookings') || '[]');
window.rabs = JSON.parse(localStorage.getItem('dreamos_rabs') || '[]');
window.realisasi = JSON.parse(localStorage.getItem('dreamos_realisasi') || '[]');
window.aset = JSON.parse(localStorage.getItem('dreamos_aset') || '[{"nama":"Laptop","jumlah":5},{"nama":"Proyektor","jumlah":3},{"nama":"AC","jumlah":10}]');
window.audit = JSON.parse(localStorage.getItem('dreamos_audit') || '[]');
window.userRole = localStorage.getItem('dreamos_role') || 'kabag';
window.periodicFunds = JSON.parse(localStorage.getItem('dreamos_periodic_funds') || '[]');
window.tips = JSON.parse(localStorage.getItem('dreamos_tips') || '[]');
window.maintenances = JSON.parse(localStorage.getItem('dreamos_maintenances') || '[]');
window.chartInstance = null;

window.addAudit = function(action, details) {
    window.audit.unshift({ timestamp: new Date().toISOString(), role: window.userRole, action, details });
    if (window.audit.length > 200) window.audit.pop();
    localStorage.setItem('dreamos_audit', JSON.stringify(window.audit));
};

window.saveAll = function() {
    localStorage.setItem('dreamos_bookings', JSON.stringify(window.bookings));
    localStorage.setItem('dreamos_rabs', JSON.stringify(window.rabs));
    localStorage.setItem('dreamos_realisasi', JSON.stringify(window.realisasi));
    localStorage.setItem('dreamos_aset', JSON.stringify(window.aset));
    localStorage.setItem('dreamos_periodic_funds', JSON.stringify(window.periodicFunds));
    localStorage.setItem('dreamos_tips', JSON.stringify(window.tips));
    localStorage.setItem('dreamos_maintenances', JSON.stringify(window.maintenances));
};

window.switchTab = function(tabId) {
    console.log('switchTab called: ' + tabId);
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active', 'bg-teal-600/30'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    var target = document.getElementById('tab-' + tabId);
    if (target) target.classList.remove('hidden');
    var activeBtn = document.querySelector('.tab-btn[onclick*="switchTab(\'' + tabId + '\')"]');
    if (activeBtn) activeBtn.classList.add('active', 'bg-teal-600/30');
    if (tabId === 'dashboard') window.updateDashboard();
};

window.switchRole = function() {
    console.log('switchRole called');
    var roles = ['koordinator', 'kabag', 'direktur'];
    var current = localStorage.getItem('dreamos_role') || 'kabag';
    var idx = roles.indexOf(current);
    var newRole = roles[(idx + 1) % roles.length];
    localStorage.setItem('dreamos_role', newRole);
    var badge = document.getElementById('role-badge');
    if (badge) badge.innerText = 'Role: ' + newRole;
};

window.updateDashboard = function() {
    var pendingCount = window.bookings.filter(function(b) { return b.status === 'pending'; }).length;
    var totalRab = window.rabs.reduce(function(sum, r) { return sum + r.nominal; }, 0);
    var realisasiBulan = window.realisasi.reduce(function(sum, r) { return sum + (r.nominal || 0); }, 0);
    var totalTips = window.tips.reduce(function(s,t){ return s + t.nominal; }, 0);

    document.getElementById('pending-count').innerText = pendingCount;
    document.getElementById('rab-total').innerText = 'Rp ' + totalRab.toLocaleString();
    document.getElementById('realisasi-bulan').innerText = 'Rp ' + realisasiBulan.toLocaleString();
    document.getElementById('tips-total').innerText = 'Rp ' + totalTips.toLocaleString();

    if (typeof Chart !== 'undefined') {
        var ctx = document.getElementById('budgetChart');
        if (ctx) {
            ctx = ctx.getContext('2d');
            if (window.chartInstance) window.chartInstance.destroy();
            window.chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Anggaran', 'Realisasi'],
                    datasets: [{
                        label: 'Rp',
                        data: [totalRab, realisasiBulan],
                        backgroundColor: ['#2dd4bf', '#f59e0b']
                    }]
                },
                options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } } }
            });
        }
    }
};

if (window.bookings.length === 0) window.bookings = [{ id: 1, title: 'Rapat Koordinasi', date: '2026-05-15', status: 'pending', approvalLevel: 1 }];
if (window.rabs.length === 0) window.rabs = [{ id: 1, nama: 'Seminar AI', nominal: 5000000, status: 'pending', approvalLevel: 1 }];
if (window.maintenances.length === 0) window.maintenances = [{ id: 1, item: 'AC Ruang Rapat', desc: 'Cuci AC', date: '2026-02-10', cost: 250000, tech: 'PT Suhu Sejuk', status: 'progress' }];
window.saveAll();
window.updateDashboard();
console.log('✅ Command Center Ready');
