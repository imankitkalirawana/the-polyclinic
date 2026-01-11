import { useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useServiceStore } from '../store';
import { ActionType, DropdownKeyType } from '../types';
import { permissions } from './data';

import QuickLook from '@/components/ui/dashboard/quicklook';
import { ButtonProps, DropdownItemProps } from '@/components/ui/dashboard/quicklook/types';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import { ServiceStatus, ServiceType } from '@/services/client/service/service.types';

export function ServiceQuickLook() {
  const { selected, setSelected, setAction, action } = useServiceStore();

  const buttons: Array<Partial<ButtonProps<ActionType>>> = useMemo(
    () => [
      {
        key: 'new-tab',
        children: 'Open in new tab',
        startContent: <Icon icon="solar:arrow-right-up-line-duotone" width="20" />,
        color: 'default',
        variant: 'flat',
        position: 'left',
        isIconOnly: true,
        onPress: () => {
          const url = `/dashboard/services/${selected?.uniqueId}`;
          window.open(url, '_blank');
        },
      },
    ],
    [selected]
  );

  const dropdown = useMemo<Array<Partial<DropdownItemProps<DropdownKeyType>>>>(
    () => [
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
      label: 'Service Name',
      value: () => service.name,
      icon: 'hugeicons:service',
      classNames: { icon: 'text-blue-500 bg-blue-50' },
    },
    {
      label: 'Price',
      value: () => service.price || 'N/A',
      icon: 'solar:tag-price-bold',
      classNames: { icon: 'text-orange-500 bg-orange-50' },
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
      value: () => (service.status === ServiceStatus.ACTIVE ? 'Online' : 'Offline'),
      icon: 'solar:map-point-bold-duotone',
      classNames: { icon: 'text-teal-500 bg-teal-50' },
    },
    {
      label: 'Type',
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
      content={content(selected)}
    />
  );
}
