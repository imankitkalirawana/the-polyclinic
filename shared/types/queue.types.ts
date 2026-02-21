import { Patient } from '.';
import { PaymentMode, QueueStatus } from '../enums';
import { Doctor } from './doctor.types';

export type QueueUserInfo = {
  id: string;
  email: string;
  name: string;
};

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
    'id' | 'name' | 'email' | 'phone' | 'image' | 'user_id' | 'age' | 'gender'
  >;
  doctor: Pick<
    Doctor,
    'id' | 'name' | 'email' | 'phone' | 'image' | 'specializations' | 'seating' | 'user_id'
  >;
  bookedByUser: QueueUserInfo;
  completedByUser?: QueueUserInfo;
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

export type GroupedAppointmentQueuesResponse = {
  previous: AppointmentQueue[];
  current: AppointmentQueue | null;
  next: AppointmentQueue[];
  metaData: {
    totalPrevious: number;
    totalNext: number;
    total: number;
  };
};
