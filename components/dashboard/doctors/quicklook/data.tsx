import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tabs,
} from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { ActionType, DropdownKeyType } from '../types';

import { PermissionProps } from '@/components/ui/dashboard/quicklook/types';
import { DoctorType } from '@/services/client/doctor';
import Avatar from 'boring-avatars';

export const permissions: PermissionProps<ActionType, DropdownKeyType> = {
  DOCTOR: ['cancel', 'reschedule', 'reminder', 'new-tab', 'add-to-calendar', 'invoice', 'reports'],
  PATIENT: ['cancel', 'reschedule', 'new-tab', 'add-to-calendar', 'invoice', 'reports'],
  ADMIN: 'all',
  NURSE: ['cancel', 'reschedule'],
  RECEPTIONIST: ['cancel', 'reschedule', 'reminder'],
};
export const sidebarContent = (doctor: DoctorType) => (
  <>
    <div className="flex flex-col items-center gap-2 p-4">
      <Avatar name={doctor.name} variant="beam" size={40} />
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
          <div className="text-small flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-orange-200 p-[5px] text-orange-400">
                <Icon icon="solar:hashtag-circle-bold" width="24" />
              </div>
              <span className="text-default-400 capitalize">ID</span>
            </div>
            <span className="text-default-foreground capitalize">{doctor.id}</span>
          </div>
          <div className="from-divider/20 via-divider to-divider/20 h-px w-full bg-linear-to-r" />
          <div className="text-small flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-pink-200 p-[5px] text-pink-400">
                <Icon icon="material-symbols:abc-rounded" width="24" />
              </div>
              <span className="text-default-400 capitalize">Name</span>
            </div>
            <span className="text-default-foreground capitalize">{doctor.name}</span>
          </div>
          <div className="from-divider/20 via-divider to-divider/20 h-px w-full bg-linear-to-r" />
          <div className="text-small flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-blue-200 p-[5px] text-blue-400">
                <Icon icon="uim:calender" width="24" height="24" />
              </div>
              <span className="text-default-400 capitalize">Designation</span>
            </div>
            <span className="text-default-foreground">{doctor.designation}</span>
          </div>
        </div>
      </Tab>
      {/* <Tab title="Activity" key="activity">
        <ActivityTimeline aid={doctor.id} schema="doctor" />
      </Tab> */}
    </Tabs>
  </>
);
