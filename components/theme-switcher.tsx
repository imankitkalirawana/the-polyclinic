'use client';

import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import type { JSX } from 'react';
import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { cn } from '@heroui/react';

function ThemeOption({
  icon,
  value,
  isActive,
  onClick,
}: {
  icon: JSX.Element;
  value: string;
  isActive?: boolean;
  onClick: (value: string) => void;
}) {
  return (
    <button
      className={cn(
        'relative flex size-8 cursor-default items-center justify-center rounded-full transition-all [&_svg]:size-4',
        isActive ? 'text-primary' : 'text-default-600 hover:text-primary'
      )}
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => onClick(value)}
    >
      {icon}

      {isActive && (
        <motion.div
          layoutId="theme-option"
          transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
          className="absolute inset-0 rounded-full border border-divider"
        />
      )}
    </button>
  );
}

const THEME_OPTIONS = [
  {
    icon: <Icon icon="solar:monitor-bold-duotone" />,
    value: 'system',
  },
  {
    icon: <Icon icon="solar:sun-bold-duotone" />,
    value: 'light',
  },
  {
    icon: <Icon icon="solar:moon-fog-bold-duotone" />,
    value: 'dark',
  },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="flex h-8 w-24" />;
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-hidden rounded-full bg-background ring-1 ring-inset ring-divider"
      role="radiogroup"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={setTheme}
        />
      ))}
    </motion.div>
  );
}

export { ThemeSwitcher };
