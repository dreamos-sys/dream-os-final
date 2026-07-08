-- ============================================
-- RBAC BACKEND: VALIDASI ROLE DI DATABASE
-- ============================================

-- 1. Tambahkan kolom role jika belum ada di auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'staff';

-- 2. Buat fungsi untuk mengecek role dari JWT
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'role',
    'staff'
  );
END;
$$ LANGUAGE plpgsql;

-- 3. Perbaiki policy K3 agar hanya admin yang bisa menghapus
DROP POLICY IF EXISTS "Admin can delete K3" ON public.k3_reports;
CREATE POLICY "Admin can delete K3" ON public.k3_reports
  FOR DELETE USING (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag', 'koord')
  );

-- 4. Policy untuk maintenance
DROP POLICY IF EXISTS "Admin can delete maintenance" ON public.maintenance_tasks;
CREATE POLICY "Admin can delete maintenance" ON public.maintenance_tasks
  FOR DELETE USING (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag', 'koord', 'maintenance')
  );

-- 5. Policy untuk bookings
DROP POLICY IF EXISTS "Admin can delete booking" ON public.bookings;
CREATE POLICY "Admin can delete booking" ON public.bookings
  FOR DELETE USING (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag', 'koord')
  );
