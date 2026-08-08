-- =====================================================
-- DREAM OS — FIX RLS users + storage avatars (v2, aman)
-- Cara pakai di Supabase Dashboard -> SQL Editor:
--   1) Jalankan BAGIAN A dulu (CEK) -> screenshot hasilnya
--   2) Lalu jalankan BAGIAN B (FIX)
-- Semua statement idempotent (aman dijalankan berulang kali)
-- =====================================================


-- ============ BAGIAN A: CEK KONDISI (jalankan dulu) ============
-- Lihat policy yang sudah ada di tabel users
select policy_name, cmd, roles, qual, with_check
from pg_policies
where tablename = 'users';

-- Lihat tipe kolom di public.users (pastikan id & email ada)
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'users'
order by ordinal_position;

-- Lihat policy storage objects untuk bucket avatars
select policy_name, cmd, roles, qual, with_check
from pg_policies
where tablename = 'objects' and (qual like '%avatars%' or with_check like '%avatars%');


-- ============ BAGIAN B: FIX (jalankan setelah cek) ============
alter table if exists public.users enable row level security;

-- UPDATE: user boleh update barisnya sendiri (cast aman text/uuid)
drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
for update to authenticated
using ( (auth.uid() is not null and auth.uid()::text = id::text)
        or email = coalesce(auth.jwt() ->> 'email', '') )
with check ( (auth.uid() is not null and auth.uid()::text = id::text)
        or email = coalesce(auth.jwt() ->> 'email', '') );

-- INSERT: untuk upsert on-conflict email (buat baris profil baru)
drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
for insert to authenticated
with check ( (auth.uid() is not null and auth.uid()::text = id::text)
        or email = coalesce(auth.jwt() ->> 'email', '') );

-- Pastikan kolom yang dipakai aplikasi ada
alter table if exists public.users add column if not exists avatar_url text;
alter table if exists public.users add column if not exists nama text;
alter table if exists public.users add column if not exists phone text;
alter table if exists public.users add column if not exists department text;
alter table if exists public.users add column if not exists device_dna text;
alter table if exists public.users add column if not exists role text;

-- Bucket avatars: pastikan ada & public
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Storage: authenticated boleh upload/update ke bucket avatars
drop policy if exists "avatars_upload_own" on storage.objects;
create policy "avatars_upload_own" on storage.objects
for insert to authenticated
with check ( bucket_id = 'avatars' );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects
for update to authenticated
using ( bucket_id = 'avatars' )
with check ( bucket_id = 'avatars' );

-- Public read biar avatar bisa ditampilkan di semua device
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
for select to anon, authenticated
using ( bucket_id = 'avatars' );
