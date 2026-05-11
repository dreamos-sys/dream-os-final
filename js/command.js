// ==========================================
// DREAM OS COMMAND CENTER - CORE LOGIC
// Bi idznillah - Out of The Box Inside
// ==========================================

// --- Inisialisasi Global ---
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
window.currentMaintFilter = { keyword: '', startDate: '', endDate: '' };

// --- Fungsi Bantuan ---
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

// --- Fungsi Utama (diakses oleh onclick di HTML) ---
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active', 'bg-teal-600/30'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.remove('hidden');
    const activeBtn = document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active', 'bg-teal-600/30');
    if (tabId === 'dashboard') window.updateDashboard();
};

window.switchRole = function() {
    const roles = ['koordinator', 'kabag', 'direktur'];
    let current = localStorage.getItem('dreamos_role') || 'kabag';
    let idx = roles.indexOf(current);
    let newRole = roles[(idx + 1) % roles.length];
    localStorage.setItem('dreamos_role', newRole);
    document.getElementById('role-badge').innerText = 'Role: ' + newRole;
    location.reload();
};

// --- Logika Dashboard ---
window.updateDashboard = function() {
    const pendingCount = window.bookings.filter(b => b.status === 'pending').length;
    const totalRab = window.rabs.reduce((sum, r) => sum + r.nominal, 0);
    const realisasiBulan = window.realisasi.reduce((sum, r) => sum + (r.nominal || 0), 0);
    const totalTips = window.tips.reduce((s,t)=>s+t.nominal,0);

    document.getElementById('pending-count').innerText = pendingCount;
    document.getElementById('rab-total').innerText = 'Rp ' + totalRab.toLocaleString();
    document.getElementById('realisasi-bulan').innerText = 'Rp ' + realisasiBulan.toLocaleString();
    document.getElementById('tips-total').innerText = 'Rp ' + totalTips.toLocaleString();

    // Grafik
    if (typeof Chart !== 'undefined') {
        const ctx = document.getElementById('budgetChart')?.getContext('2d');
        if (ctx) {
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

// --- Inisialisasi Data Contoh ---
if (window.bookings.length === 0) window.bookings = [{ id: 1, title: 'Rapat Koordinasi', date: '2026-05-15', status: 'pending', approvalLevel: 1 }];
if (window.rabs.length === 0) window.rabs = [{ id: 1, nama: 'Seminar AI', nominal: 5000000, status: 'pending', approvalLevel: 1 }];
if (window.maintenances.length === 0) window.maintenances = [{ id: 1, item: 'AC Ruang Rapat', desc: 'Cuci AC', date: '2026-02-10', cost: 250000, tech: 'PT Suhu Sejuk', status: 'progress' }];
window.saveAll();

// --- Finalisasi: Update UI & Verifikasi ---
document.getElementById('role-badge').innerText = 'Role: ' + window.userRole;
window.updateDashboard();
console.log('✅ Command Center Logic Active');
