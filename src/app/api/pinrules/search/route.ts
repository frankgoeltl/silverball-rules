import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json([])
  }

  const supabase = createServerClient()

  // Search machines by name that have rules
  // Using ilike for case-insensitive search (different from .NET which was case-sensitive)
  const { data, error } = await supabase
    .from('pinball_machines')
    .select('opendb_id, name')
    .ilike('name', `%${query}%`)
    .in('opendb_id',
      supabase.from('pinball_rules').select('opendb_id')
    )

  if (error) {
    // Fallback: simpler query if the subquery doesn't work
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('pinball_machines')
      .select(`
        opendb_id,
        name,
        pinball_rules!inner(opendb_id)
      `)
      .ilike('name', `%${query}%`)

    if (fallbackError) {
      console.error('Error searching machines:', fallbackError)
      return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
    }

    const response = (fallbackData || []).map(item => ({
      name: item.name,
      opendbId: item.opendb_id,
    }))

    return NextResponse.json(response)
  }

  // Format response to match existing .NET API format
  const response = (data || []).map(item => ({
    name: item.name,
    opendbId: item.opendb_id,
  }))

  return NextResponse.json(response)
}
