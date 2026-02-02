/**
 * Update OPDB Images
 *
 * Fetches and updates image URLs for existing opdb_machines records.
 * The initial import used wrong field mapping for images.
 *
 * Usage:
 *   npx tsx scripts/update-opdb-images.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const OPDB_API_KEY = 'a8iN1XvJIg4viSpVfcrlZjI2iBbm6n93JBSQu7C1eF8jRndjGvPXIHS7VlZb'
const OPDB_API_BASE = 'https://opdb.org/api/machines'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables')
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
  images?: OpdbImage[]
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
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

async function main() {
  console.log('=== Update OPDB Images ===\n')

  // Get all machines without images
  const { data: machines, error } = await supabase
    .from('opdb_machines')
    .select('opdb_id')
    .is('image_url_medium', null)

  if (error) {
    console.error('Error fetching machines:', error)
    process.exit(1)
  }

  console.log(`Found ${machines?.length || 0} machines without images\n`)

  if (!machines || machines.length === 0) {
    console.log('All machines have images.')
    return
  }

  let updated = 0
  let noImage = 0
  let failed = 0

  for (let i = 0; i < machines.length; i++) {
    const { opdb_id } = machines[i]
    process.stdout.write(`[${i + 1}/${machines.length}] ${opdb_id}... `)

    try {
      const response = await fetch(`${OPDB_API_BASE}/${opdb_id}?api_token=${OPDB_API_KEY}`)

      if (!response.ok) {
        console.log(`FAILED (${response.status})`)
        failed++
        await delay(300)
        continue
      }

      const data: OpdbApiResponse = await response.json()
      const imageUrl = extractImageUrl(data.images)

      if (!imageUrl) {
        console.log('NO IMAGE')
        noImage++
        await delay(300)
        continue
      }

      const { error: updateError } = await supabase
        .from('opdb_machines')
        .update({ image_url_medium: imageUrl })
        .eq('opdb_id', opdb_id)

      if (updateError) {
        console.log(`UPDATE ERROR: ${updateError.message}`)
        failed++
      } else {
        console.log('OK')
        updated++
      }
    } catch (err) {
      console.log(`ERROR: ${err}`)
      failed++
    }

    await delay(300)
  }

  console.log('\n=== Update Complete ===')
  console.log(`Updated: ${updated}`)
  console.log(`No image available: ${noImage}`)
  console.log(`Failed: ${failed}`)
}

main().catch(console.error)
