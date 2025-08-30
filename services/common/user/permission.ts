import { PermissionConfig } from '@/lib/permissions/api/types';

const BASE_PATH = '/api/v1/common/users';

export const userPermissions: PermissionConfig = {
  [BASE_PATH]: {
    GET: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist'],
    POST: ['superadmin', 'moderator'],
    DELETE: ['superadmin'],
  },
};
