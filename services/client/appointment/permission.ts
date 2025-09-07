import { PermissionConfig } from '@/lib/permissions/api/types';

const BASE_PATH = '/api/v1/client/appointments';

export const appointmentPermissions: PermissionConfig = {
  [BASE_PATH]: {
    GET: ['admin', 'receptionist', 'doctor', 'patient'],
    POST: ['admin', 'receptionist'],
    PUT: ['admin', 'doctor'],
    DELETE: ['admin'],
  },
  [`${BASE_PATH}/:aid`]: {
    GET: ['admin', 'receptionist', 'doctor', 'patient'],
  },
};
