'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { View } from './types';

export function useCurrentView() {
  const pathname = usePathname();

  const view = useMemo<View>(() => {
    if (!pathname) return '';

    // Example path: /appointments/month
    const parts = pathname.split('/').filter(Boolean); // ["appointments", "month"]
    const lastPart = parts[parts.length - 1];

    if (['month', 'week', 'day'].includes(lastPart)) {
      return lastPart as View;
    }

    return '';
  }, [pathname]);

  return { view };
}
