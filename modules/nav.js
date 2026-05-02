const navModule = {
    init() {
        const n = document.getElementById('bottom-nav');
        n.classList.remove('hidden');
        document.querySelectorAll('.nav-btn').forEach(b => {
            b.onclick = () => {
                document.querySelectorAll('.nav-btn').forEach(x => {
                    x.classList.remove('active', 'text-teal-400');
                    x.classList.add('text-slate-500');
                });
                b.classList.add('active', 'text-teal-400');
                const t = b.getAttribute('data-target');
                document.querySelectorAll('.view-section').forEach(e => e.classList.add('hidden'));
                document.getElementById('view-'+t).classList.remove('hidden');
            };
        });
    }
};
