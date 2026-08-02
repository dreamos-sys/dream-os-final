-- =====================================================================
--  DREAM OS ENTERPRISE — SUPABASE SYNC SCHEMA (v1.0 Beta)
--  Cognitive Facility Operating System • ISO 27001 / 9001 / 55001
--  Engineered by Family Dream Team — "The Power Soul Of Shalawat"
-- ---------------------------------------------------------------------
--  CARA PAKAI:
--   1. Supabase Dashboard → SQL Editor → paste SELURUH file ini → RUN
--   2. Idempotent: aman dijalankan berulang.
--   3. RLS aktif: user login-lokal (tanpa Supabase Auth) = cloud ditolak
--      (by design, mereka mode offline). Auth via Supabase Auth.
--   4. TABEL 'users' TIDAK menyimpan password_hash (keamanan).
--  STATUS SINKRON per modul (setelah SQL ini):
--   bookings        → OTOMATIS sinkron (JS booking.html + index sudah wired)
--   security_matrix → butuh js/matrix-cloud-sync.js (OPSIONAL, lihat bawah)
--   k3/stok/asset/  → tabel SIAP; aktifkan sync per-modul bertahap
--    maintenance/    (tawarkan ke saya, saya wire satu per satu biar aman)
--    announcements
-- =====================================================================

-- ---------------- HELPER FUNCTIONS ----------------
create or replace function public.dreamos_role() returns text language sql stable as $$
  select coalesce(auth.jwt() -> 'user_metadata' ->> 'role', 'staff');
$$;
create or replace function public.dreamos_has_role(text[]) returns boolean language sql stable as $$
  select public.dreamos_role() = any($1);
$$;
create or replace function public.dreamos_set_updated_at() returns trigger language plpgsql as $$
  begin new.updated_at = now(); return new; end;
$$;
create or replace function public.dreamos_audit() returns trigger language plpgsql
security definer set search_path = public, auth as $$
  begin
    insert into public.audit_log(table_name, operation, user_id, user_role, old_data, new_data)
    values (TG_TABLE_NAME, TG_OP, auth.uid(), public.dreamos_role(), to_jsonb(old), to_jsonb(new));
    return coalesce(new, old);
  end;
$$;
grant execute on function public.dreamos_role() to public;
grant execute on function public.dreamos_has_role(text[]) to public;

-- ---------------- TABEL ----------------
create table if not exists public.bookings (
  id text primary key,
  tgl text, tgl_display text, ruang text, nama_peminjam text, no_hp text, divisi text,
  jam_mulai text, jam_selesai text, keperluan text, sarana_alat text, status text default 'pending',
  created_at timestamptz default now(), created_by text,
  approved_by text, approved_at timestamptz, reject_reason text, updated_at timestamptz default now()
);

create table if not exists public.security_matrix (
  id text primary key,                 -- format: periode|nama|tgl
  nama text not null, divisi text default 'SECURITY',
  tgl int not null, shift text, periode text not null,
  updated_at timestamptz default now(), updated_by text
);
create index if not exists idx_matrix_periode on public.security_matrix(periode, tgl);

create table if not exists public.security_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date not null,
  personnel jsonb, activities_a jsonb, activities_b jsonb, mutasi jsonb,
  created_at timestamptz default now(), created_by text, updated_at timestamptz default now(),
  unique(report_date, created_by)
);

create table if not exists public.security_patrol (
  id uuid primary key default gen_random_uuid(),
  pos int, pos_name text, scan_type text, scanned_at timestamptz default now(),
  scanned_by text, location text, notes text, updated_at timestamptz default now()
);

create table if not exists public.k3_reports (
  id text primary key, kategori text, lokasi text, status text default 'pending',
  pelapor text, deskripsi text, prioritas text, tindakan text, foto text, tanggal text,
  created_at timestamptz default now(), created_by text, updated_at timestamptz default now()
);
create index if not exists idx_k3_status on public.k3_reports(status);

create table if not exists public.stok_gudang (
  id text primary key, nama text, kode text, kategori text, satuan text,
  quantity int default 0, jumlah int default 0, min_stock int default 5,
  lokasi text, harga numeric, updated_at timestamptz default now(), updated_by text
);

create table if not exists public.assets (
  id text primary key, nama text, kode text, kategori text, lokasi text,
  kondisi text, status text, nilai numeric, tgl_perolehan text,
  updated_at timestamptz default now(), updated_by text
);

create table if not exists public.maintenance (
  id text primary key, aset text, aset_id text, jenis text, status text default 'pending',
  prioritas text, tanggal text, petugas text, deskripsi text, biaya numeric,
  updated_at timestamptz default now(), updated_by text
);

create table if not exists public.cmd_announcements (
  id uuid primary key default gen_random_uuid(),
  type text not null, msg text,
  created_at timestamptz default now(), created_by text, updated_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text, title text, msg text, message text, module_id text, booking_id text,
  target_roles jsonb, read boolean default false, created_at timestamptz default now()
);

