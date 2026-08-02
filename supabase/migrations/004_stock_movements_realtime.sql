-- ============================================================
--  DREAM OS — STOCK MOVEMENTS (log mutasi lintas device) + REALTIME
-- ============================================================
create table if not exists public.stock_movements (
  id text primary key,
  item text,
  qty int,
  location text,
  type text,                 -- TAMBAH | HAPUS | EDIT | KONSUMSI
  user_name text,
  role text,
  wo_id text,                -- referensi Work Order (untuk KONSUMSI maintenance)
  created_at timestamptz default now()
);
create index if not exists idx_sm_created on public.stock_movements(created_at desc);
create index if not exists idx_sm_item on public.stock_movements(item);
create index if not exists idx_sm_type on public.stock_movements(type);

alter table public.stock_movements enable row level security;
grant select, insert, update on public.stock_movements to authenticated;
-- append-friendly: semua authenticated baca & tulis; HAPUS hanya admin (audit terjaga)
drop policy if exists sm_sel on public.stock_movements; create policy sm_sel on public.stock_movements for select to authenticated using (true);
drop policy if exists sm_ins on public.stock_movements; create policy sm_ins on public.stock_movements for insert to authenticated with check (true);
drop policy if exists sm_upd on public.stock_movements; create policy sm_upd on public.stock_movements for update to authenticated using (true) with check (true);
drop policy if exists sm_del on public.stock_movements; create policy sm_del on public.stock_movements for delete to authenticated using (public.dreamos_has_role(array['dev','kabag_umum','koordinator_umum']));

-- ===== NYALAKAN REALTIME untuk tabel operasional inti (idempotent) =====
do $$ begin
  begin alter publication supabase_realtime add table public.stock_movements;   exception when others then null; end;
  begin alter publication supabase_realtime add table public.inventory;         exception when others then null; end;
  begin alter publication supabase_realtime add table public.maintenance_tasks; exception when others then null; end;
  begin alter publication supabase_realtime add table public.k3_followups;      exception when others then null; end;
  begin alter publication supabase_realtime add table public.users;             exception when others then null; end;
end $$;

-- verifikasi
select 'stock_movements' as tbl, count(*) as policies from pg_policies where tablename='stock_movements';
select tablename as realtime_tables from pg_publication_tables where pubname='supabase_realtime' and tablename in ('stock_movements','inventory','maintenance_tasks','k3_followups','users') order by tablename;
