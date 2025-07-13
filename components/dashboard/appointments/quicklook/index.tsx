import AddToCalendar from '@/components/ui/appointments/add-to-calendar';
import QuickLook from '@/components/ui/dashboard/quicklook';
import { AppointmentType } from '@/types/appointment';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAppointmentStore } from '../store';
import {
  ButtonProps,
  DropdownItemProps,
} from '@/components/ui/dashboard/quicklook/types';
import { useMemo } from 'react';
import { permissions, sidebarContent } from './data';
import { ActionType, DropdownKeyType } from '../types';
import { addToast, Select, SelectItem } from '@heroui/react';
import CancelDeleteAppointment from '../modals/cancel-delete';
import RescheduleAppointment from '../modals/reschedule';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { format } from 'date-fns';

export const AppointmentQuickLook = () => {
  const { selected, setSelected, setAction, action } = useAppointmentStore();

  const buttons: Array<Partial<ButtonProps<ActionType>>> = useMemo(
    () => [
      {
        key: 'new-tab',
        children: 'Open in new tab',
        startContent: (
          <Icon icon="solar:arrow-right-up-line-duotone" width="20" />
        ),
        color: 'default',
        variant: 'flat',
        position: 'left',
        isIconOnly: true,
        onPress: () => {
          const url = `/dashboard/appointments/${selected?.aid}`;
          window.open(url, '_blank');
        },
      },
      {
        key: 'add-to-calendar',
        children: 'Add to Calendar',
        startContent: (
          <Icon icon="solar:calendar-add-bold-duotone" width="20" />
        ),
        isHidden:
          selected?.status === 'cancelled' ||
          selected?.status === 'completed' ||
          selected?.status === 'overdue',
        color: 'default',
        variant: 'flat',
        position: 'left',
        onPress: () => {
          if (selected) {
            setAction('add-to-calendar');
          }
        },
        content: (
          <AddToCalendar
            appointment={selected as AppointmentType}
            onClose={() => setAction(null)}
          />
        ),
      },
      {
        key: 'cancel',
        children: 'Cancel Appointment',
        startContent: (
          <Icon icon="solar:close-circle-bold-duotone" width="20" />
        ),
        isIconOnly: true,
        color: 'danger',
        variant: 'flat',
        position: 'right',
        isHidden:
          selected?.status === 'cancelled' || selected?.status === 'completed',
        onPress: () => {
          if (selected) {
            setAction('cancel');
          }
        },
        content: <CancelDeleteAppointment type="cancel" />,
      },
      {
        key: 'reminder',
        children: 'Send a Reminder',
        startContent: <Icon icon="solar:bell-bold-duotone" width="20" />,
        isIconOnly: true,
        variant: 'flat',
        position: 'right',
        isHidden:
          selected?.status === 'completed' ||
          selected?.status === 'cancelled' ||
          selected?.status === 'overdue',
        onPress: async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          addToast({
            title: 'Reminder Sent',
            description: 'Reminder sent to the patient',
            color: 'success',
          });
        },
      },
      {
        key: 'reschedule',
        children: 'Reschedule',
        startContent: <Icon icon="solar:calendar-bold-duotone" width="20" />,
        color: 'warning',
        variant: 'flat',
        position: 'right',
        isHidden: selected?.status === 'completed',
        onPress: () => {
          if (selected) {
            setAction('reschedule');
          }
        },
        content: <RescheduleAppointment />,
      },
    ],
    [selected]
  );

  const dropdown = useMemo<Array<Partial<DropdownItemProps<DropdownKeyType>>>>(
    () => [
      {
        key: 'invoice',
        children: 'Download Invoice',
        startContent: (
          <Icon icon="solar:file-download-bold-duotone" width="20" />
        ),
        onPress: () =>
          addToast({
            title: 'Invoice Downloaded',
            description: 'Invoice downloaded successfully',
            color: 'success',
          }),
      },
      {
        key: 'reports',
        children: 'Download Reports',
        // hide if there are no previous appointments or if the appointment is not completed
        isHidden:
          !selected?.previousAppointment || selected?.status !== 'completed',
        startContent: (
          <Icon icon="solar:download-twice-square-bold-duotone" width="20" />
        ),
        onPress: () =>
          addToast({
            title: 'Reports Downloaded',
            description: 'Reports downloaded successfully',
            color: 'success',
          }),
      },
      {
        key: 'edit',
        children: 'Edit Appointment',
        startContent: (
          <Icon icon="solar:pen-new-square-bold-duotone" width="20" />
        ),
        onPress: () =>
          addToast({
            title: 'Appointment Edited',
            description: 'Appointment edited successfully',
            color: 'success',
          }),
      },
      {
        key: 'delete',
        children: 'Delete Appointment',
        color: 'danger',
        startContent: <Icon icon="solar:trash-bin-2-bold-duotone" width="20" />,
        onPress: () => {
          if (selected) {
            setAction('delete');
          }
        },
        content: <CancelDeleteAppointment type="delete" />,
      },
    ],
    [selected]
  );

  const content = (appointment: AppointmentType) => [
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
          <Select
            label="Select Doctor"
            className="w-full max-w-sm"
            aria-label="Select Doctor"
          >
            <SelectItem key="not-assigned">Not Assigned</SelectItem>
          </Select>
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

  if (!selected) return null;

  return (
    <QuickLook
      selectedItem={selected}
      isOpen={!!selected}
      onClose={() => setSelected(null)}
      selectedKey={action}
      buttons={buttons}
      permissions={permissions}
      dropdown={dropdown}
      sidebarContent={sidebarContent(selected)}
      content={content(selected)}
    />
  );
};
