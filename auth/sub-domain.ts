'use server';

import { headers } from 'next/headers';
import { rootDomain, excludedSubdomains } from '@/lib/utils';

/**
 * Extracts subdomain (tenant) from request headers.
 * Supports dev (localhost, lvh.me) and production (custom domains).
 *
 * @example
 * - fortis.lvh.me:3000 => "fortis"
 * - fortis.localhost:3000 => "fortis"
 * - clinic.divinely.dev => "clinic"
 * - divinely.dev => null
 * - localhost:3000 => null
 */
export async function getSubdomain(): Promise<string | null> {
  const headersList = await headers();

  // Try multiple headers to get the hostname
  const host = headersList.get('host') || '';
  const origin = headersList.get('origin') || '';
  const referer = headersList.get('referer') || '';

  // Extract hostname from different sources
  let hostname = '';

  if (host && !host.match(/^\d+\.\d+\.\d+\.\d+/)) {
    // Use host if it's not an IP address
    hostname = host.split(':')[0];
  } else if (origin) {
    // Try to extract from origin header
    try {
      const url = new URL(origin);
      hostname = url.hostname;
    } catch {
      // If URL parsing fails, try to extract manually
      const match = origin.match(/https?:\/\/([^\/]+)/);
      if (match) {
        hostname = match[1].split(':')[0];
      }
    }
  } else if (referer) {
    // Try to extract from referer header
    try {
      const url = new URL(referer);
      hostname = url.hostname;
    } catch {
      // If URL parsing fails, try to extract manually
      const match = referer.match(/https?:\/\/([^\/]+)/);
      if (match) {
        hostname = match[1].split(':')[0];
      }
    }
  }

  if (!hostname) return null;

  const rootDomainFormatted = rootDomain.split(':')[0];

  console.log('getSubdomain: hostname', hostname, 'rootDomain', rootDomainFormatted);
  console.log('getSubdomain: headers', Object.fromEntries(headersList.entries()));

  // Special-case: localhost and lvh.me (dev environments)
  if (hostname === 'localhost') return null;

  if (hostname.endsWith('.localhost')) {
    // e.g. fortis.localhost → ["fortis", "localhost"]
    const sub = hostname.split('.')[0];
    return excludedSubdomains.includes(sub) ? null : sub;
  }

  if (hostname.endsWith('.lvh.me')) {
    // e.g. fortis.lvh.me → ["fortis", "lvh", "me"]
    const sub = hostname.split('.')[0];
    return excludedSubdomains.includes(sub) ? null : sub;
  }

  // Production: Check if hostname is a subdomain of root domain
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  if (!isSubdomain) return null;

  // Remove root domain → e.g. "fortis.staging.divinely.dev" → "fortis.staging"
  const subdomainPart = hostname.replace(`.${rootDomainFormatted}`, '');

  // Split into labels and filter out excluded ones
  const labels = subdomainPart.split('.');
  const filtered = labels.filter((l) => !excludedSubdomains.includes(l));

  return filtered.length > 0 ? filtered[0] : null;
}
