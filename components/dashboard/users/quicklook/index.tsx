import React, { useMemo } from 'react';
import { addToast } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useUserStore } from '../store';
import { ActionType, DropdownKeyType } from '../types';
import { permissions, sidebarContent } from './data';

import QuickLook from '@/components/ui/dashboard/quicklook';
import { ButtonProps, DropdownItemProps } from '@/components/ui/dashboard/quicklook/types';
import { renderChip } from '@/components/ui/static-data-table/cell-renderers';
import { UserType } from '@/services/common/user/user.types';
import { UserStatus } from '@/services/common/user/user.constants';

export function UserQuickLook() {
  const { selected, setSelected, setAction, action } = useUserStore();

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

      {
        key: 'reminder',
        children: 'Send a Reminder',
        startContent: <Icon icon="solar:bell-bold-duotone" width="20" />,
        isIconOnly: true,
        variant: 'flat',
        position: 'right',
        isHidden:
          selected?.status === UserStatus.ACTIVE ||
          selected?.status === UserStatus.INACTIVE ||
          selected?.status === UserStatus.BLOCKED,
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

  const content = (user: UserType) => [
    {
      label: 'User ID',
      value: () => user.id,
      icon: 'solar:hashtag-circle-bold-duotone',
      classNames: { icon: 'text-purple-500 bg-purple-50' },
    },
    {
      label: 'User Status',
      value: () => renderChip({ item: user.status }),
      icon: 'solar:watch-square-minimalistic-bold-duotone',
      classNames: { icon: 'text-purple-500 bg-purple-50', label: 'mb-1' },
    },
    {
      label: 'Email',
      value: () => user.email.toLowerCase(),
      icon: 'solar:letter-bold-duotone',
      classNames: { icon: 'text-blue-500 bg-blue-50', value: 'lowercase' },
    },
    {
      label: 'Phone',
      value: () => user.phone || 'N/A',
      icon: 'solar:phone-bold-duotone',
      classNames: { icon: 'text-green-500 bg-green-50' },
    },
    {
      label: 'Role',
      value: () => renderChip({ item: user.role }),
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
}
