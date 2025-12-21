import { Gender } from '@/types';

export enum QueueStatus {
  BOOKED = 'BOOKED',
  CALLED = 'CALLED',
  IN_CONSULTATION = 'IN_CONSULTATION',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export type PatientInfo = {
  id: string;
  name: string;
  phone?: string;
  email: string;
  gender?: Gender;
  age?: number;
  image?: string;
};

export type DoctorInfo = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  seating?: string;
};

export type BookedByUser = {
  id: string;
  email: string;
  name: string;
};

export type AppointmentQueueType = {
  id: string;
  sequenceNumber: number;
  status: QueueStatus;
  patient: PatientInfo;
  doctor: DoctorInfo;
  bookedByUser: BookedByUser;
  createdAt: string;
  updatedAt: string;
};
