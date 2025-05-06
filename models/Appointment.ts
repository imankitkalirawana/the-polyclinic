import mongoose, { Model } from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

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
  sitting?: string;
  image?: string;
}

export interface AppointmentType extends Base {
  aid: number;
  date: string | Date;
  patient: {
    uid: number;
    name: string;
    phone?: string;
    email: string;
    gender?: Gender;
    age?: number;
  };
  doctor?: {
    uid: number;
    name: string;
    email: string;
    sitting?: string;
  };
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
}

// @ts-ignore
const AutoIncrement = mongooseSequence(mongoose);

const appointmentSchema = new mongoose.Schema(
  {
    aid: {
      type: Number,
      unique: true,
    },
    date: String,
    patient: {
      uid: Number,
      name: String,
      phone: String,
      email: String,
      gender: {
        type: String,
        enum: Gender,
      },
      age: Number,
      image: String,
    },
    doctor: {
      uid: Number,
      name: String,
      email: String,
      sitting: String,
      image: String,
    },
    additionalInfo: {
      type: {
        type: String,
        enum: AppointmentMode,
        default: AppointmentMode.offline,
      },
      notes: String,
      symptoms: String,
      description: String,
      instructions: String,
    },
    progress: Number,
    status: {
      type: String,
      default: AppointmentStatus.booked,
      enum: AppointmentStatus,
    },
    data: {
      type: Map,
      of: String,
    },
    type: {
      type: String,
      enum: AType,
      default: AType.consultation,
    },
  },
  {
    timestamps: true,
  }
);

// @ts-ignore
appointmentSchema.plugin(AutoIncrement, { inc_field: 'aid', start_seq: 1000 });

const Appointment: Model<AppointmentType> =
  mongoose.models.Appointment ||
  mongoose.model<AppointmentType>('Appointment', appointmentSchema);

export default Appointment;
