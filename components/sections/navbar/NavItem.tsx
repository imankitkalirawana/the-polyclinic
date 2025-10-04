'use client';

import React from 'react';
import { Link, NavbarItem } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { NavItem as NavItemType } from './types';

interface NavItemProps {
  item: NavItemType;
  index: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function NavItem({ item, index, onMouseEnter, onMouseLeave }: NavItemProps) {
  if (item.subItems) {
    return (
      <NavbarItem key={`${item.name}-${index}`}>
        <Link
          aria-label={item.name}
          className="cursor-pointer text-default-500 text-small"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {item.name} <Icon icon="tabler:chevron-down" />
        </Link>
      </NavbarItem>
    );
  }

  return (
    <NavbarItem key={`${item.name}-${index}`}>
      <Link className="text-default-500" href={item.href} size="sm">
        {item.name}
      </Link>
    </NavbarItem>
  );
}
