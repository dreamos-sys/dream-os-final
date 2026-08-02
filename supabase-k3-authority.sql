-- =====================================================================
--  DREAM OS — K3 AUTHORITY FINAL
--  Hak mutlak: dev (Mr.M) + kabag_umum (Hanung) + koordinator_umum (Erwinsyah)
--  management/komite/guru/dll = read + lapor SAJA (tanpa approve/delete/manage)
--  Idempotent. Jalankan setelah supabase-enterprise-sync.sql & supabase-k3-complete.sql
-- =====================================================================

-- APPROVE/REJECT (update): HANYA dev + kabag + koord
drop policy if exists k3_upd on public.k3_reports;
create policy k3_upd on public.k3_reports for update to authenticated
  using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']))
  with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

-- DELETE: HANYA dev + kabag + koord (hak mutlak)
drop policy if exists k3_del on public.k3_reports;
create policy k3_del on public.k3_reports for delete to authenticated
  using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

-- INSERT (lapor): semua role canonical (K3 = keselamatan bersama)
drop policy if exists k3_ins on public.k3_reports;
create policy k3_ins on public.k3_reports for insert to authenticated with check (
  public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','management','komite',
    'guru','security','komandan_regu','janitor_indoor','janitor_outdoor','maintenance','staff'])
);

-- SELECT (lihat): semua authenticated
drop policy if exists k3_sel on public.k3_reports;
create policy k3_sel on public.k3_reports for select to authenticated using (true);

-- verifikasi
select policyname, cmd, qual is not null as has_using, with_check is not null as has_check
from pg_policies where schemaname='public' and tablename='k3_reports' order by policyname;
