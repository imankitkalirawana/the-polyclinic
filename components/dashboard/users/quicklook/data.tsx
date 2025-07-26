import React from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tabs,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import ActivityTimeline from '../../../ui/activity/timeline';
import { ActionType, DropdownKeyType } from '../types';

import { PermissionProps } from '@/components/ui/dashboard/quicklook/types';
import { avatars } from '@/lib/avatar';
import { UserType } from '@/types/user';

export const permissions: PermissionProps<ActionType, DropdownKeyType> = {
  doctor: ['cancel', 'reschedule', 'reminder', 'new-tab', 'add-to-calendar', 'invoice', 'reports'],
  user: ['cancel', 'reschedule', 'new-tab', 'add-to-calendar', 'invoice', 'reports'],
  admin: 'all',
  nurse: ['cancel', 'reschedule'],
  receptionist: ['cancel', 'reschedule', 'reminder'],
};
export const sidebarContent = (user: UserType) => (
  <>
    <div className="flex flex-col items-center gap-2 p-4">
      <Avatar
        src={user.image || avatars.memoji[Math.floor(Math.random() * avatars.memoji.length)]}
        size="lg"
      />
      <div className="flex flex-col items-center">
        <h6 className="font-medium capitalize">{user.name}</h6>
        <p className="text-small capitalize text-default-500">
          {user.gender ? `${user.gender}` : ''}
        </p>
      </div>
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
    <Tabs size="sm" className="flex flex-col gap-2 p-4">
      <Tab title="Patient Details" key="patient-details">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4 text-small">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-orange-200 p-[5px] text-orange-400">
                <Icon icon="solar:hashtag-circle-bold" width="24" />
              </div>
              <span className="capitalize text-default-400">UID</span>
            </div>
            <span className="capitalize text-default-foreground">{user.uid}</span>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20" />
          <div className="flex items-center justify-between gap-4 text-small">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-pink-200 p-[5px] text-pink-400">
                <Icon icon="material-symbols:abc-rounded" width="24" />
              </div>
              <span className="capitalize text-default-400">Name</span>
            </div>
            <span className="capitalize text-default-foreground">{user.name}</span>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20" />
          <div className="flex items-center justify-between gap-4 text-small">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-blue-200 p-[5px] text-blue-400">
                <Icon icon="uim:calender" width="24" height="24" />
              </div>
              <span className="capitalize text-default-400">Date of Birth</span>
            </div>
            <span className="text-default-foreground">{user.dob}</span>
          </div>
        </div>
      </Tab>
      <Tab title="Activity" key="activity">
        <ActivityTimeline aid={user.uid} schema="user" />
      </Tab>
    </Tabs>
  </>
);
