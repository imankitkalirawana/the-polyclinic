'use server';

import { headers } from 'next/headers';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';
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
  const host = headersList.get('host') || '';
  const hostname = host.split(':')[0]; // remove port

  if (!hostname) return null;

  const rootDomainFormatted = rootDomain.split(':')[0];

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

export async function isOrganizationRegistered(organization: string) {
  const conn = await connectDB(organization);
  const User = getUserModel(conn);
  const user = await User.findOne({ organization });
  return !!user;
}
