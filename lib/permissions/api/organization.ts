import { PermissionConfig } from './types';

export const organizationPermissions: PermissionConfig = {
  '/api/v1/organizations': {
    GET: ['superadmin', 'moderator', 'ops'],
    POST: ['superadmin', 'moderator'],
    DELETE: ['superadmin'],
  },
};
