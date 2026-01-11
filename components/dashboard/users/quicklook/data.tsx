import React from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { ActionType, DropdownKeyType } from '../types';

import { PermissionProps } from '@/components/ui/dashboard/quicklook/types';
import { UserType } from '@/services/common/user/user.types';
import { RenderUser } from '@/components/ui/static-data-table/cell-renderers';

export const permissions: PermissionProps<ActionType, DropdownKeyType> = {
  DOCTOR: ['cancel', 'reschedule', 'reminder', 'new-tab', 'add-to-calendar', 'invoice', 'reports'],
  PATIENT: ['cancel', 'reschedule', 'new-tab', 'add-to-calendar', 'invoice', 'reports'],
  ADMIN: 'all',
  NURSE: ['cancel', 'reschedule'],
  RECEPTIONIST: ['cancel', 'reschedule', 'reminder'],
};
export const sidebarContent = (user: UserType) => (
  <>
    <div className="flex flex-col items-center gap-2 p-4">
      <RenderUser name={user.name} description={user.email} size="xl" />
      <div className="flex gap-1">
        <Button
          color="primary"
          variant="flat"
          startContent={<Icon icon="solar:phone-bold-duotone" width="20" />}
          size="sm"
        >
          Call
        </Button>
        <Button
          size="sm"
          variant="bordered"
          startContent={<Icon icon="solar:chat-round-line-bold-duotone" width="20" />}
        >
          Message
        </Button>
        <Dropdown placement="bottom-end" aria-label="Patient actions">
          <DropdownTrigger>
            <Button size="sm" variant="bordered" isIconOnly>
              <Icon icon="solar:menu-dots-bold" width="20" className="rotate-90" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="edit">Edit</DropdownItem>
            <DropdownItem color="danger" className="text-danger-500" key="delete">
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  </>
);
