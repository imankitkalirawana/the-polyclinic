import { PermissionProps } from '@/components/ui/dashboard/quicklook/types';

import { ActionType, DropdownKeyType } from '../types';

export const permissions: PermissionProps<ActionType, DropdownKeyType> = {
  doctor: [
    'cancel',
    'reschedule',
    'reminder',
    'new-tab',
    'add-to-calendar',
    'invoice',
    'reports',
  ],
  admin: 'all',
  nurse: ['cancel', 'reschedule'],
  receptionist: ['cancel', 'reschedule', 'reminder'],
};
