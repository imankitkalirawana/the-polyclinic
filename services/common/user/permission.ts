import { PermissionConfig } from '@/lib/permissions/api/types';
import { UnifiedUser } from './types';

const BASE_PATH = '/api/v1/common/users';

export const userPermissions: PermissionConfig = {
  [BASE_PATH]: {
    GET: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist'],
    POST: ['superadmin', 'moderator', 'admin', 'receptionist'],
    DELETE: ['superadmin'],
  },
  [`${BASE_PATH}/:uid`]: {
    GET: ['superadmin', 'moderator', 'ops', 'admin', 'receptionist'],
    PUT: ['superadmin', 'moderator', 'admin', 'receptionist', 'doctor', 'patient'],
    DELETE: ['superadmin', 'admin', 'receptionist'],
  },
};

export const rolePermissions: Record<UnifiedUser['role'], UnifiedUser['role'][]> = {
  superadmin: ['superadmin', 'admin', 'doctor', 'nurse', 'patient', 'receptionist', 'pharmacist'],
  moderator: ['admin', 'doctor', 'nurse', 'patient', 'receptionist', 'pharmacist'],
  ops: ['admin', 'doctor', 'nurse', 'patient', 'receptionist', 'pharmacist'],
  admin: ['admin', 'doctor', 'nurse', 'patient', 'receptionist', 'pharmacist'],
  doctor: [],
  nurse: [],
  receptionist: ['patient'],
  patient: [],
  pharmacist: [],
};
