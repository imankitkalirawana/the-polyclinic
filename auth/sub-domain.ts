'use server';

import { headers } from 'next/headers';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';
import { rootDomain, excludedSubdomains } from '@/lib/utils';

/**
 * Extracts subdomain (tenant) from request headers.
 * Works for both dev (lvh.me) and prod (custom domains).
 *
 * @example
 * - fortis.lvh.me:3000 => "fortis"
 * - clinic.divinely.dev => "clinic"
 * - divinely.dev => null
 */
export async function getSubdomain(): Promise<string | null> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const hostname = host.split(':')[0]; // remove port

  const rootDomainFormatted = rootDomain.split(':')[0];

  // Check if hostname is actually a subdomain of the root domain
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  if (!isSubdomain) return null;

  // Remove the root domain → e.g. "fortis.staging.lvh.me" -> "fortis.staging"
  const subdomainPart = hostname.replace(`.${rootDomainFormatted}`, '');

  // Split into labels → ["fortis", "staging"]
  const labels = subdomainPart.split('.');

  // Filter out excluded subdomains → ["fortis"]
  const filtered = labels.filter((l) => !excludedSubdomains.includes(l));

  // Return first remaining label, or null if none
  return filtered.length > 0 ? filtered[0] : null;
}

export async function isOrganizationRegistered(organization: string) {
  const conn = await connectDB(organization);
  const User = getUserModel(conn);
  const user = await User.findOne({ organization });
  return user ? true : false;
}
