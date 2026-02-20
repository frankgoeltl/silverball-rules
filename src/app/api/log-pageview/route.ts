import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json()

    if (!path || !path.startsWith('/rules/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const supabase = createServerClient()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    await supabase.from('api_log_entries').insert({
      method: 'GET',
      path: path,
      query_string: null,
      ip_address: ip,
      user_agent: request.headers.get('user-agent') || null,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
  }
}
