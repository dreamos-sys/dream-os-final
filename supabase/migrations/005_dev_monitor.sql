-- ============================================================
--  DREAM OS — DEV MONITOR: presence online + login attempts
--  Tulis oleh user ybs / anon(login); BACA hanya DEV.
-- ============================================================

-- ===== USER PRESENCE (heartbeat online) =====
create table if not exists public.user_presence (
  user_id text primary key,
  email text, nama text, role text,
  last_seen timestamptz default now(),
  device text
);
alter table public.user_presence enable row level security;
grant select, insert, update on public.user_presence to authenticated;
drop policy if exists up_sel on public.user_presence; create policy up_sel on public.user_presence for select to authenticated using (public.dreamos_has_role(array['dev']));
drop policy if exists up_ins on public.user_presence; create policy up_ins on public.user_presence for insert to authenticated with check (((select auth.uid())::text = user_id));
drop policy if exists up_upd on public.user_presence; create policy up_upd on public.user_presence for update to authenticated using (((select auth.uid())::text = user_id)) with check (((select auth.uid())::text = user_id));

-- ===== LOGIN ATTEMPTS (siapa coba login, sukses/gagal) =====
create table if not exists public.login_attempts (
  id text primary key,
  email text, status text, detail text, source text, device text,
  created_at timestamptz default now()
);
create index if not exists idx_la_created on public.login_attempts(created_at desc);
alter table public.login_attempts enable row level security;
grant select, insert, delete on public.login_attempts to anon, authenticated;
-- insert: anon+authenticated (login terjadi sebelum sesi ada)
drop policy if exists la_ins on public.login_attempts; create policy la_ins on public.login_attempts for insert to anon, authenticated with check (true);
-- baca & hapus: hanya DEV
drop policy if exists la_sel on public.login_attempts; create policy la_sel on public.login_attempts for select to authenticated using (public.dreamos_has_role(array['dev']));
drop policy if exists la_del on public.login_attempts; create policy la_del on public.login_attempts for delete to authenticated using (public.dreamos_has_role(array['dev']));

-- verifikasi
select 'user_presence' as tbl, count(*) as policies from pg_policies where tablename='user_presence'
union all select 'login_attempts', count(*) from pg_policies where tablename='login_attempts';
