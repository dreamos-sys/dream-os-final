// ==========================================
// DREAM OS — SUPABASE AUTH CLIENT
// ==========================================
// Prinsip: password hash di SERVER, bukan client!

const Auth = {
  // Initialize Supabase client
  init: function() {
    if (!window.supabaseClient) {
      console.error('❌ Supabase client not loaded');
      return false;
    }
    console.log('✅ Auth module initialized');
    return true;
  },

  // SIGN UP — User daftar sendiri
  signUp: async function(email, password, metadata = {}) {
    try {
      const { data, error } = await window.supabaseClient.auth.signUp({
        email: email,
        password: password, // plaintext via HTTPS, hashed server-side
        options: {
          data: {
            nama: metadata.nama || '',
            role: metadata.role || 'user',
            created_at: new Date().toISOString()
          }
        }
      });

      if (error) throw error;

      console.log('✅ User created:', data.user.email);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ Sign up failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // LOGIN — User masuk
  login: async function(email, password) {
    try {
      const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;

      // Simpan session info
      localStorage.setItem('dreamos_session', JSON.stringify({
        user_id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || 'user',
        login_at: new Date().toISOString()
      }));

      console.log('✅ Login successful:', data.user.email);
      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // LOGOUT — User keluar
  logout: async function() {
    try {
      await window.supabaseClient.auth.signOut();
      localStorage.removeItem('dreamos_session');
      console.log('✅ Logout successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // CHECK SESSION — Cek apakah user sudah login
  getSession: async function() {
    try {
      const { data: { session }, error } = await window.supabaseClient.auth.getSession();
      if (error) throw error;
      return { success: true, session: session };
    } catch (error) {
      return { success: false, session: null };
    }
  },

  // PASSWORD RESET REQUEST — User minta reset password
  requestPasswordReset: async function(email) {
    try {
      const { data, error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password.html'
      });

      if (error) throw error;

      console.log('✅ Reset email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('❌ Reset request failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // UPDATE PASSWORD — User buat password baru (dari email link)
  updatePassword: async function(newPassword) {
    try {
      const { data, error } = await window.supabaseClient.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      console.log('✅ Password updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Password update failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // GET CURRENT USER — Ambil user yang sedang login
  getCurrentUser: async function() {
    try {
      const { data: { user }, error } = await window.supabaseClient.auth.getUser();
      if (error) throw error;
      return { success: true, user: user };
    } catch (error) {
      return { success: false, user: null };
    }
  }
};

// Expose ke window
window.Auth = Auth;

// Auto-init saat DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Auth.init());
} else {
  Auth.init();
}
