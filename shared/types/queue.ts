import { Doctor, Patient, User } from '.';
import { PaymentMode, QueueStatus } from '../enums';

export type AppointmentQueueRequest = {
  aid?: string | null;
  patientId: string;
  doctorId: string;
  appointmentDate: Date | null;
  paymentMode: PaymentMode;
  notes?: string | null;
};

export type VerifyPaymentRequest = {
  orderId: string;
  paymentId: string;
  signature: string;
};

export type PaymentDetails = {
  payment: { orderId: string; amount: number; currency: string };
};

export type AppointmentQueue = {
  id: string;
  aid: string;
  paymentMode: PaymentMode;
  sequenceNumber: number;
  title: string;
  notes: string;
  appointmentDate: string;
  prescription: string;
  status: QueueStatus;
  patient: Pick<
    Patient,
    'id' | 'user_id' | 'name' | 'phone' | 'email' | 'gender' | 'age' | 'image'
  >;
  doctor: Pick<Doctor, 'id' | 'user_id' | 'name' | 'email' | 'phone' | 'image' | 'seating'>;
  bookedByUser: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  completedByUser?: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  createdAt: string;
  updatedAt: string;
  previousQueueId?: string;
  nextQueueId?: string;
};

export type Counter = {
  skip: number;
  clockIn: number;
  call: number;
};
