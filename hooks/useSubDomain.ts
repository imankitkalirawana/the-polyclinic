'use client';
import { useEffect, useState } from 'react';

/**
 * Client-side hook to get the current subdomain from window.location.hostname
 *
 * @example
 * - clinic.divinely.dev => "clinic"
 * - divinely.dev => null
 */
export function useSubdomain() {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');

      if (parts.length > 2) {
        setSubdomain(parts[0]);
      } else {
        setSubdomain(null);
      }
    }
  }, []);

  return subdomain;
}