create table if not exists public.users (   -- direktori role SAJA (TANPA password_hash!)
  id text primary key, email text unique, nama text, role text default 'staff',
  divisi text, aktif boolean default true,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text, operation text, user_id uuid, user_role text,
  timestamp timestamptz default now(), old_data jsonb, new_data jsonb
);
create index if not exists idx_audit_ts on public.audit_log(timestamp desc);

create table if not exists public.telemetry (
  id uuid primary key default gen_random_uuid(),
  type text, data jsonb, user_role text, created_at timestamptz default now()
);

-- ---------------- RLS ----------------
do $$ declare t text;
  tables text[] := array['bookings','security_matrix','security_reports','security_patrol',
    'k3_reports','stok_gudang','assets','maintenance','cmd_announcements',
    'notifications','users','audit_log','telemetry'];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- helper: drop+create policy
-- (SELECT = authenticated untuk semua tabel operasional)
do $$ begin
  -- BOOKINGS: authenticated full DML (app gate approve/reject via isAdmin UI; audit_log = akuntabilitas)
  drop policy if exists bookings_sel on public.bookings; create policy bookings_sel on public.bookings for select to authenticated using (true);
  drop policy if exists bookings_ins on public.bookings; create policy bookings_ins on public.bookings for insert to authenticated with check (true);
  drop policy if exists bookings_upd on public.bookings; create policy bookings_upd on public.bookings for update to authenticated using (true) with check (true);
  drop policy if exists bookings_del on public.bookings; create policy bookings_del on public.bookings for delete to authenticated using (true);

  -- K3
  drop policy if exists k3_sel on public.k3_reports; create policy k3_sel on public.k3_reports for select to authenticated using (true);
  drop policy if exists k3_ins on public.k3_reports; create policy k3_ins on public.k3_reports for insert to authenticated with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','security','guru','janitor_indoor','janitor_outdoor','maintenance']));
  drop policy if exists k3_upd on public.k3_reports; create policy k3_upd on public.k3_reports for update to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum'])) with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));
  drop policy if exists k3_del on public.k3_reports; create policy k3_del on public.k3_reports for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

  -- SECURITY MATRIX
  drop policy if exists matrix_sel on public.security_matrix; create policy matrix_sel on public.security_matrix for select to authenticated using (true);
  drop policy if exists matrix_ins on public.security_matrix; create policy matrix_ins on public.security_matrix for insert to authenticated with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','komandan_regu','security']));
  drop policy if exists matrix_upd on public.security_matrix; create policy matrix_upd on public.security_matrix for update to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','komandan_regu','security'])) with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','komandan_regu','security']));
  drop policy if exists matrix_del on public.security_matrix; create policy matrix_del on public.security_matrix for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','komandan_regu','security']));

  -- SECURITY REPORTS
  drop policy if exists srep_sel on public.security_reports; create policy srep_sel on public.security_reports for select to authenticated using (true);
  drop policy if exists srep_ins on public.security_reports; create policy srep_ins on public.security_reports for insert to authenticated with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','security','komandan_regu']));
  drop policy if exists srep_upd on public.security_reports; create policy srep_upd on public.security_reports for update to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','security','komandan_regu'])) with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','security','komandan_regu']));
  drop policy if exists srep_del on public.security_reports; create policy srep_del on public.security_reports for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

  -- SECURITY PATROL
  drop policy if exists pat_sel on public.security_patrol; create policy pat_sel on public.security_patrol for select to authenticated using (true);
  drop policy if exists pat_ins on public.security_patrol; create policy pat_ins on public.security_patrol for insert to authenticated with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','security','komandan_regu']));
  drop policy if exists pat_upd on public.security_patrol; create policy pat_upd on public.security_patrol for update to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));
  drop policy if exists pat_del on public.security_patrol; create policy pat_del on public.security_patrol for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

  -- STOK
  drop policy if exists stok_sel on public.stok_gudang; create policy stok_sel on public.stok_gudang for select to authenticated using (true);
  drop policy if exists stok_ins on public.stok_gudang; create policy stok_ins on public.stok_gudang for insert to authenticated with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));
  drop policy if exists stok_upd on public.stok_gudang; create policy stok_upd on public.stok_gudang for update to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum'])) with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));
  drop policy if exists stok_del on public.stok_gudang; create policy stok_del on public.stok_gudang for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

  -- ASSETS
  drop policy if exists ast_sel on public.assets; create policy ast_sel on public.assets for select to authenticated using (true);
  drop policy if exists ast_ins on public.assets; create policy ast_ins on public.assets for insert to authenticated with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','maintenance']));
  drop policy if exists ast_upd on public.assets; create policy ast_upd on public.assets for update to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','maintenance'])) with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','maintenance']));
  drop policy if exists ast_del on public.assets; create policy ast_del on public.assets for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

  -- MAINTENANCE
  drop policy if exists mnt_sel on public.maintenance; create policy mnt_sel on public.maintenance for select to authenticated using (true);
  drop policy if exists mnt_ins on public.maintenance; create policy mnt_ins on public.maintenance for insert to authenticated with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum','maintenance']));
  drop policy if exists mnt_upd on public.maintenance; create policy mnt_upd on public.maintenance for update to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum'])) with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));
  drop policy if exists mnt_del on public.maintenance; create policy mnt_del on public.maintenance for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

  -- CMD ANNOUNCEMENTS
  drop policy if exists ann_sel on public.cmd_announcements; create policy ann_sel on public.cmd_announcements for select to authenticated using (true);
  drop policy if exists ann_ins on public.cmd_announcements; create policy ann_ins on public.cmd_announcements for insert to authenticated with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));
  drop policy if exists ann_upd on public.cmd_announcements; create policy ann_upd on public.cmd_announcements for update to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum'])) with check (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));
  drop policy if exists ann_del on public.cmd_announcements; create policy ann_del on public.cmd_announcements for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

  -- NOTIFICATIONS
  drop policy if exists not_sel on public.notifications; create policy not_sel on public.notifications for select to authenticated using (true);
  drop policy if exists not_ins on public.notifications; create policy not_ins on public.notifications for insert to authenticated with check (true);
  drop policy if exists not_upd on public.notifications; create policy not_upd on public.notifications for update to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));
  drop policy if exists not_del on public.notifications; create policy not_del on public.notifications for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

  -- USERS (ketat: baca=admin, tulis=dev only)
  drop policy if exists usr_sel on public.users; create policy usr_sel on public.users for select to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));
  drop policy if exists usr_ins on public.users; create policy usr_ins on public.users for insert to authenticated with check (public.dreamos_has_role(array['dev']));
  drop policy if exists usr_upd on public.users; create policy usr_upd on public.users for update to authenticated using (public.dreamos_has_role(array['dev'])) with check (public.dreamos_has_role(array['dev']));
  drop policy if exists usr_del on public.users; create policy usr_del on public.users for delete to authenticated using (public.dreamos_has_role(array['dev']));

  -- AUDIT LOG (baca=dev/kabag; tulis via trigger SECURITY DEFINER)
  drop policy if exists aud_sel on public.audit_log; create policy aud_sel on public.audit_log for select to authenticated using (public.dreamos_has_role(array['dev','kabag_umum']));

  -- TELEMETRY (baca=dev; tulis=authenticated)
  drop policy if exists tel_sel on public.telemetry; create policy tel_sel on public.telemetry for select to authenticated using (public.dreamos_has_role(array['dev']));
  drop policy if exists tel_ins on public.telemetry; create policy tel_ins on public.telemetry for insert to authenticated with check (true);
