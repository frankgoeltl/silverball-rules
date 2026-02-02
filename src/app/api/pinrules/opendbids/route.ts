import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { logApiRequest } from '@/lib/logging'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()

  // Log the API request
  await logApiRequest(request, '/api/pinrules/opendbids')

  // Get all machines that have rules (join with pinball_rules)
  const { data, error } = await supabase
    .from('pinball_rules')
    .select(`
      opendb_id,
      pinball_machines!inner(name)
    `)

  if (error) {
    console.error('Error fetching opendb ids:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }

  // Format response to match existing .NET API format
  const response = (data || []).map(item => ({
    opendbId: item.opendb_id,
    name: (item.pinball_machines as { name: string }).name,
  }))

  return NextResponse.json(response)
}
