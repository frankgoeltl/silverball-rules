import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getClientIp, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed, resetAt } = checkRateLimit(ip)
  if (!allowed) {
    return rateLimitResponse(resetAt)
  }

  try {
    const { path } = await request.json()

    if (!path || !path.startsWith('/rules/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const supabase = createServerClient()

    await supabase.from('api_log_entries').insert({
      method: 'GET',
      path: path,
      query_string: null,
      ip_address: ip,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
  }
}
