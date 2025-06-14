'use client';

import React from 'react';
import type { AvatarProps } from '@heroui/react';
import { Avatar } from '@heroui/react';
import { cn } from '@heroui/react';

const TeamAvatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ name, className, classNames = {}, ...props }, ref) => (
    <Avatar
      {...props}
      ref={ref}
      classNames={{
        ...classNames,
        base: cn(
          'bg-transparent border-small border-divider',
          classNames?.base,
          className
        ),
        name: cn(
          'text-default-500 text-[0.6rem] font-semibold',
          classNames?.name
        ),
      }}
      getInitials={(name) =>
        (name[0] || '') + (name[name.lastIndexOf(' ') + 1] || '').toUpperCase()
      }
      name={name}
      radius="md"
      size="sm"
    />
  )
);

TeamAvatar.displayName = 'TeamAvatar';

export default TeamAvatar;
