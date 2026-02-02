/**
 * OPDB Import Tool
 *
 * Fetches machine data from OPDB API and imports to Supabase.
 * Populates the opdb_machines table with manufacturer, year, image, etc.
 *
 * Usage:
 *   npx tsx scripts/import-opdb.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const OPDB_API_KEY = 'a8iN1XvJIg4viSpVfcrlZjI2iBbm6n93JBSQu7C1eF8jRndjGvPXIHS7VlZb'
const OPDB_API_BASE = 'https://opdb.org/api/machines'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface OpdbImage {
  title: string | null
  primary: boolean
  type: string
  urls: {
    medium: string
    large: string
    small: string
  }
}

interface OpdbApiResponse {
  opdb_id: string
  is_machine: string
  name: string
  shortname?: string
  ipdb_id?: number
  manufacture_date?: string
  manufacturer?: {
    name: string
  }
  type?: string
  display?: string
  player_count?: number
  images?: OpdbImage[]
}

function extractImageUrl(images?: OpdbImage[]): string | null {
  if (!images || images.length === 0) return null

  // Prefer primary backglass image
  const backglass = images.find(img => img.type === 'backglass' && img.primary)
  if (backglass) return backglass.urls.medium

  // Fall back to any backglass
  const anyBackglass = images.find(img => img.type === 'backglass')
  if (anyBackglass) return anyBackglass.urls.medium

  // Fall back to first primary image
  const primary = images.find(img => img.primary)
  if (primary) return primary.urls.medium

  // Fall back to first image
  return images[0]?.urls?.medium || null
}

interface OpdbMachineRecord {
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

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchOpdbMachine(opendbId: string): Promise<OpdbApiResponse | null> {
  try {
    const url = `${OPDB_API_BASE}/${opendbId}?api_token=${OPDB_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      console.warn(`  Failed to fetch ${opendbId}: ${response.status}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.warn(`  Error fetching ${opendbId}:`, error)
    return null
  }
}

async function main() {
  console.log('=== OPDB Machine Data Import ===\n')

  // Get all machines that have rules
  console.log('Fetching machines with rules from Supabase...')
  const { data: rulesData, error: rulesError } = await supabase
    .from('pinball_rules')
    .select('opendb_id')

  if (rulesError) {
    console.error('Error fetching rules:', rulesError)
    process.exit(1)
  }

  const opendbIds = rulesData?.map(r => r.opendb_id) || []
  console.log(`Found ${opendbIds.length} machines with rules\n`)

  // Check which ones already exist in opdb_machines
  const { data: existingData } = await supabase
    .from('opdb_machines')
    .select('opdb_id')

  const existingIds = new Set(existingData?.map(m => m.opdb_id) || [])
  const newIds = opendbIds.filter(id => !existingIds.has(id))

  console.log(`Already imported: ${existingIds.size}`)
  console.log(`New to import: ${newIds.length}\n`)

  if (newIds.length === 0) {
    console.log('No new machines to import.')
    return
  }

  // Fetch and insert OPDB data
  let imported = 0
  let failed = 0
  let notFound = 0

  for (let i = 0; i < newIds.length; i++) {
    const opendbId = newIds[i]
    process.stdout.write(`[${i + 1}/${newIds.length}] Fetching ${opendbId}... `)

    const opdbData = await fetchOpdbMachine(opendbId)

    if (!opdbData) {
      console.log('NOT FOUND')
      notFound++
      await delay(100)
      continue
    }

    const record: OpdbMachineRecord = {
      opdb_id: opdbData.opdb_id,
      is_machine: opdbData.is_machine || null,
      name: opdbData.name || null,
      shortname: opdbData.shortname || null,
      ipdb_id: opdbData.ipdb_id || null,
      manufacture_date: opdbData.manufacture_date || null,
      manufacturer_name: opdbData.manufacturer?.name || null,
      type: opdbData.type || null,
      display: opdbData.display || null,
      player_count: opdbData.player_count || null,
      image_url_medium: extractImageUrl(opdbData.images),
    }

    const { error: insertError } = await supabase
      .from('opdb_machines')
      .insert(record)

    if (insertError) {
      console.log(`ERROR: ${insertError.message}`)
      failed++
    } else {
      console.log(`OK (${record.manufacturer_name}, ${record.manufacture_date?.substring(0, 4) || 'N/A'})`)
      imported++
    }

    // Rate limiting - 300ms between calls to avoid 429 errors
    await delay(300)
  }

  console.log('\n=== Import Complete ===')
  console.log(`Imported: ${imported}`)
  console.log(`Not found: ${notFound}`)
  console.log(`Failed: ${failed}`)
}

main().catch(console.error)
