import { Gender, PaymentMode, QueueStatus } from '../enums';

export type QueuePatientInfo = {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  email: string;
  gender?: Gender;
  age?: number;
  image?: string;
};

export type QueueDoctorInfo = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  seating?: string;
};

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
  patient: QueuePatientInfo;
  doctor: QueueDoctorInfo;
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
