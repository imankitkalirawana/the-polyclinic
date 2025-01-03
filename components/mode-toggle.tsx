'use client';
import * as React from 'react';
import { useTheme } from 'next-themes';

import { Switch } from '@nextui-org/react';

export default function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    mounted && (
      <Switch
        isSelected={theme === 'dark'}
        onValueChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        color="secondary"
      />
    )
  );
}
