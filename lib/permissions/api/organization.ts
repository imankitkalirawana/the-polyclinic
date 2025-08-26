import { PermissionConfig } from './types';

const BASE_PATH = '/api/v1/system/organizations';

export const organizationPermissions: PermissionConfig = {
  [BASE_PATH]: {
    GET: ['superadmin', 'moderator', 'ops'],
    POST: ['superadmin', 'moderator'],
    DELETE: ['superadmin'],
  },
  [`${BASE_PATH}/:id`]: {
    GET: ['superadmin', 'moderator', 'ops'],
    PUT: ['superadmin', 'moderator'],
    DELETE: ['superadmin'],
  },
  [`${BASE_PATH}/:id/status`]: {
    PATCH: ['superadmin'],
  },
  [`${BASE_PATH}/:id/users`]: {
    GET: ['superadmin', 'moderator', 'ops'],
    POST: ['superadmin', 'moderator'],
    DELETE: ['superadmin', 'moderator', 'ops'],
  },
};
