export const USER_STATUSES = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  blocked: 'BLOCKED',
} as const;

export enum Role {
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}
