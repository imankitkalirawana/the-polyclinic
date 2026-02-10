'use client';
import { useEffect, useState } from 'react';
import { excludedSubdomains } from '@/libs/utils';

/**
 * Client-side hook to get the current subdomain from window.location.hostname
 *
 * @example
 * - clinic.divinely.dev => "clinic"
 * - clinic.staging.divinely.dev => "clinic"
 * - staging.divinely.dev => null
 * - divinely.dev => null
 * - clinic.localhost:3000 => "clinic"
 * - localhost:3000 => null
 */
export function useSubdomain() {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname; // e.g., "fortis.thepolyclinic.app"
      const parts = hostname.split('.');

      let extracted: string | null = null;

      if (hostname === 'localhost') {
        extracted = null;
      } else if (hostname.endsWith('.localhost')) {
        extracted = parts[0];
      } else {
        if (parts.length > 2) {
          const subdomainParts = parts.slice(0, -2);
          const filtered = subdomainParts.filter((label) => !excludedSubdomains.includes(label));
          extracted = filtered.length > 0 ? filtered[0] : null;
        }
      }

      setSubdomain(extracted);
    }
  }, []);

  return subdomain;
}
