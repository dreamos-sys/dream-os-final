-- ============================================
-- DREAM OS ENTERPRISE RLS POLICIES
-- ISO 27001 A.9.4 - Access Control
-- Jalankan di Supabase Dashboard > SQL Editor
-- ============================================

-- Aktifkan RLS di semua tabel
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE k3_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE stok_gudang ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa lihat data sesuai role
-- Dev & Kabag Umum: Full access
CREATE POLICY "dev_kabag_full_access" ON bookings
  FOR ALL USING (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag_umum', 'koordinator_umum')
  );

CREATE POLICY "dev_kabag_full_access_k3" ON k3_reports
  FOR ALL USING (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag_umum', 'koordinator_umum', 'security', 'guru')
  );

-- Policy: Staff hanya bisa lihat booking sendiri
CREATE POLICY "staff_own_booking" ON bookings
  FOR SELECT USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'staff'
    AND nama_peminjam = auth.jwt() -> 'user_metadata' ->> 'nama'
  );

-- Policy: Janitor hanya bisa lihat data janitor
CREATE POLICY "janitor_access" ON k3_reports
  FOR SELECT USING (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('janitor_indoor', 'janitor_outdoor')
  );

-- Policy: Security hanya bisa lihat security data
CREATE POLICY "security_access" ON bookings
  FOR SELECT USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'security'
  );

-- Policy: Insert hanya untuk role yang berwenang
CREATE POLICY "authorized_insert_bookings" ON bookings
  FOR INSERT WITH CHECK (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag_umum', 'koordinator_umum', 'guru', 'staff')
  );

CREATE POLICY "authorized_insert_k3" ON k3_reports
  FOR INSERT WITH CHECK (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag_umum', 'koordinator_umum', 'security', 'guru', 'janitor_indoor', 'janitor_outdoor')
  );

-- Policy: Update/Delete hanya untuk dev & kabag
CREATE POLICY "admin_update_delete" ON bookings
  FOR UPDATE USING (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag_umum')
  );

CREATE POLICY "admin_delete" ON bookings
  FOR DELETE USING (
    auth.jwt() -> 'user_metadata' ->> 'role' IN ('dev', 'kabag_umum')
  );

-- Audit trail: Catat semua perubahan
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, operation, user_id, user_role, timestamp, old_data, new_data)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    auth.jwt() -> 'user_metadata' ->> 'role',
    NOW(),
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang audit trigger di tabel kritis
CREATE TRIGGER audit_bookings
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_k3_reports
  AFTER INSERT OR UPDATE OR DELETE ON k3_reports
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Index untuk performa
CREATE INDEX idx_bookings_role ON bookings ((auth.jwt() -> 'user_metadata' ->> 'role'));
CREATE INDEX idx_k3_role ON k3_reports ((auth.jwt() -> 'user_metadata' ->> 'role'));
CREATE INDEX idx_audit_timestamp ON audit_log (timestamp DESC);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON k3_reports TO authenticated;
GRANT SELECT ON audit_log TO authenticated;

-- Verification query
SELECT 'RLS Policies Active' as status,
       (SELECT count(*) FROM pg_policies WHERE tablename = 'bookings') as booking_policies,
       (SELECT count(*) FROM pg_policies WHERE tablename = 'k3_reports') as k3_policies;
