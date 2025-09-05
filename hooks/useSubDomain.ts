'use client';
import { useEffect, useState } from 'react';
import { excludedSubdomains } from '@/lib/utils';

/**
 * Client-side hook to get the current subdomain from window.location.hostname
 *
 * @example
 * - clinic.divinely.dev => "clinic"
 * - clinic.staging.divinely.dev => "clinic"
 * - staging.divinely.dev => null
 * - divinely.dev => null
 */
export function useSubdomain() {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');

      // If it's only root domain (e.g., "divinely.dev") → no subdomain
      if (parts.length <= 2) {
        setSubdomain(null);
        return;
      }

      // Remove the root domain (e.g., "clinic.staging.divinely.dev" → ["clinic", "staging"])
      const subdomainParts = parts.slice(0, -2);

      // Filter out excluded ones
      const filtered = subdomainParts.filter((label) => !excludedSubdomains.includes(label));

      setSubdomain(filtered.length > 0 ? filtered[0] : null);
    }
  }, []);

  return subdomain;
}
