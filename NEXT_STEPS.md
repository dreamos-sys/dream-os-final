# 🎯 LANGKAH SELANJUTNYA - SUPABASE AUTH

## 1. Buat User di Supabase Dashboard
- Buka https://supabase.com/dashboard/project/gbigjdhifispatrrskgh
- Authentication > Users > Add User
- Isi email & password (minimal 6 karakter)
- Centang "Auto Confirm User"
- Klik "Create User"

## 2. Atur User Metadata (Role)
- Setelah user dibuat, klik user tersebut
- Di bagian "User Metadata", tambahkan:
  { "nama": "Nama Lengkap", "role": "dev" }
- Untuk role lain: guru, security, janitor, maintenance, staff
- Klik Save

## 3. Uji Login
- Buka https://dreamos-sys.github.io/dream-os-final
- Masukkan email & password yang sudah dibuat
- Harus masuk ke dashboard

## 4. Matikan Auto-Login Lama (Opsional)
- Auto-login berdasarkan role 'dev' dan session masih ada di index.html
- Bisa dinonaktifkan setelah Supabase Auth berjalan lancar

## 5. Langkah Berikutnya
- Migrasi data user dari localStorage ke Supabase (tabel public.users)
- Aktifkan Row Level Security (RLS)
- Buat halaman registrasi (signUp)
