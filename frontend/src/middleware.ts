import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CANON = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '')
export function middleware(req: NextRequest) {
  if (!CANON) return NextResponse.next()
  const host = req.headers.get('host')
  if (host && host !== CANON) {
    return NextResponse.redirect(
      new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANON}`),
      301,
    )
  }
  return NextResponse.next()
}
export const config = { matcher: ['/((?!_next|api|favicon|og\\.jpg).*)'] }
