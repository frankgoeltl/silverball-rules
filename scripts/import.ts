/**
 * Import Tool
 *
 * Imports JSON data from updates folder to Supabase.
 * Replacement for `dotnet run import` from the .NET API.
 *
 * Usage:
 *   npx tsx scripts/import.ts [path-to-updates-folder]
 *
 * Example:
 *   npx tsx scripts/import.ts ../updates/update-2026-02
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

// Load environment variables
import 'dotenv/config'

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

async function updateMachines(dataPath: string) {
  const filePath = path.join(dataPath, 'SilverBalls_PinballMachines.json')

  if (!fs.existsSync(filePath)) {
    console.log(`No machines file found at ${filePath}, skipping...`)
    return { added: 0, updated: 0 }
  }

  const jsonData: MachineJson[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  console.log(`Processing ${jsonData.length} machines from JSON...`)

  // Get existing machines
  const { data: existing } = await supabase
    .from('pinball_machines')
    .select('opendb_id, name')

  const existingMap = new Map(existing?.map(m => [m.opendb_id, m.name]) || [])

  let added = 0
  let updated = 0

  // Process in batches
  const toInsert: { id: number; opendb_id: string; name: string }[] = []
  const toUpdate: { opendb_id: string; name: string }[] = []

  for (const machine of jsonData) {
    const existingName = existingMap.get(machine.OpendbId)

    if (existingName === undefined) {
      toInsert.push({
        id: machine.id,
        opendb_id: machine.OpendbId,
        name: machine.name,
      })
    } else if (existingName !== machine.name) {
      toUpdate.push({
        opendb_id: machine.OpendbId,
        name: machine.name,
      })
    }
  }

  // Insert new machines
  if (toInsert.length > 0) {
    const { error } = await supabase
      .from('pinball_machines')
      .insert(toInsert)

    if (error) {
      console.error('Error inserting machines:', error)
    } else {
      added = toInsert.length
    }
  }

  // Update existing machines
  for (const machine of toUpdate) {
    const { error } = await supabase
      .from('pinball_machines')
      .update({ name: machine.name })
      .eq('opendb_id', machine.opendb_id)

    if (!error) {
      updated++
    }
  }

  return { added, updated }
}

async function updateRules(dataPath: string) {
  const filePath = path.join(dataPath, 'SilverBalls_PinballRules.json')

  if (!fs.existsSync(filePath)) {
    console.log(`No rules file found at ${filePath}, skipping...`)
    return { added: 0, updated: 0 }
  }

  const jsonData: RuleJson[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  console.log(`Processing ${jsonData.length} rules from JSON...`)

  // Get existing rules
  const { data: existing } = await supabase
    .from('pinball_rules')
    .select('opendb_id')

  const existingSet = new Set(existing?.map(r => r.opendb_id) || [])

  let added = 0
  let updated = 0

  for (const rule of jsonData) {
    const ruleData = {
      opendb_id: rule.OpendbId,
      quickie_version: rule.QuickieVersion || null,
      go_to_flipper: rule.GoToFlipper || null,
      risk_index: rule.RiskIndex || null,
      shots_to_master: rule.ShotsToMaster || null,
      style_alert: rule.StyleAlert || null,
      skill_shot: rule.SkillShot || null,
      full_rules: rule.FullRules || null,
      playfield_risk: rule.PlayfieldRisk || null,
    }

    if (!existingSet.has(rule.OpendbId)) {
      // Insert new rule
      const { error } = await supabase
        .from('pinball_rules')
        .insert(ruleData)

      if (error) {
        console.error(`Error inserting rule ${rule.OpendbId}:`, error.message)
      } else {
        added++
      }
    } else {
      // Update existing rule
      const { error } = await supabase
        .from('pinball_rules')
        .update(ruleData)
        .eq('opendb_id', rule.OpendbId)

      if (error) {
        console.error(`Error updating rule ${rule.OpendbId}:`, error.message)
      } else {
        updated++
      }
    }
  }

  return { added, updated }
}

async function main() {
  console.log('=== Silverball Rules Import Tool ===\n')

  // Get data path from command line or prompt
  let dataPath = process.argv[2]

  if (!dataPath) {
    dataPath = await prompt('Enter path to updates folder: ')
  }

  dataPath = path.resolve(dataPath)

  if (!fs.existsSync(dataPath)) {
    console.error(`Path not found: ${dataPath}`)
    process.exit(1)
  }

  console.log(`Using data from: ${dataPath}\n`)

  // Confirm before proceeding
  const confirm = await prompt('This will update data in Supabase. Continue? (y/n): ')
  if (confirm.toLowerCase() !== 'y') {
    console.log('Aborted.')
    process.exit(0)
  }

  console.log('\n--- Updating Machines ---')
  const machineResult = await updateMachines(dataPath)
  console.log(`Machines: ${machineResult.added} added, ${machineResult.updated} updated`)

  console.log('\n--- Updating Rules ---')
  const ruleResult = await updateRules(dataPath)
  console.log(`Rules: ${ruleResult.added} added, ${ruleResult.updated} updated`)

  console.log('\n=== Import Complete ===')
}

main().catch(console.error)
