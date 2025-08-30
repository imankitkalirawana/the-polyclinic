export const USER_STATUSES = ['active', 'inactive', 'blocked'] as const;
export const SYSTEM_USER_ROLE = ['superadmin', 'moderator', 'ops'] as const;

export const ORGANIZATION_USER_ROLES = [
  'admin',
  'doctor',
  'nurse',
  'patient',
  'receptionist',
  'pharmacist',
] as const;

export const UNIFIED_USER_ROLES = [...SYSTEM_USER_ROLE, ...ORGANIZATION_USER_ROLES] as const;
