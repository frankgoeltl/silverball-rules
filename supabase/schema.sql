-- Silverball Rules Database Schema
-- Run this in Supabase SQL Editor to create the tables

-- Pinball Machines (parent table)
CREATE TABLE pinball_machines (
  id SERIAL,
  opendb_id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Pinball Rules (links to machines via opendb_id)
CREATE TABLE pinball_rules (
  opendb_id TEXT PRIMARY KEY REFERENCES pinball_machines(opendb_id),
  quickie_version TEXT,
  go_to_flipper TEXT,
  risk_index TEXT,
  shots_to_master TEXT,
  style_alert TEXT,
  skill_shot TEXT,
  full_rules TEXT,
  playfield_risk TEXT
);

-- OpenDB Machine metadata (supplementary data)
CREATE TABLE opdb_machines (
  opdb_id TEXT PRIMARY KEY,
  is_machine TEXT,
  name TEXT,
  shortname TEXT,
  ipdb_id SMALLINT,
  manufacture_date TIMESTAMPTZ,
  manufacturer_name TEXT,
  type TEXT,
  display TEXT,
  player_count SMALLINT,
  image_url_medium TEXT
);

-- API Log Entries (for analytics)
CREATE TABLE api_log_entries (
  id SERIAL PRIMARY KEY,
  method TEXT,
  path TEXT,
  query_string TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_pinball_machines_name ON pinball_machines(name);
CREATE INDEX idx_api_log_entries_timestamp ON api_log_entries(timestamp);

-- Enable Row Level Security (optional, for future auth)
-- ALTER TABLE pinball_machines ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pinball_rules ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE opdb_machines ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE api_log_entries ENABLE ROW LEVEL SECURITY;
