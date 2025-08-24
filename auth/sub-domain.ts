'use server';

import { headers } from 'next/headers';
import { connectDB } from '@/lib/db';
import { getUserModel } from '@/models/User';

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

  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0]; // return "fortis"
  }

  return null;
}

export async function isOrganizationRegistered(organization: string) {
  const conn = await connectDB(organization);
  const User = getUserModel(conn);
  const user = await User.findOne({ organization });
  return user ? true : false;
}
