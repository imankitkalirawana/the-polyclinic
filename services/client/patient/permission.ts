import { PermissionConfig } from '@/lib/permissions/api/types';

const BASE_PATH = '/api/v1/client/patients';

export const patientPermissions: PermissionConfig = {
  [BASE_PATH]: {
    GET: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist', 'patient'],
    POST: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist'],
    DELETE: ['superadmin'],
  },
  [`${BASE_PATH}/:uid`]: {
    GET: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist'],
    POST: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist'],
    DELETE: ['superadmin'],
  },
  [`${BASE_PATH}/:uid/appointments`]: {
    GET: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist'],
  },
};
