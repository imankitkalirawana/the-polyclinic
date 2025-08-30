import { basePermissions } from './base';
import { organizationPermissions } from '../../../services/organization/permission';
import { userPermissions } from '@/services/common/user';
import { appointmentPermissions } from '@/services/client/appointment';
import { PermissionConfig } from './types';
import { patientPermissions } from '@/services/client/patient/permission';

export const permissionsConfig: PermissionConfig = {
  ...basePermissions,
  ...organizationPermissions,
  ...userPermissions,
  ...patientPermissions,
  ...appointmentPermissions,
};
