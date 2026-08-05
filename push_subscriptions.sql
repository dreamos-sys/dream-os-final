-- Tabel push_subscriptions untuk Web Push
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  user_email TEXT,
  user_role TEXT,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subs_role ON push_subscriptions(user_role);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can view own subscriptions" ON push_subscriptions
  FOR SELECT USING (auth.uid()::text = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can insert own subscriptions" ON push_subscriptions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can delete own subscriptions" ON push_subscriptions
  FOR DELETE USING (auth.uid()::text = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Service role can manage all" ON push_subscriptions;
CREATE POLICY "Service role can manage all" ON push_subscriptions
  FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_push_subs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_push_subs_updated_at ON push_subscriptions;
CREATE TRIGGER trigger_push_subs_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_push_subs_updated_at();
