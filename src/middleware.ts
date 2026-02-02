import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  // Only log rules page views
  const path = request.nextUrl.pathname
  if (!path.startsWith('/rules/')) {
    return NextResponse.next()
  }

  // Only log actual document navigations (strict positive match)
  // sec-fetch-dest: document = full page navigation
  // sec-fetch-mode: navigate = user-initiated navigation
  const isDocumentNavigation = request.headers.get('sec-fetch-dest') === 'document'
    && request.headers.get('sec-fetch-mode') === 'navigate'

  if (!isDocumentNavigation) {
    return NextResponse.next()
  }

  // Don't block the response - log asynchronously
  logPageView(request, path).catch(() => {
    // Silently fail - don't affect user experience
  })

  return NextResponse.next()
}

async function logPageView(request: NextRequest, path: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]
      || request.headers.get('x-real-ip')
      || 'unknown'

    await supabase.from('api_log_entries').insert({
      method: 'GET',
      path: path,
      query_string: request.nextUrl.search || null,
      ip_address: ip,
    })
  } catch {
    // Silently fail
  }
}

export const config = {
  matcher: '/rules/:path*',
}
