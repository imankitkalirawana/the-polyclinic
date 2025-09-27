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

export const getSubdomain = async (): Promise<string> => {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    if (!host) return '';

    // Remove protocol if present
    const cleanedHost = host.replace(/^https?:\/\//, '').split(':')[0]; // also removes port

    // Ensure cleanedHost is defined and not empty
    if (!cleanedHost || typeof cleanedHost !== 'string') {
      return '';
    }

    const parts = cleanedHost.split('.');

    // Skip if host is localhost-like or a known non-subdomain host
    const ignoredHosts = [
      'localhost',
      'lvh',
      'lvhme',
      '127.0.0.1',
      'thepolyclinic',
      'staging',
      'api',
    ];
    if (ignoredHosts.some((h) => cleanedHost?.startsWith(h))) {
      return '';
    }

    // If it's just a root domain (example.com), no subdomain
    if (parts.length <= 2) {
      return '';
    }

    return parts[0]; // ✅ real subdomain
  } catch (error) {
    // During build time, headers might not be available
    console.warn('Failed to get subdomain:', error);
    return '';
  }
};
