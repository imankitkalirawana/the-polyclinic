import { z } from 'zod';
import { createAppointmentSchema } from '@/services/client/appointment/validation';
import { Base, Gender } from '@/types';
import { ValuesOf } from '@/lib/utils';
import { APPOINTMENT_MODES, APPOINTMENT_STATUSES, APPOINTMENT_TYPES } from './constants';

interface PatientInfo {
  uid: number;
  name: string;
  phone?: string;
  email: string;
  gender?: Gender;
  age?: number;
  image?: string;
}

interface DoctorInfo {
  uid: number;
  name: string;
  email: string;
  phone: string;
  seating?: string;
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
  type: AppointmentTypes;
  previousAppointment?: string;
}

export type AppointmentStatus = ValuesOf<typeof APPOINTMENT_STATUSES>;
export type AppointmentMode = ValuesOf<typeof APPOINTMENT_MODES>;
export type AppointmentTypes = ValuesOf<typeof APPOINTMENT_TYPES>[`value`];

// Zod
export type CreateAppointmentType = z.infer<typeof createAppointmentSchema>;
