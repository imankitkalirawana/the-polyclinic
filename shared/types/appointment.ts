import { Base } from './common';
import { type AppointmentStatus, type AppointmentMode, type AppointmentType } from '../enums';
import { Gender } from '../enums';

export type AppointmentPatientInfo = {
  uid: string;
  name: string;
  phone?: string;
  email: string;
  gender?: Gender;
  age?: number;
  image?: string;
};

export type AppointmentDoctorInfo = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  seating?: string;
  image?: string;
};

export type Appointment = Base & {
  aid: string;
  date: string | Date;
  patient: AppointmentPatientInfo;
  doctor?: AppointmentDoctorInfo;
  status: AppointmentStatus;
  additionalInfo: {
    notes?: string;
    symptoms?: string;
    type: AppointmentMode;
    description?: string;
    instructions?: string;
  };
  cancellation?: {
    remarks?: string;
    date?: string;
    by?: { name?: string; email?: string; uid?: string };
  };
  progress?: number;
  data?: Record<string, string>;
  type: AppointmentType;
  previousAppointment?: string;
};

export type CreateAppointmentInput = {
  patientId: string;
  date: Date;
  type: 'consultation' | 'follow_up' | 'emergency';
  additionalInfo: {
    mode: 'online' | 'offline';
    notes?: string;
    symptoms?: string;
    description?: string;
    instructions?: string;
  };
  doctorId?: string;
  previousAppointment?: string;
};
