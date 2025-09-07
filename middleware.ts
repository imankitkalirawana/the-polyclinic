import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain, excludedSubdomains } from '@/lib/utils';

export function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0]; // remove port

  const rootDomainFormatted = rootDomain.split(':')[0];

  // 1. Local development environment
  if (url.includes('lvh.me') || url.includes('localhost')) {
    // Try regex first → "fortis.lvh.me" or "fortis.staging.lvh.me"
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.lvh\.me/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback → get first label before ".lvh.me"
    if (hostname.includes('.lvh.me')) {
      const labels = hostname.replace(`.${rootDomainFormatted}`, '').split('.');
      const filtered = labels.filter((l) => !excludedSubdomains.includes(l));
      return filtered.length > 0 ? filtered[0] : null;
    }

    return null;
  }

  // 2. Preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // 3. Regular production subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  if (!isSubdomain) return null;

  // Remove root domain → "fortis.staging.lvh.me" → "fortis.staging"
  const subdomainPart = hostname.replace(`.${rootDomainFormatted}`, '');

  // Split → ["fortis", "staging"]
  const labels = subdomainPart.split('.');

  // Filter out excluded → ["fortis"]
  const filtered = labels.filter((l) => !excludedSubdomains.includes(l));

  return filtered.length > 0 ? filtered[0] : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    // Block access to admin page from subdomains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }
  }

  // On the root domain, allow normal access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)',
  ],
};
