export const APPOINTMENT_TYPES = {
  consultation: {
    label: 'Consultation',
    value: 'consultation',
    description:
      'A consultation is a visit to a doctor for a general check-up or to discuss a specific health concern.',
  },
  follow_up: {
    label: 'Follow-up',
    value: 'follow_up',
    description:
      'A follow-up is a visit to a doctor to check on the progress of a specific health concern.',
  },
  emergency: {
    label: 'Emergency',
    value: 'emergency',
    description: 'An emergency is a visit to a doctor for a sudden and urgent health concern.',
  },
} as const;

export const APPOINTMENT_MODES = ['online', 'offline'] as const;

export const APPOINTMENT_STATUSES = {
  booked: 'booked',
  confirmed: 'confirmed',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  overdue: 'overdue',
  on_hold: 'on_hold',
} as const;
