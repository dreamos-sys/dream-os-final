
-- Tambah kolom versioning untuk conflict resolution
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS last_edited_by TEXT;

ALTER TABLE k3_reports 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS last_edited_by TEXT;

ALTER TABLE stok_gudang 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS last_edited_by TEXT;

-- Trigger auto-increment version saat UPDATE
CREATE OR REPLACE FUNCTION increment_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version := OLD.version + 1;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pasang trigger di setiap tabel
CREATE TRIGGER trg_bookings_version BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION increment_version();
CREATE TRIGGER trg_k3_version BEFORE UPDATE ON k3_reports FOR EACH ROW EXECUTE FUNCTION increment_version();
CREATE TRIGGER trg_stok_version BEFORE UPDATE ON stok_gudang FOR EACH ROW EXECUTE FUNCTION increment_version();
