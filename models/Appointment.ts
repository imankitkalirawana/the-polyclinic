import mongoose from 'mongoose';
import { Appointment as IAppointment } from '@/lib/interface';

const AppointmentSchema = new mongoose.Schema<IAppointment>(
  {
    uid: Number,
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
    }
  },
  {
    timestamps: true
  }
);

const Appointment =
  mongoose.models.appointments ||
  mongoose.model('appointments', AppointmentSchema);

export default Appointment;
