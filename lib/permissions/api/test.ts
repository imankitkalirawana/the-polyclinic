import { PermissionConfig } from './types';

export const testPermissions: PermissionConfig = {
  '/api/v1/test': {
    GET: ['superadmin', 'moderator', 'ops'],
    POST: ['superadmin', 'moderator'],
    DELETE: ['superadmin'],
  },
  '/api/v1/test/:id': {
    GET: ['moderator', 'ops'],
    POST: ['superadmin', 'moderator'],
    DELETE: ['superadmin'],
  },
};
