import AddToCalendar from '@/components/ui/appointments/add-to-calendar';
import RescheduleModal from '@/components/ui/appointments/reschedule-modal';
import QuickLook from '@/components/ui/dashboard/quicklook';
import { AppointmentType } from '@/models/Appointment';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAppointmentStore } from '../store';
import {
  ActionType,
  ButtonProps,
} from '@/components/ui/dashboard/quicklook/types';
import { useMemo } from 'react';
import { content, dropdown, permissions, sidebarContent } from './data';

export const AppointmentQuickLook = () => {
  const { selected, setSelected, setAction, action } = useAppointmentStore();

  const buttons: ButtonProps[] = useMemo(
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
      },
      {
        key: 'add-to-calendar',
        children: 'Add to Calendar',
        startContent: <Icon icon="solar:calendar-bold-duotone" width="20" />,
        color: 'warning',
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
            onClose={() => setSelected(null)}
          />
        ),
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
        content: <RescheduleModal />,
      },
    ],
    []
  );

  return (
    <QuickLook
      selectedItem={selected}
      isOpen={!!selected}
      onClose={() => setSelected(null)}
      selectedKey={action as ActionType | null}
      buttons={buttons}
      permissions={permissions}
      dropdown={dropdown}
      sidebarContent={sidebarContent(selected as AppointmentType)}
      content={content(selected as AppointmentType)}
    />
  );
};
