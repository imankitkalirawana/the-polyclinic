import { PermissionConfig } from '@/lib/permissions/api/types';

const BASE_PATH = '/api/v1/client/doctors';

export const doctorsPermissions: PermissionConfig = {
  [BASE_PATH]: {
    GET: ['admin', 'receptionist', 'patient'],
    POST: ['admin'],
    DELETE: ['admin'],
  },
};
