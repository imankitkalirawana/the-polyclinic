import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RESERVED_SUBDOMAINS = ['www', 'app', 'api'];

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0];

  const parts = hostname.split('.');
  let subdomain: string | null = null;

  if (parts.length > 2) {
    subdomain = parts[0];
  }

  if (url.pathname.startsWith('/auth/register') && !subdomain) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
    req.headers.set('x-subdomain', subdomain);
  }

  return NextResponse.next();
}
