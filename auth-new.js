        // === SUPABASE AUTH INTEGRATION ===
        const SUPABASE_URL = 'https://gbigjdhifispatrrskgh.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiaWdqZGhpZmlzcGF0cnJza2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzY1OTIsImV4cCI6MjA5Njc1MjU5Mn0.eqAFloptEHV3oIUjortuTsWvkhJgjb3xsXHM9nXfF8k';
        
        // Inisialisasi Supabase client global
        const { createClient } = supabase;
        window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        // Fungsi toggle password
        function togglePassword() {
            const pw = document.getElementById('password-input');
            const icon = event.target;
            pw.type = pw.type === 'password' ? 'text' : 'password';
            icon.textContent = pw.type === 'password' ? '👁️' : '🙈';
        }

        // Fungsi authenticate baru: email & password via Supabase
        async function authenticate() {
            const email = document.getElementById('email-input').value.trim();
            const password = document.getElementById('password-input').value;
            const error = document.getElementById('error-msg');
            
            if (!email || !password) {
                error.textContent = '⛔ Email dan password harus diisi.';
                error.style.display = 'block';
                setTimeout(() => error.style.display = 'none', 3000);
                return;
            }

            try {
                const { data, error: authError } = await window.supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (authError) {
                    error.textContent = '⛔ ' + (authError.message || 'Login gagal');
                    error.style.display = 'block';
                    setTimeout(() => error.style.display = 'none', 3000);
                    return;
                }

                // Login sukses, simpan data user ke localStorage
                const user = data.user;
                const userData = {
                    id: user.id,
                    email: user.email,
                    nama: user.user_metadata?.nama || email.split('@')[0],
                    role: user.user_metadata?.role || 'staff',
                    device_dna: ''
                };
                localStorage.setItem('dreamos_bound_user', JSON.stringify(userData));
                localStorage.setItem('dreamos_session_active', 'true');

                // Masuk ke dashboard
                document.getElementById('login-screen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('login-screen').style.display = 'none';
                    document.getElementById('main-app').style.display = 'block';
                    document.getElementById('bottom-nav').style.display = 'block';
                    renderDashboard();
                }, 500);
            } catch (e) {
                error.textContent = '⚠️ Koneksi gagal. Periksa jaringan.';
                error.style.display = 'block';
                setTimeout(() => error.style.display = 'none', 3000);
            }
        }

        // Event listener untuk enter pada password
        document.addEventListener('DOMContentLoaded', () => {
            const pwInput = document.getElementById('password-input');
            if (pwInput) {
                pwInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') authenticate();
                });
            }
            const emailInput = document.getElementById('email-input');
            if (emailInput) {
                emailInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('password-input').focus();
                    }
                });
            }
        });