end $$;

-- ---------------- GRANTS (RLS yang gating asli) ----------------
grant usage on schema public to authenticated;
do $$ declare t text;
  tables text[] := array['bookings','security_matrix','security_reports','security_patrol',
    'k3_reports','stok_gudang','assets','maintenance','cmd_announcements',
    'notifications','users','audit_log','telemetry'];
begin
  foreach t in array tables loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- ---------------- UPDATED_AT TRIGGERS ----------------
do $$ declare t text;
  tables text[] := array['bookings','security_matrix','security_reports','security_patrol',
    'k3_reports','stok_gudang','assets','maintenance','cmd_announcements','notifications','users'];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists dreamos_upd_trg on public.%I', t);
    execute format('create trigger dreamos_upd_trg before update on public.%I for each row execute function public.dreamos_set_updated_at()', t);
  end loop;
end $$;

-- ---------------- AUDIT TRIGGERS ----------------
do $$ declare t text;
  tables text[] := array['bookings','security_matrix','security_reports','security_patrol',
    'k3_reports','stok_gudang','assets','maintenance','cmd_announcements','users'];
begin
  foreach t in array tables loop
    execute format('drop trigger if exists dreamos_audit_trg on public.%I', t);
    execute format('create trigger dreamos_audit_trg after insert or update or delete on public.%I for each row execute function public.dreamos_audit()', t);
  end loop;
end $$;

-- ---------------- REALTIME (biar subscribeRealtime modul jalan) ----------------
do $$ declare t text;
  tables text[] := array['bookings','k3_reports','security_matrix','security_reports','security_patrol'];
begin
  foreach t in array tables loop
    execute format('alter table public.%I replica identity full', t);
    begin execute format('alter publication supabase_realtime add table public.%I', t); exception when others then null; end;
  end loop;
end $$;

-- ---------------- VERIFIKASI ----------------
select '✅ SCHEMA SIAP' as status,
  (select count(*) from information_schema.tables where table_schema='public'
     and table_name in ('bookings','security_matrix','security_reports','security_patrol',
       'k3_reports','stok_gudang','assets','maintenance','cmd_announcements',
       'notifications','users','audit_log','telemetry')) as tables_created,
  (select count(*) from pg_policies where schemaname='public') as rls_policies;
