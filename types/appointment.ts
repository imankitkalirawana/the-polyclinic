import { Base, Gender } from '@/lib/interface';

export enum AType {
  consultation = 'consultation',
  'follow-up' = 'follow-up',
  emergency = 'emergency',
}

export enum AppointmentMode {
  online = 'online',
  offline = 'offline',
}

export enum AppointmentStatus {
  booked = 'booked',
  confirmed = 'confirmed',
  'in-progress' = 'in-progress',
  completed = 'completed',
  cancelled = 'cancelled',
  overdue = 'overdue',
  'on-hold' = 'on-hold',
}

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

export type CreateAppointmentType = Omit<
  AppointmentType,
  | '_id'
  | 'aid'
  | 'status'
  | 'progress'
  | 'data'
  | 'previousAppointments'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
>;
