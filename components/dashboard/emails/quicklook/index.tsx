import { useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { useEmailStore } from '../store';
import { ActionType, DropdownKeyType } from '../types';
import { permissions } from './data';

import QuickLook from '@/components/ui/dashboard/quicklook';
import { ButtonProps, DropdownItemProps } from '@/components/ui/dashboard/quicklook/types';
import { EmailType } from '@/services/client/email/email.types';

export function EmailQuickLook() {
  const { selected, setSelected, setAction, action } = useEmailStore();

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
          const url = `/dashboard/emails/${selected?._id}`;
          window.open(url, '_blank');
        },
      },
      {
        key: 'resend',
        children: 'Resend Email',
        startContent: <Icon icon="mdi:email-resend" width="24" height="24" />,
        color: 'warning',
        variant: 'flat',
        position: 'right',
        onPress: () => {
          if (selected) {
            setAction('resend');
          }
        },
      },
    ],
    [selected]
  );

  const dropdown = useMemo<Array<Partial<DropdownItemProps<DropdownKeyType>>>>(
    () => [
      {
        key: 'delete',
        children: 'Delete Email',
        color: 'danger',
        startContent: <Icon icon="solar:trash-bin-2-bold-duotone" width="20" />,
        onPress: () => {
          if (selected) {
            setAction('delete');
          }
        },

        // content: <CancelDeleteEmail type="delete" />,
      },
    ],
    [selected]
  );

  const content = (email: EmailType) => [
    {
      label: 'From',
      value: () => email.from,
      icon: 'solar:letter-bold-duotone',
      classNames: { icon: 'text-blue-500 bg-blue-50', value: 'lowercase' },
    },
    {
      label: 'To',
      value: () => email.to,
      icon: 'solar:letter-bold-duotone',
      classNames: { icon: 'text-blue-500 bg-blue-50', value: 'lowercase' },
    },
    {
      label: 'Subject',
      value: () => email.subject || 'N/A',
      icon: 'solar:phone-bold-duotone',
      classNames: { icon: 'text-green-500 bg-green-50' },
      className: ' col-span-full',
    },
    {
      label: 'Message',
      value: () => email.message || 'N/A',
      icon: 'solar:map-point-bold-duotone',
      classNames: { icon: 'text-teal-500 bg-teal-50' },
      className: ' col-span-full',
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
