import { PermissionConfig } from './types';

export const basePermissions: PermissionConfig = {
  '/api/v1': {
    GET: ['superadmin', 'moderator', 'ops'],
    POST: ['superadmin', 'moderator'],
    DELETE: ['superadmin'],
  },
};
