'use server';

import { headers } from 'next/headers';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/services/common/user/model';
import { rootDomain } from '@/lib/utils';

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

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export async function isOrganizationRegistered(organization: string) {
  const conn = await connectDB(organization);
  const User = getUserModel(conn);
  const user = await User.findOne({ organization });
  return user ? true : false;
}
