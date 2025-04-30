'use client';

import type React from 'react';
import { Chip, User } from '@heroui/react';
import { Icon } from '@iconify/react';

import { CopyText } from '@/components/ui/copy';

export const renderCopyableText = (text: string) => {
  return <CopyText>{text}</CopyText>;
};

export const renderUser = (avatar: string, name: string, email: string) => {
  return (
    <User
      avatarProps={{ radius: 'lg', src: avatar }}
      classNames={{
        name: 'text-default-foreground',
        description: 'text-default-500',
      }}
      description={email}
      name={name}
    >
      {email}
    </User>
  );
};

export const renderDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <div className="flex items-center gap-1">
      <Icon
        className="h-[16px] w-[16px] text-default-300"
        icon="solar:calendar-minimalistic-linear"
      />
      <p className="text-nowrap text-small capitalize text-default-foreground">
        {new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(dateObj)}
      </p>
    </div>
  );
};

export const renderCountry = (name: string, icon: React.ReactNode) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-[16px] w-[16px]">{icon}</div>
      <p className="text-nowrap text-small text-default-foreground">{name}</p>
    </div>
  );
};

export const renderChips = (items: string[]) => {
  return (
    <div className="float-start flex gap-1">
      {items.map((item, index) => {
        if (index < 3) {
          return (
            <Chip
              key={item}
              className="rounded-xl bg-default-100 px-[6px] capitalize text-default-800"
              size="sm"
              variant="flat"
            >
              {item}
            </Chip>
          );
        }
        if (index === 3) {
          return (
            <Chip
              key={item}
              className="text-default-500"
              size="sm"
              variant="flat"
            >
              {`+${items.length - 3}`}
            </Chip>
          );
        }

        return null;
      })}
    </div>
  );
};

export const renderActions = (
  onView?: () => void,
  onEdit?: () => void,
  onDelete?: () => void
) => {
  return (
    <div className="flex items-center justify-end gap-2">
      {onView && (
        <Icon
          icon="solar:eye-bold"
          className="cursor-pointer text-default-400"
          height={18}
          width={18}
          onClick={(e) => {
            e.stopPropagation();
            onView?.();
          }}
        />
      )}
      {onEdit && (
        <Icon
          icon="solar:pen-bold"
          className="cursor-pointer text-default-400"
          height={18}
          width={18}
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        />
      )}
      {onDelete && (
        <Icon
          icon="solar:trash-bin-trash-bold"
          className="cursor-pointer text-default-400"
          height={18}
          width={18}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        />
      )}
    </div>
  );
};
