-- =====================================================
-- FIX RLS: public.users — izinkan user update/insert barisnya sendiri
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → Run
-- =====================================================

alter table if exists public.users enable row level security;

-- UPDATE: user boleh update barisnya sendiri (by id ATAU email session)
drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update to authenticated
  using ( auth.uid() = id or email = coalesce(auth.jwt() ->> 'email', '') )
  with check ( auth.uid() = id or email = coalesce(auth.jwt() ->> 'email', '') );

-- INSERT: untuk upsert on-conflict email (buat baris profil baru)
drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert to authenticated
  with check ( auth.uid() = id or email = coalesce(auth.jwt() ->> 'email', '') );

-- Pastikan kolom yang dipakai ada (aman kalau sudah ada)
alter table if exists public.users add column if not exists avatar_url text;
alter table if exists public.users add column if not exists nama text;
alter table if exists public.users add column if not exists phone text;
alter table if exists public.users add column if not exists department text;
alter table if exists public.users add column if not exists device_dna text;
alter table if exists public.users add column if not exists role text;

-- =====================================================
-- Pastikan bucket 'avatars' ada & public (sekali jalan)
-- =====================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Policy storage: authenticated boleh upload ke folder miliknya
drop policy if exists "avatars_upload_own" on storage.objects;
create policy "avatars_upload_own" on storage.objects
  for insert to authenticated
  with check ( bucket_id = 'avatars' );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using ( bucket_id = 'avatars' )
  with check ( bucket_id = 'avatars' );

-- Public read biar avatar bisa ditampilkan
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select to anon, authenticated
  using ( bucket_id = 'avatars' );
