-- Policy: User hanya bisa membaca data miliknya sendiri
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Hanya admin yang bisa menghapus user
DROP POLICY IF EXISTS "Admin can delete users" ON public.users;
CREATE POLICY "Admin can delete users" ON public.users
  FOR DELETE USING (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag', 'koord')
  );

-- Pastikan semua tabel memiliki policy SELECT untuk user terautentikasi
CREATE POLICY IF NOT EXISTS "Auth users can read K3" ON public.k3_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Auth users can read Maint" ON public.maintenance_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Auth users can read Bookings" ON public.bookings FOR SELECT TO authenticated USING (true);
