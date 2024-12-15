import mongoose, { Model } from 'mongoose';
import { Base } from '@/lib/interface';
import mongooseSequence from 'mongoose-sequence';

export interface GuestType {
  name: string;
  connection: string;
  phone: string;
}

export interface AppointmentType extends Base {
  uid: number;
  name: string;
  phone: string;
  email: string;
  guests: GuestType[];
  notes: string;
  date: Date | string;
  doctor: number;
  progerss: number;
  type: 'online' | 'offline';
  aid: number;
  status:
    | 'booked'
    | 'confirmed'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'overdue'
    | 'on-hold';
}

// @ts-ignore
const AutoIncrement = mongooseSequence(mongoose);

const appointmentSchema = new mongoose.Schema(
  {
    uid: Number,
    aid: {
      type: Number,
      unique: true
    },
    name: String,
    phone: String,
    email: String,
    guests: [
      {
        name: String,
        connection: String,
        phone: String
      }
    ],
    notes: String,
    date: String,
    doctor: Number,
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
    type: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline'
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
