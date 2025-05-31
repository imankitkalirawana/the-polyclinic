import { PermissionProps } from '@/components/ui/dashboard/quicklook/types';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { avatars } from '@/lib/avatar';
import { ServiceType } from '@/models/Service';
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
import { format } from 'date-fns';
import { ActionType, DropdownKeyType } from '../types';
import ActivityTimeline from '../../../ui/activity/timeline';

export const permissions: PermissionProps<ActionType, DropdownKeyType> = {
  doctor: [
    'cancel',
    'reschedule',
    'reminder',
    'new-tab',
    'add-to-calendar',
    'invoice',
    'reports',
  ],
  admin: 'all',
  nurse: ['cancel', 'reschedule'],
  receptionist: ['cancel', 'reschedule', 'reminder'],
};

export const content = (service: ServiceType) => [
  {
    label: 'Service ID',
    value: () => service.uniqueId,
    icon: 'solar:hashtag-circle-bold-duotone',
    classNames: { icon: 'text-purple-500 bg-purple-50' },
  },
  {
    label: 'Service Status',
    value: () => renderChip({ item: service.status }),
    icon: 'solar:watch-square-minimalistic-bold-duotone',
    classNames: { icon: 'text-purple-500 bg-purple-50', label: 'mb-1' },
  },
  {
    label: 'Name',
    value: () => service.name,
    icon: 'solar:letter-bold-duotone',
    classNames: { icon: 'text-blue-500 bg-blue-50' },
  },
  {
    label: 'Duration',
    value: () => service.duration,
    icon: 'solar:letter-bold-duotone',
    classNames: { icon: 'text-blue-500 bg-blue-50' },
  },
  {
    label: 'Description',
    value: () => service.description || 'N/A',
    icon: 'solar:phone-bold-duotone',
    classNames: { icon: 'text-green-500 bg-green-50' },
  },
  {
    label: 'Mode',
    value: () => (service.status === 'active' ? 'Online' : 'Offline'),
    icon: 'solar:map-point-bold-duotone',
    classNames: { icon: 'text-teal-500 bg-teal-50' },
  },
  {
    label: 'Address',
    value: () => service.type || 'N/A',
    icon: 'solar:map-point-bold-duotone',
    classNames: { icon: 'text-teal-500 bg-teal-50' },
  },
];

export const sidebarContent = (service: ServiceType) => (
  <>
    <div className="flex flex-col items-center gap-2 p-4">
      <Avatar
        src={
          service.image ||
          avatars.memoji[Math.floor(Math.random() * avatars.memoji.length)]
        }
        size="lg"
      />
      <div className="flex flex-col items-center">
        <h6 className="font-medium capitalize">{service.name}</h6>
        <p className="text-sm capitalize text-default-500">
          {service.price ? `${service.price},` : ''}
          {service.createdAt ? `${service.createdAt} Years` : ''}
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
          startContent={
            <Icon icon="solar:chat-round-line-bold-duotone" width="20" />
          }
        >
          Message
        </Button>
        <Dropdown placement="bottom-end" aria-label="Patient actions">
          <DropdownTrigger>
            <Button size="sm" variant="bordered" isIconOnly>
              <Icon
                icon="solar:menu-dots-bold"
                width="20"
                className="rotate-90"
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="edit">Edit</DropdownItem>
            <DropdownItem
              color="danger"
              className="text-danger-500"
              key="delete"
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <Tabs size="sm" className="flex flex-col gap-2 p-4">
      <Tab title="Patient Details" key="patient-details">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-orange-200 p-[5px] text-orange-400">
                <Icon icon="solar:hashtag-circle-bold" width="24" />
              </div>
              <span className="capitalize text-default-400">UID</span>
            </div>
            <span className="capitalize text-default-foreground">
              {service.uniqueId}
            </span>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-pink-200 p-[5px] text-pink-400">
                <Icon icon="material-symbols:abc-rounded" width="24" />
              </div>
              <span className="capitalize text-default-400">Name</span>
            </div>
            <span className="capitalize text-default-foreground">
              {service.name}
            </span>
          </div>
        </div>
      </Tab>
    </Tabs>
  </>
);
