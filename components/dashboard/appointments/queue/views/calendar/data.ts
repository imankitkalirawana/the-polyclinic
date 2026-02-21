import { UserRole } from '@repo/store';

export const MAX_APPOINTMENTS_IN_CELL = 2;

export const weekdays = [
  {
    label: 'S',
    value: 'sunday',
  },
  {
    label: 'M',
    value: 'monday',
  },
  {
    label: 'T',
    value: 'tuesday',
  },
  {
    label: 'W',
    value: 'wednesday',
  },
  {
    label: 'T',
    value: 'thursday',
  },
  {
    label: 'F',
    value: 'friday',
  },
  {
    label: 'S',
    value: 'saturday',
  },
];

export const allowedRolesToCreateAppointment = [
  UserRole.ADMIN,
  UserRole.RECEPTIONIST,
  UserRole.PATIENT,
];
