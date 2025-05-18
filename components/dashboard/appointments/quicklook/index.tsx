import AddToCalendar from '@/components/ui/appointments/add-to-calendar';
import QuickLook from '@/components/ui/dashboard/quicklook';
import { AppointmentType } from '@/models/Appointment';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAppointmentStore } from '../store';
import {
  ButtonProps,
  DropdownItemProps,
} from '@/components/ui/dashboard/quicklook/types';
import { useMemo } from 'react';
import { content, permissions, sidebarContent } from './data';
import { ActionType, DropdownKeyType } from '../types';
import { addToast } from '@heroui/react';
import CancelDeleteAppointment from '../modals/cancel-delete';
import RescheduleAppointment from '../modals/reschedule';

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
