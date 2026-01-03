import { useMemo } from 'react';
import { addToast } from '@heroui/react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useDrugStore } from '../store';
import { ActionType, DropdownKeyType } from '../types';
import { permissions, sidebarContent } from './data';

import QuickLook from '@/components/ui/dashboard/quicklook';
import { ButtonProps, DropdownItemProps } from '@/components/ui/dashboard/quicklook/types';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import { DrugType } from '@/services/client/drug/drug.types';

export function DrugQuickLook() {
  const { selected, setSelected, setAction, action } = useDrugStore();

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
          const url = `/dashboard/drugs/${selected?.did}`;
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
          selected?.status === 'available' ||
          selected?.status === 'unavailable' ||
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
        startContent: <Icon icon="solar:file-download-bold-duotone" width="20" />,
        onPress: () =>
          addToast({
            title: 'Invoice Downloaded',
            description: 'Invoice downloaded successfully',
            color: 'success',
          }),
      },

      {
        key: 'edit',
        children: 'Edit Drug',
        startContent: <Icon icon="solar:pen-new-square-bold-duotone" width="20" />,
        onPress: () =>
          addToast({
            title: 'Drug Edited',
            description: 'Drug edited successfully',
            color: 'success',
          }),
      },
      {
        key: 'delete',
        children: 'Delete Drug',
        color: 'danger',
        startContent: <Icon icon="solar:trash-bin-2-bold-duotone" width="20" />,
        onPress: () => {
          if (selected) {
            setAction('delete');
          }
        },
        // content: <CancelDeleteDrug type="delete" />,
      },
    ],
    [selected]
  );

  const content = (drug: DrugType) => [
    {
      label: 'Drug ID',
      value: () => drug.did,
      icon: 'solar:hashtag-circle-bold-duotone',
      classNames: { icon: 'text-purple-500 bg-purple-50' },
    },
    {
      label: 'Drug Status',
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
}
