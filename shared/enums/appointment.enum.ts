export const APPOINTMENT_STATUSES = {
  booked: 'booked',
  confirmed: 'confirmed',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  overdue: 'overdue',
  on_hold: 'on_hold',
} as const;

export const APPOINTMENT_MODES = ['online', 'offline'] as const;

export const APPOINTMENT_TYPES = {
  consultation: 'consultation',
  follow_up: 'follow_up',
  emergency: 'emergency',
} as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES];
export type AppointmentMode = (typeof APPOINTMENT_MODES)[number];
export type AppointmentType = (typeof APPOINTMENT_TYPES)[keyof typeof APPOINTMENT_TYPES];
