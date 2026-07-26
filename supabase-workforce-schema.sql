-- 🛡️ WORKFORCE ROSTER & LOGS SCHEMA (ISO 27001 A.9.2.3 • NIST AC-2)
-- Jalankan di Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.workforce_roster (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  zone TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  type TEXT DEFAULT 'tetap',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workforce_logs (
  id TEXT PRIMARY KEY,
  worker_id TEXT,
  zone TEXT,
  note TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  reported_by TEXT
);

-- 🛡️ ROW-LEVEL SECURITY (RLS)
ALTER TABLE public.workforce_roster ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workforce_logs ENABLE ROW LEVEL SECURITY;

-- Kabag/Koordinator/Dev: Full Access
CREATE POLICY "wf_roster_mgmt_access" ON public.workforce_roster FOR ALL USING (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('kabag_umum', 'koordinator_umum', 'dev')
);
CREATE POLICY "wf_logs_mgmt_access" ON public.workforce_logs FOR ALL USING (
  auth.jwt() -> 'user_metadata' ->> 'role' IN ('kabag_umum', 'koordinator_umum', 'dev')
);

-- Staff/Guru/Security/Maintenance: Read-Only
CREATE POLICY "wf_roster_staff_read" ON public.workforce_roster FOR SELECT USING (true);
CREATE POLICY "wf_logs_staff_read" ON public.workforce_logs FOR SELECT USING (true);

-- ✅ BACKFILL DEFAULT ROSTER (Opsional, bisa dihapus jika sudah ada data)
INSERT INTO public.workforce_roster (id, name, role, zone, status, type) VALUES
('j_sd_1','Janitor SD Lt.1','Janitor Indoor','SD Lt.1','active','tetap'),
('j_sd_2','Janitor SD Lt.2','Janitor Indoor','SD Lt.2','active','tetap'),
('j_sd_3','Janitor SD Lt.3','Janitor Indoor','SD Lt.3','active','tetap'),
('j_smp_1','Janitor SMP Lt.1','Janitor Indoor','SMP Lt.1','active','tetap'),
('j_smp_2','Janitor SMP Lt.2','Janitor Indoor','SMP Lt.2','active','tetap'),
('j_smp_3','Janitor SMP Lt.3','Janitor Indoor','SMP Lt.3','active','tetap'),
('j_smp_new','Janitor SMP Gedung Baru','Janitor Indoor','SMP Baru','active','tetap'),
('j_sma_1','Janitor SMA Lt.1-2','Janitor Indoor','SMA Lt.1-2','active','tetap'),
('j_sma_2','Janitor SMA Lt.3-4','Janitor Indoor','SMA Lt.3-4','active','tetap'),
('j_sg','Janitor Gedung Serbaguna','Janitor Indoor','Gedung Serbaguna','active','tetap'),
('j_out_s','Janitor Outdoor Selatan','Janitor Outdoor','Taman Selatan','active','tetap'),
('j_out_u','Janitor Outdoor Utara','Janitor Outdoor','Taman Utara','active','tetap'),
('m_1','Teknisi Maintenance','Maintenance','All Area','active','tetap'),
('t_tetap','Tukang Bangunan Tetap','Tukang Bangunan','Proyek','active','tetap'),
('t_h1','Tukang Harian 1','Tukang Bangunan','Proyek','active','harian'),
('t_h2','Tukang Harian 2','Tukang Bangunan','Proyek','active','harian'),
('t_h3','Tukang Harian 3','Tukang Bangunan','Proyek','active','harian'),
('s_1','Security 1','Security','Pos Utama','active','tetap'),
('s_2','Security 2','Security','Pos Gerbang','active','tetap'),
('s_3','Security 3','Security','Patrol','active','tetap'),
('s_4','Security 4','Security','Patrol','active','tetap'),
('s_5','Security 5','Security','Malam','active','tetap'),
('s_6','Security 6','Security','Malam','active','tetap'),
('s_7','Security 7','Security','Cadangan','active','tetap')
ON CONFLICT (id) DO NOTHING;
