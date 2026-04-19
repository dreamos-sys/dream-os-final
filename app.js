document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const pwInput = document.getElementById('accessKey');

    async function loadData() {
        try {
            const [prayRes, zikirRes, locRes] = await Promise.all([
                fetch('./data/prayer.json'),
                fetch('./data/zikir.json'),
                fetch('./data/location.json')
            ]);
            
            const pray = await prayRes.json();
            const zikir = await zikirRes.json();
            const loc = await locRes.json();

            // Update Dashboard UI
            document.getElementById('zikir-display').innerText = `${zikir.name} (${zikir.trans})`;
            document.getElementById('location-display').innerText = `${loc.city} • Maghrib: ${pray.data.timings.Maghrib}`;
        } catch (err) {
            console.log("Satelit Belum Update Data.");
        }
    }

    loginBtn.addEventListener('click', () => {
        if (pwInput.value === 'Mr.M_Architect_2025') {
            alert('🤲 Bismillah! Akses Diterima. Thuma\'ninah Mode Active.');
            document.getElementById('login-screen').classList.remove('active');
            document.getElementById('dashboard-screen').classList.add('active');
            loadData(); // Jalankan sinkronisasi data
        } else {
            alert('❌ Kode Salah, Sultan!');
        }
    });
});
