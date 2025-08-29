export const APPOINTMENT_TYPES = [
  {
    label: 'Consultation',
    value: 'consultation',
    description:
      'A consultation is a visit to a doctor for a general check-up or to discuss a specific health concern.',
  },
  {
    label: 'Follow-up',
    value: 'follow-up',
    description:
      'A follow-up is a visit to a doctor to check on the progress of a specific health concern.',
  },
  {
    label: 'Emergency',
    value: 'emergency',
    description: 'An emergency is a visit to a doctor for a sudden and urgent health concern.',
  },
] as const;

export const APPOINTMENT_MODES = ['online', 'offline'] as const;
