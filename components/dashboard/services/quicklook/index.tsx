import AddToCalendar from '@/components/ui/appointments/add-to-calendar';
import QuickLook from '@/components/ui/dashboard/quicklook';
import { ServiceType } from '@/models/Service';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useServiceStore } from '../store';
import {
  ButtonProps,
  DropdownItemProps,
} from '@/components/ui/dashboard/quicklook/types';
import { useMemo } from 'react';
import { permissions, sidebarContent } from './data';
import { ActionType, DropdownKeyType } from '../types';
import { addToast, Select, SelectItem } from '@heroui/react';
import { renderChip } from '@/components/ui/data-table/cell-renderers';
import { format } from 'date-fns';

export const ServiceQuickLook = () => {
  const { selected, setSelected, setAction, action } = useServiceStore();

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
          const url = `/dashboard/services/${selected?.uniqueId}`;
          window.open(url, '_blank');
        },
      },

      {
        key: 'reminder',
        children: 'Send a Reminder',
        startContent: <Icon icon="solar:bell-bold-duotone" width="20" />,
        isIconOnly: true,
        variant: 'flat',
        position: 'right',
        isHidden:
          selected?.status === 'active' ||
          selected?.status === 'inactive' ||
          selected?.status === 'blocked' ||
          selected?.status === 'deleted',
        onPress: async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          addToast({
            title: 'Reminder Sent',
            description: 'Reminder sent to the patient',
            color: 'success',
          });
        },
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
        key: 'edit',
        children: 'Edit Service',
        startContent: (
          <Icon icon="solar:pen-new-square-bold-duotone" width="20" />
        ),
        onPress: () =>
          addToast({
            title: 'Service Edited',
            description: 'Service edited successfully',
            color: 'success',
          }),
      },
      {
        key: 'delete',
        children: 'Delete Service',
        color: 'danger',
        startContent: <Icon icon="solar:trash-bin-2-bold-duotone" width="20" />,
        onPress: () => {
          if (selected) {
            setAction('delete');
          }
        },
        // content: <CancelDeleteService type="delete" />,
      },
    ],
    [selected]
  );

  const content = (service: ServiceType) => [
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
      label: 'Description',
      value: () => service.description,
      icon: 'solar:letter-bold-duotone',
      classNames: { icon: 'text-blue-500 bg-blue-50' },
    },
    {
      label: 'Duration',
      value: () => service.duration || 'N/A',
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
