import { NextRequest } from 'next/server'
import { createServerClient } from './supabase'

export async function logApiRequest(request: NextRequest, path: string) {
  // Don't log search requests (matching .NET API behavior)
  if (path.includes('/search')) {
    return
  }

  try {
    const supabase = createServerClient()

    // Get client IP from headers (works with Vercel/proxies)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]
      || request.headers.get('x-real-ip')
      || 'unknown'

    await supabase.from('api_log_entries').insert({
      method: request.method,
      path: path,
      query_string: request.nextUrl.search || null,
      ip_address: ip,
      user_agent: request.headers.get('user-agent') || null,
    })
  } catch (error) {
    // Don't fail the request if logging fails
    console.error('Failed to log API request:', error)
  }
}
