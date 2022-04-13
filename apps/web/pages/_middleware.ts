import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    return NextResponse.redirect(`${url.origin}/manga`)
  }

  return undefined
}
