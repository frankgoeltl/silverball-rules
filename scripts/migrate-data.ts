/**
 * Data Migration Script
 *
 * Migrates data from the JSON files (exported from .NET API) to Supabase.
 *
 * Usage:
 *   1. Copy JSON files to scripts/data/ folder:
 *      - SilverBalls_PinballMachines.json
 *      - SilverBalls_PinballRules.json
 *   2. Set environment variables in .env.local
 *   3. Run: npx tsx scripts/migrate-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

// Load environment variables from .env.local
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface MachineJson {
  id: number
  name: string
  OpendbId: string
}

interface RuleJson {
  OpendbId: string
  QuickieVersion?: string
  GoToFlipper?: string
  RiskIndex?: string
  ShotsToMaster?: string
  StyleAlert?: string
  SkillShot?: string
  FullRules?: string
  PlayfieldRisk?: string
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function migrateMachines(dataPath: string) {
  const filePath = path.join(dataPath, 'SilverBalls_PinballMachines.json')

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    return false
  }

  const data: MachineJson[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  console.log(`Found ${data.length} machines to migrate`)

  const machines = data.map(m => ({
    id: m.id,
    opendb_id: m.OpendbId,
    name: m.name,
  }))

  // Insert in batches of 500
  const batchSize = 500
  let inserted = 0

  for (let i = 0; i < machines.length; i += batchSize) {
    const batch = machines.slice(i, i + batchSize)
    const { error } = await supabase
      .from('pinball_machines')
      .upsert(batch, { onConflict: 'opendb_id' })

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
      return false
    }

    inserted += batch.length
    console.log(`Inserted ${inserted}/${machines.length} machines`)
  }

  return true
}

async function migrateRules(dataPath: string) {
  const filePath = path.join(dataPath, 'SilverBalls_PinballRules.json')

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    return false
  }

  const data: RuleJson[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  console.log(`Found ${data.length} rules to migrate`)

  const rules = data.map(r => ({
    opendb_id: r.OpendbId,
    quickie_version: r.QuickieVersion || null,
    go_to_flipper: r.GoToFlipper || null,
    risk_index: r.RiskIndex || null,
    shots_to_master: r.ShotsToMaster || null,
    style_alert: r.StyleAlert || null,
    skill_shot: r.SkillShot || null,
    full_rules: r.FullRules || null,
    playfield_risk: r.PlayfieldRisk || null,
  }))

  // Insert in batches of 100 (rules have more data)
  const batchSize = 100
  let inserted = 0

  for (let i = 0; i < rules.length; i += batchSize) {
    const batch = rules.slice(i, i + batchSize)
    const { error } = await supabase
      .from('pinball_rules')
      .upsert(batch, { onConflict: 'opendb_id' })

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
      console.error('Failed rule:', batch[0])
      return false
    }

    inserted += batch.length
    console.log(`Inserted ${inserted}/${rules.length} rules`)
  }

  return true
}

async function main() {
  console.log('=== Silverball Rules Data Migration ===\n')

  const args = process.argv.slice(2)
  const skipConfirm = args.includes('--yes') || args.includes('-y')

  // Look for data in scripts/data/ or ask for path
  let dataPath = path.join(__dirname, 'data')

  if (!fs.existsSync(dataPath)) {
    console.log('Default data path not found: scripts/data/')
    if (skipConfirm) {
      dataPath = path.resolve(__dirname, '../../sbm-23-01_API/updates/update-2026-01')
    } else {
      const customPath = await prompt('Enter path to JSON files (or press Enter to use ../sbm-23-01_API/updates/update-2026-01): ')
      dataPath = customPath || path.resolve(__dirname, '../../sbm-23-01_API/updates/update-2026-01')
    }
  }

  console.log(`Using data from: ${dataPath}\n`)

  // Confirm before proceeding
  if (!skipConfirm) {
    const confirm = await prompt('This will insert/update data in Supabase. Continue? (y/n): ')
    if (confirm.toLowerCase() !== 'y') {
      console.log('Aborted.')
      process.exit(0)
    }
  }

  console.log('\n--- Migrating Machines ---')
  const machinesOk = await migrateMachines(dataPath)

  if (!machinesOk) {
    console.error('Machine migration failed')
    process.exit(1)
  }

  console.log('\n--- Migrating Rules ---')
  const rulesOk = await migrateRules(dataPath)

  if (!rulesOk) {
    console.error('Rules migration failed')
    process.exit(1)
  }

  console.log('\n=== Migration Complete ===')
}

main().catch(console.error)
