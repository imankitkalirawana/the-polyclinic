import { ActionType, DropdownKeyType } from '../types';

import { PermissionProps } from '@/components/ui/dashboard/quicklook/types';

export const permissions: PermissionProps<ActionType, DropdownKeyType> = {
  DOCTOR: ['cancel', 'reschedule', 'reminder', 'new-tab', 'add-to-calendar', 'invoice', 'reports'],
  ADMIN: 'all',
  NURSE: ['cancel', 'reschedule'],
  RECEPTIONIST: ['cancel', 'reschedule', 'reminder'],
};
