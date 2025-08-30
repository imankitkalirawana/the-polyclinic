import { basePermissions } from './base';
import { organizationPermissions } from './organization';
import { userPermissions } from '@/services/common/user';
import { appointmentPermissions } from '@/services/client/appointment';
import { PermissionConfig } from './types';

export const permissionsConfig: PermissionConfig = {
  ...basePermissions,
  ...organizationPermissions,
  ...userPermissions,
  ...appointmentPermissions,
};
