-- ============================================================
--  DREAM OS — USERS MIRROR (provisioning via Edge Function only)
--  Client HANYA boleh baca; tulis hanya service_role (Edge Function).
-- ============================================================
create table if not exists public.users (
  id text primary key,                 -- = auth.users.id
  email text unique not null,
  nama text,
  role text default 'staff',
  status text default 'active',
  source text,
  last_sync timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.users enable row level security;

-- whitelist cleanup: hanya izinkan policy baca 'users_sel'
do $$ declare r record; begin
  for r in select policyname from pg_policies where schemaname='public' and tablename='users' and policyname <> 'users_sel' loop
    execute format('drop policy if exists %I on public.users', r.policyname);
  end loop;
end $$;

-- BACA: semua yang login (pragmatis; bisa diperketat is_admin() di fase hardening)
drop policy if exists users_sel on public.users;
create policy users_sel on public.users for select to authenticated using (true);
-- TULIS: sengaja TIDAK ADA policy untuk authenticated => client tak bisa insert/update/delete
--        (hanya service_role / Edge Function yang bypass RLS)

grant select on public.users to authenticated;
revoke insert, update, delete on public.users from authenticated;

drop trigger if exists dreamos_upd_trg on public.users;
create trigger dreamos_upd_trg before update on public.users for each row execute function public.dreamos_set_updated_at();

-- verifikasi
select 'users' as tbl, count(*) as policies from pg_policies where tablename='users';
