-- 🛡️ ROW-LEVEL SECURITY POLICIES (ISO 27001 A.9.2.3 • NIST AC-6)
-- Jalankan di Supabase Dashboard → SQL Editor

-- 1. KABAG UMUM: Full Access (Final Approval & Override)
CREATE POLICY "kabag_full_access_dana" ON public.dana_requests FOR ALL USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'kabag_umum'
);

-- 2. KOORDINATOR UMUM: Scope Divisi + Recommend Only
CREATE POLICY "koordinator_divisi_scope_dana" ON public.dana_requests FOR SELECT USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'koordinator_umum' AND
  (divisi = auth.jwt() -> 'user_metadata' ->> 'divisi' OR auth.jwt() -> 'user_metadata' ->> 'divisi' = 'admin')
);

CREATE POLICY "koordinator_recommend_only" ON public.dana_requests FOR UPDATE USING (
  auth.jwt() -> 'user_metadata' ->> 'role' = 'koordinator_umum' AND
  status IN ('pending', 'recommended')
) WITH CHECK (
  status = 'recommended' AND
  updated_by = auth.jwt() ->> 'sub'
);

-- 3. AUDIT LOG: Append-Only (Non-Repudiation)
CREATE POLICY "audit_log_append_only" ON public.activity_logs FOR INSERT USING (true);
CREATE POLICY "audit_log_read_role" ON public.activity_logs FOR SELECT USING (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('kabag_umum', 'koordinator_umum', 'dev')
);
