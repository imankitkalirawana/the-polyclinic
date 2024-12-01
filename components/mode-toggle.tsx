'use client';
import * as React from 'react';
import { useTheme } from 'next-themes';
import { IconMoonFilled, IconSunFilled } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react';
import { toast } from 'sonner';

export default function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="relative">
          Theme
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          onClick={() => {
            setTheme('light');
            toast.success('Light mode enabled');
          }}
        >
          Light
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            setTheme('dark');
            toast.success('Light mode enabled');
          }}
        >
          Dark
        </DropdownItem>
        <DropdownItem onClick={() => setTheme('system')}>System</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
