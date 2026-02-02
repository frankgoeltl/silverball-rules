-- Row Level Security Policies for Silverball Rules
-- Run this in Supabase SQL Editor to enable RLS

-- Enable RLS on all tables
ALTER TABLE pinball_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pinball_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE opdb_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_log_entries ENABLE ROW LEVEL SECURITY;

-- Public read access for machine data (anonymous users)
CREATE POLICY "Public read access for pinball_machines"
  ON pinball_machines
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for pinball_rules"
  ON pinball_rules
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for opdb_machines"
  ON opdb_machines
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Service role only for machine data writes
CREATE POLICY "Service role write access for pinball_machines"
  ON pinball_machines
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role write access for pinball_rules"
  ON pinball_rules
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role write access for opdb_machines"
  ON opdb_machines
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- API log entries: service role can do everything, anon can insert only
CREATE POLICY "Service role full access for api_log_entries"
  ON api_log_entries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon insert access for api_log_entries"
  ON api_log_entries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Note: Run reports queries with service_role key to read api_log_entries
