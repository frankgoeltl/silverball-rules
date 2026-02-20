import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const MAX_QUERY_LENGTH = 100

function sanitizeSearchQuery(query: string): string {
  return query
    .slice(0, MAX_QUERY_LENGTH)
    .replace(/[%_\\]/g, '\\$&')
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json([])
  }

  const sanitizedQuery = sanitizeSearchQuery(query)
  const supabase = createServerClient()

  // Search machines by name that have rules
  // Using ilike for case-insensitive search and inner join to only get machines with rules
  const { data, error } = await supabase
    .from('pinball_machines')
    .select(`
      opendb_id,
      name,
      pinball_rules!inner(opendb_id)
    `)
    .ilike('name', `%${sanitizedQuery}%`)

  if (error) {
    console.error('Error searching machines:', error)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }

  // Format response to match existing .NET API format
  const response = (data || []).map(item => ({
    name: item.name,
    opendbId: item.opendb_id,
  }))

  return NextResponse.json(response)
}
