import { UserRole } from '@repo/store';
import { VerticalCollapsibleStepProps } from './vertical-steps';

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

export enum BookQueueSteps {
  PATIENT_INFORMATION = 'patient-information',
  DOCTOR_SELECTION = 'doctor-selection',
  ADDITIONAL_DETAILS = 'additional-details',
  REVIEW_AND_PAY = 'review-and-pay',
}

export const BookQueueAppointmentSteps: Record<string, VerticalCollapsibleStepProps> = {
  [BookQueueSteps.PATIENT_INFORMATION]: {
    key: BookQueueSteps.PATIENT_INFORMATION,
    title: 'Patient Information',
    description: 'Please provide your patient information to create an appointment.',
    details: ['Select patient from the list or create a new patient.'],
  },
  [BookQueueSteps.DOCTOR_SELECTION]: {
    key: BookQueueSteps.DOCTOR_SELECTION,
    title: 'Doctor Selection',
    description: 'Please select the doctor you want to book an appointment with.',
    details: ['Select the doctor that you would like to book an appointment with.'],
  },
  [BookQueueSteps.ADDITIONAL_DETAILS]: {
    key: BookQueueSteps.ADDITIONAL_DETAILS,
    title: 'Date & Additional Details',
    description: 'Please provide additional details for your appointment.',
    details: [
      'Select the date for the appointment',
      'Provide additional information to the doctor',
    ],
  },
  [BookQueueSteps.REVIEW_AND_PAY]: {
    key: BookQueueSteps.REVIEW_AND_PAY,
    title: 'Review and Pay',
    description: 'Check details and pay',
    details: [
      'Please review the details of your appointment.',
      'Pay via UPI, Bank Transfer, or Cash.',
    ],
  },
};

const stepExclusionByRole: Partial<Record<UserRole, string[]>> = {
  [UserRole.PATIENT]: [BookQueueSteps.PATIENT_INFORMATION],
};

export function getBookQueueStepsByRole(role: UserRole): VerticalCollapsibleStepProps[] {
  const excludedSteps = stepExclusionByRole[role] ?? [];

  return Object.entries(BookQueueAppointmentSteps)
    .filter(([stepKey]) => !excludedSteps.includes(stepKey as BookQueueSteps))
    .map(([, step]) => step);
}

export function getFirstBookQueueStep(role: UserRole): BookQueueSteps {
  const steps = getBookQueueStepsByRole(role);
  const firstKey = steps[0]?.key;
  return firstKey ?? BookQueueSteps.PATIENT_INFORMATION;
}
