import { useMemo } from 'react';
import { useSession } from '@/providers/session-provider';
import { addToast, Select, SelectItem } from '@heroui/react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

import { permissions, sidebarContent, useAppointmentButtons } from './data';

import QuickLook from '@/components/ui/dashboard/quicklook';
import { DropdownItemProps } from '@/components/ui/dashboard/quicklook/types';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { useAppointmentStore } from '@/store/appointment';
import CancelDeleteAppointment from '@/components/client/appointments/ui/cancel-delete';
import { AppointmentType, DropdownKeyType } from '@/services/client/appointment';
import { OrganizationUser } from '@/services/common/user';

export function AppointmentQuickLook() {
  const { user } = useSession();
  const { appointment, setAppointment, setAction, action } = useAppointmentStore();

  const buttons = useAppointmentButtons({
    appointment,
    role: user?.role as OrganizationUser['role'],
  });

  const dropdown = useMemo<Array<Partial<DropdownItemProps<DropdownKeyType>>>>(
    () => [
      {
        key: 'invoice',
        children: 'Download Invoice',
        startContent: <Icon icon="solar:file-download-bold-duotone" width="20" />,
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
        isHidden: !appointment?.previousAppointment || appointment?.status !== 'completed',
        startContent: <Icon icon="solar:download-twice-square-bold-duotone" width="20" />,
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
        startContent: <Icon icon="solar:pen-new-square-bold-duotone" width="20" />,
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
          if (appointment) {
            setAction('delete');
          }
        },
        content: <CancelDeleteAppointment type="delete" />,
      },
    ],
    [appointment]
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
      value: () => (appointment.additionalInfo.type === 'online' ? 'Online' : 'In Clinic'),
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
          <Select label="Select Doctor" className="w-full max-w-sm" aria-label="Select Doctor">
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

  if (!appointment) return null;

  return (
    <QuickLook
      selectedItem={appointment}
      isOpen={!!appointment}
      onClose={() => setAppointment(null)}
      selectedKey={action}
      buttons={buttons}
      permissions={permissions}
      dropdown={dropdown}
      sidebarContent={sidebarContent(appointment)}
      content={content(appointment)}
    />
  );
}
