import { useMemo } from 'react';
import { addToast } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useDoctorStore } from '../store';
import { ActionType, DropdownKeyType } from '../types';
import { permissions, sidebarContent } from './data';

import QuickLook from '@/components/ui/dashboard/quicklook';
import { ButtonProps, DropdownItemProps } from '@/components/ui/dashboard/quicklook/types';
import { DoctorType } from '@/services/client/doctor';

export function UserQuickLook() {
  const { selected, setSelected, setAction, action } = useDoctorStore();

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
          const url = `/dashboard/users/${selected?.id}`;
          window.open(url, '_blank');
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
        children: 'Edit User',
        startContent: <Icon icon="solar:pen-new-square-bold-duotone" width="20" />,
        onPress: () =>
          addToast({
            title: 'User Edited',
            description: 'User edited successfully',
            color: 'success',
          }),
      },
      {
        key: 'delete',
        children: 'Delete User',
        color: 'danger',
        startContent: <Icon icon="solar:trash-bin-2-bold-duotone" width="20" />,
        onPress: () => {
          if (selected) {
            setAction('delete');
          }
        },
        // content: <CancelDeleteUser type="delete" />,
      },
    ],
    [selected]
  );

  const content = (doctor: DoctorType) => [
    {
      label: 'User ID',
      value: () => doctor.id,
      icon: 'solar:hashtag-circle-bold-duotone',
      classNames: { icon: 'text-purple-500 bg-purple-50' },
    },
    {
      label: 'Designation',
      value: () => doctor.designation,
      icon: 'solar:watch-square-minimalistic-bold-duotone',
      classNames: { icon: 'text-purple-500 bg-purple-50', label: 'mb-1' },
    },
    {
      label: 'Email',
      value: () => doctor.email.toLowerCase(),
      icon: 'solar:letter-bold-duotone',
      classNames: { icon: 'text-blue-500 bg-blue-50', value: 'lowercase' },
    },
    {
      label: 'Phone',
      value: () => doctor.phone || 'N/A',
      icon: 'solar:phone-bold-duotone',
      classNames: { icon: 'text-green-500 bg-green-50' },
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
