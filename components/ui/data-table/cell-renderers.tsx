'use client';

import type React from 'react';
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
  User,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { UserRole, UserStatus } from '@/models/User';

import { CopyText } from '@/components/ui/copy';
import { format } from 'date-fns';
import { ServiceStatus, ServiceTypes } from '@/models/Service';
import { DrugStatus } from '@/models/Drug';
import { AppointmentStatus, AppointmentType } from '@/models/Appointment';

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

export const renderDate = ({
  date,
  isTime = false,
}: {
  date: Date | string;
  isTime?: boolean;
}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return (
    <div className="flex flex-col">
      <p className="text-nowrap text-small capitalize text-default-foreground">
        {format(dateObj, 'PP')}
      </p>
      {isTime && (
        <p className="text-nowrap text-xs capitalize text-default-500">
          {format(dateObj, 'p')}
        </p>
      )}
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

type ChipColorType =
  | UserRole
  | UserStatus
  | ServiceStatus
  | ServiceTypes
  | DrugStatus
  | AppointmentStatus;

const chipColorMap: Record<ChipColorType, string> = {
  // for status
  active: 'bg-green-500',
  inactive: 'bg-gray-500',
  blocked: 'bg-pink-500',
  deleted: 'bg-red-500',
  unverified: 'bg-yellow-500',
  available: 'bg-green-500',
  unavailable: 'bg-red-500',

  // for roles
  admin: 'bg-red-500',
  doctor: 'bg-blue-500',
  nurse: 'bg-amber-500',
  receptionist: 'bg-yellow-500',
  pharmacist: 'bg-purple-500',
  laboratorist: 'bg-teal-500',
  user: 'bg-gray-500',
  //for appointment types
  overdue: 'bg-red-500',
  completed: 'bg-green-500',
  cancelled: 'bg-gray-200',
  'on-hold': 'bg-gray-500',
  booked: 'bg-blue-500',
  confirmed: 'bg-green-500',
  'in-progress': 'bg-amber-500',
  // for service types
  medical: 'bg-red-500',
  surgical: 'bg-blue-500',
  diagnostic: 'bg-green-500',
  consultation: 'bg-yellow-500',
};

export const renderChip = ({ item }: { item: ChipColorType }) => {
  return (
    <div className="flex w-fit items-center gap-[2px] rounded-lg bg-default-100 px-2 py-1">
      <span
        className={cn('size-2 rounded-full bg-default-500', chipColorMap[item])}
      ></span>
      <span className="px-1 capitalize text-default-800">
        {item.split('-').join(' ')}
      </span>
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
}) => {
  return (
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
                  navigator.clipboard.writeText(url + '/' + key);
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
              startContent={
                <Icon icon="solar:pen-new-square-bold-duotone" width={24} />
              }
              onClick={onEdit}
            >
              Edit file
            </DropdownItem>
          ) : null}
        </DropdownSection>
        <DropdownSection title="Danger zone">
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            description="Permanently delete the item"
            shortcut="⌘⇧D"
            startContent={
              <Icon
                icon="solar:trash-bin-minimalistic-bold-duotone"
                width={24}
              />
            }
            onClick={onDelete}
          >
            Delete item
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};
