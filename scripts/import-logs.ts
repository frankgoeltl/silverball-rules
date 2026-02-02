/**
 * Legacy API Logs Import Tool
 *
 * Fetches log entries from the legacy .NET API and imports to Supabase.
 * Handles 200k+ records with batch inserts.
 *
 * Usage:
 *   npx tsx scripts/import-logs.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const LEGACY_API_URL = 'https://silverballsapi.azurewebsites.net/api/ApiLogEntries'
const BATCH_SIZE = 500
const BATCH_DELAY_MS = 100

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface LegacyLogEntry {
  id: number
  method: string | null
  path: string | null
  queryString: string | null
  timestamp: string
  ipAddress: string | null
}

interface SupabaseLogEntry {
  method: string | null
  path: string | null
  query_string: string | null
  timestamp: string
  ip_address: string | null
}

async function fetchLegacyLogs(): Promise<LegacyLogEntry[]> {
  console.log(`Fetching logs from ${LEGACY_API_URL}...`)
  console.log('(This may take a while for 200k+ records)\n')

  const response = await fetch(LEGACY_API_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data as LegacyLogEntry[]
}

function transformLog(legacy: LegacyLogEntry): SupabaseLogEntry {
  // Normalize legacy PascalCase paths to lowercase
  const normalizedPath = legacy.path?.replace(/\/api\/PinRules\//i, '/api/pinrules/') || null

  return {
    method: legacy.method,
    path: normalizedPath,
    query_string: legacy.queryString,
    timestamp: legacy.timestamp,
    ip_address: legacy.ipAddress,
  }
}

async function clearLogs() {
  console.log('=== Clearing All Log Entries ===\n')

  const { count: existingCount } = await supabase
    .from('api_log_entries')
    .select('*', { count: 'exact', head: true })

  console.log(`Current log entries: ${existingCount || 0}`)

  if (!existingCount || existingCount === 0) {
    console.log('No entries to clear.')
    return
  }

  console.log('Deleting all entries...')

  // Delete all entries (Supabase requires a filter, so we use a condition that matches all)
  const { error } = await supabase
    .from('api_log_entries')
    .delete()
    .gte('id', 0)

  if (error) {
    console.error('Error clearing logs:', error.message)
  } else {
    console.log('All log entries cleared.')
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.includes('--clear')) {
    await clearLogs()
    return
  }

  const forceImport = args.includes('--force')

  console.log('=== Legacy API Logs Import ===\n')
  console.log('Options: --clear (delete all), --force (skip duplicate check)\n')

  // Check current count
  const { count: existingCount } = await supabase
    .from('api_log_entries')
    .select('*', { count: 'exact', head: true })

  console.log(`Current log entries in Supabase: ${existingCount || 0}\n`)

  // Fetch legacy logs
  const legacyLogs = await fetchLegacyLogs()
  console.log(`Fetched ${legacyLogs.length.toLocaleString()} logs from legacy API\n`)

  if (legacyLogs.length === 0) {
    console.log('No logs to import.')
    return
  }

  // Transform logs
  const transformedLogs = legacyLogs.map(transformLog)

  let newLogs = transformedLogs

  if (!forceImport) {
    // Get existing timestamps to avoid duplicates
    console.log('Checking for existing entries to avoid duplicates...')
    const { data: existingData } = await supabase
      .from('api_log_entries')
      .select('timestamp, path, ip_address')
      .limit(300000)

    const existingKeys = new Set(
      (existingData || []).map(e => `${e.timestamp}|${e.path}|${e.ip_address}`)
    )

    newLogs = transformedLogs.filter(
      log => !existingKeys.has(`${log.timestamp}|${log.path}|${log.ip_address}`)
    )

    console.log(`New logs to import: ${newLogs.length.toLocaleString()}`)
    console.log(`Skipping duplicates: ${(transformedLogs.length - newLogs.length).toLocaleString()}\n`)
  } else {
    console.log('Force mode: skipping duplicate check\n')
    console.log(`Logs to import: ${newLogs.length.toLocaleString()}\n`)
  }

  if (newLogs.length === 0) {
    console.log('All logs already imported.')
    return
  }

  // Batch insert
  let imported = 0
  let failed = 0
  const totalBatches = Math.ceil(newLogs.length / BATCH_SIZE)

  console.log(`Importing in ${totalBatches} batches of ${BATCH_SIZE}...\n`)

  for (let i = 0; i < newLogs.length; i += BATCH_SIZE) {
    const batch = newLogs.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1

    process.stdout.write(`[${batchNum}/${totalBatches}] Inserting ${batch.length} records... `)

    const { error } = await supabase.from('api_log_entries').insert(batch)

    if (error) {
      console.log(`ERROR: ${error.message}`)
      failed += batch.length
      // If we hit rate limiting, wait longer
      if (error.message.includes('rate') || error.message.includes('limit')) {
        console.log('Rate limited, waiting 2 seconds...')
        await delay(2000)
      }
    } else {
      console.log('OK')
      imported += batch.length
    }

    // Small delay between batches to avoid rate limiting
    await delay(BATCH_DELAY_MS)
  }

  console.log('\n=== Import Complete ===')
  console.log(`Imported: ${imported.toLocaleString()}`)
  console.log(`Failed: ${failed.toLocaleString()}`)

  // Final count
  const { count: finalCount } = await supabase
    .from('api_log_entries')
    .select('*', { count: 'exact', head: true })

  console.log(`\nTotal log entries now: ${(finalCount || 0).toLocaleString()}`)
}

main().catch(console.error)
