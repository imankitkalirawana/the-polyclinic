import AddToCalendar from '@/components/ui/appointments/add-to-calendar';
import QuickLook from '@/components/ui/dashboard/quicklook';
import { EmailType } from '@/models/Email';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEmailStore } from '../store';
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

export const EmailQuickLook = () => {
  const { selected, setSelected, setAction, action } = useEmailStore();

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
          const url = `/dashboard/emails/${selected?._id}`;
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
        children: 'Edit Email',
        startContent: (
          <Icon icon="solar:pen-new-square-bold-duotone" width="20" />
        ),
        onPress: () =>
          addToast({
            title: 'Email Edited',
            description: 'Email edited successfully',
            color: 'success',
          }),
      },
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
      label: 'Email ID',
      value: () => email._id,
      icon: 'solar:hashtag-circle-bold-duotone',
      classNames: { icon: 'text-purple-500 bg-purple-50' },
    },
    {
      label: 'From',
      value: () => email.from,
      icon: 'solar:letter-bold-duotone',
      classNames: { icon: 'text-blue-500 bg-blue-50' },
    },
    {
      label: 'To',
      value: () => email.to,
      icon: 'solar:letter-bold-duotone',
      classNames: { icon: 'text-blue-500 bg-blue-50' },
    },
    {
      label: 'Subject',
      value: () => email.subject || 'N/A',
      icon: 'solar:phone-bold-duotone',
      classNames: { icon: 'text-green-500 bg-green-50' },
    },
    {
      label: 'Mode',
      value: () => (email.status === 'active' ? 'Online' : 'Offline'),
      icon: 'solar:map-point-bold-duotone',
      classNames: { icon: 'text-teal-500 bg-teal-50' },
    },
    {
      label: 'Message',
      value: () => email.message || 'N/A',
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
