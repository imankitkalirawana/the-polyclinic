export const CREATE_APPOINTMENT_STEPS = [
  {
    title: 'Patient Information',
    description: 'Please provide your patient information to create an appointment.',
    details: ['Select patient from the list or create a new patient.'],
  },
  {
    title: 'Appointment Type',
    description: 'Please select the type of appointment you want to create.',
    details: ['Price may vary based on the type of appointment.'],
  },
  {
    title: 'Doctor Selection',
    description: 'Please select the doctor you want to book an appointment with.',
    details: ['Select the doctor that you would like to book an appointment with.'],
  },
  {
    title: 'Date Selection',
    description: 'Please select the date you want to book an appointment with.',
    details: ['Select the date that you would like to book an appointment with.'],
  },
  {
    title: 'Additional Details',
    description: 'Please provide additional details for your appointment.',
    details: ['Please provide additional details for your appointment.'],
  },
];

export const BOOK_QUEUE_APPOINTMENT_STEPS = [
  {
    title: 'Patient Information',
    description: 'Please provide your patient information to create an appointment.',
    details: ['Select patient from the list or create a new patient.'],
  },
  {
    title: 'Doctor & Date Selection',
    description: 'Please select the doctor and date you want to book an appointment with.',
    details: [
      'Select the doctor with whom you want to book an appointment',
      'Select the date and time for the appointment',
    ],
  },
  {
    title: 'Additional Details',
    description: 'Please provide additional details for your appointment.',
    details: ['Please provide additional details for your appointment.'],
  },
  {
    title: 'Review and Pay',
    description: 'Check details and pay',
    details: [
      'Please review the details of your appointment.',
      'Pay via UPI, Bank Transfer, or Cash.',
    ],
  },
];
