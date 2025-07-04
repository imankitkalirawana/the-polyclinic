import { PermissionProps } from '@/components/ui/dashboard/quicklook/types';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { avatars } from '@/lib/avatar';
import { AppointmentType } from '@/types/appointment';
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
  user: [
    'cancel',
    'reschedule',
    'new-tab',
    'add-to-calendar',
    'invoice',
    'reports',
  ],
  admin: 'all',
  nurse: ['cancel', 'reschedule'],
  receptionist: ['cancel', 'reschedule', 'reminder'],
};

export const content = (appointment: AppointmentType) => [
  {
    label: 'Appointment ID',
    value: () => appointment.aid,
    icon: 'solar:hashtag-circle-bold-duotone',
    classNames: { icon: 'text-purple-500 bg-purple-50' },
  },
  {
    label: 'Appointment Status',
    value: () => renderChip({ item: appointment.status }),
    icon: 'solar:watch-square-minimalistic-bold-duotone',
    classNames: { icon: 'text-purple-500 bg-purple-50', label: 'mb-1' },
  },
  {
    label: 'Email',
    value: () => appointment.patient.email,
    icon: 'solar:letter-bold-duotone',
    classNames: { icon: 'text-blue-500 bg-blue-50' },
  },
  {
    label: 'Phone',
    value: () => appointment.patient.phone || 'N/A',
    icon: 'solar:phone-bold-duotone',
    classNames: { icon: 'text-green-500 bg-green-50' },
  },
  {
    label: 'Date & Time',
    value: () => format(new Date(appointment.date), 'MMM d, yyyy - h:mm a'),
    icon: 'solar:calendar-bold-duotone',
    classNames: { icon: 'text-yellow-500 bg-yellow-50' },
  },
  {
    label: 'Mode',
    value: () =>
      appointment.additionalInfo.type === 'online' ? 'Online' : 'In Clinic',
    icon: 'solar:map-point-bold-duotone',
    classNames: { icon: 'text-teal-500 bg-teal-50' },
  },
  {
    label: 'Doctor',
    value: () =>
      appointment.doctor?.name ? (
        <div className="flex items-center gap-1">
          <span>{appointment.doctor?.name}</span>
        </div>
      ) : (
        'Not Assigned'
      ),
    icon: 'solar:stethoscope-bold-duotone',
    classNames: { icon: 'text-purple-500 bg-purple-50' },
    className: !appointment.doctor?.name ? 'bg-danger-50/50' : '',
    cols: 2,
  },
  ...(appointment.additionalInfo.symptoms
    ? [
        {
          label: 'Symptoms',
          value: () => appointment.additionalInfo.symptoms,
          icon: 'solar:notes-bold-duotone',
          classNames: { icon: 'text-orange-500 bg-orange-50' },
          cols: 2,
        },
      ]
    : []),
  ...(appointment.additionalInfo.notes
    ? [
        {
          label: 'Notes',
          value: () => appointment.additionalInfo.notes,
          icon: 'solar:notes-bold-duotone',
          classNames: { icon: 'text-amber-500 bg-amber-50' },
          cols: 2,
        },
      ]
    : []),
  ...(appointment.additionalInfo.description
    ? [
        {
          label: 'Description',
          value: () => appointment.additionalInfo.description,
          icon: 'solar:document-text-bold-duotone',
          classNames: { icon: 'text-pink-500 bg-pink-50' },
          cols: 2,
        },
      ]
    : []),
];

export const sidebarContent = (appointment: AppointmentType) => (
  <>
    <div className="flex flex-col items-center gap-2 p-4">
      <Avatar
        src={
          appointment.patient.image ||
          avatars.memoji[Math.floor(Math.random() * avatars.memoji.length)]
        }
        size="lg"
      />
      <div className="flex flex-col items-center">
        <h6 className="font-medium capitalize">{appointment.patient.name}</h6>
        <p className="text-small capitalize text-default-500">
          {appointment.patient.gender ? `${appointment.patient.gender},` : ''}
          {appointment.patient.age ? `${appointment.patient.age} Years` : ''}
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
          <div className="flex items-center justify-between gap-4 text-small">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-orange-200 p-[5px] text-orange-400">
                <Icon icon="solar:hashtag-circle-bold" width="24" />
              </div>
              <span className="capitalize text-default-400">UID</span>
            </div>
            <span className="capitalize text-default-foreground">
              {appointment.patient.uid}
            </span>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-divider/20 via-divider to-divider/20"></div>
          <div className="flex items-center justify-between gap-4 text-small">
            <div className="flex items-center gap-2">
              <div className="rounded-medium bg-pink-200 p-[5px] text-pink-400">
                <Icon icon="material-symbols:abc-rounded" width="24" />
              </div>
              <span className="capitalize text-default-400">Name</span>
            </div>
            <span className="capitalize text-default-foreground">
              {appointment.patient.name}
            </span>
          </div>
        </div>
      </Tab>
      <Tab title="Activity" key="activity">
        <ActivityTimeline aid={appointment.aid} schema="appointment" />
      </Tab>
    </Tabs>
  </>
);
