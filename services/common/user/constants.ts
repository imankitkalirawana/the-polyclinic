export const USER_STATUSES = {
  active: 'active',
  inactive: 'inactive',
  blocked: 'blocked',
} as const;

export const SYSTEM_USER_ROLE = {
  superadmin: 'superadmin',
  moderator: 'moderator',
  ops: 'ops',
} as const;

export const ORGANIZATION_USER_ROLES = {
  admin: 'ADMIN',
  doctor: 'DOCTOR',
  nurse: 'NURSE',
  patient: 'PATIENT',
  receptionist: 'RECEPTIONIST',
  pharmacist: 'PHARMACIST',
} as const;

export const UNIFIED_USER_ROLES = [
  ...Object.values(SYSTEM_USER_ROLE),
  ...Object.values(ORGANIZATION_USER_ROLES),
] as const;
