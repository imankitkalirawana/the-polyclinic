import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const forwardedHost = req.headers.get('x-forwarded-host');

  if (forwardedHost) {
    req.headers.set('host', forwardedHost);
  }

  return NextResponse.next();
}
