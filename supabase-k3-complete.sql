-- =====================================================================
--  DREAM OS — K3 COMPLETE (kolom + audit + RLS role canonical)
--  Jalankan SETELAH supabase-enterprise-sync.sql. Idempotent & aman.
-- =====================================================================

-- 1) Kolom yang dikirim k3.html (FIX insert error)
alter table public.k3_reports add column if not exists nama_pelapor text;
alter table public.k3_reports add column if not exists priority text;
alter table public.k3_reports add column if not exists pelapor_id text;
alter table public.k3_reports add column if not exists pelapor_nama text;
alter table public.k3_reports add column if not exists synced boolean default false;
create index if not exists idx_k3_status on public.k3_reports(status);
create index if not exists idx_k3_created on public.k3_reports(created_at desc);

-- 2) Audit trail TANPA foto base64 (cegah audit_log bengkak)
create or replace function public.dreamos_audit_k3() returns trigger language plpgsql
security definer set search_path = public, auth as $$
begin
  insert into public.audit_log(table_name, operation, user_id, user_role, old_data, new_data)
  values (TG_TABLE_NAME, TG_OP, auth.uid(), public.dreamos_role(),
          to_jsonb(old) - 'foto', to_jsonb(new) - 'foto');
  return coalesce(new, old);
end; $$;
drop trigger if exists dreamos_audit_trg on public.k3_reports;
create trigger dreamos_audit_trg after insert or update or delete on public.k3_reports
  for each row execute function public.dreamos_audit_k3();

-- 3) RLS K3 sesuai matriks role
-- SELECT: semua authenticated
drop policy if exists k3_sel on public.k3_reports;
create policy k3_sel on public.k3_reports for select to authenticated using (true);

-- INSERT (lapor): semua role canonical
drop policy if exists k3_ins on public.k3_reports;
create policy k3_ins on public.k3_reports for insert to authenticated with check (
  public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','management','komite',
    'guru','security','komandan_regu','janitor_indoor','janitor_outdoor','maintenance','staff'])
);

-- UPDATE (approve/reject): manajerial
drop policy if exists k3_upd on public.k3_reports;
create policy k3_upd on public.k3_reports for update to authenticated
  using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','management']))
  with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','management']));

-- DELETE: admin tertinggi
drop policy if exists k3_del on public.k3_reports;
create policy k3_del on public.k3_reports for delete to authenticated
  using (public.dreamos_has_role(array['dev','kabag_umum']));

-- verifikasi
select 'k3_reports columns:' as info;
select column_name from information_schema.columns where table_schema='public' and table_name='k3_reports' order by ordinal_position;
select 'k3 policies:' as info, count(*) from pg_policies where schemaname='public' and tablename='k3_reports';
