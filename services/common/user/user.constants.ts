export const USER_STATUSES = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  blocked: 'BLOCKED',
} as const;

/**
 * @deprecated Avoid using this instead use `Role` enum.
 */
export const SYSTEM_USER_ROLE = {
  superadmin: 'superadmin',
  moderator: 'moderator',
  ops: 'ops',
} as const;

/**
 * @deprecated Avoid using this instead use `Role` enum.
 */
export const ORGANIZATION_USER_ROLES = {
  admin: 'ADMIN',
  doctor: 'DOCTOR',
  nurse: 'NURSE',
  patient: 'PATIENT',
  receptionist: 'RECEPTIONIST',
  pharmacist: 'PHARMACIST',
} as const;

/**
 * @deprecated Avoid using this instead use `Role` enum.
 */
export const UNIFIED_USER_ROLES = [
  ...Object.values(SYSTEM_USER_ROLE),
  ...Object.values(ORGANIZATION_USER_ROLES),
] as const;

export enum Role {
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
}

export enum SystemRole {
  SUPERADMIN = 'SUPERADMIN',
  MODERATOR = 'MODERATOR',
  OPS = 'OPS',
}

export enum ClientRole {
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
}
