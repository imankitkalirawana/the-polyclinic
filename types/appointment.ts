import { Base } from '@/lib/interface';
import { Gender } from '@/types/user';
import { ValuesOf } from '@/lib/utils';

export const appointmentTypes = [
  'consultation',
  'follow-up',
  'emergency',
] as const;

export const appointmentModes = ['online', 'offline'] as const;

export const appointmentStatuses = [
  'booked',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
  'overdue',
  'on-hold',
] as const;

export interface PatientInfo {
  uid: number;
  name: string;
  phone?: string;
  email: string;
  gender?: Gender;
  age?: number;
  image?: string;
}

export interface DoctorInfo {
  uid: number;
  name: string;
  email: string;
  phone: string;
  sitting?: string;
  image?: string;
}

export interface AppointmentType extends Base {
  aid: number;
  date: string | Date;
  patient: PatientInfo;
  doctor?: DoctorInfo;
  status: AppointmentStatus;
  additionalInfo: {
    notes?: string;
    symptoms?: string;
    type: AppointmentMode;
    description?: string;
    instructions?: string;
  };
  progress?: number;
  data?: Record<string, string>;
  type: AType;
  previousAppointments?: Array<number>;
}

export type CreateAppointmentType = Pick<
  AppointmentType,
  'date' | 'type' | 'additionalInfo' | 'patient' | 'doctor'
>;

export type AppointmentMode = ValuesOf<typeof appointmentModes>;
export type AType = ValuesOf<typeof appointmentTypes>;
export type AppointmentStatus = ValuesOf<typeof appointmentStatuses>;
