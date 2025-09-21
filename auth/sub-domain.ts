'use server';

import { headers } from 'next/headers';

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

export const getSubdomain = async (): Promise<string | undefined> => {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  if (!host) return undefined;

  // Remove protocol if present
  const cleanedHost = host.replace(/^https?:\/\//, '').split(':')[0]; // also removes port
  const parts = cleanedHost.split('.');

  // Skip if host is localhost-like or a known non-subdomain host
  const ignoredHosts = [
    'localhost',
    'lvh',
    'lvhme',
    '127.0.0.1',
    'thepolyclinic',
    'staging',
    'demo',
    'api',
  ];
  if (ignoredHosts.some((h) => cleanedHost.startsWith(h))) {
    return undefined;
  }

  // If it's just a root domain (example.com), no subdomain
  if (parts.length <= 2) {
    return undefined;
  }

  return parts[0]; // ✅ real subdomain
};
