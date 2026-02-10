import type { DateValue } from '@internationalized/date';
import { GENDERS } from '@/libs/constants';

export enum QueueStatus {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  BOOKED = 'BOOKED',
  CALLED = 'CALLED',
  IN_CONSULTATION = 'IN_CONSULTATION',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export type PatientInfo = {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  email: string;
  gender?: GENDERS;
  age?: number;
  image?: string;
  bloodType?: string;
  allergies?: string;
  diseases?: string;
  height?: number;
  weight?: number;
};

export type DoctorInfo = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  seating?: string;
  specialization?: string;
};

export type UserInfo = {
  id: string;
  email: string;
  name: string;
};

export type PaymentMode = 'RAZORPAY' | 'CASH';

export type AppointmentQueueRequest = {
  queueId?: string | null;
  patientId: string;
  doctorId: string;
  appointmentDate: Date | null;
  paymentMode: PaymentMode;
  notes?: string | null;
};

export type CreateAppointmentQueueFormValues = {
  appointment: AppointmentQueueRequest & { queueId?: string | null };
  meta: {
    currentStep: number;
    showConfirmation: boolean;
    showReceipt: boolean;
    createNewPatient: boolean;
  };
};

export type VerifyPaymentRequest = {
  orderId: string;
  paymentId: string;
  signature: string;
};

export type PaymentDetails = { payment: { orderId: string; amount: number; currency: string } };

export type AppointmentQueueFilters = {
  date: { start: DateValue | null; end: DateValue | null };
  status?: QueueStatus[];
  doctorId?: string | null;
};

export const DEFAULT_APPOINTMENT_QUEUE_FILTERS: AppointmentQueueFilters = {
  date: { start: null, end: null },
  status: undefined,
  doctorId: null,
};

export type AppointmentQueueType = {
  id: string;
  aid: string;
  paymentMode: PaymentMode;
  sequenceNumber: number;
  title: string;
  notes: string;
  appointmentDate: string;
  prescription: string;
  status: QueueStatus;
  patient: PatientInfo;
  doctor: DoctorInfo;
  bookedByUser: UserInfo;
  completedByUser?: UserInfo;
  createdAt: string;
  updatedAt: string;
  previousQueueId?: string;
  nextQueueId?: string;
};

export type GroupedAppointmentQueuesResponse = {
  previous: AppointmentQueueResponse[];
  current: AppointmentQueueResponse | null;
  next: AppointmentQueueResponse[];
  metaData: {
    totalPrevious: number;
    totalNext: number;
    total: number;
  };
};
