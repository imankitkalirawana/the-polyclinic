import mongoose, { Model } from 'mongoose';
import { Appointment as IAppointment } from '@/lib/interface';
import mongooseSequence from 'mongoose-sequence';

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

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;
