import { NextRequest, NextResponse } from 'next/server'

// Known scraper/bot User-Agent patterns
const BOT_UA_PATTERNS = [
  /python-requests/i,
  /python-urllib/i,
  /go-http-client/i,
  /curl\//i,
  /wget\//i,
  /scrapy/i,
  /node-fetch/i,
  /aiohttp/i,
  /httpx/i,
  /libwww-perl/i,
  /java\//i,
  /apache-httpclient/i,
  /okhttp/i,
  /php\//i,
  /guzzlehttp/i,
]

// --- Best-effort in-memory rate limiting (Edge Runtime) ---
// Edge workers have longer-lived instances than Lambdas, so this
// is more effective here than in per-route handlers. Still not
// persistent across edge locations or cold starts.
// Vercel sets x-forwarded-for reliably, so IP extraction is trustworthy here.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()
const WINDOW_MS = 60 * 1000

// Rate limits per route category (requests per minute per IP)
const RATE_LIMITS: Record<string, number> = {
  opendbids: 10,
  search: 20,
  print: 20,
  api_default: 30,
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

function getRateLimitCategory(pathname: string): string {
  if (pathname.startsWith('/api/pinrules/opendbids')) return 'opendbids'
  if (pathname.startsWith('/api/pinrules/search')) return 'search'
  if (pathname.startsWith('/print/')) return 'print'
  return 'api_default'
}

function checkRateLimit(ip: string, category: string): { allowed: boolean; resetAt: number } {
  const now = Date.now()
  const key = `${ip}:${category}`
  const maxRequests = RATE_LIMITS[category] || 30
  const entry = rateLimitStore.get(key)

  // Expired or new entry — reset the window (also serves as cleanup)
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, resetAt: now + WINDOW_MS }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, resetAt: entry.resetAt }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ua = request.headers.get('user-agent') || ''
  const origin = request.headers.get('origin')

  // --- Bot User-Agent blocking ---
  // Block empty UA and known scraper patterns on protected routes
  if (!ua || BOT_UA_PATTERNS.some(p => p.test(ua))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // --- CORS headers on API routes ---
  // Allow cross-origin requests (external apps like Match Play Events use the API).
  // Bot blocking and rate limiting handle abuse; CORS headers enable legitimate consumers.
  if (pathname.startsWith('/api/') && request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // --- Rate limiting ---
  const ip = getClientIp(request)
  const category = getRateLimitCategory(pathname)
  const { allowed, resetAt } = checkRateLimit(ip, category)

  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
        },
      }
    )
  }

  // --- Add CORS headers to API responses ---
  const response = NextResponse.next()
  if (pathname.startsWith('/api/') && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  return response
}

export const config = {
  matcher: ['/api/:path*', '/print/:path*'],
}
