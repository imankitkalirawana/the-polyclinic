import AddToCalendar from '@/components/ui/appointments/add-to-calendar';
import RescheduleModal from '@/components/ui/appointments/reschedule-modal';
import QuickLook from '@/components/ui/dashboard/quicklook';
import { AppointmentType } from '@/models/Appointment';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAppointmentStore } from '../store';
import { ButtonProps } from '@/components/ui/dashboard/quicklook/types';
import { useMemo } from 'react';
import { content, dropdown, permissions, sidebarContent } from './data';
import CancelModal from '@/components/ui/appointments/cancel-modal';
import { ActionType } from '../types';
import Modal from '@/components/ui/modal';
import { addToast } from '@heroui/react';

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
        onPress: () => {
          if (selected) {
            setAction('cancel');
          }
        },
        content: <CancelModal type="cancel" />,
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
        onPress: () => {
          if (selected) {
            setAction('reschedule');
          }
        },
        content: (
          <Modal
            header="Reschedule Appointment"
            body={<>Hello</>}
            onClose={() => setAction(null)}
          />
        ),
      },
    ],
    []
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
