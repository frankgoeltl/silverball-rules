/**
 * Check OPDB Sync
 * Compares local database names with OPDB data
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function check() {
  // Get pinball_machines
  const { data: machines } = await supabase
    .from('pinball_machines')
    .select('opendb_id, name')

  // Get opdb_machines
  const { data: opdb } = await supabase
    .from('opdb_machines')
    .select('opdb_id, name')

  // Get machines with rules
  const { data: rules } = await supabase
    .from('pinball_rules')
    .select('opendb_id')

  const opdbMap = new Map(opdb?.map(m => [m.opdb_id, m.name]) || [])
  const opdbSet = new Set(opdb?.map(m => m.opdb_id) || [])
  const rulesSet = new Set(rules?.map(r => r.opendb_id) || [])

  console.log('=== Name Mismatches (pinball_machines vs opdb_machines) ===\n')

  let mismatches = 0
  for (const m of machines || []) {
    const opdbName = opdbMap.get(m.opendb_id)
    if (opdbName && opdbName !== m.name) {
      console.log(`${m.opendb_id}:`)
      console.log(`  Local: ${m.name}`)
      console.log(`  OPDB:  ${opdbName}\n`)
      mismatches++
    }
  }

  if (mismatches === 0) {
    console.log('No mismatches found!')
  } else {
    console.log(`\nTotal mismatches: ${mismatches}`)
  }

  // Machines with rules but no OPDB data
  const withRulesNoOpdb = (machines || []).filter(m =>
    rulesSet.has(m.opendb_id) && opdbSet.has(m.opendb_id) === false
  )

  if (withRulesNoOpdb.length > 0) {
    console.log(`\n=== Machines WITH RULES but no OPDB data: ${withRulesNoOpdb.length} ===`)
    withRulesNoOpdb.forEach(m => console.log(`  ${m.opendb_id}: ${m.name}`))
  } else {
    console.log('\n=== All machines with rules have OPDB data ===')
  }

  // Stats
  console.log('\n=== Summary ===')
  console.log(`pinball_machines: ${machines?.length || 0}`)
  console.log(`pinball_rules: ${rulesSet.size}`)
  console.log(`opdb_machines: ${opdb?.length || 0}`)
}

check().catch(console.error)
