// Database types matching Supabase schema

export interface PinballMachine {
  id: number
  opendb_id: string
  name: string
}

export interface PinballRule {
  opendb_id: string
  quickie_version: string | null
  go_to_flipper: string | null
  risk_index: string | null
  shots_to_master: string | null
  style_alert: string | null
  skill_shot: string | null
  full_rules: string | null
  playfield_risk: string | null
}

export interface OpdbMachine {
  opdb_id: string
  is_machine: string | null
  name: string | null
  shortname: string | null
  ipdb_id: number | null
  manufacture_date: string | null
  manufacturer_name: string | null
  type: string | null
  display: string | null
  player_count: number | null
  image_url_medium: string | null
}

export interface ApiLogEntry {
  id: number
  method: string | null
  path: string | null
  query_string: string | null
  timestamp: string
  ip_address: string | null
}

// API Response types (matching current .NET API format)
export interface MachineResponse {
  pinballMachine: {
    id: number
    name: string
    opendbId: string
  } | null
  rules: {
    opendbId: string
    quickieVersion: string | null
    goToFlipper: string | null
    riskIndex: string | null
    shotsToMaster: string | null
    styleAlert: string | null
    skillShot: string | null
    fullRules: string | null
    playfieldRisk: string | null
  }[]
  opdbMachine: {
    opdbId: string
    is_machine: string | null
    name: string | null
    shortname: string | null
    ipdb_id: number | null
    manufacture_date: string | null
    manufacturer_name: string | null
    type: string | null
    display: string | null
    player_count: number | null
    image_url_medium: string | null
  } | null
}

export interface MachineListItem {
  opendbId: string
  name: string
}
