'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@heroui/react';

export default function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    mounted && (
      <Switch
        checked={theme === 'dark'}
        onSelect={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
    )
  );
}
