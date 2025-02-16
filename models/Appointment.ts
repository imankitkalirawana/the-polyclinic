import mongoose, { Model } from 'mongoose';
import { Base } from '@/lib/interface';
import mongooseSequence from 'mongoose-sequence';

export enum AType {
  consultation = 'consultation',
  'follow-up' = 'follow-up',
  emergency = 'emergency'
}
export interface AppointmentType extends Base {
  aid: number;
  date: string;
  patient: {
    uid: number;
    name: string;
    phone?: string;
    email: string;
    gender?: 'male' | 'female' | 'other';
    age?: number;
  };
  doctor?: {
    uid: number;
    name: string;
    email: string;
    sitting?: string;
  };
  additionalInfo: {
    notes?: string;
    symptoms?: string;
    type: 'online' | 'offline';
    description?: string;
    instructions?: string;
  };
  progerss?: number;
  status:
    | 'booked'
    | 'confirmed'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'overdue'
    | 'on-hold';
  data?: Record<string, string>;
  type: AType;
}

// @ts-ignore
const AutoIncrement = mongooseSequence(mongoose);

const appointmentSchema = new mongoose.Schema(
  {
    aid: {
      type: Number,
      unique: true
    },
    date: String,
    patient: {
      uid: Number,
      name: String,
      phone: String,
      email: String,
      gender: {
        type: String,
        enum: ['male', 'female', 'other']
      },
      age: Number
    },
    doctor: {
      uid: Number,
      name: String,
      email: String,
      sitting: String
    },
    additionalInfo: {
      type: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
      },
      notes: String,
      symptoms: String,
      description: String,
      instructions: String
    },
    progerss: Number,
    status: {
      type: String,
      default: 'booked',
      enum: [
        'booked',
        'confirmed',
        'in-progress',
        'completed',
        'cancelled',
        'overdue',
        'on-hold'
      ]
    },
    data: {
      type: Map,
      of: String
    },
    type: {
      type: String,
      enum: ['consultation', 'follow-up', 'emergency'],
      default: 'consultation'
    }
  },
  {
    timestamps: true
  }
);

// @ts-ignore
appointmentSchema.plugin(AutoIncrement, { inc_field: 'aid', start_seq: 1000 });

const Appointment: Model<AppointmentType> =
  mongoose.models.Appointment ||
  mongoose.model<AppointmentType>('Appointment', appointmentSchema);

export default Appointment;
