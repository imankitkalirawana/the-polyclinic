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
  User,
} from '@heroui/react';
import { format } from 'date-fns';
import type React from 'react';
import { Icon } from '@iconify/react';

import { CopyText } from '@/components/ui/copy';
import { chipColorMap, ChipColorType } from '@/lib/chip';

export const renderCopyableText = (text: string) => <CopyText>{text}</CopyText>;

export const renderUser = ({
  avatar,
  name,
  description,
}: {
  avatar?: string | undefined;
  name: string | undefined;
  description?: string | number | undefined;
}) => (
  <Tooltip
    delay={1000}
    classNames={{
      content: 'bg-transparent p-0 shadow-none',
    }}
  >
    <User
      avatarProps={{
        radius: 'lg',
        src: avatar,
        size: avatar ? 'md' : 'sm',
        name,
      }}
      classNames={{
        name: 'text-default-foreground',
        description: 'text-default-500',
      }}
      description={description}
      name={name}
    >
      {description}
    </User>
  </Tooltip>
);

export const renderDate = ({ date, isTime = false }: { date: Date | string; isTime?: boolean }) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <div className="flex flex-col">
      <p className="text-nowrap text-small capitalize text-default-foreground">
        {format(dateObj, 'PP')}
      </p>
      {isTime && (
        <p className="text-nowrap text-tiny capitalize text-default-500">{format(dateObj, 'p')}</p>
      )}
    </div>
  );
};

export const renderCountry = (name: string, icon: React.ReactNode) => (
  <div className="flex items-center gap-2">
    <div className="h-[16px] w-[16px]">{icon}</div>
    <p className="text-nowrap text-small text-default-foreground">{name}</p>
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
    <span className="capitalize text-default-800">{item?.split('-').join(' ')}</span>
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
