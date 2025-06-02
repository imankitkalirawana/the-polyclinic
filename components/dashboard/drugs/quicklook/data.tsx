import { PermissionProps } from '@/components/ui/dashboard/quicklook/types';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { avatars } from '@/lib/avatar';
import { DrugType } from '@/models/Drug';
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

export const content = (drug: DrugType) => [
  {
    label: 'drug ID',
    value: () => drug.did,
    icon: 'solar:hashtag-circle-bold-duotone',
    classNames: { icon: 'text-purple-500 bg-purple-50' },
  },
  {
    label: 'drug Status',
    value: () => renderChip({ item: drug.status }),
    icon: 'solar:watch-square-minimalistic-bold-duotone',
    classNames: { icon: 'text-purple-500 bg-purple-50', label: 'mb-1' },
  },
  {
    label: 'Brand Name',
    value: () => drug.brandName,
    icon: 'solar:letter-bold-duotone',
    classNames: { icon: 'text-blue-500 bg-blue-50' },
  },
  {
    label: 'Generic Name',
    value: () => drug.genericName,
    icon: 'solar:phone-bold-duotone',
    classNames: { icon: 'text-green-500 bg-green-50' },
  },
  {
    label: 'Dosage',
    value: () => drug.dosage || 'N/A',
    icon: 'solar:pill-bold-duotone',
    classNames: { icon: 'text-yellow-500 bg-yellow-50' },
  },
  {
    label: 'Form',
    value: () => drug.form || 'N/A',
    icon: 'solar:pill-bold-duotone',
    classNames: { icon: 'text-yellow-500 bg-yellow-50' },
  },
  {
    label: 'Strength',
    value: () => (drug.strength ? `${drug.strength} mg` : 'N/A'),
    icon: 'solar:pill-bold-duotone',
    classNames: { icon: 'text-yellow-500 bg-yellow-50' },
  },
  {
    label: 'Price',
    value: () => `$${drug.price?.toFixed(2) || '0.00'}`,
    icon: 'solar:money-bag-bold-duotone',
    classNames: { icon: 'text-green-500 bg-green-50' },
  },
  {
    label: 'Quantity',
    value: () => drug.quantity || 0,
    icon: 'solar:basket-bold-duotone',
    classNames: { icon: 'text-orange-500 bg-orange-50' },
  },
  {
    label: 'Created At',
    value: () => format(new Date(drug.createdAt), 'dd MMM yyyy'),
    icon: 'solar:calendar-bold-duotone',
    classNames: { icon: 'text-gray-500 bg-gray-50' },
  },
];

export const sidebarContent = (drug: DrugType) => (
  <>
    <div className="flex flex-col items-center gap-2 p-4">
      <div className="flex flex-col items-center">
        <h6 className="font-medium capitalize">{drug.brandName}</h6>
        <p className="text-sm capitalize text-default-500">
          {drug.manufacturer ? `${drug.manufacturer}` : ''}
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
              {drug.did}
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
              {drug.brandName}
            </span>
          </div>
        </div>
      </Tab>
      <Tab title="Activity" key="activity">
        <ActivityTimeline aid={drug.did} schema="drug" />
      </Tab>
    </Tabs>
  </>
);
