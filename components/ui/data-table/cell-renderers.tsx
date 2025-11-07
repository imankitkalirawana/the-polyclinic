'use client';

import {
  addToast,
  Button,
  Chip,
  ChipProps,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Tooltip,
} from '@heroui/react';
import { format } from 'date-fns';
import type React from 'react';
import { Icon } from '@iconify/react';

import { CopyText } from '@/components/ui/copy';
import { chipColorMap, ChipColorType } from '@/lib/chip';
import Avatar from 'boring-avatars';

export const renderCopyableText = (text: string) => <CopyText>{text}</CopyText>;

export const RenderUser = ({
  name,
  size = 'md',
  description,
  isCompact,
  classNames,
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  description?: string | number;
  isCompact?: boolean;
  classNames?: {
    name?: string;
    description?: string;
    avatar?: string;
  };
}) => {
  const sizeClass: Record<
    typeof size,
    {
      avatar: string;
      gap: string;
    }
  > = {
    sm: {
      avatar: 'size-8',
      gap: 'gap-0',
    },
    md: {
      avatar: 'size-9',
      gap: 'gap-0.5',
    },
    lg: {
      avatar: 'size-11',
      gap: 'gap-0.5',
    },
    xl: {
      avatar: 'size-12',
      gap: 'gap-1',
    },
  };

  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} className={cn(classNames?.avatar, sizeClass[size].avatar)} />
      {!isCompact && (
        <div className={cn('flex flex-col', sizeClass[size].gap)}>
          <h4 className={cn('text-nowrap text-default-foreground text-small', classNames?.name)}>
            {name}
          </h4>
          <p className={cn('text-nowrap text-default-500 text-tiny', classNames?.description)}>
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export const renderDate = ({ date, isTime = false }: { date: Date | string; isTime?: boolean }) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <div className="flex flex-col">
      <p className="text-nowrap capitalize text-default-foreground text-small">
        {format(dateObj, 'PP')}
      </p>
      {isTime && (
        <p className="text-nowrap capitalize text-default-500 text-tiny">{format(dateObj, 'p')}</p>
      )}
    </div>
  );
};

export const renderCountry = (name: string, icon: React.ReactNode) => (
  <div className="flex items-center gap-2">
    <div className="h-[16px] w-[16px]">{icon}</div>
    <p className="text-nowrap text-default-foreground text-small">{name}</p>
  </div>
);

export const renderChip = ({
  item,
  size,
  richColor,
}: {
  item: ChipColorType;
  size?: ChipProps['size'];
  richColor?: boolean;
}) => (
  <Chip
    className={cn(
      'flex w-fit items-center gap-[2px] rounded-lg px-2 py-1',
      richColor ? chipColorMap[item].bg : 'bg-default-100'
    )}
    size={size}
    startContent={<span className={cn('size-2 rounded-full', chipColorMap[item]?.text)} />}
  >
    <span className="capitalize text-default-800">{item?.replace(/[_-]/g, ' ')}</span>
  </Chip>
);

export const renderChips = (items: string[]) => (
  <div className="float-start flex gap-1">
    {items.map((item, index) => {
      if (index < 3) {
        return (
          <Chip
            key={item}
            className="rounded-small bg-default-100 px-[6px] capitalize text-default-800"
            size="sm"
            variant="flat"
          >
            {item}
          </Chip>
        );
      }
      if (index === 3) {
        return (
          <Chip key={item} className="text-default-500" size="sm" variant="flat">
            {`+${items.length - 3}`}
          </Chip>
        );
      }

      return null;
    })}
  </div>
);

export const renderActions = ({
  onView,
  onEdit,
  onDelete,
  onCopy,
  key,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  key?: string | number;
}) => (
  <Dropdown aria-label="Actions" placement="bottom-end">
    <DropdownTrigger>
      <Button variant="light" isIconOnly>
        <Icon icon="solar:menu-dots-bold" width={18} className="rotate-90" />
      </Button>
    </DropdownTrigger>
    <DropdownMenu aria-label="Dropdown menu with description" variant="flat">
      <DropdownSection showDivider title="Actions">
        <DropdownItem
          key="view"
          description="View the item"
          shortcut="⌘V"
          startContent={<Icon icon="solar:eye-bold-duotone" width={24} />}
          onClick={onView}
        >
          View Item
        </DropdownItem>
        {onCopy || key ? (
          <DropdownItem
            key="copy"
            description="Copy the link"
            shortcut="⌘C"
            startContent={<Icon icon="solar:copy-bold-duotone" width={24} />}
            onClick={() => {
              if (onCopy) {
                onCopy();
              } else {
                const url = window.location.href;
                navigator.clipboard.writeText(`${url}/${key}`);
                addToast({
                  title: 'Copied',
                  description: 'Link copied to clipboard',
                  color: 'success',
                });
              }
            }}
          >
            Copy link
          </DropdownItem>
        ) : null}
        {onEdit ? (
          <DropdownItem
            key="edit"
            description="Allows you to edit the file"
            shortcut="⌘⇧E"
            startContent={<Icon icon="solar:pen-new-square-bold-duotone" width={24} />}
            onClick={onEdit}
          >
            Edit file
          </DropdownItem>
        ) : null}
      </DropdownSection>
      {onDelete ? (
        <DropdownSection title="Danger zone">
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            description="Permanently delete the item"
            shortcut="⌘⇧D"
            startContent={<Icon icon="solar:trash-bin-minimalistic-bold-duotone" width={24} />}
            onClick={onDelete}
          >
            Delete item
          </DropdownItem>
        </DropdownSection>
      ) : null}
    </DropdownMenu>
  </Dropdown>
);
