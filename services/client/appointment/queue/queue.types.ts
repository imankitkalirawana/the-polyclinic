import { Gender } from '@/types';

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
  userId: string;
  name: string;
  phone?: string;
  email: string;
  gender?: Gender;
  age?: number;
  image?: string;
};

export type DoctorInfo = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  seating?: string;
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

export type AppointmentQueueResponse = {
  id: string;
  referenceNumber: string;
  paymentMode: PaymentMode;
  sequenceNumber: number;
  title: string;
  notes: string;
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
